"use client";

import { useRouter } from "next/navigation";

/** Gradient + emoji placeholder thumbnail (stands in for real character art). */
export function Thumb({
  emoji,
  gradient,
  className = "",
  rounded = "rounded-2xl",
}: {
  emoji: string;
  gradient: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${rounded} ${className}`}
    >
      <span className="text-3xl drop-shadow-sm">{emoji}</span>
    </div>
  );
}

/** Top app bar with a back chevron and centered title, matching the screenshots. */
export function TopBar({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-lovepink-50/90 px-4 py-3 backdrop-blur">
      <button
        aria-label="back"
        onClick={() => (onBack ? onBack() : router.back())}
        className="text-xl text-ink"
      >
        ‹
      </button>
      <h1 className="flex items-center gap-1 text-lg font-bold text-ink">
        {title} <span className="text-lovepink-500">💬</span>
      </h1>
      <div className="w-6 text-right">{right}</div>
    </div>
  );
}

export function GemBadge({ amount }: { amount: number }) {
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/30 px-3 py-1 text-sm font-semibold">
      {amount} 💎
    </span>
  );
}
