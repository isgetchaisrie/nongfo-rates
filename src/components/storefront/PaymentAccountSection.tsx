"use client";

import React, { useState } from "react";
import { CatMascot } from "@/components/mascot/CatMascot";
import { KawaiiCatSprite } from "@/components/mascot/KawaiiCatPlayground";
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/types/settings";

export interface PaymentAccountSectionProps {
  onExploreRates?: () => void;
  settings?: StoreSettings;
}

export function PaymentAccountSection({
  onExploreRates,
  settings,
}: PaymentAccountSectionProps) {
  const currentSettings = { ...DEFAULT_STORE_SETTINGS, ...settings };
  const kbankRaw = currentSettings.kbankNumber.replace(/\D/g, "");
  const trueRaw = currentSettings.trueNumber.replace(/\D/g, "");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<"kbank" | "true" | "fb" | null>(
    null
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const handleCopy = async (
    text: string,
    key: "kbank" | "true" | "fb",
    successMessage: string
  ) => {
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
      // Fallback handled
    }
    setCopiedKey(key);
    showToast(successMessage);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 2000);
  };

  const handleDownloadQr = async () => {
    const qrUrl = currentSettings.qrImage || "/payment-qr.jpg";
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "payment-qr.jpg";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast("บันทึกรูปภาพเรียบร้อยแล้วนะคะ!");
    } catch {
      window.open(qrUrl, "_blank", "noopener,noreferrer");
      showToast("เปิดหน้าต่างรูปภาพให้แล้วค่ะ");
    }
  };

  return (
    <section
      aria-label="บัญชีชำระเงิน Pattida Payment"
      className="mx-auto w-full space-y-4 pt-1 pb-4"
    >
      {/* Floating Copy / Download Toast */}
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

      {/* Hero Header Card (Matching RateBoard Hero with บัญชี text) */}
      <div className="glass-card relative mb-3.5 rounded-[24px] p-2.5 sm:mb-6 sm:rounded-[40px] sm:p-6">
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
                บัญชี{" "}
                <span className="relative mt-1 inline-block rounded-xl border border-[#F8BBD0] bg-[#FCE4EC] px-2.5 py-0.5 text-[#b81452] sm:rounded-2xl sm:px-3.5">
                  ชำระเงิน Pattida
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
                ช่องทางชำระเงินของร้าน Nongfo สแกน QR Code หรือคัดลอกเลขบัญชีธนาคารกสิกรไทย / วอเลท พร้อมคัดลอกข้อความโน้ตสลิปด้านล่างได้เลยน้า~
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
                  label="น้องแมว Nongfo ต้อนรับสู่หน้าบัญชีชำระเงิน"
                  className="animate-mascot-float h-16 w-16 sm:h-36 sm:w-36"
                />
              </div>
            </div>
          </div>

          {/* Cute Interactive Kawaii Cat Parade Strip */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#F8BBD0]/45 pt-3.5 sm:mt-5 sm:pt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white bg-[#FCE4EC] px-3 py-1 text-center text-xs font-bold text-[#4a352c] shadow-xs sm:px-3.5">
              แก๊งน้องแมว Nongfo พร้อมต้อนรับ เช็กชื่อบัญชีและแปะสลิปทุกครั้งน้า~
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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
                    size={42}
                    label={cat.label}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Pattistore Glass Card */}
      <div className="mx-auto max-w-[430px] space-y-4">
      <div className="glass-card relative z-10 rounded-[40px] p-3">
        <svg
          aria-hidden="true"
          className="anim-float-1 pointer-events-none absolute -top-4 -left-2 z-20 h-9 w-9 text-[#F8BBD0] drop-shadow-xs"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          aria-hidden="true"
          className="anim-float-2 pointer-events-none absolute top-[25%] -right-3 z-20 h-7 w-7 text-[#F8BBD0] drop-shadow-xs"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>

        {/* Animated Dashed Frame + QR Image */}
        <div className="relative z-10 rounded-[36px] p-2">
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
              rx="34"
              ry="34"
              fill="none"
              stroke="#F8BBD0"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-dash"
            />
          </svg>
          <div className="relative overflow-hidden rounded-[28px] border-4 border-white bg-white shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSettings.qrImage || "/payment-qr.jpg"}
              onError={(e) => {
                e.currentTarget.src =
                  "https://i.postimg.cc/85TRr9bv/line-oa-chat-261013-123006.jpg";
              }}
              alt={`QR ชำระเงิน บัญชี ${currentSettings.accountName}`}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        {/* Save QR Button */}
        <div className="mt-2 px-2">
          <button
            type="button"
            onClick={handleDownloadQr}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white bg-[#FCE4EC] px-6 py-3 text-sm font-bold text-[#5c4338] shadow-md transition-all hover:bg-[#F8BBD0] active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-5 w-5 text-[#5c4338]"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <span>บันทึกแล้วสแกนได้เลยน้า</span>
          </button>
        </div>

        <div className="space-y-4 p-3.5 pt-4">
          {/* Account Name Callout */}
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold leading-relaxed text-[#5c4338]">
              <span className="inline-flex items-center justify-center gap-1">
                <span>เลขบัญชีตามนี้เลยค่า</span>
                <svg
                  className="anim-pulse h-4 w-4 text-[#F8BBD0]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </span>
              <br />
              <span>ชื่อบัญชี </span>
              <span className="relative inline-block rounded-lg border border-[#F8BBD0]/40 bg-[#FCE4EC] px-2.5 py-0.5 font-bold text-[#4a352c]">
                {currentSettings.accountName}
                <svg
                  className="anim-float-3 absolute -top-2 -right-2.5 h-4 w-4 text-[#F8BBD0]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
              <span> เท่านั้น !</span>
            </p>

            <div className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#F8BBD0] bg-white px-4 py-2 text-xs font-semibold text-[#5c4338] shadow-xs">
              <span>เซฟรูปเพื่อสแกน หรือจิ้มคัดลอกเลขบัญชีได้เลยนะคะ</span>
            </div>
          </div>

          {/* Section Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-[#F8BBD0]/40" />
            <span className="text-xs font-bold tracking-wider text-[#6d5246] uppercase">
              เลือกช่องทางชำระเงิน
            </span>
            <div className="h-px flex-1 bg-[#F8BBD0]/40" />
          </div>

          <div className="space-y-3.5">
            {/* K-Plus Card */}
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  kbankRaw,
                  "kbank",
                  `คัดลอกเลขบัญชีกสิกร ${currentSettings.kbankNumber} แล้ว`
                )
              }
              className="group relative w-full cursor-pointer overflow-hidden rounded-[24px] border border-white bg-gradient-to-br from-[#E8F0FE] to-[#E0F2F1] p-5 text-left shadow-md transition-all hover:-translate-y-0.5 active:scale-98"
            >
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 -rotate-12 text-white opacity-35"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>

              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="rounded-full border border-white/60 bg-white/60 px-3 py-1 backdrop-blur-xs">
                    <span className="text-sm font-bold tracking-wider text-[#4a352c]">
                      K-Plus
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-[#4a352c] shadow-xs transition-colors ${
                      copiedKey === "kbank" ? "bg-white/50" : "bg-white"
                    }`}
                  >
                    {copiedKey === "kbank" ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="h-4 w-4 text-[#0f5137]"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        <span>สำเร็จ</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="2"
                            ry="2"
                          />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        <span>คัดลอก</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="mt-1">
                  <div className="mb-1 text-xs font-bold text-[#6d5246]">
                    กสิกร ({currentSettings.accountName})
                  </div>
                  <div className="font-[var(--font-fredoka)] text-2xl font-bold tracking-widest text-[#4a352c] tabular-nums">
                    {currentSettings.kbankNumber}
                  </div>
                </div>
              </div>
            </button>

            {/* TrueMoney Wallet Card */}
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  trueRaw,
                  "true",
                  `คัดลอกเบอร์วอเลท ${currentSettings.trueNumber} แล้ว`
                )
              }
              className="group relative w-full cursor-pointer overflow-hidden rounded-[24px] border border-white bg-gradient-to-br from-[#FFFDE7] to-[#FCE4EC] p-5 text-left shadow-md transition-all hover:-translate-y-0.5 active:scale-98"
            >
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 -left-6 h-32 w-32 rotate-12 text-white opacity-45"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>

              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="rounded-full border border-white/60 bg-white/60 px-3 py-1 backdrop-blur-xs">
                    <span className="text-sm font-bold tracking-wider text-[#4a352c]">
                      TrueMoney Wallet
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-[#4a352c] shadow-xs transition-colors ${
                      copiedKey === "true" ? "bg-white/50" : "bg-white"
                    }`}
                  >
                    {copiedKey === "true" ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="h-4 w-4 text-[#b81452]"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        <span>สำเร็จ</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="2"
                            ry="2"
                          />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        <span>คัดลอก</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="mt-1">
                  <div className="mb-1 text-xs font-bold text-[#6d5246]">
                    วอเลท ({currentSettings.accountName})
                  </div>
                  <div className="font-[var(--font-fredoka)] text-2xl font-bold tracking-widest text-[#4a352c] tabular-nums">
                    {currentSettings.trueNumber}
                  </div>
                </div>
              </div>
            </button>

            {/* Slip Note Important Card */}
            <div className="relative z-10 overflow-hidden rounded-[20px] border-2 border-dashed border-[#F8BBD0] bg-gradient-to-br from-[#FFFDFC] to-white p-3.5 shadow-xs">
              <div className="relative z-10 flex items-start gap-3">
                <div className="mt-1 shrink-0 rounded-full bg-[#F8C8DC] p-1.5 text-[#5c4338] shadow-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-left text-xs leading-relaxed text-[#5c4338]">
                  <span className="mb-1.5 inline-block rounded-full border border-[#F8BBD0]/40 bg-[#F8C8DC] px-2.5 py-0.5 text-xs font-bold text-[#4a352c]">
                    สำคัญ
                  </span>
                  <br />
                  <span className="font-semibold">โน้ตสลิปทุกครั้ง </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        currentSettings.slipNote,
                        "fb",
                        "คัดลอกข้อความโน้ตสลิปแล้วนะคะ"
                      )
                    }
                    className={`mt-1 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#F8BBD0]/50 px-2.5 py-1 shadow-xs transition-all hover:bg-[#FFFDE7] active:scale-95 ${
                      copiedKey === "fb" ? "bg-[#E8F0FE]/70" : "bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#4a352c]">
                      {copiedKey === "fb"
                        ? '"คัดลอกสำเร็จ!"'
                        : `"${currentSettings.slipNote}"`}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#e11d68]"
                      aria-hidden="true"
                    >
                      <rect
                        width="14"
                        height="14"
                        x="8"
                        y="8"
                        rx="2"
                        ry="2"
                      />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>
                  <span className="mt-1.5 block text-xs text-[#6d5246]">
                    หากลืมโน้ต โอนเพิ่ม 1฿ พร้อมกำกับสลิปน้า
                  </span>
                </div>
              </div>
            </div>

            {/* Warning 1: Check Account before transfer */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#9e8877]/20 bg-white/80 p-3 text-left shadow-xs">
              <div className="shrink-0 rounded-full border border-[#9e8877]/15 bg-white p-1.5 text-[#5c4338] shadow-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="text-xs leading-relaxed font-semibold text-[#5c4338]">
                โอนผิด โอนใหม่ ไม่โอนคืน
                <br />
                <span className="font-normal text-[#6d5246]">
                  เช็คบัญชีและชื่อก่อนโอนทุกครั้งนะคะ !
                </span>
              </div>
            </div>

            {/* Warning 2: Send slip every time */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#F8BBD0]/40 bg-white/80 p-3 text-left shadow-xs">
              <div className="shrink-0 rounded-full border border-[#F8BBD0]/20 bg-white p-1.5 text-[#5c4338] shadow-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <div className="text-xs leading-relaxed font-semibold text-[#5c4338]">
                โอนแล้วรบกวน{" "}
                <span className="font-bold underline decoration-[#F8BBD0]">
                  แปะสลิปทุกครั้ง
                </span>{" "}
                ด้วยน้า
                <br />
                <span className="font-normal text-[#6d5246]">
                  เค้าจะได้รีบเช็คยอดให้ไว ๆ ค่ะ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Quick Switch to Game/App Rates */}
      <div className="flex flex-col items-center justify-center gap-2.5 pt-1 text-center text-xs text-[#6d5246]">
        <div className="flex items-center gap-1.5 font-bold text-[#5c4338]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="anim-pulse h-4 w-4 text-[#e11d68]"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
          <span>ขอบคุณที่ใช้บริการนะคะ</span>
        </div>

        {onExploreRates && (
          <button
            type="button"
            onClick={onExploreRates}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white bg-[#FCE4EC] px-4 py-2 text-xs font-bold text-[#b81452] shadow-xs transition-all hover:bg-[#F8BBD0]"
          >
            <span>ไปดูเรทราคาเกมและแอปทั้งหมด</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
      </div>
    </section>
  );
}
