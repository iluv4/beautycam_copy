"use client";

import { useState } from "react";
import { Thumb } from "@/components/ui";
import { CHARACTERS, RELATION_TABS } from "@/lib/data";

/**
 * Two-step character selector matching the screenshots:
 *  1) action sheet — upload a photo OR browse my characters
 *  2) "좋아요한 캐릭터" grid with relationship tabs
 */
export function CharacterPicker({
  onClose,
  onUploadClick,
  onSelect,
}: {
  onClose: () => void;
  onUploadClick: () => void;
  onSelect: (id: string) => void;
}) {
  const [view, setView] = useState<"sheet" | "grid">("sheet");
  const [tab, setTab] = useState(RELATION_TABS[0]);
  const [picked, setPicked] = useState<string | null>(null);

  const list = CHARACTERS.filter((c) => c.tab === tab);

  return (
    <div className="fixed inset-0 z-30 mx-auto flex max-w-[480px] flex-col justify-end bg-black/40">
      {view === "sheet" ? (
        <div className="rounded-t-3xl bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-ink">캐릭터 선택</h3>
            <button onClick={onClose} className="text-2xl text-gray-400">
              ×
            </button>
          </div>

          <button
            onClick={onUploadClick}
            className="mb-3 flex w-full items-center gap-4 rounded-2xl bg-lovepink-100 p-4 text-left"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-lovepink-200 text-xl">
              🖼️
            </span>
            <div>
              <p className="font-bold text-ink">캐릭터 사진 업로드</p>
              <p className="text-sm text-gray-500">직접 사진을 업로드합니다</p>
            </div>
          </button>

          <button
            onClick={() => setView("grid")}
            className="flex w-full items-center gap-4 rounded-2xl bg-lovepink-100 p-4 text-left"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-lovepink-200 text-xl">
              👥
            </span>
            <div>
              <p className="font-bold text-ink">캐릭터 선택하기</p>
              <p className="text-sm text-gray-500">
                내가 만든 캐릭터 또는 좋아요한 캐릭터에서 선택합니다
              </p>
            </div>
          </button>
        </div>
      ) : (
        <div className="flex max-h-[85vh] flex-col rounded-t-3xl bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <button onClick={() => setView("sheet")} className="text-xl text-ink">
              ‹
            </button>
            <h3 className="flex items-center gap-1 text-lg font-bold text-ink">
              좋아요한 캐릭터 <span className="text-lovepink-500">💬</span>
            </h3>
            <button onClick={onClose} className="text-2xl text-gray-400">
              ×
            </button>
          </div>

          {/* tabs */}
          <div className="no-scrollbar flex gap-5 overflow-x-auto border-b border-gray-100 px-5">
            {RELATION_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap pb-3 text-sm font-semibold ${
                  tab === t
                    ? "border-b-2 border-ink text-ink"
                    : "text-gray-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <p className="mb-3 text-sm text-gray-500">총 {list.length}개</p>
            {list.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">
                이 관계의 캐릭터가 아직 없어요.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {list.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setPicked(c.id)}
                    className="text-left"
                  >
                    <div className="relative">
                      <Thumb emoji={c.emoji} gradient={c.gradient} className="h-40 w-full" />
                      {picked === c.id && (
                        <span className="absolute inset-0 grid place-items-center rounded-2xl bg-black/20">
                          <span className="grid h-12 w-12 place-items-center rounded-full bg-lovepink-500 text-2xl text-white">
                            ✓
                          </span>
                        </span>
                      )}
                      {c.caption && (
                        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                          {c.caption}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-bold text-ink">{c.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4">
            <button
              disabled={!picked}
              onClick={() => picked && onSelect(picked)}
              className="w-full rounded-2xl bg-lovepink-400 py-4 text-lg font-bold text-white disabled:opacity-50"
            >
              선택하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
