"use client";

import React, { useState } from "react";

export interface KawaiiCatSpriteProps {
  col: number; // 0..5
  row: number; // 0..4
  size?: number;
  flipX?: boolean;
  className?: string;
  label?: string;
}

/**
 * Renders one of the 30 kawaii anime cats from /cats-sheet.jpg (6 columns x 5 rows).
 */
export function KawaiiCatSprite({
  col,
  row,
  size = 76,
  flipX = false,
  className = "",
  label = "น้องแมว Nongfo",
}: KawaiiCatSpriteProps) {
  const xPct = (col / 5) * 100;
  const yPct = (row / 4) * 100;

  return (
    <span
      role="img"
      aria-label={label}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: "url('/cats-sheet.jpg')",
        backgroundSize: "600% 500%",
        backgroundPosition: `${xPct}% ${yPct}%`,
        backgroundRepeat: "no-repeat",
        transform: flipX ? "scaleX(-1)" : undefined,
      }}
      className={`inline-block shrink-0 rounded-full border-2 border-white bg-white shadow-[0_6px_18px_-4px_rgba(244,143,177,0.5)] ${className}`}
    />
  );
}

interface RoamingKitty {
  id: string;
  name: string;
  quote: string;
  col: number;
  row: number;
  durationSec: number;
  delaySec: number;
  direction: "ltr" | "rtl";
}

const ROAMING_KITTIES: RoamingKitty[] = [
  {
    id: "sakura-kitty",
    name: "น้องซากุระชมพู",
    quote: "เมี๊ยว~ เกมแท้ราคาน่ารักทุกเกมเลยน้า!",
    col: 1,
    row: 3, // Pastel pink cat
    durationSec: 22,
    delaySec: 0,
    direction: "ltr",
  },
  {
    id: "lavender-bow",
    name: "น้องโบว์ม่วงพาสเทล",
    quote: "จิ้มเลือกดูหมวดเกมหรือแอปด้านบนได้เลยค่า~",
    col: 0,
    row: 3, // Pastel purple cat with bow
    durationSec: 26,
    delaySec: 5,
    direction: "rtl",
  },
  {
    id: "rainbow-pastel",
    name: "น้องสายรุ้งมาร์ชแมลโลว์",
    quote: "รองรับทั้ง iOS และ Android เช็กเรทไวสุดๆ เมี๊ยว!",
    col: 4,
    row: 3, // Pastel rainbow cat
    durationSec: 28,
    delaySec: 11,
    direction: "ltr",
  },
  {
    id: "mint-bell",
    name: "น้องกระดิ่งมินต์",
    quote: "น้องแมวมาวิ่งเล่นเป็นเพื่อนเลือกเกมน้า~",
    col: 3,
    row: 3, // Pastel mint cat with bell
    durationSec: 24,
    delaySec: 16,
    direction: "rtl",
  },
];

export function KawaiiCatPlayground() {
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  return (
    <div
      aria-label="สนามวิ่งเล่นน้องแมว Nongfo"
      className="pointer-events-none fixed inset-x-0 bottom-2 z-30 h-24 overflow-hidden"
    >
      {ROAMING_KITTIES.map((kitty) => {
        const isRtl = kitty.direction === "rtl";
        return (
          <div
            key={kitty.id}
            style={{
              animationDuration: `${kitty.durationSec}s`,
              animationDelay: `${kitty.delaySec}s`,
            }}
            className={`pointer-events-auto absolute bottom-1 flex flex-col items-center ${
              isRtl ? "cat-roam-rtl" : "cat-roam-ltr"
            }`}
          >
            {activeSpeech === kitty.id && (
              <div className="mb-1.5 whitespace-nowrap rounded-full border border-[#F8BBD0] bg-white/95 px-3 py-1 text-xs font-bold text-[#4a352c] shadow-sm">
                {kitty.quote}
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                setActiveSpeech((prev) => (prev === kitty.id ? null : kitty.id))
              }
              aria-label={`ทักทาย${kitty.name}`}
              className="cat-trot group relative flex items-center justify-center rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]"
            >
              <KawaiiCatSprite
                col={kitty.col}
                row={kitty.row}
                size={60}
                flipX={isRtl}
                label={kitty.name}
              />
              <span className="pointer-events-none absolute -top-2.5 -right-1 rounded-full border border-white bg-[#FCE4EC] px-2 py-0.5 text-xs font-bold text-[#b81452] opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                เมี๊ยว!
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
