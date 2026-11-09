import React from "react";
import type { GameRate, PlatformType } from "@/types/game";

export interface ProductRateCardProps {
  game: GameRate;
}

const PLATFORM_LABELS: Record<PlatformType, string> = {
  both: "iOS & Android",
  ios: "เฉพาะ iOS",
  android: "เฉพาะ Android",
};

function MiniIosIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path d="M16.365 12.642c.018 2.09 1.832 2.785 1.852 2.794-.015.05-.29 1.002-.956 1.98-.576.846-1.174 1.689-2.115 1.706-.924.017-1.222-.55-2.28-.55-1.058 0-1.39.533-2.263.568-.906.034-1.599-.912-2.18-1.755-1.19-1.724-2.099-4.872-.878-6.996.606-1.054 1.69-1.722 2.866-1.739.895-.017 1.74.604 2.286.604.547 0 1.573-.747 2.651-.638.451.019 1.719.182 2.533 1.375-.066.041-1.512.885-1.496 2.651Zm-1.74-5.134c.483-.586.809-1.4.72-2.213-.696.028-1.539.464-2.039 1.05-.448.519-.84 1.35-.734 2.146.777.06 1.57-.396 2.053-.983Z" />
    </svg>
  );
}

function MiniAndroidIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path d="M17.523 15.341a.858.858 0 1 1 0-1.716.858.858 0 0 1 0 1.716Zm-11.046 0a.858.858 0 1 1 0-1.716.858.858 0 0 1 0 1.716Zm11.405-5.02 1.907-3.303a.396.396 0 0 0-.686-.396l-1.93 3.344a10.427 10.427 0 0 0-5.173-1.27 10.427 10.427 0 0 0-5.173 1.27L4.897 6.622a.396.396 0 0 0-.686.396l1.907 3.303C2.85 12.11.682 15.468.5 19.391h23c-.182-3.923-2.35-7.281-5.618-9.07Z" />
    </svg>
  );
}

export function ProductRateCard({ game }: ProductRateCardProps) {
  const hasIos = game.priceIos !== null && game.priceIos > 0;
  const hasAndroid = game.priceAndroid !== null && game.priceAndroid > 0;

  return (
    <article className="flex flex-col rounded-3xl border border-[#ffd6e5] bg-white p-4 shadow-[0_12px_28px_-14px_rgba(225,29,104,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(225,29,104,0.24)]">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#ffe4ee] bg-[#fff0f6]">
        <img
          src={game.image}
          alt={game.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-3 top-3 inline-flex items-center rounded-full border border-[#ffd6e5] bg-white/95 px-3 py-1 text-xs font-semibold text-[#2d1622] shadow-[0_4px_12px_-4px_rgba(45,22,34,0.14)]">
          {PLATFORM_LABELS[game.platform]}
        </span>
      </div>

      <h2 className="mt-4 mb-3 line-clamp-2 min-h-[3.25rem] font-[var(--font-mali)] text-lg font-bold leading-snug text-[#2d1622]">
        {game.name}
      </h2>

      <dl className="mt-auto grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-[#ffc2da] bg-[#fff0f6] p-3">
          <dt className="flex items-center gap-1.5 text-xs font-semibold text-[#6e485b]">
            <MiniIosIcon />
            <span>iOS</span>
          </dt>
          <dd
            className={`mt-1 font-[var(--font-fredoka)] text-xl font-bold tabular-nums ${
              hasIos ? "text-[#be1253]" : "text-[#6e485b]"
            }`}
          >
            {hasIos ? `฿${game.priceIos}` : "—"}
          </dd>
        </div>

        <div className="rounded-2xl border border-[#b8f0d6] bg-[#eefbf5] p-3">
          <dt className="flex items-center gap-1.5 text-xs font-semibold text-[#0f5137]">
            <MiniAndroidIcon />
            <span>Android</span>
          </dt>
          <dd
            className={`mt-1 font-[var(--font-fredoka)] text-xl font-bold tabular-nums ${
              hasAndroid ? "text-[#0f5137]" : "text-[#4b6e5f]"
            }`}
          >
            {hasAndroid ? `฿${game.priceAndroid}` : "—"}
          </dd>
        </div>
      </dl>
    </article>
  );
}
