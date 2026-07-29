import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}></div>
      <div className={styles.year}>2026</div>
      <h1 className={styles.title}>نتيجة الثانوية العامة 2026</h1>
      <p className={styles.subtitle}>استعلم عن نتيجتك الآن برقم الجلوس أو الاسم بكل سهولة وسرعة</p>
    </section>
  );
}
