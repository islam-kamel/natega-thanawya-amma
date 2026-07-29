import { Metadata } from "next";
import { searchBySeatingNo } from "@/lib/db";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ seatingNo: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seatingNo } = await params;
  const student = searchBySeatingNo(parseInt(seatingNo, 10));

  if (!student) {
    return {
      title: "لم يتم العثور على النتيجة",
    };
  }

  const percentage = ((student.total_degree / 320) * 100).toFixed(1);

  return {
    title: `نتيجة ${student.arabic_name} - الثانوية العامة 2026`,
    description: `نتيجة الطالب ${student.arabic_name} في الثانوية العامة 2026 - رقم الجلوس ${student.seating_no} - المجموع ${student.total_degree} من 320 (${percentage}%) - ${student.student_case_desc}`,
    openGraph: {
      title: `نتيجة ${student.arabic_name} - الثانوية العامة 2026`,
      description: `المجموع: ${student.total_degree}/320 (${percentage}%) - ${student.student_case_desc}`,
      type: "article",
      locale: "ar_EG",
    },
    twitter: {
      card: "summary",
      title: `نتيجة ${student.arabic_name} - ثانوية عامة 2026`,
      description: `المجموع: ${student.total_degree}/320 - ${student.student_case_desc}`,
    },
  };
}

function getStatusInfo(status: string) {
  if (status.includes("ناجح دور أول")) return { className: styles.statusSuccess, label: "ناجح دور أول", icon: "✓" };
  if (status.includes("دور ثان")) return { className: styles.statusWarning, label: "دور ثان", icon: "⟳" };
  if (status.includes("راسب")) return { className: styles.statusError, label: "راسب دور أول", icon: "✗" };
  if (status.includes("غياب")) return { className: styles.statusMuted, label: "غياب كلى", icon: "—" };
  return { className: styles.statusMuted, label: status, icon: "?" };
}

export default async function ResultPage({ params }: PageProps) {
  const { seatingNo } = await params;
  const student = searchBySeatingNo(parseInt(seatingNo, 10));

  if (!student) {
    notFound();
  }

  const percentage = ((student.total_degree / 320) * 100).toFixed(1);
  const statusInfo = getStatusInfo(student.student_case_desc);
  const isExcellent = student.student_case_desc.includes("ناجح") && student.total_degree >= 300;
  const circumference = 2 * Math.PI * 54;
  const progressOffset = circumference - (student.total_degree / 320) * circumference;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Back link */}
        <a href="/" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
          العودة للبحث
        </a>

        {/* Result Card */}
        <div className={styles.resultCard}>
          {isExcellent && (
            <div className={styles.excellentBanner}>
              <span className={styles.star}>⭐</span>
              متفوق
              <span className={styles.star}>⭐</span>
            </div>
          )}

          <div className={styles.header}>
            <h1 className={styles.studentName}>{student.arabic_name}</h1>
            <p className={styles.seatingNumber}>رقم الجلوس: {student.seating_no}</p>
          </div>

          <div className={styles.scoreSection}>
            <div className={styles.circularProgress}>
              <svg viewBox="0 0 120 120" className={styles.progressSvg}>
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  className={styles.progressCircle}
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D94724" />
                    <stop offset="100%" stopColor="#FF6B3D" />
                  </linearGradient>
                </defs>
              </svg>
              <div className={styles.scoreOverlay}>
                <span className={styles.scoreValue}>{student.total_degree}</span>
                <span className={styles.scoreMax}>/ 320</span>
              </div>
            </div>

            <div className={styles.scoreDetails}>
              <div className={styles.percentageWrapper}>
                <span className={styles.percentageValue}>{percentage}%</span>
                <span className={styles.percentageLabel}>النسبة المئوية</span>
              </div>
              <div className={`${styles.statusBadge} ${statusInfo.className}`}>
                <span>{statusInfo.icon}</span>
                <span>{statusInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className={styles.shareSection}>
            <p className={styles.shareText}>شارك النتيجة</p>
            <div className={styles.shareButtons}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`نتيجة ${student.arabic_name} في الثانوية العامة 2026\nالمجموع: ${student.total_degree}/320 (${percentage}%)\n${student.student_case_desc}\nhttps://natega-thanawya-amma.vercel.app/result/${student.seating_no}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.shareBtn} ${styles.whatsapp}`}
                aria-label="مشاركة عبر واتساب"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://natega-thanawya-amma.vercel.app/result/${student.seating_no}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.shareBtn} ${styles.facebook}`}
                aria-label="مشاركة عبر فيسبوك"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`نتيجة ${student.arabic_name} في الثانوية العامة 2026 - المجموع: ${student.total_degree}/320 (${percentage}%)`)}&url=${encodeURIComponent(`https://natega-thanawya-amma.vercel.app/result/${student.seating_no}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.shareBtn} ${styles.twitter}`}
                aria-label="مشاركة عبر تويتر"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <section className={styles.seoContent}>
          <h2>نتيجة الثانوية العامة 2026 برقم الجلوس</h2>
          <p>
            تم اعتماد نتيجة الثانوية العامة للعام الدراسي 2025/2026 رسمياً. يمكنك الاستعلام عن نتيجتك من خلال رقم الجلوس أو الاسم.
            المجموع الكلي من 320 درجة. هذه صفحة نتيجة الطالب {student.arabic_name} برقم جلوس {student.seating_no}.
          </p>
        </section>
      </div>
    </main>
  );
}
