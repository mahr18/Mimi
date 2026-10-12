import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Dizi — اكتشف عالم المسلسلات التركية",
    template: "%s | Dizi"
  },
  description: "اكتشف المسلسلات التركية، تعرّف على القصص والمواسم والحلقات، واعثر على مصادر المشاهدة الرسمية والمرخّصة.",
  applicationName: "Dizi",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dizi.example"),
  openGraph: {
    title: "Dizi — اكتشف عالم المسلسلات التركية",
    description: "دليلك العربي لاكتشاف المسلسلات التركية ومصادرها الرسمية.",
    type: "website",
    locale: "ar"
  },
  robots: { index: process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SITE_URL), follow: process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SITE_URL) }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}