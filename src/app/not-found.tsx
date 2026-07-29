import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = {
  title: "الصفحة غير موجودة - نتيجة الثانوية العامة 2026",
};

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>لم يتم العثور على النتيجة</h1>
        <p className={styles.description}>
          عذراً، لم نتمكن من العثور على النتيجة المطلوبة. يرجى التأكد من رقم الجلوس والمحاولة مرة أخرى.
        </p>
        <Link href="/" className={styles.homeLink}>
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </main>
  );
}
