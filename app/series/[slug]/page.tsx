import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "صفحة غير متاحة | VIP TV",
  robots: { index: false, follow: false }
};

export default function LegacySeriesPage() {
  notFound(); // Reject legacy sample slugs rather than rendering fabricated series data.
}