"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Lock, RotateCcw } from "lucide-react";
import type { GameRate } from "@/types/game";
import { CatMascot } from "@/components/mascot/CatMascot";
import { CatFloatingWidget } from "@/components/mascot/CatFloatingWidget";
import {
  computePlatformCounts,
  filterGames,
  type FilterPlatform,
} from "./filterGames";
import { SearchBar } from "./SearchBar";
import { PlatformSwitcher } from "./PlatformSwitcher";
import { ProductRateCard } from "./ProductRateCard";

export interface RateBoardClientProps {
  initialGames: GameRate[];
}

export function RateBoardClient({ initialGames }: RateBoardClientProps) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<FilterPlatform>("all");

  const counts = useMemo(
    () => computePlatformCounts(initialGames, query),
    [initialGames, query],
  );

  const visibleGames = useMemo(
    () => filterGames(initialGames, query, platform),
    [initialGames, query, platform],
  );

  const handleResetFilters = () => {
    setQuery("");
    setPlatform("all");
  };

  return (
    <div className="min-h-screen bg-[#fff6f9] font-[var(--font-prompt)] text-[#2d1622] selection:bg-[#ff85b3]/30 selection:text-[#2d1622]">
      <header className="border-b border-[#ffd6e5] bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <CatMascot
              variant="badge"
              label="มาสคอตน้องแมว Nuggetkub"
              className="h-10 w-10 shrink-0"
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-[var(--font-mali)] text-xl font-bold tracking-tight text-[#2d1622]">
                Nuggetkub Rates
              </span>
              <span className="inline-flex items-center rounded-full border border-[#ffc2da] bg-[#fff0f6] px-3 py-0.5 text-xs font-semibold text-[#be1253] tabular-nums">
                ทั้งหมด {initialGames.length} เกม
              </span>
            </div>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd6e5] bg-[#fff6f9] px-3.5 py-2 text-xs font-semibold text-[#6e485b] transition-colors hover:border-[#ff85b3] hover:bg-[#fff0f6] hover:text-[#2d1622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]"
          >
            <Lock aria-hidden="true" className="h-3.5 w-3.5" />
            <span>สำหรับแอดมิน</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border border-[#ffd6e5] bg-white p-6 shadow-[0_14px_34px_-16px_rgba(225,29,104,0.16)] sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-2xl text-center md:text-left">
              <h1 className="font-[var(--font-mali)] text-2xl font-bold leading-tight text-[#2d1622] sm:text-3xl lg:text-4xl">
                ตารางเรทราคาเกมและแอปแท้
              </h1>
              <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-[#6e485b]">
                เช็กเรทราคาเกมและแอปมือถือระบบ iOS และ Android ของร้าน Nuggetkub
                ได้ทันที ค้นหาชื่อเกมที่ต้องการหรือกดเลือกดูเฉพาะระบบที่ใช้งานได้เลย
              </p>
            </div>

            <div className="shrink-0">
              <CatMascot
                variant="hero"
                label="น้องแมว Nuggetkub ต้อนรับสู่ตารางเรทราคาเกม"
                className="h-32 w-32 sm:h-36 sm:w-36"
              />
            </div>
          </div>
        </section>

        <section
          aria-label="ค้นหาและกรองรายการเกม"
          className="sticky top-3 z-20 mb-8 rounded-3xl border border-[#ffd6e5] bg-white/95 p-4 shadow-[0_12px_30px_-14px_rgba(225,29,104,0.18)]"
        >
          <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-md">
              <SearchBar value={query} onChange={setQuery} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <PlatformSwitcher
                value={platform}
                onChange={setPlatform}
                counts={counts}
              />

              <p
                aria-live="polite"
                className="text-sm font-semibold text-[#6e485b] tabular-nums"
              >
                แสดง {visibleGames.length} รายการ
              </p>
            </div>
          </div>
        </section>

        {visibleGames.length > 0 ? (
          <section aria-label="รายการเรทราคาเกม">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleGames.map((game) => (
                <ProductRateCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        ) : (
          <section
            aria-label="ไม่พบรายการเกม"
            className="flex flex-col items-center justify-center rounded-3xl border border-[#ffd6e5] bg-white px-6 py-16 text-center shadow-[0_12px_28px_-14px_rgba(225,29,104,0.14)]"
          >
            <CatMascot
              variant="empty"
              label="น้องแมวหาเกมไม่เจอ"
              className="mb-4 h-28 w-28"
            />
            <h2 className="font-[var(--font-mali)] text-xl font-bold text-[#2d1622]">
              ไม่พบเกมที่ตรงกับการค้นหาเมี๊ยว~
            </h2>
            <p className="mt-2 max-w-md text-sm text-[#6e485b]">
              ลองตรวจสอบตัวสะกดอีกครั้ง หรือกดปุ่มด้านล่างเพื่อกลับไปดูรายการเกมทั้งหมดในตารางเรทราคา
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#e11d68] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(225,29,104,0.5)] transition-colors hover:bg-[#be1253] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] focus-visible:ring-offset-2"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              <span>ดูรายการเกมทั้งหมด</span>
            </button>
          </section>
        )}
      </main>

      <CatFloatingWidget />
    </div>
  );
}
