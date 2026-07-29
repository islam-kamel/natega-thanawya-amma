import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const csvPath = path.join(projectRoot, 'students_degree_2026.csv');
const dataDir = path.join(projectRoot, 'data');
const dbPath = path.join(dataDir, 'students.db');

console.log(`CSV: ${csvPath}`);
console.log(`DB:  ${dbPath}`);

if (!fs.existsSync(csvPath)) {
  console.error(`CSV file not found: ${csvPath}`);
  process.exit(1);
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Remove old DB if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed old database.');
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('synchronous = OFF');
db.pragma('cache_size = -128000');
db.pragma('mmap_size = 268435456');
db.pragma('temp_store = MEMORY');
db.pragma('locking_mode = EXCLUSIVE');

console.log('Creating tables...');
db.exec(`
  CREATE TABLE students (
    seating_no INTEGER PRIMARY KEY,
    arabic_name TEXT NOT NULL,
    total_degree REAL,
    student_case_desc TEXT
  );
`);

const insertStudent = db.prepare(`
  INSERT OR IGNORE INTO students (seating_no, arabic_name, total_degree, student_case_desc)
  VALUES (?, ?, ?, ?)
`);

let count = 0;
let skipped = 0;
let isFirstLine = true;
let isHeader = true;

const rl = readline.createInterface({
  input: fs.createReadStream(csvPath),
  crlfDelay: Infinity
});

let batch = [];
const BATCH_SIZE = 5000;

const startTime = Date.now();

const insertBatch = db.transaction((rows) => {
  for (const row of rows) {
    try {
      insertStudent.run(row.seatingNo, row.arabicName, row.totalDegree, row.studentCaseDesc);
    } catch {
      skipped++;
    }
  }
});

rl.on('line', (line) => {
  line = line.replace(/\r/g, '').trim();

  if (isFirstLine) {
    isFirstLine = false;
    if (line.includes('Table')) {
      return;
    }
  }

  if (isHeader) {
    isHeader = false;
    return;
  }

  if (!line) return;

  // Handle CSV fields - name might contain commas in rare cases
  const firstComma = line.indexOf(',');
  if (firstComma === -1) return;

  const seatingNoStr = line.substring(0, firstComma).trim();
  const rest = line.substring(firstComma + 1);

  // Find the last two commas for total_degree and student_case_desc
  const lastComma = rest.lastIndexOf(',');
  if (lastComma === -1) return;

  const studentCaseDesc = rest.substring(lastComma + 1).trim();
  const beforeLastComma = rest.substring(0, lastComma);

  const secondLastComma = beforeLastComma.lastIndexOf(',');
  if (secondLastComma === -1) return;

  const totalDegreeStr = beforeLastComma.substring(secondLastComma + 1).trim();
  const arabicName = beforeLastComma.substring(0, secondLastComma).trim();

  const seatingNo = parseInt(seatingNoStr, 10);
  const totalDegree = parseFloat(totalDegreeStr) || 0;

  if (isNaN(seatingNo) || !arabicName) return;

  batch.push({ seatingNo, arabicName, totalDegree, studentCaseDesc });

  if (batch.length >= BATCH_SIZE) {
    insertBatch(batch);
    count += batch.length;
    batch = [];

    if (count % 100000 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`Inserted ${count.toLocaleString()} rows... (${elapsed}s)`);
    }
  }
});

rl.on('close', () => {
  if (batch.length > 0) {
    insertBatch(batch);
    count += batch.length;
  }

  const insertTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nInserted ${count.toLocaleString()} rows in ${insertTime}s (skipped: ${skipped})`);

  console.log('Creating indexes...');
  db.exec(`CREATE INDEX IF NOT EXISTS idx_arabic_name ON students(arabic_name);`);

  console.log('Building FTS5 index...');
  db.exec(`
    CREATE VIRTUAL TABLE students_fts USING fts5(
      seating_no,
      arabic_name,
      content='students',
      content_rowid='rowid'
    );
  `);

  // Populate FTS from existing data
  db.exec(`
    INSERT INTO students_fts(rowid, seating_no, arabic_name) 
    SELECT rowid, seating_no, arabic_name FROM students;
  `);

  console.log('Computing statistics...');
  const statsQuery = db.prepare(`
    SELECT 
      COUNT(*) as total_students,
      SUM(CASE WHEN student_case_desc LIKE 'ناجح دور أول%' THEN 1 ELSE 0 END) as total_passed,
      SUM(CASE WHEN student_case_desc LIKE 'دور ثان%' THEN 1 ELSE 0 END) as total_second_round,
      SUM(CASE WHEN student_case_desc LIKE 'راسب%' THEN 1 ELSE 0 END) as total_failed,
      SUM(CASE WHEN student_case_desc LIKE 'غياب%' THEN 1 ELSE 0 END) as total_absent,
      AVG(total_degree) as avg_degree,
      MAX(total_degree) as max_degree,
      MIN(CASE WHEN student_case_desc LIKE 'ناجح دور أول%' THEN total_degree ELSE NULL END) as min_degree_passed
    FROM students
  `).get();

  db.exec(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY DEFAULT 1,
      total_students INTEGER,
      total_passed INTEGER,
      total_second_round INTEGER,
      total_failed INTEGER,
      total_absent INTEGER,
      pass_rate REAL,
      avg_degree REAL,
      max_degree REAL,
      min_degree_passed REAL
    );
  `);

  const passRate = statsQuery.total_students > 0 ? (statsQuery.total_passed / statsQuery.total_students) * 100 : 0;

  const insertStats = db.prepare(`
    INSERT INTO stats (
      total_students, total_passed, total_second_round, total_failed, total_absent,
      pass_rate, avg_degree, max_degree, min_degree_passed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStats.run(
    statsQuery.total_students,
    statsQuery.total_passed,
    statsQuery.total_second_round,
    statsQuery.total_failed,
    statsQuery.total_absent,
    passRate,
    statsQuery.avg_degree,
    statsQuery.max_degree,
    statsQuery.min_degree_passed
  );

  console.log('\n📊 Stats Summary:');
  console.log(`   Total Students:   ${statsQuery.total_students?.toLocaleString()}`);
  console.log(`   Passed (1st):     ${statsQuery.total_passed?.toLocaleString()}`);
  console.log(`   Second Round:     ${statsQuery.total_second_round?.toLocaleString()}`);
  console.log(`   Failed:           ${statsQuery.total_failed?.toLocaleString()}`);
  console.log(`   Absent:           ${statsQuery.total_absent?.toLocaleString()}`);
  console.log(`   Pass Rate:        ${passRate.toFixed(2)}%`);
  console.log(`   Avg Degree:       ${statsQuery.avg_degree?.toFixed(1)}`);
  console.log(`   Max Degree:       ${statsQuery.max_degree}`);
  console.log(`   Min Passed:       ${statsQuery.min_degree_passed}`);

  console.log('\nOptimizing database...');
  db.exec("INSERT INTO students_fts(students_fts) VALUES('optimize')");
  db.pragma('optimize');

  db.close();
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Database build complete in ${totalTime}s`);
  console.log(`   Database size: ${(fs.statSync(dbPath).size / 1024 / 1024).toFixed(1)} MB`);
});
