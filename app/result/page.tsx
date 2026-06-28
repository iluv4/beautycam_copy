"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui";
import { getCharacter, getTheme } from "@/lib/data";
import { useBooth } from "@/lib/store";

export default function ResultPage() {
  const router = useRouter();
  const { resultImage, resultMeta, resetBooth } = useBooth();

  useEffect(() => {
    if (!resultImage) router.replace("/");
  }, [resultImage, router]);

  if (!resultImage || !resultMeta) return null;

  const theme = getTheme(resultMeta.themeId);
  const char = resultMeta.characterId ? getCharacter(resultMeta.characterId) : null;
  const charName = char?.name ?? "내 캐릭터";

  function save() {
    const a = document.createElement("a");
    a.href = resultImage!;
    a.download = `lovecam-${resultMeta!.themeId}.png`;
    a.click();
  }

  return (
    <main className="min-h-screen bg-lovepink-50 pb-32">
      <TopBar title={`${charName}와의 ${theme?.title ?? "사진"}`} onBack={() => router.push("/")} />

      <section className="mx-4 mt-3 rounded-3xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-center gap-3 text-xl font-bold text-ink">
          <span>{charName}</span>
          <span className="text-lovepink-500">❤️</span>
          <span>나</span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resultImage}
          alt="generated"
          className="w-full rounded-2xl object-cover"
        />

        <div className="mt-4 flex items-center justify-center gap-8 text-2xl">
          <button aria-label="like" className="text-gray-300 active:text-lovepink-500">👍</button>
          <button aria-label="dislike" className="text-gray-300">👎</button>
          <span className="ml-auto text-2xl">🧚‍♀️</span>
        </div>
      </section>

      <div className="mx-4 mt-4 space-y-3">
        <button onClick={save} className="w-full rounded-2xl bg-white py-4 font-bold text-ink shadow-card">
          저장하기
        </button>
        <button className="w-full rounded-2xl bg-white py-4 font-bold text-ink shadow-card">
          포스트로 기록하기
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex max-w-[480px] gap-3 p-4">
        <button
          onClick={() => {
            resetBooth();
            router.push(`/theme/${resultMeta.themeId}`);
          }}
          className="flex-1 rounded-2xl bg-lovepink-300 py-4 font-bold text-white"
        >
          새 {theme?.title ?? "사진"}
        </button>
        <button
          onClick={() => router.push("/")}
          className="flex-1 rounded-2xl bg-lovepink-500 py-4 font-bold text-white"
        >
          포토부스로 돌아가기
        </button>
      </div>
    </main>
  );
}
