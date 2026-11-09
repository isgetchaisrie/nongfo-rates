"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KawaiiCatSprite } from "@/components/mascot/KawaiiCatPlayground";

export function ContactAdminSection() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch {
      // Ignore fallback error
    }
    setCopiedChannel(key);
    showToast(label);
    window.setTimeout(() => {
      setCopiedChannel((current) => (current === key ? null : current));
    }, 2000);
  };

  return (
    <section
      aria-label="ช่องทางการติดต่อแอดมิน"
      className="mx-auto w-full max-w-[430px] space-y-4 pt-1 pb-4"
    >
      {/* Floating Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#F8BBD0]/40 bg-[#5c4338] px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition-all duration-300 ${
          toastMessage
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-5 w-5 text-[#F8BBD0]"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{toastMessage ?? "คัดลอกแล้ว"}</span>
      </div>

      {/* Header */}
      <div className="relative pt-1 pb-1 text-center">
        <div className="mb-1 flex items-center justify-center gap-2">
          <KawaiiCatSprite col={4} row={3} size={42} className="anim-float-1" />
          <h1 className="font-[var(--font-mali)] text-2xl font-bold tracking-tight text-[#5c4338] sm:text-3xl">
            ติดต่อแอดมิน
          </h1>
          <KawaiiCatSprite col={2} row={3} size={42} className="anim-float-2" />
        </div>
        <p className="text-xs font-bold tracking-wider text-[#b81452]">
          ทักแชทสอบถามเรท สั่งซื้อเกม/แอป หรือส่งสลิปโอนเงินได้เลยน้า
        </p>
      </div>

      {/* Main Contact Card */}
      <div className="glass-card relative z-10 space-y-4 rounded-[36px] p-4">
        {/* Channel 1: Facebook Pat Pattida */}
        <div className="relative overflow-hidden rounded-[24px] border border-white bg-gradient-to-br from-[#E8F0FE] to-[#FCE4EC] p-4 shadow-md">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-bold text-[#4a352c]">
              <span>Facebook แม่ค้า (ช่องทางหลัก)</span>
            </span>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  "Pat Pattida",
                  "fb-pat",
                  "คัดลอกชื่อเฟซ Pat Pattida แล้วค่ะ"
                )
              }
              className="cursor-pointer rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#4a352c] shadow-xs transition-all hover:bg-[#FFFDE7] active:scale-95"
            >
              {copiedChannel === "fb-pat" ? "✓ คัดลอกแล้ว" : "คัดลอกชื่อเฟซ"}
            </button>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-[#6d5246]">
              เฟซบุ๊กสำหรับทักแชทสั่งซื้อ / ส่งสลิป
            </div>
            <div className="mt-0.5 font-[var(--font-fredoka)] text-xl font-bold text-[#4a352c]">
              Fb : Pat Pattida
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://www.facebook.com/search/top/?q=Pat%20Pattida"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white bg-white/90 px-4 py-2 text-xs font-bold text-[#4a352c] shadow-xs transition-all hover:bg-white"
            >
              <span>ค้นหาเฟซ Pat Pattida</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Channel 2: Facebook Thitima Nongfo */}
        <div className="relative overflow-hidden rounded-[24px] border border-white bg-gradient-to-br from-[#FFFDE7] to-[#FCE4EC] p-4 shadow-md">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-bold text-[#4a352c]">
              <span>Facebook (Nongfo Store)</span>
            </span>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  "Thitima Nongfo",
                  "fb-nongfo",
                  "คัดลอกชื่อเฟซ Thitima Nongfo แล้วค่ะ"
                )
              }
              className="cursor-pointer rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#4a352c] shadow-xs transition-all hover:bg-[#FFFDE7] active:scale-95"
            >
              {copiedChannel === "fb-nongfo"
                ? "✓ คัดลอกแล้ว"
                : "คัดลอกชื่อเฟซ"}
            </button>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-[#6d5246]">
              เฟซบุ๊กแอดมินน้องโฟร์
            </div>
            <div className="mt-0.5 font-[var(--font-fredoka)] text-xl font-bold text-[#4a352c]">
              Fb : Thitima Nongfo
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://www.facebook.com/search/top/?q=Thitima%20Nongfo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white bg-white/90 px-4 py-2 text-xs font-bold text-[#4a352c] shadow-xs transition-all hover:bg-white"
            >
              <span>ค้นหาเฟซ Thitima Nongfo</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Channel 3: LINE Official */}
        <div className="relative overflow-hidden rounded-[24px] border border-white bg-gradient-to-br from-[#E0F2F1] to-[#E8F0FE] p-4 shadow-md">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-bold text-[#0f5137]">
              <span>LINE Official</span>
            </span>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  "@709qwuff",
                  "line-oa",
                  "คัดลอกไอดี LINE @709qwuff แล้วค่ะ"
                )
              }
              className="cursor-pointer rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#4a352c] shadow-xs transition-all hover:bg-[#FFFDE7] active:scale-95"
            >
              {copiedChannel === "line-oa" ? "✓ คัดลอกแล้ว" : "คัดลอกไอดี"}
            </button>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-[#6d5246]">
              ไลน์ร้าน (มี @ นำหน้า)
            </div>
            <div className="mt-0.5 font-[var(--font-fredoka)] text-xl font-bold text-[#0f5137]">
              @709qwuff
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://line.me/R/ti/p/@709qwuff"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white bg-white/90 px-4 py-2 text-xs font-bold text-[#0f5137] shadow-xs transition-all hover:bg-white"
            >
              <span>กดแอดไลน์ / ทักแชท LINE</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* How to order quick steps */}
        <div className="rounded-2xl border-2 border-dashed border-[#F8BBD0] bg-white/85 p-3.5 text-left text-xs leading-relaxed text-[#5c4338]">
          <div className="mb-1.5 font-bold text-[#b81452]">
            ขั้นตอนสั่งซื้อไวๆ กับแอดมิน
          </div>
          <ol className="list-inside list-decimal space-y-1 font-medium text-[#5c4338]">
            <li>
              เลือกดูราคาเกมหรือแอปจากแท็บ <strong>หมวดเกม / หมวดแอป / ตารางเรท</strong>
            </li>
            <li>
              สแกน QR หรือคัดลอกเลขบัญชีที่แท็บ <strong>บัญชี</strong> พร้อมใส่โน้ตสลิป
            </li>
            <li>
              ส่งรูปสลิป + ชื่อเกมและระบบ (iOS / Android) ทักแชทแอดมินได้เลยค่า
            </li>
          </ol>
        </div>
      </div>

      {/* Store Owner Admin Login Link */}
      <div className="pt-2 text-center">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#F8BBD0]/60 bg-white/80 px-4 py-1.5 text-xs font-bold text-[#6d5246] shadow-xs transition-colors hover:bg-[#FCE4EC] hover:text-[#4a352c]"
        >
          <span>สำหรับเจ้าของร้าน: จัดการเรทราคา (Admin)</span>
        </Link>
      </div>
    </section>
  );
}
