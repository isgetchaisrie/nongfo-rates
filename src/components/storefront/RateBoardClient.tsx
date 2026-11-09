"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  LayoutGrid,
  Lock,
  RotateCcw,
  Sparkles,
  Table2,
} from "lucide-react";
import type { GameRate } from "@/types/game";
import { CatMascot } from "@/components/mascot/CatMascot";
import { CatFloatingWidget } from "@/components/mascot/CatFloatingWidget";
import { KawaiiCatSprite } from "@/components/mascot/KawaiiCatPlayground";
import {
  computeCategoryCounts,
  computePlatformCounts,
  filterGames,
  type FilterCategory,
  type FilterPlatform,
} from "./filterGames";
import { SearchBar } from "./SearchBar";
import { PlatformSwitcher } from "./PlatformSwitcher";
import { ProductRateCard } from "./ProductRateCard";
import { BottomNav } from "./BottomNav";

export interface RateBoardClientProps {
  initialGames: GameRate[];
}

const CATEGORY_TABS: Array<{
  id: FilterCategory;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "all", label: "ทุกหมวด", Icon: LayoutGrid },
  { id: "game", label: "เกม", Icon: Gamepad2 },
  { id: "app", label: "แอป", Icon: Sparkles },
];

export function RateBoardClient({ initialGames }: RateBoardClientProps) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<FilterPlatform>("all");
  const [category, setCategory] = useState<FilterCategory>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const counts = useMemo(
    () => computePlatformCounts(initialGames, query, category),
    [initialGames, query, category],
  );

  const categoryCounts = useMemo(
    () => computeCategoryCounts(initialGames, query, platform),
    [initialGames, query, platform],
  );

  const visibleGames = useMemo(
    () => filterGames(initialGames, query, platform, category),
    [initialGames, query, platform, category],
  );

  const handleResetFilters = () => {
    setQuery("");
    setPlatform("all");
    setCategory("all");
  };

  return (
    <div className="bg-pastel-canvas relative min-h-screen overflow-x-hidden font-[var(--font-prompt)] text-[#4a352c] selection:bg-[#FCE4EC] selection:text-[#4a352c]">
      {/* Ambient Floating Hearts & Stars (Pattistore Kawaii Style) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <svg
          className="anim-float-1 absolute left-[8%] top-[7%] h-8 w-8 text-[#F8BBD0]/55"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <svg
          className="anim-pulse absolute left-[3%] top-[24%] h-6 w-6 text-[#F8BBD0]/45"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="anim-float-2 absolute right-[7%] top-[12%] h-9 w-9 text-[#F8BBD0]/55"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="anim-float-3 absolute right-[4%] top-[48%] h-7 w-7 text-[#F8BBD0]/50"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <svg
          className="anim-float-2 absolute bottom-[12%] left-[9%] h-8 w-8 text-[#F8BBD0]/50"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      <header className="relative z-10 border-b border-[#F8BBD0]/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3.5 py-2.5 sm:gap-4 sm:px-6 sm:py-3.5 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <CatMascot
              variant="badge"
              label="มาสคอตน้องแมว Nongfo"
              className="h-8 w-8 shrink-0 sm:h-10 sm:w-10"
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-[var(--font-mali)] text-base font-bold tracking-tight text-[#4a352c] sm:text-xl">
                Nongfo Rates
              </span>
              <span className="inline-flex items-center rounded-full border border-white bg-[#FCE4EC] px-2.5 py-0.5 text-xs font-bold text-[#b81452] shadow-xs tabular-nums sm:px-3">
                ทั้งหมด {initialGames.length} รายการ
              </span>
            </div>
          </div>

          <Link
            href="/admin"
            className="hidden items-center gap-1.5 rounded-full border border-white bg-[#FCE4EC] px-3 py-1.5 text-xs font-bold text-[#5c4338] shadow-xs transition-all hover:bg-[#F8BBD0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] md:inline-flex sm:px-4 sm:py-2"
          >
            <Lock aria-hidden="true" className="h-3.5 w-3.5 text-[#b81452]" />
            <span>สำหรับแอดมิน</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-3 pt-3 pb-40 sm:px-6 sm:pt-8 lg:px-8 lg:pb-28">
        <section className="glass-card relative mb-3.5 rounded-[24px] p-2.5 sm:mb-8 sm:rounded-[40px] sm:p-6">
          <svg
            aria-hidden="true"
            className="anim-float-1 pointer-events-none absolute -left-2 -top-3 z-20 h-6 w-6 text-[#F8BBD0] drop-shadow-xs sm:-top-4 sm:h-9 sm:w-9"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg
            aria-hidden="true"
            className="anim-float-2 pointer-events-none absolute -right-1.5 top-4 z-20 h-5 w-5 text-[#F8BBD0] drop-shadow-xs sm:-right-2 sm:top-6 sm:h-7 sm:w-7"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>

          <div className="relative rounded-[20px] p-3 sm:rounded-[34px] sm:p-6">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="calc(100% - 4px)"
                height="calc(100% - 4px)"
                rx="18"
                ry="18"
                fill="none"
                stroke="#F8BBD0"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-dash"
              />
            </svg>

            <div className="flex flex-row items-center justify-between gap-3 md:gap-6">
              <div className="min-w-0 flex-1 text-left">
                <h1 className="font-[var(--font-mali)] text-lg font-bold leading-snug text-[#4a352c] sm:text-3xl lg:text-4xl">
                  ตารางเรทราคา{" "}
                  <span className="relative inline-block rounded-xl border border-[#F8BBD0] bg-[#FCE4EC] px-2 py-0.5 text-[#b81452] sm:rounded-2xl sm:px-3">
                    เกมและแอปแท้
                    <svg
                      aria-hidden="true"
                      className="anim-float-3 absolute -right-2 -top-2 h-4 w-4 text-[#f06292] sm:-right-2.5 sm:-top-2.5 sm:h-5 sm:w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </span>
                </h1>
                <p className="mt-1.5 max-w-[65ch] text-xs font-medium leading-relaxed text-[#6d5246] sm:mt-3 sm:text-base">
                  เช็กเรทราคาเกมและแอปมือถือ iOS & Android ของร้าน Nongfo แท้ 100%
                  เลือกหมวดหรือสลับตารางจากแถบด้านล่างได้เลยน้า~
                </p>
              </div>

              <div className="relative flex shrink-0 items-center justify-center">
                <div className="anim-float-1 absolute -left-4 -top-3 z-20 sm:-left-7 sm:-top-6">
                  <KawaiiCatSprite
                    col={1}
                    row={3}
                    size={40}
                    label="น้องแมวชมพูพาสเทล Nongfo"
                    className="sm:scale-125"
                  />
                </div>
                <div className="anim-float-2 absolute -bottom-2 -left-3 z-20 sm:-bottom-4 sm:-left-6">
                  <KawaiiCatSprite
                    col={0}
                    row={3}
                    size={38}
                    label="น้องแมวโบว์ม่วงพาสเทล Nongfo"
                    className="sm:scale-125"
                  />
                </div>
                <div className="anim-float-3 absolute -right-3 -top-3 z-20 sm:-right-6 sm:-top-5">
                  <KawaiiCatSprite
                    col={4}
                    row={3}
                    size={38}
                    label="น้องแมวสายรุ้งพาสเทล Nongfo"
                    className="sm:scale-125"
                  />
                </div>
                <div className="rounded-[20px] border-2 border-white bg-[#FFFDE7]/85 p-1.5 shadow-sm sm:rounded-[28px] sm:border-4 sm:p-2.5">
                  <CatMascot
                    variant="hero"
                    label="น้องแมว Nongfo ต้อนรับสู่ตารางเรทราคาเกม"
                    className="animate-mascot-float h-16 w-16 sm:h-36 sm:w-36"
                  />
                </div>
              </div>
            </div>

            {/* Cute Interactive Kawaii Cat Parade Strip (Desktop/Tablet) */}
            <div className="mt-5 hidden flex-wrap items-center justify-between gap-2.5 border-t border-[#F8BBD0]/45 pt-4 sm:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white bg-[#FCE4EC] px-3.5 py-1 text-center text-xs font-bold text-[#4a352c] shadow-xs">
                แก๊งน้องแมว Nongfo พร้อมต้อนรับเลือกชมเกมและแอปแท้ราคาน่ารัก~
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { col: 0, row: 0, label: "น้องแมวขาวจั๊วะ" },
                  { col: 0, row: 3, label: "น้องแมวโบว์ม่วง" },
                  { col: 1, row: 3, label: "น้องแมวซากุระชมพู" },
                  { col: 2, row: 3, label: "น้องแมวฟ้าพาสเทล" },
                  { col: 3, row: 3, label: "น้องแมวมินต์กระดิ่งทอง" },
                  { col: 4, row: 3, label: "น้องแมวสายรุ้งพาสเทล" },
                  { col: 5, row: 3, label: "น้องแมวกาแล็กซีดาววิ้ง" },
                ].map((cat, idx) => (
                  <div
                    key={`${cat.col}-${cat.row}`}
                    className={idx % 2 === 0 ? "anim-float-1" : "anim-float-2"}
                  >
                    <KawaiiCatSprite
                      col={cat.col}
                      row={cat.row}
                      size={46}
                      label={cat.label}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="ค้นหาและกรองรายการเกมและแอป"
          className="glass-card sticky top-2 z-20 mb-4 rounded-[22px] p-2.5 sm:top-3 sm:mb-10 sm:rounded-[32px] sm:p-4"
        >
          <div className="pointer-events-none absolute -top-8 right-7 z-30 hidden sm:block">
            <KawaiiCatSprite
              col={1}
              row={1}
              size={58}
              label="น้องแมวทักทาย"
              className="anim-float-1"
            />
          </div>
          <div className="flex flex-col gap-2 sm:gap-3.5">
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:max-w-md">
                <SearchBar value={query} onChange={setQuery} />
              </div>

              {/* Category tabs shown on md+ since BottomNav handles categories on mobile */}
              <div
                role="group"
                aria-label="กรองตามหมวดหมู่ เกม หรือ แอป"
                className="hidden flex-wrap items-center gap-2 md:inline-flex"
              >
                {CATEGORY_TABS.map(({ id, label, Icon }) => {
                  const isActive = category === id;
                  const count = categoryCounts[id] ?? 0;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setCategory(id)}
                      className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] focus-visible:ring-offset-2 ${
                        isActive
                          ? "border-white bg-[#FCE4EC] text-[#4a352c] shadow-[0_6px_16px_-4px_rgba(244,143,177,0.55)]"
                          : "border-[#F8BBD0]/60 bg-[#FFFDF9] text-[#6d5246] hover:bg-[#FCE4EC]/50 hover:text-[#4a352c]"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[#d81b60]" />
                      <span>{label}</span>
                      <span
                        className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 font-[var(--font-fredoka)] text-xs font-bold tabular-nums ${
                          isActive
                            ? "bg-white text-[#b81452]"
                            : "bg-[#FCE4EC] text-[#b81452]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[#F8BBD0]/40 pt-2 sm:flex-wrap sm:gap-3 sm:pt-3">
              <PlatformSwitcher
                value={platform}
                onChange={setPlatform}
                counts={counts}
              />

              <div className="flex items-center gap-2">
                {/* View mode toggle shown on md+ since BottomNav has the table toggle on mobile */}
                <div
                  role="group"
                  aria-label="สลับมุมมองการ์ดหรือตาราง"
                  className="hidden items-center rounded-full border border-[#F8BBD0]/70 bg-[#FFFDF9] p-1 shadow-xs md:inline-flex"
                >
                  <button
                    type="button"
                    aria-pressed={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] ${
                      viewMode === "grid"
                        ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                        : "text-[#6d5246] hover:text-[#4a352c]"
                    }`}
                  >
                    <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>การ์ด</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={viewMode === "table"}
                    onClick={() => setViewMode("table")}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] ${
                      viewMode === "table"
                        ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                        : "text-[#6d5246] hover:text-[#4a352c]"
                    }`}
                  >
                    <Table2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>ตาราง</span>
                  </button>
                </div>

                <p
                  aria-live="polite"
                  className="shrink-0 rounded-full border border-[#F8BBD0]/60 bg-white px-2.5 py-1 text-xs font-bold text-[#6d5246] tabular-nums sm:px-3"
                >
                  {visibleGames.length} รายการ
                </p>
              </div>
            </div>
          </div>
        </section>

        {visibleGames.length > 0 ? (
          <section aria-label="รายการเรทราคาเกมและแอป">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3 pt-1 sm:gap-6 sm:pt-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleGames.map((game) => (
                  <ProductRateCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="glass-card overflow-hidden rounded-[24px] border border-[#F8BBD0]/70 sm:rounded-[32px]">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#F8BBD0]/60 bg-[#FCE4EC]/75 font-[var(--font-mali)] text-xs font-bold text-[#4a352c] sm:text-sm">
                        <th scope="col" className="py-3 pr-2 pl-3.5 sm:py-3.5 sm:pl-6">
                          รายชื่อเกม / แอป
                        </th>
                        <th
                          scope="col"
                          className="w-24 px-2 py-3 text-center sm:w-36 sm:px-4 sm:py-3.5"
                        >
                          เรท iOS
                        </th>
                        <th
                          scope="col"
                          className="w-24 py-3 pr-3.5 pl-2 text-center sm:w-36 sm:py-3.5 sm:pr-6 sm:pl-4"
                        >
                          เรท Android
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F8BBD0]/40 bg-white/85">
                      {visibleGames.map((game, idx) => {
                        const hasIos =
                          game.priceIos !== null && game.priceIos > 0;
                        const hasAndroid =
                          game.priceAndroid !== null && game.priceAndroid > 0;
                        const isApp = game.category === "app";

                        return (
                          <tr
                            key={game.id}
                            className={`transition-colors hover:bg-[#FCE4EC]/35 ${
                              idx % 2 === 1 ? "bg-[#FFFDF9]/90" : "bg-white/90"
                            }`}
                          >
                            <td className="py-2.5 pr-2 pl-3.5 sm:py-3 sm:pl-6">
                              <div className="flex items-center gap-2.5 sm:gap-3.5">
                                <img
                                  src={game.image}
                                  alt={game.name}
                                  loading="lazy"
                                  className="h-10 w-10 shrink-0 rounded-xl border-2 border-white bg-[#FCE4EC]/40 object-cover shadow-xs sm:h-12 sm:w-12 sm:rounded-2xl"
                                />
                                <div className="min-w-0">
                                  <p className="font-[var(--font-mali)] text-xs font-bold leading-snug text-[#4a352c] sm:text-base">
                                    {game.name}
                                  </p>
                                  <span
                                    className={`mt-0.5 inline-flex items-center gap-1 rounded-full border border-[#F8BBD0]/60 px-2 py-0.5 text-xs font-bold ${
                                      isApp
                                        ? "bg-[#FFFDE7] text-[#5c4338]"
                                        : "bg-[#FCE4EC]/70 text-[#5c4338]"
                                    }`}
                                  >
                                    {isApp ? "แอป" : "เกม"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-2.5 text-center sm:px-4 sm:py-3">
                              {hasIos ? (
                                <span className="inline-flex min-w-14 items-center justify-center rounded-xl border border-white bg-[#FCE4EC] px-2.5 py-1 font-[var(--font-fredoka)] text-sm font-bold text-[#b81452] shadow-xs tabular-nums sm:min-w-20 sm:rounded-2xl sm:px-3 sm:py-1.5 sm:text-lg">
                                  ฿{game.priceIos}
                                </span>
                              ) : (
                                <span className="font-[var(--font-fredoka)] text-sm font-bold text-[#84685b] tabular-nums">
                                  —
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 pr-3.5 pl-2 text-center sm:py-3 sm:pr-6 sm:pl-4">
                              {hasAndroid ? (
                                <span className="inline-flex min-w-14 items-center justify-center rounded-xl border border-white bg-[#E0F2F1] px-2.5 py-1 font-[var(--font-fredoka)] text-sm font-bold text-[#0f5137] shadow-xs tabular-nums sm:min-w-20 sm:rounded-2xl sm:px-3 sm:py-1.5 sm:text-lg">
                                  ฿{game.priceAndroid}
                                </span>
                              ) : (
                                <span className="font-[var(--font-fredoka)] text-sm font-bold text-[#4b6e5f] tabular-nums">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section
            aria-label="ไม่พบรายการเกมหรือแอป"
            className="glass-card flex flex-col items-center justify-center rounded-[36px] px-6 py-16 text-center"
          >
            <CatMascot
              variant="empty"
              label="น้องแมวหารายการไม่เจอ"
              className="mb-4 h-28 w-28"
            />
            <h2 className="font-[var(--font-mali)] text-xl font-bold text-[#4a352c]">
              ไม่พบเกมหรือแอปที่ตรงกับการค้นหาเมี๊ยว~
            </h2>
            <p className="mt-2 max-w-md text-sm font-medium text-[#6d5246]">
              ลองตรวจสอบตัวสะกดอีกครั้ง หรือกดปุ่มด้านล่างเพื่อกลับไปดูรายการทั้งหมดในตารางเรทราคาน้า
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white bg-[#FCE4EC] px-6 py-3 text-sm font-bold text-[#4a352c] shadow-md transition-all hover:bg-[#F8BBD0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] focus-visible:ring-offset-2"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4 text-[#b81452]" />
              <span>ดูรายการทั้งหมดเลยน้า</span>
            </button>
          </section>
        )}
      </main>

      <CatFloatingWidget />
      <BottomNav
        category={category}
        onSelectCategory={setCategory}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode((prev) => (prev === "grid" ? "table" : "grid"))
        }
        gameCount={categoryCounts.game ?? 0}
        appCount={categoryCounts.app ?? 0}
      />
    </div>
  );
}
