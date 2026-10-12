import type { Metadata } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

const publicSiteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: { default: "VIP TV — اكتشف المسلسلات التركية", template: "%s | VIP TV" },
  description: "اكتشف المسلسلات التركية، تعرّف على قصصها وملصقاتها ومواسمها وحلقاتها، وابحث بسهولة عن العمل الذي تريد.",
  applicationName: "VIP TV",
  ...(publicSiteUrl ? { metadataBase: publicSiteUrl } : {}),
  openGraph: {
    title: "VIP TV — قصتك القادمة تبدأ بضغطة",
    description: "منصة عربية لاكتشاف المسلسلات التركية ومعلوماتها.",
    type: "website",
    locale: "ar"
  },
  robots: { index: process.env.NODE_ENV === "production" && Boolean(publicSiteUrl), follow: process.env.NODE_ENV === "production" && Boolean(publicSiteUrl) }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}

