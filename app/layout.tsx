import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "VIP TV — اكتشف المسلسلات التركية", template: "%s | VIP TV" },
  description: "اكتشف المسلسلات التركية، تعرّف على قصصها وملصقاتها ومواسمها وحلقاتها، وابحث بسهولة عن العمل الذي تريد.",
  applicationName: "VIP TV",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vip-tv.example"),
  openGraph: {
    title: "VIP TV — قصتك القادمة تبدأ بضغطة",
    description: "منصة عربية لاكتشاف المسلسلات التركية ومعلوماتها.",
    type: "website",
    locale: "ar"
  },
  robots: { index: process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SITE_URL), follow: process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SITE_URL) }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
