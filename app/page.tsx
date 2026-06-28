"use client";

import { useRouter } from "next/navigation";
import { THEMES } from "@/lib/data";
import { Thumb } from "@/components/ui";

export default function HomePage() {
  const router = useRouter();
  const top5 = THEMES.filter((t) => t.popular).slice(0, 5);
  const all = THEMES;

  return (
    <main className="min-h-screen bg-lovepink-50 pb-10">
      {/* header */}
      <header className="flex items-center justify-between px-4 py-4">
        <button aria-label="back" className="text-xl text-ink">
          ‹
        </button>
        <h1 className="flex items-center gap-1 text-xl font-bold text-ink">
          포토부스 <span className="text-lovepink-500">💬</span>
        </h1>
        <span className="text-xl">👤</span>
      </header>

      {/* welcome banner */}
      <section className="mx-4 mb-6 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-card">
        <Thumb emoji="🧚‍♀️" gradient="from-lovepink-200 to-lovepink-300" className="h-16 w-16" rounded="rounded-full" />
        <div>
          <p className="text-base font-bold text-ink">러비의 사진관에 오신 걸 환영해요!</p>
          <p className="text-sm text-gray-500">오늘은 어떤 사진을 찍어 볼까요?</p>
        </div>
      </section>

      {/* TOP 5 */}
      <section className="px-4">
        <h2 className="mb-3 text-xl font-extrabold text-ink">인기 테마 TOP 5</h2>
        <ul className="space-y-3">
          {top5.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card"
            >
              <Thumb emoji={t.emoji} gradient={t.gradient} className="h-16 w-16" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-lovepink-500">{t.rank}</span>
                  <span className="text-lg font-bold text-ink">{t.title}</span>
                </div>
                <p className="truncate text-sm text-gray-400">{t.subtitle}</p>
              </div>
              <button
                onClick={() => router.push(`/theme/${t.id}`)}
                className="shrink-0 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-ink active:scale-95"
              >
                사용하기
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 전체 테마 */}
      <section className="mt-8 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">전체 테마</h2>
          <span className="text-sm text-gray-400">인기순 ▾</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {all.map((t) => (
            <button
              key={t.id}
              onClick={() => router.push(`/theme/${t.id}`)}
              className="overflow-hidden rounded-2xl bg-white text-left shadow-card active:scale-[0.98]"
            >
              <Thumb emoji={t.emoji} gradient={t.gradient} className="h-28 w-full" rounded="rounded-none" />
              <div className="p-3">
                <p className="font-bold text-ink">{t.title}</p>
                <p className="truncate text-xs text-gray-400">{t.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
