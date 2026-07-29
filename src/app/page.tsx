import Hero from "@/components/Hero";
import SearchBox from "@/components/SearchBox";
import StatsSection from "@/components/StatsSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { getStats } from "@/lib/db";
import styles from "./page.module.css";

export default function Home() {
  const stats = getStats();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Hero />
        <SearchBox />
        {stats && (
          <StatsSection
            stats={{
              total_students: stats.total_students,
              total_passed: stats.total_passed,
              total_second_round: stats.total_second_round,
              total_failed: stats.total_failed,
              total_absent: stats.total_absent,
              pass_rate: stats.pass_rate,
              avg_degree: stats.avg_degree,
              max_degree: stats.max_degree,
            }}
          />
        )}
        <FAQ />

        {/* SEO Content Section */}
        <section className={styles.seoSection}>
          <h2 className={styles.seoTitle}>نتيجة الثانوية العامة 2026 مصر</h2>
          <div className={styles.seoContent}>
            <p>
              أعلنت وزارة التربية والتعليم والتعليم الفني نتيجة الثانوية العامة للعام الدراسي 2025/2026 رسمياً.
              يمكن لجميع طلاب الثانوية العامة الاستعلام عن نتائجهم من خلال هذا الموقع باستخدام رقم الجلوس أو الاسم الكامل.
            </p>
            <p>
              تقدم لامتحانات الثانوية العامة هذا العام أكثر من 919 ألف طالب وطالبة من جميع محافظات جمهورية مصر العربية.
              المجموع الكلي للثانوية العامة من 410 درجة موزعة على المواد الدراسية المختلفة.
            </p>
            <h3>طريقة الاستعلام عن نتيجة الثانوية العامة 2026</h3>
            <ul>
              <li>أدخل رقم الجلوس في مربع البحث أعلاه للحصول على النتيجة فوراً</li>
              <li>يمكنك أيضاً البحث بالاسم الكامل أو جزء من الاسم</li>
              <li>ستظهر النتيجة مباشرة دون الحاجة للانتظار</li>
              <li>يمكنك مشاركة النتيجة مع الأصدقاء والعائلة عبر واتساب وفيسبوك</li>
            </ul>
            <h3>نتائج الثانوية العامة 2026 بالأرقام</h3>
            <p>
              بلغت نسبة النجاح في الثانوية العامة 2026 حوالي {stats ? stats.pass_rate.toFixed(1) : '70'}% من إجمالي الطلاب المتقدمين.
              وحقق أعلى طالب مجموع {stats ? stats.max_degree : 320} درجة من أصل 410 درجة.
              فيما بلغ متوسط الدرجات {stats ? stats.avg_degree.toFixed(1) : '220'} درجة.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
