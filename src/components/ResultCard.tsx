'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './ResultCard.module.css';

interface Student {
  seating_no: number;
  arabic_name: string;
  total_degree: number;
  student_case_desc: string;
}

export default function ResultCard({ student }: { student: Student }) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = student.total_degree;
    if (start === end) {
      setScore(end);
      return;
    }

    const duration = 1000;
    const incrementTime = 20;
    const steps = duration / incrementTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setScore(end);
        clearInterval(timer);
      } else {
        setScore(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [student.total_degree]);

  const getStatusColor = (status: string) => {
    if (status.includes('ناجح')) return '#4caf50';
    if (status.includes('دور ثان')) return '#ff9800';
    if (status.includes('راسب')) return '#f44336';
    return '#9e9e9e';
  };

  const statusColor = getStatusColor(student.student_case_desc);
  const percentage = ((student.total_degree / 410) * 100).toFixed(2);
  const isExcellent = student.student_case_desc.includes('ناجح دور أول') && student.total_degree > 300;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const text = `نتيجة الطالب ${student.arabic_name} - المجموع: ${student.total_degree}/410 بنسبة ${percentage}%`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'نتيجة الثانوية العامة 2026',
          text,
          url: window.location.origin + `/result/${student.seating_no}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('تم نسخ النتيجة إلى الحافظة');
    }
  };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 410) * circumference;

  return (
    <Link href={`/result/${student.seating_no}`} passHref>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.name}>{student.arabic_name}</h3>
            <p className={styles.seatingNo}>رقم الجلوس: {student.seating_no}</p>
          </div>
          <button className={styles.shareBtn} onClick={handleShare} aria-label="مشاركة">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>

        <div className={styles.scoreSection}>
          <div className={styles.circularProgressWrapper}>
            <svg className={styles.circularProgress} width="100" height="100">
              <circle
                className={styles.progressBg}
                cx="50" cy="50" r={radius}
                strokeWidth="8"
                fill="none"
              />
              <circle
                className={styles.progressCircle}
                cx="50" cy="50" r={radius}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                stroke={statusColor}
              />
            </svg>
            <div className={styles.scoreTextInside}>
              <span className={styles.percentage}>{percentage}%</span>
            </div>
          </div>
          
          <div className={styles.scoreDetails}>
            <div className={styles.scoreValueContainer}>
              <span className={styles.scoreValue}>{score}</span>
              <span className={styles.scoreMax}>/ 410</span>
            </div>
            
            <div 
              className={styles.statusBadge} 
              style={{ backgroundColor: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}
            >
              {student.student_case_desc}
            </div>

            {isExcellent && (
              <div className={styles.excellentBadge}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                متفوق
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
