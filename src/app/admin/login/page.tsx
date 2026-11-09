"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { CatMascot } from "@/components/mascot/CatMascot";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const trimmed = password.trim();
    if (!trimmed) {
      setError("กรุณากรอกรหัสผ่านผู้ดูแลระบบ");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const body = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.status === 429) {
        setError(
          body.error ??
            "กรอกรหัสผ่านผิดเกินจำนวนครั้งที่กำหนด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
        );
        return;
      }

      if (res.status === 401 || !res.ok) {
        setError(body.error ?? "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fff6f9] px-4 py-10 text-[#2d1622]">
      <div className="w-full max-w-md rounded-3xl border border-[#ffd6e5] bg-white p-6 shadow-[0_16px_40px_rgba(45,22,34,0.08)] sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[#ffd6e5] bg-[#fff0f6] p-2">
            <CatMascot
              variant="admin"
              className="h-16 w-16"
              label="มาสคอตแอดมิน Nuggetkub"
            />
          </div>

          <h1
            className="mt-4 text-2xl font-bold text-[#2d1622]"
            style={{ fontFamily: "var(--font-mali), sans-serif" }}
          >
            เข้าสู่ระบบจัดการเรทราคา
          </h1>
          <p className="mt-1.5 text-sm text-[#6e485b]">
            สำหรับเจ้าของร้าน Nuggetkub เพื่อเพิ่ม แก้ไข หรือลบเรทราคาเกม
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-[#f43f5e]/30 bg-[#fff1f2] px-4 py-3 text-sm font-medium text-[#9f1239]"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-semibold text-[#2d1622]"
            >
              รหัสผ่านผู้ดูแลระบบ
            </label>
            <div className="relative mt-1.5">
              <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e485b]" />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านแอดมิน"
                className="w-full rounded-2xl border border-[#ffd6e5] bg-[#fff6f9] py-2.5 pl-10 pr-4 text-base text-[#2d1622] placeholder:text-[#6e485b]/70 focus:border-[#e11d68] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e11d68] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(225,29,104,0.28)] transition-colors hover:bg-[#be1253] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>เข้าสู่ระบบ</span>
          </button>
        </form>

        <div className="mt-6 border-t border-[#ffe4ee] pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6e485b] transition-colors hover:text-[#e11d68]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับหน้าตารางเรทราคา</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
