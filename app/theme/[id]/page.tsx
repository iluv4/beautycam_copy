"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar, Thumb, GemBadge } from "@/components/ui";
import { CharacterPicker } from "@/components/CharacterPicker";
import {
  CONCEPTS,
  getCharacter,
  getTheme,
} from "@/lib/data";
import { useBooth } from "@/lib/store";

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function BoothPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const theme = getTheme(params.id);

  const {
    characterId,
    characterPhoto,
    myPhoto,
    mode,
    conceptId,
    freeText,
    setTheme,
    setCharacter,
    setCharacterPhoto,
    setMyPhoto,
    setMode,
    setConcept,
    setFreeText,
    setResult,
  } = useBooth();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const myFileRef = useRef<HTMLInputElement>(null);
  const charFileRef = useRef<HTMLInputElement>(null);

  // keep the active theme in the store
  useMemo(() => {
    if (theme) setTheme(theme.id);
  }, [theme, setTheme]);

  if (!theme) {
    return (
      <main className="p-6">
        <p>존재하지 않는 테마예요.</p>
        <button className="mt-4 underline" onClick={() => router.push("/")}>
          포토부스로 돌아가기
        </button>
      </main>
    );
  }

  const selectedChar = characterId ? getCharacter(characterId) : null;
  const charName = selectedChar?.name ?? (characterPhoto ? "내 캐릭터" : null);
  const ready = Boolean((characterId || characterPhoto) && myPhoto);

  async function onMyPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setMyPhoto(await readFileAsDataURL(f));
  }
  async function onCharPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setCharacterPhoto(await readFileAsDataURL(f));
      setCharacter(null);
    }
  }

  async function generate() {
    if (!theme || !ready || loading) return;
    setLoading(true);
    setError(null);
    try {
      const concept =
        mode === "concept"
          ? CONCEPTS.find((c) => c.id === conceptId)?.label
          : freeText;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: theme.id,
          themeTitle: theme.title,
          characterId,
          characterName: charName,
          characterPhoto,
          myPhoto,
          concept,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "생성 실패");
      const data = (await res.json()) as { image: string };
      setResult(data.image, { themeId: theme.id, characterId });
      router.push("/result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-lovepink-50 pb-28">
      <TopBar title={theme.title} onBack={() => router.push("/")} />

      {/* 사진 업로드 */}
      <section className="mx-4 mt-3 rounded-3xl bg-white p-5 shadow-card">
        <h2 className="mb-5 text-lg font-bold text-ink">사진 업로드</h2>
        <div className="flex items-center justify-center gap-6">
          {/* character slot */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setPickerOpen(true)}
              className="relative grid h-28 w-28 place-items-center rounded-full"
            >
              {selectedChar ? (
                <Thumb emoji={selectedChar.emoji} gradient={selectedChar.gradient} className="h-28 w-28" rounded="rounded-full" />
              ) : characterPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={characterPhoto} alt="character" className="h-28 w-28 rounded-full object-cover" />
              ) : (
                <span className="upload-ring grid h-28 w-28 place-items-center text-2xl text-lovepink-500">📷</span>
              )}
            </button>
            <span className="rounded-full bg-lovepink-100 px-3 py-1 text-sm text-ink">
              {charName ?? "캐릭터"}
            </span>
          </div>

          <span className="text-2xl text-lovepink-500">❤️</span>

          {/* my slot */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => myFileRef.current?.click()}
              className="relative grid h-28 w-28 place-items-center rounded-full"
            >
              {myPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={myPhoto} alt="me" className="h-28 w-28 rounded-full object-cover" />
              ) : (
                <span className="upload-ring grid h-28 w-28 place-items-center text-2xl text-lovepink-500">📷</span>
              )}
            </button>
            <span className="rounded-full bg-lovepink-100 px-3 py-1 text-sm text-ink">
              {myPhoto ? "나" : "내 사진"}
            </span>
            <input ref={myFileRef} type="file" accept="image/*" hidden onChange={onMyPhoto} />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-lovepink-100 p-3">
          <span className="text-lg">🧚‍♀️</span>
          <p className="text-sm font-medium text-lovepink-700">
            캐릭터는 실사로 변환되고, 내 얼굴은 그대로 유지돼요!
          </p>
        </div>
      </section>

      {/* 컨셉 */}
      <section className="mx-4 mt-4 rounded-3xl bg-white p-5 shadow-card">
        <h2 className="mb-4 text-lg font-bold text-ink">어떤 사진을 찍을까요?</h2>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("concept")}
            className={`rounded-2xl border-2 px-3 py-3 text-center ${
              mode === "concept"
                ? "border-lovepink-400 bg-lovepink-50"
                : "border-transparent bg-lovepink-100"
            }`}
          >
            <p className="font-bold text-ink">컨셉 선택</p>
            <p className="text-xs text-gray-500">준비된 컨셉 중 선택</p>
          </button>
          <button
            onClick={() => setMode("freeform")}
            className={`rounded-2xl border-2 px-3 py-3 text-center ${
              mode === "freeform"
                ? "border-lovepink-400 bg-lovepink-50"
                : "border-transparent bg-lovepink-100"
            }`}
          >
            <p className="font-bold text-ink">직접 입력</p>
            <p className="text-xs text-gray-500">원하는 장면 자유롭게</p>
          </button>
        </div>

        <div className="border-t border-gray-100 pt-4">
          {mode === "concept" ? (
            <div className="flex flex-wrap gap-2">
              {CONCEPTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setConcept(c.id)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    conceptId === c.id
                      ? "bg-lovepink-50 text-lovepink-600 ring-2 ring-lovepink-400"
                      : "bg-lovepink-100 text-ink"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="예) 노을 지는 해변에서 손잡고 걷는 장면"
              className="h-24 w-full resize-none rounded-2xl bg-lovepink-100 p-3 text-sm text-ink outline-none placeholder:text-gray-400"
            />
          )}
        </div>

        <button className="mt-4 flex w-full items-center justify-between rounded-2xl bg-lovepink-100 px-4 py-4 text-left">
          <span className="font-bold text-lovepink-600">잘 나오는 팁 🚩</span>
          <span className="text-lovepink-500">›</span>
        </button>
      </section>

      {error && (
        <p className="mx-4 mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {/* bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[480px] bg-gradient-to-t from-lovepink-50 via-lovepink-50 to-transparent p-4">
        <button
          disabled={!ready || loading}
          onClick={generate}
          className="flex w-full items-center justify-center rounded-2xl bg-lovepink-500 py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {loading ? "사진 찍는 중…" : `${theme.title} 찍으러 가기`}
          {!loading && <GemBadge amount={theme.cost} />}
        </button>
      </div>

      {pickerOpen && (
        <CharacterPicker
          onClose={() => setPickerOpen(false)}
          onUploadClick={() => {
            setPickerOpen(false);
            charFileRef.current?.click();
          }}
          onSelect={(id) => {
            setCharacter(id);
            setCharacterPhoto(null);
            setPickerOpen(false);
          }}
        />
      )}
      <input ref={charFileRef} type="file" accept="image/*" hidden onChange={onCharPhoto} />
    </main>
  );
}
