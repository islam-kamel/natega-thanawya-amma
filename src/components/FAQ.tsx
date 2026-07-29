'use client';

import React, { useState } from 'react';
import styles from './FAQ.module.css';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'كيف أستعلم عن نتيجة الثانوية العامة 2026؟',
      a: 'يمكنك الاستعلام عن نتيجتك من خلال إدخال رقم الجلوس أو الاسم في مربع البحث أعلاه. ستظهر النتيجة فوراً.'
    },
    {
      q: 'ما هو الحد الأقصى للمجموع في الثانوية العامة؟',
      a: 'الحد الأقصى للمجموع الكلي هو 410 درجة.'
    },
    {
      q: 'ما معنى "دور ثان"؟',
      a: 'يعني أن الطالب لم يحقق درجة النجاح في مادة أو أكثر ولديه فرصة لإعادة الامتحان في الدور الثاني.'
    },
    {
      q: 'هل يمكنني البحث بالاسم؟',
      a: 'نعم، يمكنك البحث بالاسم الكامل أو جزء من الاسم وستظهر لك جميع النتائج المطابقة.'
    },
    {
      q: 'متى تم اعتماد نتيجة الثانوية العامة 2026؟',
      a: 'تم اعتماد النتيجة رسمياً من وزير التربية والتعليم والتعليم الفني.'
    }
  ];

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>الأسئلة الشائعة</h2>
      <div className={styles.accordion}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={styles.item}>
              <button 
                className={styles.question} 
                onClick={() => toggleOpen(index)}
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <svg 
                  className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <div className={`${styles.answer} ${isOpen ? styles.answerOpen : ''}`}>
                <div className={styles.answerContent}>
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
