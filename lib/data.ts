// Static demo data modelled on the BeautyCam / 러비의 사진관 screenshots.
// In production these would come from the LoveyDovey API.

export type Theme = {
  id: string;
  rank?: number;
  title: string;
  subtitle: string;
  cost: number; // gems (젬)
  emoji: string;
  gradient: string; // tailwind gradient classes for the placeholder thumbnail
  popular: boolean;
};

export type RelationTab = "아는 사이" | "친구" | "썸" | "연인" | "결혼";

export type Character = {
  id: string;
  name: string;
  tab: RelationTab;
  kind: "character" | "celebrity";
  emoji: string;
  gradient: string;
  caption?: string;
};

export type Concept = {
  id: string;
  label: string;
};

export const THEMES: Theme[] = [
  {
    id: "realistic-couple",
    rank: 1,
    title: "실사 커플샷",
    subtitle: "캐릭터의 실사 버전과 함께 사진을 찍어요",
    cost: 50,
    emoji: "📸",
    gradient: "from-rose-300 to-lovepink-400",
    popular: true,
  },
  {
    id: "couple",
    rank: 2,
    title: "커플샷",
    subtitle: "커플 사진을 AI로 만들어보세요",
    cost: 40,
    emoji: "💞",
    gradient: "from-fuchsia-300 to-lovepink-500",
    popular: true,
  },
  {
    id: "fashion",
    rank: 3,
    title: "패션 화보",
    subtitle: "패션화보 스타일로 변신해요",
    cost: 50,
    emoji: "🖤",
    gradient: "from-zinc-400 to-zinc-700",
    popular: true,
  },
  {
    id: "future-baby",
    rank: 4,
    title: "미래 2세 만들기",
    subtitle: "우리 아이의 미래 모습을 만나보세요",
    cost: 60,
    emoji: "👶",
    gradient: "from-amber-200 to-rose-300",
    popular: true,
  },
  {
    id: "movie-poster",
    rank: 5,
    title: "영화 포스터",
    subtitle: "나만의 영화 포스터를 만들어보세요",
    cost: 50,
    emoji: "🎬",
    gradient: "from-orange-300 to-red-500",
    popular: true,
  },
  {
    id: "id-photo",
    title: "증명사진",
    subtitle: "깔끔한 AI 증명사진",
    cost: 30,
    emoji: "🪪",
    gradient: "from-sky-200 to-indigo-300",
    popular: false,
  },
  {
    id: "world-cup",
    title: "축구 국가대표샷",
    subtitle: "축구 테마 캐릭터와 응원샷을 찍어요",
    cost: 50,
    emoji: "⚽️",
    gradient: "from-emerald-300 to-teal-500",
    popular: false,
  },
];

export const RELATION_TABS: RelationTab[] = [
  "아는 사이",
  "친구",
  "썸",
  "연인",
  "결혼",
];

export const CHARACTERS: Character[] = [
  {
    id: "tee",
    name: "티",
    tab: "아는 사이",
    kind: "character",
    emoji: "🖤",
    gradient: "from-slate-600 to-slate-900",
  },
  {
    id: "ron-sophia",
    name: "론 & 소피아",
    tab: "아는 사이",
    kind: "character",
    emoji: "🌸",
    gradient: "from-pink-300 to-rose-400",
  },
  {
    id: "hanya",
    name: "학교의 지배자, 한야",
    tab: "아는 사이",
    kind: "character",
    emoji: "🏫",
    gradient: "from-stone-300 to-stone-500",
  },
  {
    id: "theetat",
    name: "티탓 [Theetat]",
    tab: "아는 사이",
    kind: "character",
    emoji: "🕶️",
    gradient: "from-lime-300 to-emerald-500",
  },
  {
    id: "second-marriage",
    name: "두 번째 결혼 / YOU",
    tab: "결혼",
    kind: "character",
    emoji: "💍",
    gradient: "from-indigo-400 to-slate-700",
  },
  // celebrity-style personas (prototype only — see docs/research legal memo)
  {
    id: "star-vocalist",
    name: "스타 보컬 ☆",
    tab: "연인",
    kind: "celebrity",
    emoji: "🎤",
    gradient: "from-violet-300 to-fuchsia-500",
    caption: "연예인 컨셉",
  },
  {
    id: "striker-no9",
    name: "국가대표 스트라이커",
    tab: "친구",
    kind: "celebrity",
    emoji: "⚽️",
    gradient: "from-emerald-300 to-teal-600",
    caption: "축구 테마",
  },
];

export const CONCEPTS: Concept[] = [
  { id: "vintage-booth", label: "빈티지 포토부스" },
  { id: "airport", label: "공항샷" },
  { id: "high-angle", label: "하이앵글" },
  { id: "mirror", label: "미러샷" },
  { id: "video-call", label: "영상통화" },
];

export const getTheme = (id: string) => THEMES.find((t) => t.id === id);
export const getCharacter = (id: string) =>
  CHARACTERS.find((c) => c.id === id);
