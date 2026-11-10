"use client";

import React from "react";
import Link from "next/link";
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/types/settings";

export function FacebookIcon({ className }: { className?: string }) {
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

export function LineIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      {/* Official LINE Speech Bubble */}
      <path
        fill="#06C755"
        d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
      />
      {/* Official LINE Letters */}
      <path
        fill="#FFFFFF"
        d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629"
      />
    </svg>
  );
}

export interface ContactAdminSectionProps {
  settings?: StoreSettings;
}

export function ContactAdminSection({ settings }: ContactAdminSectionProps) {
  const currentSettings = { ...DEFAULT_STORE_SETTINGS, ...settings };

  return (
    <section
      aria-label="โปรไฟล์ติดต่อแอดมิน Nongfo"
      className="mx-auto w-full max-w-[440px] space-y-4 pt-1 pb-6"
    >
      {/* Profile Card (Linktree / Bio style) */}
      <div className="gingham-frame relative z-10 overflow-hidden rounded-[36px] p-2.5 sm:p-3.5 border-3 border-white shadow-[0_8px_28px_rgba(244,143,177,0.22)] text-center">
        {/* Ambient cute static stars & hearts */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-1 -top-1 h-6 w-6 text-[#F8BBD0] drop-shadow-xs"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 top-5 h-5 w-5 text-[#F8BBD0] drop-shadow-xs"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>

        <div className="relative rounded-[28px] border-2 border-white bg-white/95 p-4 sm:p-6 shadow-xs backdrop-blur-md">
        {/* Center Polaroid Profile Card */}
        <div className="relative mx-auto mt-2 mb-4 flex w-fit items-center justify-center">
          <div className="relative rotate-[-1.5deg] rounded-lg border border-[#f0e4dc] bg-white p-2.5 pb-3 shadow-[0_6px_20px_rgba(92,67,56,0.12)] transition-transform hover:rotate-0">
            <div className="washi-tape-pink absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 w-14 rounded-2xs border-x border-white/60" />
            <img
              src={currentSettings.adminAvatar || "/admin-profile.jpg"}
              alt={`แอดมิน ${currentSettings.adminName}`}
              className="h-28 w-28 rounded-xs object-cover sm:h-32 sm:w-32"
            />
            <div className="mt-1.5 text-center font-[var(--font-mali)] text-xs font-bold text-[#8a6b5c]">
              ร้าน Nongfo แท้ 100%
            </div>
          </div>
        </div>

        {/* Profile Name & Title */}
        <h1 className="font-[var(--font-mali)] text-2xl font-bold tracking-tight text-[#4a352c] sm:text-3xl">
          {currentSettings.adminName}
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
            href={currentSettings.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-white bg-gradient-to-r from-[#1877F2] to-[#3b5998] p-3.5 text-left text-white shadow-[0_6px_20px_rgba(24,119,242,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(24,119,242,0.4)] active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
                <FacebookIcon className="h-7 w-7 text-[#1877F2]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white/90">
                  Facebook แอดมิน (คลิกทักแชท)
                </div>
                <div className="font-[var(--font-mali)] text-base font-bold text-white drop-shadow-xs">
                  {currentSettings.facebookName}
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
            href={currentSettings.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-white bg-gradient-to-r from-[#06C755] to-[#00B900] p-3.5 text-left text-white shadow-[0_6px_20px_rgba(6,199,85,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(6,199,85,0.4)] active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
                <LineIcon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white/90">
                  LINE Official (คลิกเพิ่มเพื่อน)
                </div>
                <div className="font-[var(--font-mali)] text-base font-bold text-white drop-shadow-xs">
                  {currentSettings.lineName}
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
