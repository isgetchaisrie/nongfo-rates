"use client";

import React, { useState } from "react";
import { CatMascot, PawSparkle } from "./CatMascot";

const MASCOT_TIPS = [
  "เรทราคาอัปเดตล่าสุดจากร้าน Nuggetkub แท้ 100%",
  "กดสลับดูเฉพาะ iOS หรือ Android ได้ที่แถบด้านบนน้า เมี๊ยว~",
  "พิมพ์ชื่อเกมที่ช่องค้นหาเพื่อเช็กเรทไวๆ ได้เลย!",
] as const;

export function CatFloatingWidget({ defaultOpen = false }: { defaultOpen?: boolean } = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [tipIndex, setTipIndex] = useState(0);

  const handleCycleTip = () => {
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    setTipIndex((prev) => (prev + 1) % MASCOT_TIPS.length);
  };

  return (
    <aside
      aria-label="ผู้ช่วยน้องแมว Nuggetkub"
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5"
    >
      {isOpen && (
        <div
          role="status"
          aria-live="polite"
          className="relative max-w-xs rounded-2xl border border-[#ffc2da] bg-white px-4 py-3 text-sm text-[#2d1622] shadow-[0_10px_28px_-8px_rgba(190,18,83,0.14)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1.5 font-semibold text-[#e11d68]">
              <PawSparkle className="h-4 w-4 shrink-0" />
              <span>น้องแมว Nuggetkub</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="ซ่อนข้อความผู้ช่วยน้องแมว"
              className="rounded-full p-1 text-[#6e485b] transition-colors hover:bg-[#fff0f6] hover:text-[#2d1622]"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <p className="mt-1 leading-relaxed text-[#2d1622]">
            {MASCOT_TIPS[tipIndex]}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-[#6e485b]">
            <span>
              เคล็ดลับ {tipIndex + 1}/{MASCOT_TIPS.length}
            </span>
            <button
              type="button"
              onClick={handleCycleTip}
              className="font-medium text-[#e11d68] underline decoration-[#ffc2da] underline-offset-4 hover:text-[#be1253]"
            >
              เคล็ดลับถัดไป
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleCycleTip}
        aria-expanded={isOpen}
        aria-label="แตะเพื่อดูเคล็ดลับจากน้องแมว Nuggetkub"
        className="group flex items-center gap-2 rounded-full border border-[#ffc2da] bg-white p-1.5 pr-3.5 text-xs font-semibold text-[#2d1622] shadow-[0_10px_28px_-8px_rgba(190,18,83,0.16)] transition-transform hover:-translate-y-0.5 hover:border-[#ff85b3]"
      >
        <CatMascot variant="badge" className="h-9 w-9 shrink-0" />
        <span className="text-[#2d1622] group-hover:text-[#e11d68]">
          เมี๊ยว~ เช็กเรทไว
        </span>
      </button>
    </aside>
  );
}

export const CatFloatingHelper = CatFloatingWidget;
