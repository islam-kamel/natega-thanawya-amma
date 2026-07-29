import type { Metadata, Viewport } from "next";
import "./globals.css";

// Google Tag Manager
const GTM_ID = "GTM-KG4KZK88";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  title: {
    default: "نتيجة الثانوية العامة 2026 | استعلم برقم الجلوس أو الاسم",
    template: "%s | نتيجة الثانوية العامة 2026",
  },
  description:
    "استعلم عن نتيجة الثانوية العامة 2026 برقم الجلوس أو بالاسم فوراً. نتائج أكثر من 919 ألف طالب وطالبة في مصر - نتيجة ثانوية عامة 2026 الدور الأول.",
  keywords: [
    "نتيجة الثانوية العامة 2026",
    "نتيجة ثانوية عامة",
    "نتيجة الثانوية العامة برقم الجلوس",
    "نتيجة الثانوية العامة بالاسم",
    "نتيجة ثانوية عامة 2026",
    "نتائج الثانوية العامة",
    "نتيجة الثانوية العامة مصر",
    "نتيجة 3 ثانوي 2026",
    "نتيجة الصف الثالث الثانوي",
    "الثانوية العامة 2026 مصر",
    "نتيجة الثانوية برقم الجلوس 2026",
    "موقع نتيجة الثانوية العامة",
  ],
  authors: [{ name: "نتيجة الثانوية العامة" }],
  creator: "نتيجة الثانوية العامة",
  publisher: "نتيجة الثانوية العامة",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://natega-thanawya-amma.vercel.app",
    siteName: "نتيجة الثانوية العامة 2026",
    title: "نتيجة الثانوية العامة 2026 | استعلم برقم الجلوس أو الاسم",
    description:
      "استعلم عن نتيجة الثانوية العامة 2026 فوراً برقم الجلوس أو بالاسم. نتائج أكثر من 919 ألف طالب وطالبة.",
  },
  twitter: {
    card: "summary_large_image",
    title: "نتيجة الثانوية العامة 2026",
    description:
      "استعلم عن نتيجة الثانوية العامة 2026 برقم الجلوس أو بالاسم فوراً",
  },
  alternates: {
    canonical: "https://natega-thanawya-amma.vercel.app",
  },
  other: {
    "google-site-verification": "",
    "content-language": "ar",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "نتيجة الثانوية العامة 2026",
  alternateName: "نتيجة ثانوية عامة 2026",
  url: "https://natega-thanawya-amma.vercel.app",
  description:
    "استعلم عن نتيجة الثانوية العامة 2026 برقم الجلوس أو بالاسم فوراً. نتائج أكثر من 919 ألف طالب وطالبة في مصر.",
  inLanguage: "ar",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://natega-thanawya-amma.vercel.app/result/{seating_no}",
    },
    "query-input": "required name=seating_no",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "كيف أستعلم عن نتيجة الثانوية العامة 2026؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "يمكنك الاستعلام عن نتيجتك من خلال إدخال رقم الجلوس أو الاسم في مربع البحث. ستظهر النتيجة فوراً.",
      },
    },
    {
      "@type": "Question",
      name: "ما هو الحد الأقصى للمجموع في الثانوية العامة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "الحد الأقصى للمجموع الكلي هو 410 درجة.",
      },
    },
    {
      "@type": "Question",
      name: 'ما معنى "دور ثان"؟',
      acceptedAnswer: {
        "@type": "Answer",
        text: "يعني أن الطالب لم يحقق درجة النجاح في مادة أو أكثر ولديه فرصة لإعادة الامتحان في الدور الثاني.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكنني البحث بالاسم؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم، يمكنك البحث بالاسم الكامل أو جزء من الاسم وستظهر لك جميع النتائج المطابقة.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
