import React from 'react';
import styles from './StatsSection.module.css';

interface StatsSectionProps {
  stats: {
    total_students: number;
    total_passed: number;
    total_second_round: number;
    total_failed: number;
    total_absent: number;
    pass_rate: number;
    avg_degree: number;
    max_degree: number;
  };
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const total = stats.total_students || 1; // prevent divide by zero
  const passWidth = (stats.total_passed / total) * 100;
  const secondRoundWidth = (stats.total_second_round / total) * 100;
  const failWidth = (stats.total_failed / total) * 100;
  const absentWidth = (stats.total_absent / total) * 100;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>إحصائيات النتيجة</h2>
      
      <div className={styles.grid}>
        <div className={styles.statCard}>
          <svg className={styles.statIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <div className={styles.statValue}>{stats.total_students.toLocaleString('ar-EG')}</div>
          <div className={styles.statLabel}>إجمالي الطلاب</div>
        </div>
        
        <div className={styles.statCard}>
          <svg className={styles.statIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <div className={styles.statValue}>{stats.pass_rate}%</div>
          <div className={styles.statLabel}>نسبة النجاح</div>
        </div>
        
        <div className={styles.statCard}>
          <svg className={styles.statIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <div className={styles.statValue}>{stats.max_degree} <span style={{fontSize: '1rem', color: '#888'}}>/ 410</span></div>
          <div className={styles.statLabel}>أعلى مجموع</div>
        </div>
        
        <div className={styles.statCard}>
          <svg className={styles.statIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          <div className={styles.statValue}>{stats.avg_degree}</div>
          <div className={styles.statLabel}>متوسط الدرجات</div>
        </div>
      </div>

      <div className={styles.distribution}>
        <div className={styles.bar}>
          <div className={styles.barSegment} style={{ width: `${passWidth}%`, backgroundColor: '#4caf50' }} title={`ناجح: ${stats.total_passed}`}></div>
          <div className={styles.barSegment} style={{ width: `${secondRoundWidth}%`, backgroundColor: '#ff9800' }} title={`دور ثان: ${stats.total_second_round}`}></div>
          <div className={styles.barSegment} style={{ width: `${failWidth}%`, backgroundColor: '#f44336' }} title={`راسب: ${stats.total_failed}`}></div>
          <div className={styles.barSegment} style={{ width: `${absentWidth}%`, backgroundColor: '#9e9e9e' }} title={`غياب: ${stats.total_absent}`}></div>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}><span className={styles.legendDot} style={{backgroundColor: '#4caf50'}}></span> ناجح</div>
          <div className={styles.legendItem}><span className={styles.legendDot} style={{backgroundColor: '#ff9800'}}></span> دور ثان</div>
          <div className={styles.legendItem}><span className={styles.legendDot} style={{backgroundColor: '#f44336'}}></span> راسب</div>
          <div className={styles.legendItem}><span className={styles.legendDot} style={{backgroundColor: '#9e9e9e'}}></span> غياب</div>
        </div>
      </div>
    </section>
  );
}
