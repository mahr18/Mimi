export type Series = {
  slug: string;
  title: string;
  originalTitle: string;
  year: number;
  genre: string;
  seasons: number;
  episodes: number;
  rating: string;
  status: "مستمر" | "مكتمل" | "قريبًا";
  synopsis: string;
  palette: string;
  symbol: string;
  featured?: boolean;
};

export const seriesCatalog: Series[] = [
  {
    slug: "shadows-of-istanbul",
    title: "ظلال إسطنبول",
    originalTitle: "İstanbul'un Gölgeleri",
    year: 2025,
    genre: "دراما وغموض",
    seasons: 2,
    episodes: 24,
    rating: "8.7",
    status: "مستمر",
    synopsis: "حكاية عائلتين تتشابك أسرارهما في أزقة إسطنبول، حيث تقود رسالة قديمة إلى حقيقة غيّرت حياة الجميع.",
    palette: "rgba(183,45,73,.42)",
    symbol: "İ",
    featured: true
  },
  {
    slug: "the-last-promise",
    title: "الوعد الأخير",
    originalTitle: "Son Söz",
    year: 2024,
    genre: "رومانسي",
    seasons: 1,
    episodes: 16,
    rating: "8.2",
    status: "مكتمل",
    synopsis: "لقاء غير متوقع يعيد فتح قصة حب قديمة، ويضع أبطالها أمام اختيارات لم يتخيلوا مواجهتها.",
    palette: "rgba(190,126,70,.4)",
    symbol: "S"
  },
  {
    slug: "north-wind",
    title: "ريح الشمال",
    originalTitle: "Kuzey Rüzgarı",
    year: 2025,
    genre: "أكشن",
    seasons: 1,
    episodes: 10,
    rating: "8.5",
    status: "مستمر",
    synopsis: "ضابط يعود إلى مدينته الساحلية ليكتشف شبكة أسرار تمتد إلى أقرب الناس إليه.",
    palette: "rgba(48,110,151,.45)",
    symbol: "K"
  },
  {
    slug: "the-silent-room",
    title: "الغرفة الصامتة",
    originalTitle: "Sessiz Oda",
    year: 2023,
    genre: "تشويق",
    seasons: 1,
    episodes: 8,
    rating: "7.9",
    status: "مكتمل",
    synopsis: "اختفاء غامض داخل فندق قديم يجمع غرباء، ولكل واحد منهم سبب لإخفاء الحقيقة.",
    palette: "rgba(95,70,139,.45)",
    symbol: "O"
  },
  {
    slug: "one-more-spring",
    title: "ربيع آخر",
    originalTitle: "Bir Bahar Daha",
    year: 2024,
    genre: "عائلي",
    seasons: 2,
    episodes: 32,
    rating: "8.1",
    status: "مكتمل",
    synopsis: "ثلاثة أجيال في بيت واحد يحاولون بدء حياة جديدة بعد قرار يقلب موازين العائلة.",
    palette: "rgba(63,132,95,.4)",
    symbol: "B"
  },
  {
    slug: "red-line",
    title: "الخط الأحمر",
    originalTitle: "Kırmızı Çizgi",
    year: 2025,
    genre: "جريمة",
    seasons: 1,
    episodes: 12,
    rating: "8.4",
    status: "قريبًا",
    synopsis: "محقق عنيد يتتبع قضية تبدو بسيطة، قبل أن تتحول إلى اختبار لكل ما يؤمن به.",
    palette: "rgba(183,58,46,.42)",
    symbol: "Ç"
  }
];

export const categories = ["الكل", "دراما وغموض", "رومانسي", "أكشن", "تشويق", "عائلي", "جريمة"];

export function getSeriesBySlug(slug: string) {
  return seriesCatalog.find((series) => series.slug === slug);
}