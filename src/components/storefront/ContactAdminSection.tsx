"use client";

import React from "react";
import Link from "next/link";
import { KawaiiCatSprite } from "@/components/mascot/KawaiiCatPlayground";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C6.48 2 2 5.82 2 10.53c0 2.92 1.72 5.51 4.38 7.02-.19.7-.68 2.53-.78 2.93-.12.5.18.49.38.36.16-.1 2.51-1.7 3.53-2.39.81.12 1.64.18 2.49.18 5.52 0 10-3.82 10-8.53S17.52 2 12 2zm-4.7 11.23c-.41 0-.75-.34-.75-.75V8.52c0-.41.34-.75.75-.75s.75.34.75.75v3.21h1.71c.41 0 .75.34.75.75s-.34.75-.75.75H7.3zm3.95-.75c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8.52c0-.41.34-.75.75-.75s.75.34.75.75v3.96zm4.8 0c0 .32-.2.6-.5.7-.08.03-.17.05-.25.05-.23 0-.46-.11-.6-.3l-2.07-2.77v2.32c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8.52c0-.32.2-.6.5-.7.25-.09.52-.03.71.18l2.21 2.96V8.52c0-.41.34-.75.75-.75s.75.34.75.75v3.96zm3.3-2.46c.41 0 .75.34.75.75s-.34.75-.75.75h-2.1c-.41 0-.75-.34-.75-.75V8.52c0-.41.34-.75.75-.75h2.1c.41 0 .75.34.75.75s-.34.75-.75.75h-1.35v.71h1.35c.41 0 .75.34.75.75s-.34.75-.75.75h-1.35v.79h1.35z" />
    </svg>
  );
}

export function ContactAdminSection() {
  return (
    <section
      aria-label="โปรไฟล์ติดต่อแอดมิน Nongfo"
      className="mx-auto w-full max-w-[440px] space-y-4 pt-1 pb-6"
    >
      {/* Profile Card (Linktree / Bio style) */}
      <div className="glass-card relative z-10 overflow-hidden rounded-[36px] p-5 text-center shadow-lg sm:p-6">
        {/* Ambient cute floating stars & hearts */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-2 -top-2 h-7 w-7 text-[#F8BBD0] anim-float-1"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 top-6 h-6 w-6 text-[#F8BBD0] anim-float-2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>

        {/* Center Circular Profile Avatar */}
        <div className="relative mx-auto mt-1 mb-3.5 flex w-fit items-center justify-center">
          <div className="relative">
            {/* Animated Ring */}
            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#F8BBD0] via-[#FFFDE7] to-[#FCE4EC] opacity-80 blur-xs"
            />
            <img
              src="/admin-profile.jpg"
              alt="แอดมิน Nongfo"
              className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-[0_8px_24px_rgba(244,143,177,0.45)] sm:h-32 sm:w-32"
            />

            {/* Little Kawaii Cat Mascot Badge */}
            <div className="absolute -bottom-1 -right-1 z-10 rounded-full border-2 border-white bg-[#FFFDE7] p-1 shadow-md">
              <KawaiiCatSprite col={1} row={3} size={28} label="น้องแมวแอดมิน" />
            </div>
          </div>
        </div>

        {/* Profile Name & Title */}
        <h1 className="font-[var(--font-mali)] text-2xl font-bold tracking-tight text-[#4a352c] sm:text-3xl">
          Nongfo
        </h1>
        <div className="mt-1 flex items-center justify-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#F8BBD0] bg-[#FCE4EC] px-3 py-0.5 text-xs font-bold text-[#b81452] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[#e11d68] animate-pulse" />
            <span>ติดต่อแอดมิน</span>
          </span>
          <span className="inline-flex items-center rounded-full border border-white bg-white/80 px-2.5 py-0.5 text-xs font-semibold text-[#6d5246] shadow-2xs">
            ร้าน Nongfo แท้ 100%
          </span>
        </div>

        <p className="mt-2 text-xs font-medium leading-relaxed text-[#6d5246]">
          ทักแชทสอบถามเรท สั่งซื้อเกม/แอป หรือส่งสลิปโอนเงินได้เลยน้า แอดมินพร้อมตอบค่า~
        </p>

        {/* Clickable Action Link Buttons */}
        <div className="mt-5 space-y-3">
          {/* Button 1: Facebook Thitima Nongfo */}
          <a
            href="https://www.facebook.com/share/1BmFBDETNn/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-white bg-gradient-to-r from-[#1877F2] to-[#3b5998] p-3.5 text-left text-white shadow-[0_6px_20px_rgba(24,119,242,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(24,119,242,0.4)] active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                <FacebookIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white/85">
                  Facebook แอดมิน (คลิกทักแชท)
                </div>
                <div className="font-[var(--font-mali)] text-base font-bold text-white drop-shadow-xs">
                  Thitima Nongfo
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-xs transition-colors group-hover:bg-white group-hover:text-[#1877F2]">
              <span>ทักแชท</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </a>

          {/* Button 2: LINE Official lin.ee */}
          <a
            href="https://lin.ee/T8apadZU"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-white bg-gradient-to-r from-[#06C755] to-[#00B900] p-3.5 text-left text-white shadow-[0_6px_20px_rgba(6,199,85,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(6,199,85,0.4)] active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                <LineIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white/85">
                  LINE Official (คลิกเพิ่มเพื่อน)
                </div>
                <div className="font-[var(--font-mali)] text-base font-bold text-white drop-shadow-xs">
                  Add LINE friend (@709qwuff)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-xs transition-colors group-hover:bg-white group-hover:text-[#06C755]">
              <span>แอดไลน์</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Store Owner Admin Link */}
      <div className="pt-1 text-center">
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
