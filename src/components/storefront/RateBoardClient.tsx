"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Lock,
  RotateCcw,
  Table2,
} from "lucide-react";
import type { GameRate } from "@/types/game";
import { CatMascot } from "@/components/mascot/CatMascot";
import {
  computeCategoryCounts,
  computePlatformCounts,
  filterGames,
  type FilterCategory,
  type FilterPlatform,
} from "./filterGames";
import { SearchBar } from "./SearchBar";
import { AppleIcon, AndroidIcon } from "./PlatformSwitcher";
import { ProductRateCard } from "./ProductRateCard";
import { BottomNav, type StorefrontSection } from "./BottomNav";
import { PaymentAccountSection } from "./PaymentAccountSection";
import { ContactAdminSection } from "./ContactAdminSection";
import {
  DEFAULT_STORE_SETTINGS,
  type StoreSettings,
} from "@/types/settings";

export interface RateBoardClientProps {
  initialGames: GameRate[];
  initialSection?: StorefrontSection;
  initialCategory?: FilterCategory;
  initialSettings?: StoreSettings;
}

export function RateBoardClient({
  initialGames,
  initialSection = "rates",
  initialCategory = "all",
  initialSettings,
}: RateBoardClientProps) {
  const [settings] = useState<StoreSettings>(
    initialSettings ?? DEFAULT_STORE_SETTINGS,
  );
  const [activeSection, setActiveSection] =
    useState<StorefrontSection>(initialSection);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<FilterPlatform>("all");
  const [category, setCategory] = useState<FilterCategory>(initialCategory);
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <CatMascot
              variant="badge"
              label="มาสคอตน้องแมว Nongfo"
              className="h-8 w-8 shrink-0 sm:h-10 sm:w-10"
            />
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-[var(--font-mali)] text-sm font-bold tracking-tight text-[#4a352c] sm:text-xl">
                Nongfo Rates
              </span>
              <span className="inline-flex items-center rounded-full border border-white bg-[#FCE4EC] px-2 py-0.5 text-[10px] font-bold text-[#b81452] shadow-xs tabular-nums sm:px-3 sm:text-xs">
                {initialGames.length} รายการ
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 rounded-full border border-[#F8BBD0]/60 bg-[#FFFDF9] p-1 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setActiveSection("rates");
                setCategory("game");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeSection === "rates" && (category === "game" || category === "all")
                  ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                  : "text-[#6d5246] hover:text-[#4a352c] hover:bg-white"
              }`}
            >
              หมวดเกม
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSection("rates");
                setCategory("app");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeSection === "rates" && category === "app"
                  ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                  : "text-[#6d5246] hover:text-[#4a352c] hover:bg-white"
              }`}
            >
              หมวดแอป
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("account")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeSection === "account"
                  ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                  : "text-[#6d5246] hover:text-[#4a352c] hover:bg-white"
              }`}
            >
              บัญชีชำระเงิน
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("contact")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeSection === "contact"
                  ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                  : "text-[#6d5246] hover:text-[#4a352c] hover:bg-white"
              }`}
            >
              ติดต่อแอดมิน
            </button>
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
        {activeSection === "account" && (
          <PaymentAccountSection
            settings={settings}
            onExploreRates={() => {
              setActiveSection("rates");
              setCategory("all");
              setViewMode("grid");
            }}
          />
        )}

        {activeSection === "contact" && (
          <ContactAdminSection settings={settings} />
        )}

        {activeSection === "rates" && (
          <>
            <section className="gingham-frame relative mb-3.5 rounded-[28px] p-2.5 sm:mb-8 sm:rounded-[44px] sm:p-3.5 border-3 border-white shadow-[0_8px_28px_rgba(244,143,177,0.22)]">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -left-1.5 -top-2.5 z-20 h-6 w-6 text-[#F8BBD0] drop-shadow-xs sm:-top-3.5 sm:h-8 sm:w-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-1 top-4 z-20 h-5 w-5 text-[#F8BBD0] drop-shadow-xs sm:-right-1.5 sm:top-5 sm:h-6 sm:w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>

          <div className="relative rounded-[22px] border-2 border-white bg-white/95 p-3 sm:rounded-[36px] sm:p-6 shadow-xs backdrop-blur-md">

            <div className="flex flex-row items-center justify-between gap-3 sm:gap-6">
              <div className="min-w-0 flex-1 text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#f0e4dc] bg-[#fffaf8] px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-[#8a6b5c] shadow-2xs mb-1.5 sm:mb-2">
                  <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
                  <span>เรทราคาพร้อมส่ง อัปเดตล่าสุด</span>
                </div>
                <h1 className="font-[var(--font-mali)] text-lg font-bold leading-snug text-[#3d271d] sm:text-3xl lg:text-4xl">
                  ตารางเรทราคา{" "}
                  <span className="relative inline-block rounded-xl border border-[#ffd6e5] bg-[#FFF0F6] px-2 py-0.5 text-[#9d174d] sm:rounded-2xl sm:px-3.5">
                    เกมและแอปแท้
                  </span>
                </h1>
                <p className="mt-1.5 max-w-[55ch] text-[11px] font-medium leading-relaxed text-[#6d5246] sm:mt-2 sm:text-sm">
                  เช็กเรทราคาเกมและแอปมือถือ iOS & Android ของร้าน Nongfo แท้ 100% สั่งซื้อง่าย ทักแชทสอบถามแอดมินได้ตลอดนะคะ
                </p>
              </div>

              {/* Real Polaroid Photo with Washi Tape */}
              <div className="relative shrink-0 pt-1 pr-0.5">
                <div className="relative rotate-[-2deg] rounded-lg border border-[#f0e4dc] bg-white p-1.5 pb-2 sm:p-2 sm:pb-2.5 shadow-[0_4px_16px_rgba(92,67,56,0.12)] transition-transform hover:rotate-0">
                  {/* Washi Tape Snippet */}
                  <div className="washi-tape-pink absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-10 sm:h-3.5 sm:w-12 rounded-2xs border-x border-white/60" />
                  <img
                    src="/admin-profile.jpg"
                    alt="ร้าน Nongfo"
                    className="h-14 w-14 sm:h-24 sm:w-24 rounded-sm object-cover"
                  />
                  <div className="mt-0.5 text-center font-[var(--font-mali)] text-[9px] sm:text-[10px] font-bold text-[#8a6b5c]">
                    ร้าน Nongfo
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Features Pills Strip */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-[#f0e4dc] pt-2.5 sm:mt-4 sm:pt-3.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#f0e4dc] bg-[#fffaf8] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#6d5246]">
                <span>✓ ของแท้ 100%</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#ffd6e5] bg-[#FFF5F8] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#9d174d]">
                <span>⚡ โอนแล้วส่งไว</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#bbf7d0] bg-[#F0FDF4] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#166534]">
                <span>💬 แอดมินตอบแชทไว</span>
              </span>
            </div>
          </div>
        </section>

        <section
          aria-label="ค้นหาและกรองรายการเกมและแอป"
          className="gingham-frame sticky top-2 z-20 mb-4 rounded-[26px] p-2 sm:top-3 sm:mb-8 sm:rounded-[32px] sm:p-2.5 border-3 border-white shadow-[0_8px_24px_rgba(244,143,177,0.2)]"
        >
          <div className="rounded-[20px] border-2 border-white bg-white/95 p-2 sm:rounded-[26px] sm:p-3 shadow-xs backdrop-blur-md">
            <div className="flex flex-col gap-2">
            <SearchBar value={query} onChange={setQuery} />

            <div className="flex flex-col gap-2 border-t border-[#F8BBD0]/40 pt-2 sm:flex-row sm:items-center sm:justify-between sm:pt-2.5">
              <div
                role="group"
                aria-label="หมวดตัวกรอง ทั้งหมด ตาราง iOS และ Android"
                className="grid grid-cols-4 gap-1 sm:flex sm:flex-wrap sm:gap-2"
              >
                {/* 1. ทั้งหมด */}
                <button
                  type="button"
                  aria-pressed={viewMode === "grid" && platform === "all"}
                  onClick={() => {
                    setViewMode("grid");
                    setPlatform("all");
                  }}
                  className={`inline-flex h-8 sm:h-10 items-center justify-center gap-1 rounded-full border px-1.5 sm:px-4 text-[11px] sm:text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] cursor-pointer ${
                    viewMode === "grid" && platform === "all"
                      ? "border-white bg-[#FCE4EC] text-[#4a352c] shadow-[0_4px_12px_-2px_rgba(244,143,177,0.55)]"
                      : "border-[#F8BBD0]/60 bg-[#FFFDF9] text-[#6d5246] hover:bg-[#FCE4EC]/50 hover:text-[#4a352c]"
                  }`}
                >
                  <LayoutGrid className="h-3 w-3 shrink-0 text-[#d81b60] sm:h-4 sm:w-4" />
                  <span>ทั้งหมด</span>
                </button>

                {/* 2. ตาราง */}
                <button
                  type="button"
                  aria-pressed={viewMode === "table"}
                  onClick={() => {
                    setViewMode((prev) =>
                      prev === "table" ? "grid" : "table",
                    );
                    setPlatform("all");
                  }}
                  className={`inline-flex h-8 sm:h-10 items-center justify-center gap-1 rounded-full border px-1.5 sm:px-4 text-[11px] sm:text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] cursor-pointer ${
                    viewMode === "table"
                      ? "border-white bg-[#FCE4EC] text-[#4a352c] shadow-[0_4px_12px_-2px_rgba(244,143,177,0.55)]"
                      : "border-[#F8BBD0]/60 bg-[#FFFDF9] text-[#6d5246] hover:bg-[#FCE4EC]/50 hover:text-[#4a352c]"
                  }`}
                >
                  <Table2 className="h-3 w-3 shrink-0 text-[#d81b60] sm:h-4 sm:w-4" />
                  <span>ตาราง</span>
                </button>

                {/* 3. iOS */}
                <button
                  type="button"
                  aria-pressed={viewMode === "grid" && platform === "ios"}
                  onClick={() => {
                    setViewMode("grid");
                    setPlatform("ios");
                  }}
                  className={`inline-flex h-8 sm:h-10 items-center justify-center gap-1 rounded-full border px-1.5 sm:px-4 text-[11px] sm:text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] cursor-pointer ${
                    viewMode === "grid" && platform === "ios"
                      ? "border-white bg-[#FCE4EC] text-[#4a352c] shadow-[0_4px_12px_-2px_rgba(244,143,177,0.55)]"
                      : "border-[#F8BBD0]/60 bg-[#FFFDF9] text-[#6d5246] hover:bg-[#FCE4EC]/50 hover:text-[#4a352c]"
                  }`}
                >
                  <AppleIcon className="h-3 w-3 shrink-0 text-[#d81b60] sm:h-4 sm:w-4" />
                  <span>iOS</span>
                </button>

                {/* 4. Android */}
                <button
                  type="button"
                  aria-pressed={viewMode === "grid" && platform === "android"}
                  onClick={() => {
                    setViewMode("grid");
                    setPlatform("android");
                  }}
                  className={`inline-flex h-8 sm:h-10 items-center justify-center gap-1 rounded-full border px-1.5 sm:px-4 text-[11px] sm:text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] cursor-pointer ${
                    viewMode === "grid" && platform === "android"
                      ? "border-white bg-[#FCE4EC] text-[#4a352c] shadow-[0_4px_12px_-2px_rgba(244,143,177,0.55)]"
                      : "border-[#F8BBD0]/60 bg-[#FFFDF9] text-[#6d5246] hover:bg-[#FCE4EC]/50 hover:text-[#4a352c]"
                  }`}
                >
                  <AndroidIcon className="h-3 w-3 shrink-0 text-[#d81b60] sm:h-4 sm:w-4" />
                  <span>Android</span>
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end">
                <p
                  aria-live="polite"
                  className="shrink-0 rounded-full border border-[#F8BBD0]/60 bg-white px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-[#6d5246] tabular-nums"
                >
                  พบ {visibleGames.length} รายการ
                </p>
              </div>
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
              <div className="gingham-frame overflow-hidden rounded-[28px] p-2 sm:rounded-[36px] sm:p-2.5 border-3 border-white shadow-[0_12px_36px_rgba(244,143,177,0.25)]">
                <div className="overflow-hidden rounded-[22px] border-2 border-white bg-white/95 shadow-xs backdrop-blur-md sm:rounded-[30px]">
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
              </div>
            )}
          </section>
        ) : (
          <section
            aria-label="ไม่พบรายการเกมหรือแอป"
            className="gingham-frame flex flex-col items-center justify-center rounded-[36px] p-2.5 sm:p-3.5 border-3 border-white shadow-[0_12px_36px_rgba(244,143,177,0.25)] text-center"
          >
            <div className="flex flex-col items-center justify-center w-full rounded-[28px] border-2 border-white bg-white/95 px-6 py-14 shadow-xs backdrop-blur-md">
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
            </div>
          </section>
            )}
          </>
        )}
      </main>

      <BottomNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        category={category}
        onSelectCategory={setCategory}
        gameCount={categoryCounts.game ?? 0}
        appCount={categoryCounts.app ?? 0}
      />
    </div>
  );
}
