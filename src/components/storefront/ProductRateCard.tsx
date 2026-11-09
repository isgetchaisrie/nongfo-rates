import React from "react";
import { Gamepad2, Smartphone } from "lucide-react";
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
  const isApp = game.category === "app";

  return (
    <article className="neko-card group flex flex-col rounded-[24px] p-2 sm:rounded-[32px] sm:p-2.5">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="pointer-events-none absolute -right-1.5 -top-1.5 z-20 h-5 w-5 text-[#f8bbd0] drop-shadow-xs anim-float-1 sm:-right-2 sm:-top-2 sm:h-6 sm:w-6"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      <div className="relative flex flex-1 flex-col rounded-[18px] border-2 border-white bg-white/95 p-2 sm:rounded-[24px] sm:p-3 shadow-xs backdrop-blur-md">
        <div className="relative aspect-square w-full overflow-hidden rounded-[14px] border-2 border-white bg-[#FCE4EC]/40 shadow-xs sm:rounded-[20px] sm:border-[2.5px]">
          <img
            src={game.image}
            alt={game.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span
            className={`absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full border border-white px-2 py-0.5 text-xs font-bold shadow-xs sm:left-2.5 sm:top-2.5 sm:px-2.5 sm:py-1 ${
              isApp
                ? "bg-[#FFFDE7]/95 text-[#5c4338]"
                : "bg-[#FCE4EC]/95 text-[#5c4338]"
            }`}
          >
            {isApp ? (
              <Smartphone aria-hidden="true" className="h-3 w-3 text-[#d81b60] sm:h-3.5 sm:w-3.5" />
            ) : (
              <Gamepad2 aria-hidden="true" className="h-3 w-3 text-[#d81b60] sm:h-3.5 sm:w-3.5" />
            )}
            <span>{isApp ? "แอป" : "เกม"}</span>
          </span>
          <span className="absolute right-2.5 top-2.5 hidden items-center rounded-full border border-[#F8BBD0] bg-white/95 px-2.5 py-1 text-xs font-bold text-[#5c4338] shadow-xs sm:inline-flex">
            {PLATFORM_LABELS[game.platform]}
          </span>
        </div>

        <h2 className="mt-2 mb-1.5 line-clamp-2 min-h-[2.5rem] px-0.5 font-[var(--font-mali)] text-sm font-bold leading-snug text-[#4a352c] sm:mt-3 sm:mb-2.5 sm:min-h-[3.25rem] sm:text-lg">
          {game.name}
        </h2>

        <dl className="mt-auto grid grid-cols-2 gap-1.5 sm:gap-2">
          <div className="relative overflow-hidden rounded-xl border border-white bg-gradient-to-br from-[#FCE4EC] to-[#FFF0F6] p-1.5 sm:p-2.5 shadow-xs">
            <dt className="flex items-center gap-1 text-xs font-bold text-[#6d5246] sm:gap-1.5">
              <MiniIosIcon />
              <span>iOS</span>
            </dt>
            <dd
              className={`mt-0.5 font-[var(--font-fredoka)] text-base font-bold tabular-nums sm:mt-1 sm:text-xl ${
                hasIos ? "text-[#b81452]" : "text-[#84685b]"
              }`}
            >
              {hasIos ? `฿${game.priceIos}` : "—"}
            </dd>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white bg-gradient-to-br from-[#E8F0FE] to-[#E0F2F1] p-1.5 sm:p-2.5 shadow-xs">
            <dt className="flex items-center gap-1 text-xs font-bold text-[#134e3a] sm:gap-1.5">
              <MiniAndroidIcon />
              <span>Android</span>
            </dt>
            <dd
              className={`mt-0.5 font-[var(--font-fredoka)] text-base font-bold tabular-nums sm:mt-1 sm:text-xl ${
                hasAndroid ? "text-[#0f5137]" : "text-[#4b6e5f]"
              }`}
            >
              {hasAndroid ? `฿${game.priceAndroid}` : "—"}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
