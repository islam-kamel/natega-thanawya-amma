import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface Student {
  seating_no: number;
  arabic_name: string;
  total_degree: number;
  student_case_desc: string;
}

export interface Stats {
  total_students: number;
  total_passed: number;
  total_second_round: number;
  total_failed: number;
  total_absent: number;
  pass_rate: number;
  avg_degree: number;
  max_degree: number;
  min_degree_passed: number;
}

const dbPath = path.join(process.cwd(), 'data', 'students.db');

let db: Database.Database | null = null;

try {
  if (fs.existsSync(dbPath)) {
    // Open in readonly mode to prevent Next.js multiple connections from locking
    db = new Database(dbPath, { readonly: true });
    
    // Performance PRAGMAs for reading
    db.pragma('cache_size = -64000');
    db.pragma('mmap_size = 268435456');
  } else {
    console.warn(`Database file not found at ${dbPath}`);
  }
} catch (error) {
  console.error('Failed to connect to database:', error);
}

export function searchBySeatingNo(seatingNo: number): Student | null {
  if (!db) return null;
  try {
    const stmt = db.prepare('SELECT * FROM students WHERE seating_no = ?');
    const result = stmt.get(seatingNo) as Student | undefined;
    return result || null;
  } catch (error) {
    console.error('Error in searchBySeatingNo:', error);
    return null;
  }
}

export function searchByName(name: string, limit: number = 20): Student[] {
  if (!db) return [];
  try {
    // Process input for FTS matching
    const searchTokens = name.trim().split(/\s+/).filter(Boolean);
    if (searchTokens.length === 0) return [];
    
    // Append wildcard to tokens for partial matching (e.g., "احمد*")
    const matchQuery = searchTokens.map(token => `"${token}"*`).join(' AND ');
    
    const stmt = db.prepare(`
      SELECT students.* 
      FROM students_fts 
      JOIN students ON students_fts.rowid = students.rowid 
      WHERE students_fts MATCH ? 
      ORDER BY rank
      LIMIT ?
    `);
    
    return stmt.all(matchQuery, limit) as Student[];
  } catch (error) {
    console.error('Error in searchByName:', error);
    return [];
  }
}

export function getStats(): Stats | null {
  if (!db) return null;
  try {
    const stmt = db.prepare('SELECT * FROM stats WHERE id = 1');
    const result = stmt.get() as Stats | undefined;
    if (result) {
      const { id, ...stats } = result as any;
      return stats as Stats;
    }
    return null;
  } catch (error) {
    console.error('Error in getStats:', error);
    return null;
  }
}
