"use client";

import React, { useState } from "react";
import { CatMascot, PawSparkle } from "./CatMascot";

const MASCOT_TIPS = [
  "เรทราคาอัปเดตล่าสุดจากร้าน Nongfo แท้ 100%",
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
      aria-label="ผู้ช่วยน้องแมว Nongfo"
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5"
    >
      {isOpen && (
        <div
          role="status"
          aria-live="polite"
          className="glass-card relative max-w-xs rounded-3xl px-4 py-3 text-sm text-[#4a352c]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1.5 font-bold text-[#b81452]">
              <PawSparkle className="h-4 w-4 shrink-0" />
              <span>น้องแมว Nongfo</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="ซ่อนข้อความผู้ช่วยน้องแมว"
              className="rounded-full p-1 text-[#6d5246] transition-colors hover:bg-[#FCE4EC] hover:text-[#4a352c]"
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
          <p className="mt-1 font-medium leading-relaxed text-[#4a352c]">
            {MASCOT_TIPS[tipIndex]}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-medium text-[#6d5246]">
            <span>
              เคล็ดลับ {tipIndex + 1}/{MASCOT_TIPS.length}
            </span>
            <button
              type="button"
              onClick={handleCycleTip}
              className="font-bold text-[#b81452] underline decoration-[#F8BBD0] underline-offset-4 hover:text-[#880e4f]"
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
        aria-label="แตะเพื่อดูเคล็ดลับจากน้องแมว Nongfo"
        className="group flex items-center gap-2 rounded-full border-2 border-white bg-[#FCE4EC] p-1.5 text-xs font-bold text-[#4a352c] shadow-[0_10px_28px_-8px_rgba(158,136,119,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#F8BBD0] sm:pr-4"
      >
        <CatMascot variant="badge" className="h-9 w-9 shrink-0" />
        <span className="hidden text-[#4a352c] group-hover:text-[#b81452] sm:inline">
          เมี๊ยว~ เช็กเรทไว
        </span>
      </button>
    </aside>
  );
}

export const CatFloatingHelper = CatFloatingWidget;
