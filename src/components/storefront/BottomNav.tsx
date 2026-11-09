"use client";

import React, { type ReactNode } from "react";
import type { FilterCategory } from "./filterGames";

export type StorefrontSection = "account" | "rates" | "contact";

export interface BottomNavProps {
  activeSection: StorefrontSection;
  onSelectSection: (section: StorefrontSection) => void;
  category: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  viewMode: "grid" | "table";
  onSetViewMode: (mode: "grid" | "table") => void;
  gameCount: number;
  appCount: number;
}

type TabKey = "home" | "game" | "app" | "table" | "admin";

const INK = "#4a352c";
const BLUSH = "#f48fb1";

/**
 * Nuggetkub signature sleepy eyes (idle) + awake eyes, blush cheeks, and smile (active).
 * Swapped via .slp / .awk in globals.css when [data-active="true"].
 */
function Eyes({ y }: { y: number }) {
  return (
    <>
      <g className="slp">
        <path
          d={`M8 ${y}q1.4 1.3 2.8 0M13.2 ${y}q1.4 1.3 2.8 0`}
          fill="none"
          stroke={INK}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <g className="awk">
        <circle cx="9.4" cy={y} r="1.3" fill={INK} />
        <circle cx="14.6" cy={y} r="1.3" fill={INK} />
        <ellipse cx="6.8" cy={y + 2.1} rx="1.4" ry=".85" fill={BLUSH} />
        <ellipse cx="17.2" cy={y + 2.1} rx="1.4" ry=".85" fill={BLUSH} />
        <path
          d={`M10.9 ${y + 1.9}q1.1 1.1 2.2 0`}
          fill="none"
          stroke={INK}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </g>
    </>
  );
}

const ICONS: Record<TabKey, ReactNode> = {
  home: (
    <>
      <path
        className="bd"
        d="M3.5 11.4 12 4.2l8.5 7.2v7.8a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6z"
      />
      <path className="ac" d="M9.8 20.8v-3.2a2.2 2.2 0 0 1 4.4 0v3.2z" />
      <Eyes y={13.3} />
    </>
  ),
  game: (
    <>
      <rect className="bd" x="4.5" y="9" width="15" height="11.6" rx="2.2" />
      <path
        className="ac"
        d="M5.2 3.8h13.6l2.2 5.4a2.3 2.3 0 0 1-4.5.6 2.3 2.3 0 0 1-4.5 0 2.3 2.3 0 0 1-4.5 0 2.3 2.3 0 0 1-4.5-.6z"
      />
      <Eyes y={14.6} />
    </>
  ),
  app: (
    <>
      <rect className="bd" x="4" y="10.2" width="16" height="10.4" rx="2.6" />
      <g className="lidp">
        <rect className="ac" x="2.8" y="5.6" width="18.4" height="4.2" rx="1.8" />
        <rect x="10.4" y="3.4" width="3.2" height="2.6" rx="1.1" fill={INK} />
      </g>
      <Eyes y={14.4} />
    </>
  ),
  table: (
    <>
      <path
        className="bd"
        d="M6 3.4h12v17.2l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z"
      />
      <path
        d="M9.2 15.8h5.6"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <Eyes y={9.6} />
    </>
  ),
  admin: (
    <>
      <circle className="bd" cx="12" cy="12.8" r="8" />
      <path
        className="ac"
        d="M7.2 7.8c1.4-3.4 8.2-3.6 9.6 0-1.8-.9-3.4-.4-4.8.8-1.3-1.2-3-1.6-4.8-.8z"
      />
      <Eyes y={12.9} />
    </>
  ),
};

function TabFace({ k, badge }: { k: TabKey; badge?: number }) {
  return (
    <span className="bnav-ico relative grid h-9 w-12 place-items-center rounded-xl">
      <svg
        viewBox="0 0 24 24"
        width="26"
        height="26"
        aria-hidden="true"
        className="overflow-visible"
      >
        {ICONS[k]}
      </svg>
      {typeof badge === "number" && badge > 0 && (
        <b className="absolute -top-1.5 -right-1 z-10 inline-flex min-w-5 items-center justify-center rounded-full border border-[#4a352c] bg-[#FCE4EC] px-1 font-[var(--font-fredoka)] text-xs font-bold text-[#b81452] tabular-nums">
          {badge}
        </b>
      )}
    </span>
  );
}

const tabClass =
  "bnav-tab relative flex min-h-14 flex-col items-center justify-start gap-0.5 rounded-2xl pt-1 text-xs font-semibold text-[#6d5246] data-[active=true]:font-extrabold data-[active=true]:text-[#4a352c] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]";

export function BottomNav({
  activeSection,
  onSelectSection,
  category,
  onSelectCategory,
  viewMode,
  onSetViewMode,
  gameCount,
  appCount,
}: BottomNavProps) {
  const isAccountActive = activeSection === "account";
  const isGameActive =
    activeSection === "rates" && category === "game" && viewMode === "grid";
  const isAppActive =
    activeSection === "rates" && category === "app" && viewMode === "grid";
  const isTableActive = activeSection === "rates" && viewMode === "table";
  const isContactActive = activeSection === "contact";

  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      data-bottom-nav
      aria-label="เมนูแท็บด้านล่าง"
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border-t-[2.5px] border-[#4a352c] bg-[#FFFDF9]/95 px-1.5 pt-1.5 shadow-[0_-8px_20px_rgba(74,53,44,0.12)] backdrop-blur-md lg:bottom-3 lg:left-1/2 lg:right-auto lg:w-full lg:max-w-md lg:-translate-x-1/2 lg:rounded-3xl lg:border-[2.5px]"
      style={{
        paddingBottom: "calc(0.35rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="grid grid-cols-5">
        <button
          type="button"
          data-active={isAccountActive}
          aria-pressed={isAccountActive}
          onClick={() => {
            onSelectSection("account");
            scrollTop();
          }}
          className={tabClass}
        >
          <TabFace k="home" />
          <span>บัญชี</span>
        </button>

        <button
          type="button"
          data-active={isGameActive}
          aria-pressed={isGameActive}
          onClick={() => {
            onSelectSection("rates");
            onSelectCategory("game");
            onSetViewMode("grid");
            scrollTop();
          }}
          className={tabClass}
        >
          <TabFace k="game" badge={gameCount} />
          <span>หมวดเกม</span>
        </button>

        <button
          type="button"
          data-active={isAppActive}
          aria-pressed={isAppActive}
          onClick={() => {
            onSelectSection("rates");
            onSelectCategory("app");
            onSetViewMode("grid");
            scrollTop();
          }}
          className={tabClass}
        >
          <TabFace k="app" badge={appCount} />
          <span>หมวดแอป</span>
        </button>

        <button
          type="button"
          data-active={isTableActive}
          aria-pressed={isTableActive}
          onClick={() => {
            onSelectSection("rates");
            onSelectCategory("all");
            onSetViewMode("table");
            scrollTop();
          }}
          className={tabClass}
        >
          <TabFace k="table" />
          <span>ตารางเรท</span>
        </button>

        <button
          type="button"
          data-active={isContactActive}
          aria-pressed={isContactActive}
          onClick={() => {
            onSelectSection("contact");
            scrollTop();
          }}
          className={tabClass}
        >
          <TabFace k="admin" />
          <span>ติดต่อแอดมิน</span>
        </button>
      </div>

      {/* Shown automatically only when Netlify's free-tier badge (#nl-badge-frame) is present in DOM */}
      <div
        aria-hidden="true"
        className="bnav-netlify-shelf mt-1 h-15 items-center border-t border-[#F8BBD0]/50 px-3"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC]/70 px-2.5 py-1 text-xs font-bold text-[#6d5246]">
          <span className="h-2 w-2 rounded-full bg-[#e11d68]" />
          <span>Nongfo Rates • เรทอัปเดตสด</span>
        </span>
      </div>
    </nav>
  );
}
