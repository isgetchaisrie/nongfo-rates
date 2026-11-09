"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Gamepad2, ImagePlus, Loader2, Smartphone, Upload, X } from "lucide-react";
import type { CategoryType, GameRate, PlatformType } from "@/types/game";
import {
  type AdminGameFormState,
  buildGamePayload,
} from "@/components/admin/adminValidation";

export interface GameFormModalProps {
  open: boolean;
  editingGame: GameRate | null;
  defaultCategory?: CategoryType;
  onClose: () => void;
  onSaved: (savedGame: GameRate, isEdit: boolean) => void;
}

const CATEGORY_OPTIONS: {
  value: CategoryType;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "game", label: "หมวดเกม (Game)", Icon: Gamepad2 },
  { value: "app", label: "หมวดแอป (App)", Icon: Smartphone },
];

const PLATFORM_OPTIONS: { value: PlatformType; label: string }[] = [
  { value: "both", label: "ทั้ง iOS & Android" },
  { value: "ios", label: "เฉพาะ iOS" },
  { value: "android", label: "เฉพาะ Android" },
];

export function GameFormModal({
  open,
  editingGame,
  defaultCategory = "game",
  onClose,
  onSaved,
}: GameFormModalProps) {
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<AdminGameFormState>({
    name: "",
    image: "",
    category: defaultCategory,
    platform: "both",
    priceIosInput: "",
    priceAndroidInput: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setUploading(false);
    setSubmitting(false);

    if (editingGame) {
      setForm({
        name: editingGame.name,
        image: editingGame.image,
        category: editingGame.category,
        platform: editingGame.platform,
        priceIosInput:
          editingGame.priceIos !== null ? String(editingGame.priceIos) : "",
        priceAndroidInput:
          editingGame.priceAndroid !== null
            ? String(editingGame.priceAndroid)
            : "",
      });
    } else {
      setForm({
        name: "",
        image: "",
        category: defaultCategory,
        platform: "both",
        priceIosInput: "",
        priceAndroidInput: "",
      });
    }
  }, [open, editingGame, defaultCategory]);

  if (!open) return null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const body = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!res.ok || !body.url) {
        setError(
          body.error ??
            "อัปโหลดรูปภาพไม่สำเร็จ กรุณาเลือกไฟล์ PNG, JPG, WEBP, GIF หรือ SVG ขนาดไม่เกิน 5 MB",
        );
        return;
      }

      setForm((prev) => ({ ...prev, image: body.url! }));
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อขณะอัปโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading || submitting) return;

    setError(null);
    const validation = buildGamePayload(form);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = Boolean(editingGame);
      const endpoint = isEdit
        ? `/api/games/${encodeURIComponent(editingGame!.id)}`
        : "/api/games";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const body = (await res.json().catch(() => ({}))) as {
        game?: GameRate;
        error?: string;
      };

      if (!res.ok || !body.game) {
        setError(body.error ?? "บันทึกข้อมูลเกมไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง");
        return;
      }

      onSaved(body.game, isEdit);
      onClose();
    } catch {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  const showIosInput = form.platform === "both" || form.platform === "ios";
  const showAndroidInput =
    form.platform === "both" || form.platform === "android";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d1622]/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="w-full max-w-lg rounded-3xl border border-[#ffd6e5] bg-white p-6 shadow-[0_18px_40px_rgba(45,22,34,0.16)] sm:p-7">
        <div className="flex items-center justify-between gap-4 border-b border-[#ffe4ee] pb-4">
          <h2
            id={titleId}
            className="text-xl font-bold text-[#2d1622]"
            style={{ fontFamily: "var(--font-mali), sans-serif" }}
          >
            {editingGame ? "แก้ไขเรทราคาเกม / แอป" : "เพิ่มเกมหรือแอปใหม่"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ffd6e5] bg-[#fff6f9] text-[#6e485b] transition-colors hover:bg-[#ffe4ee] hover:text-[#2d1622] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d68]"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-[#f43f5e]/30 bg-[#fff1f2] px-4 py-3 text-sm font-medium text-[#9f1239]"
            >
              {error}
            </div>
          )}

          {/* 0. หมวดหมู่ (เกม / แอป) */}
          <div>
            <span className="block text-sm font-semibold text-[#2d1622]">
              หมวดหมู่รายการ
            </span>
            <div
              role="radiogroup"
              aria-label="หมวดหมู่รายการ"
              className="mt-1.5 grid grid-cols-2 gap-2 rounded-2xl border border-[#ffd6e5] bg-[#fff6f9] p-1.5"
            >
              {CATEGORY_OPTIONS.map(({ value, label, Icon }) => {
                const active = (form.category ?? "game") === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, category: value }))
                    }
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                      active
                        ? "bg-[#2d1622] text-white shadow-[0_4px_12px_rgba(45,22,34,0.25)]"
                        : "text-[#6e485b] hover:bg-[#ffe4ee] hover:text-[#2d1622]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. ชื่อเกมหรือแอป */}
          <div>
            <label
              htmlFor="game-name-input"
              className="block text-sm font-semibold text-[#2d1622]"
            >
              {form.category === "app" ? "ชื่อแอป" : "ชื่อเกม"}
            </label>
            <input
              id="game-name-input"
              type="text"
              required
              maxLength={120}
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder={
                form.category === "app"
                  ? "เช่น Goodnotes 6 หรือ Procreate Dreams"
                  : "เช่น Stardew Valley"
              }
              className="mt-1.5 w-full rounded-2xl border border-[#ffd6e5] bg-[#fff6f9] px-4 py-2.5 text-base text-[#2d1622] placeholder:text-[#6e485b]/70 focus:border-[#e11d68] focus:bg-white focus:outline-none"
            />
          </div>

          {/* 2. รูปเกม (อัปโหลดจากเครื่องเท่านั้น) */}
          <div>
            <span className="block text-sm font-semibold text-[#2d1622]">
              รูปปกเกม (อัปโหลดจากเครื่อง)
            </span>
            <div className="mt-1.5 flex items-center gap-4 rounded-2xl border border-dashed border-[#ff85b3] bg-[#fff6f9] p-3.5">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#ffd6e5] bg-white">
                {form.image ? (
                  <img
                    src={form.image}
                    alt={form.name || "ตัวอย่างรูปปกเกม"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-7 w-7 text-[#6e485b]" />
                )}
              </div>

              <div className="flex flex-1 flex-col items-start gap-1.5">
                <input
                  ref={fileInputRef}
                  id="game-image-file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  onChange={handleFileChange}
                  disabled={uploading || submitting}
                  className="sr-only"
                />
                <label
                  htmlFor="game-image-file"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#ffd6e5] bg-white px-3.5 py-2 text-sm font-semibold text-[#2d1622] shadow-[0_2px_8px_rgba(45,22,34,0.06)] transition-colors hover:border-[#e11d68] hover:bg-[#fff0f6]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#e11d68]" />
                      <span>กำลังอัปโหลด...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 text-[#e11d68]" />
                      <span>
                        {form.image ? "เปลี่ยนรูปจากเครื่อง" : "เลือกรูปจากเครื่อง"}
                      </span>
                    </>
                  )}
                </label>
                <p className="text-xs text-[#6e485b]">
                  รองรับไฟล์ PNG, JPG, WEBP, GIF, SVG ไม่เกิน 5 MB
                </p>
              </div>
            </div>
          </div>

          {/* 3. แพลตฟอร์ม */}
          <div>
            <span className="block text-sm font-semibold text-[#2d1622]">
              แพลตฟอร์มที่รองรับ
            </span>
            <div
              role="radiogroup"
              aria-label="แพลตฟอร์มที่รองรับ"
              className="mt-1.5 grid grid-cols-3 gap-2 rounded-2xl border border-[#ffd6e5] bg-[#fff6f9] p-1.5"
            >
              {PLATFORM_OPTIONS.map((option) => {
                const active = form.platform === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, platform: option.value }))
                    }
                    className={`rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                      active
                        ? "bg-[#e11d68] text-white shadow-[0_4px_12px_rgba(225,29,104,0.25)]"
                        : "text-[#6e485b] hover:bg-[#ffe4ee] hover:text-[#2d1622]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. ราคาแยกตามระบบ */}
          <div
            className={`grid gap-3 ${
              showIosInput && showAndroidInput ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {showIosInput && (
              <div className="rounded-2xl border border-[#ffd6e5] bg-[#fff0f6] p-3.5">
                <label
                  htmlFor="price-ios-input"
                  className="block text-sm font-semibold text-[#2d1622]"
                >
                  ราคา iOS (บาท)
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="price-ios-input"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    required
                    value={form.priceIosInput}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        priceIosInput: e.target.value,
                      }))
                    }
                    placeholder="เช่น 55"
                    className="w-full rounded-xl border border-[#ffd6e5] bg-white px-3.5 py-2 pr-12 text-base font-semibold tabular-nums text-[#2d1622] placeholder:font-normal placeholder:text-[#6e485b]/70 focus:border-[#e11d68] focus:outline-none"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-semibold text-[#6e485b]">
                    ฿
                  </span>
                </div>
              </div>
            )}

            {showAndroidInput && (
              <div className="rounded-2xl border border-[#bbf7d0] bg-[#eefbf5] p-3.5">
                <label
                  htmlFor="price-android-input"
                  className="block text-sm font-semibold text-[#134e32]"
                >
                  ราคา Android (บาท)
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="price-android-input"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    required
                    value={form.priceAndroidInput}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        priceAndroidInput: e.target.value,
                      }))
                    }
                    placeholder="เช่น 30"
                    className="w-full rounded-xl border border-[#bbf7d0] bg-white px-3.5 py-2 pr-12 text-base font-semibold tabular-nums text-[#134e32] placeholder:font-normal placeholder:text-[#134e32]/65 focus:border-[#15803d] focus:outline-none"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-semibold text-[#134e32]">
                    ฿
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#ffe4ee] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-2xl border border-[#ffd6e5] bg-white px-4 py-2.5 text-sm font-semibold text-[#6e485b] transition-colors hover:bg-[#fff6f9] hover:text-[#2d1622]"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={uploading || submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#e11d68] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(225,29,104,0.28)] transition-colors hover:bg-[#be1253] disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{editingGame ? "บันทึกการแก้ไข" : "เพิ่มรายการเกม"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
