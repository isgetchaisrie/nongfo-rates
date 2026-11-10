"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Gamepad2,
  KeyRound,
  LayoutGrid,
  Loader2,
  LogOut,
  MessageCircle,
  Pencil,
  Plus,
  QrCode,
  Save,
  Smartphone,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import type { CategoryType, GameRate, PlatformType } from "@/types/game";
import {
  COMMON_THAI_BANKS,
  DEFAULT_STORE_SETTINGS,
  resolveBankAccounts,
  type BankAccountItem,
  type StoreSettings,
} from "@/types/settings";
import { CatMascot } from "@/components/mascot/CatMascot";
import { GameFormModal } from "@/components/admin/GameFormModal";
import {
  FacebookIcon,
  LineIcon,
} from "@/components/storefront/ContactAdminSection";

export type AdminTab = "account" | "game" | "app" | "contact";

export interface AdminDashboardClientProps {
  initialGames: GameRate[];
  initialSettings?: StoreSettings;
}

function getPlatformBadge(platform: PlatformType): {
  label: string;
  className: string;
} {
  switch (platform) {
    case "both":
      return {
        label: "iOS & Android",
        className: "border-[#ffd6e5] bg-[#fff0f6] text-[#9d174d]",
      };
    case "ios":
      return {
        label: "เฉพาะ iOS",
        className: "border-[#fbcfe8] bg-[#fdf2f8] text-[#831843]",
      };
    case "android":
      return {
        label: "เฉพาะ Android",
        className: "border-[#bbf7d0] bg-[#eefbf5] text-[#134e32]",
      };
  }
}

function formatPriceThb(price: number | null): string {
  if (price === null) return "—";
  return `฿${price.toLocaleString("th-TH")}`;
}

export function AdminDashboardClient({
  initialGames,
  initialSettings,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("account");
  const [games, setGames] = useState<GameRate[]>(initialGames);
  const [settings, setSettings] = useState<StoreSettings>(
    initialSettings ?? DEFAULT_STORE_SETTINGS,
  );

  // Modals & form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameRate | null>(null);
  const [defaultCategory, setDefaultCategory] = useState<CategoryType>("game");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // File input refs
  const qrInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // Password Modal State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const bankAccounts = resolveBankAccounts(settings);

  const handleUpdateBankAccount = (
    index: number,
    patch: Partial<BankAccountItem>
  ) => {
    const currentAccounts = resolveBankAccounts(settings);
    const updated = currentAccounts.map((item, idx) =>
      idx === index ? { ...item, ...patch } : item
    );
    setSettings((prev) => ({
      ...prev,
      bankAccounts: updated,
      kbankNumber: updated[0]?.accountNumber || "",
    }));
  };

  const handleAddBankAccount = () => {
    const currentAccounts = resolveBankAccounts(settings);
    const newAccount: BankAccountItem = {
      id: `bank-${Date.now()}`,
      bankName: "ไทยพาณิชย์ (SCB)",
      accountNumber: "",
      accountName: settings.accountName || "",
    };
    const updated = [...currentAccounts, newAccount];
    setSettings((prev) => ({
      ...prev,
      bankAccounts: updated,
    }));
  };

  const handleRemoveBankAccount = (index: number) => {
    const currentAccounts = resolveBankAccounts(settings);
    if (currentAccounts.length <= 1) return;
    const updated = currentAccounts.filter((_, idx) => idx !== index);
    setSettings((prev) => ({
      ...prev,
      bankAccounts: updated,
      kbankNumber: updated[0]?.accountNumber || "",
    }));
  };

  const counts = useMemo(() => {
    let gameCount = 0;
    let appCount = 0;
    for (const item of games) {
      if (item.category === "app") {
        appCount += 1;
      } else {
        gameCount += 1;
      }
    }
    return { all: games.length, game: gameCount, app: appCount };
  }, [games]);

  const displayedGames = useMemo(() => {
    if (activeTab === "game") {
      return games.filter((g) => g.category === "game");
    }
    if (activeTab === "app") {
      return games.filter((g) => g.category === "app");
    }
    return games;
  }, [games, activeTab]);

  function openAddModal(cat: CategoryType) {
    setEditingGame(null);
    setDefaultCategory(cat);
    setModalOpen(true);
  }

  function openEditModal(game: GameRate) {
    setEditingGame(game);
    setDefaultCategory(game.category);
    setModalOpen(true);
  }

  function handleSaved(savedGame: GameRate, isEdit: boolean) {
    setFeedbackError(null);
    if (isEdit) {
      setGames((prev) =>
        prev.map((item) => (item.id === savedGame.id ? savedGame : item)),
      );
    } else {
      setGames((prev) => [savedGame, ...prev]);
    }
    router.refresh();
  }

  async function handleConfirmDelete(id: string) {
    if (deletingId) return;
    setFeedbackError(null);
    setDeletingId(id);

    try {
      const res = await fetch(`/api/games/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setFeedbackError(body.error ?? "ลบรายการไม่สำเร็จ กรุณาลองใหม่");
        return;
      }
      setGames((prev) => prev.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
      router.refresh();
    } catch {
      setFeedbackError("เกิดข้อผิดพลาดในการเชื่อมต่อขณะลบรายการ");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveSettingsSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (savingSettings) return;

    setFeedbackError(null);
    setSavingSettings(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const body = (await res.json().catch(() => ({}))) as {
        settings?: StoreSettings;
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setFeedbackError(body.error ?? "บันทึกการตั้งค่าไม่สำเร็จ");
        return;
      }

      if (body.settings) {
        setSettings(body.settings);
      }
      setFeedbackSuccess("บันทึกการตั้งค่าเรียบร้อยแล้ว หน้าร้านจะอัปเดตทันที!");
      router.refresh();
    } catch {
      setFeedbackError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleQrUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeedbackError(null);
    setUploadingQr(true);

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
        setFeedbackError(
          body.error ??
            "อัปโหลดรูป QR Code ไม่สำเร็จ กรุณาเลือกไฟล์ภาพ PNG, JPG หรือ WEBP",
        );
        return;
      }

      setSettings((prev) => ({ ...prev, qrImage: body.url! }));
      setFeedbackSuccess("อัปโหลดรูป QR Code เรียบร้อยแล้ว อย่าลืมกดบันทึกน้า");
    } catch {
      setFeedbackError("เกิดข้อผิดพลาดในการอัปโหลดรูป QR Code");
    } finally {
      setUploadingQr(false);
      if (qrInputRef.current) qrInputRef.current.value = "";
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeedbackError(null);
    setUploadingAvatar(true);

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
        setFeedbackError(
          body.error ??
            "อัปโหลดรูปโปรไฟล์ไม่สำเร็จ กรุณาเลือกไฟล์ภาพ PNG, JPG หรือ WEBP",
        );
        return;
      }

      setSettings((prev) => ({ ...prev, adminAvatar: body.url! }));
      setFeedbackSuccess("อัปโหลดรูปโปรไฟล์เรียบร้อยแล้ว อย่าลืมกดบันทึกน้า");
    } catch {
      setFeedbackError("เกิดข้อผิดพลาดในการอัปโหลดรูปโปรไฟล์");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  }

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (savingPassword) return;
    setPasswordError(null);

    if (newPassword.trim().length < 6) {
      setPasswordError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setPasswordError(body.error ?? "เปลี่ยนรหัสผ่านไม่สำเร็จ");
        return;
      }
      setPasswordModalOpen(false);
      setFeedbackSuccess(body.message ?? "เปลี่ยนรหัสผ่านแอดมินเรียบร้อยแล้ว");
    } catch {
      setPasswordError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="bg-pastel-canvas min-h-screen text-[#4a352c]">
      {/* Top Header */}
      <header className="border-b border-[#F8BBD0]/60 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-[#FCE4EC] p-1 shadow-xs">
              <CatMascot
                variant="admin"
                className="h-10 w-10"
                label="มาสคอตแมวแอดมิน Nongfo"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-lg font-bold text-[#4a352c] sm:text-xl"
                  style={{ fontFamily: "var(--font-mali), sans-serif" }}
                >
                  ระบบจัดการร้าน Nongfo Rates (Admin)
                </h1>
                <span className="rounded-full border border-[#F8BBD0] bg-[#FFFDE7] px-2.5 py-0.5 text-xs font-bold text-[#b81452]">
                  {activeTab === "account" && "บัญชี"}
                  {activeTab === "game" && `หมวดเกม (${counts.game})`}
                  {activeTab === "app" && `หมวดแอป (${counts.app})`}
                  {activeTab === "contact" && "ติดต่อแอดมิน"}
                </span>
              </div>
              <p className="text-xs font-medium text-[#6d5246]">
                เปลี่ยนเลขบัญชี รูปโปรไฟล์ ข้อมูลติดต่อ และจัดการเรทราคาสอดคล้องกับหน้าร้าน
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#F8BBD0] bg-white px-3.5 py-1.5 text-xs font-bold text-[#4a352c] transition-colors hover:bg-[#FCE4EC]"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#b81452]" />
              <span>ดูหน้าร้านจริง</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordError(null);
                setPasswordModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#F8BBD0] bg-[#FFFDE7] px-3.5 py-1.5 text-xs font-bold text-[#4a352c] shadow-xs transition-colors hover:bg-[#FCE4EC]"
            >
              <KeyRound className="h-3.5 w-3.5 text-[#b81452]" />
              <span>รหัสผ่าน</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#F8BBD0]/60 bg-white px-3.5 py-1.5 text-xs font-bold text-[#6d5246] transition-colors hover:bg-[#FCE4EC]/50 hover:text-[#4a352c] disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              <span>ออก</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area (extra bottom padding for bottom nav) */}
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-40 sm:px-6">
        {feedbackSuccess && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#b8f0d6] bg-[#eefbf5] px-4 py-3 text-sm font-bold text-[#0f5137] shadow-xs animate-in fade-in"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{feedbackSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackSuccess(null)}
              aria-label="ปิดข้อความแจ้งเตือน"
              className="rounded-full p-1 hover:bg-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {feedbackError && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-[#f43f5e]/30 bg-[#fff1f2] px-4 py-3 text-sm font-medium text-[#9f1239] shadow-xs animate-in fade-in"
          >
            {feedbackError}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: บัญชี (Payment Account Settings)                  */}
        {/* ========================================================= */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2
                  className="text-xl font-bold text-[#4a352c]"
                  style={{ fontFamily: "var(--font-mali), sans-serif" }}
                >
                  💳 จัดการข้อมูลบัญชีรับเงิน & โน้ตสลิป
                </h2>
                <p className="text-xs font-medium text-[#6d5246]">
                  แก้ไขเลขบัญชีกสิกร, TrueMoney Wallet, ข้อความโน้ตสลิป และอัปโหลดรูป QR Code รับเงิน
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSaveSettingsSubmit()}
                disabled={savingSettings}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white bg-[#FCE4EC] px-6 py-2.5 text-sm font-bold text-[#b81452] shadow-md transition-all hover:bg-[#F8BBD0] active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {savingSettings ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>บันทึกข้อมูลบัญชี</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Form Column */}
              <div className="lg:col-span-7 space-y-5 rounded-[28px] border border-white bg-white/90 p-5 sm:p-7 shadow-md">
                {/* QR Code Upload */}
                <div>
                  <label className="block text-xs font-bold text-[#4a352c] mb-1.5">
                    รูปภาพ QR Code สแกนจ่ายเงิน
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-[#F8BBD0] bg-white p-1 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.qrImage}
                        alt="QR Code ปัจจุบัน"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={qrInputRef}
                        onChange={handleQrUpload}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => qrInputRef.current?.click()}
                        disabled={uploadingQr}
                        className="inline-flex items-center gap-2 rounded-full border border-[#F8BBD0] bg-[#FFFDE7] px-4 py-2 text-xs font-bold text-[#4a352c] shadow-xs transition-all hover:bg-[#FCE4EC] active:scale-95 disabled:opacity-60 cursor-pointer"
                      >
                        {uploadingQr ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#b81452]" />
                        ) : (
                          <Upload className="h-4 w-4 text-[#b81452]" />
                        )}
                        <span>{uploadingQr ? "กำลังอัปโหลด..." : "เปลี่ยนรูป QR Code"}</span>
                      </button>
                      <p className="text-[11px] text-[#84685b]">
                        รองรับ PNG, JPG หรือ WEBP (แนะนำรูป QR จัตุรัสคมชัด)
                      </p>
                      <input
                        type="text"
                        value={settings.qrImage}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            qrImage: e.target.value,
                          }))
                        }
                        placeholder="หรือกรอก URL รูป QR Code"
                        className="w-full rounded-xl border border-[#F8BBD0]/60 bg-white px-3 py-1.5 text-xs text-[#4a352c] focus:outline-none focus:border-[#e11d68]"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Name */}
                <div>
                  <label className="block text-xs font-bold text-[#4a352c] mb-1">
                    ชื่อบัญชี (ชื่อ-นามสกุลแม่ค้า)
                  </label>
                  <input
                    type="text"
                    value={settings.accountName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        accountName: e.target.value,
                      }))
                    }
                    placeholder="เช่น ภัทรธิดา"
                    className="w-full rounded-2xl border border-[#F8BBD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#4a352c] focus:border-[#e11d68] focus:outline-none focus:ring-2 focus:ring-[#e11d68]/20"
                  />
                </div>

                {/* Bank Accounts Section (Multi-bank, freely editable) */}
                <div className="space-y-3 rounded-2xl border border-[#F8BBD0]/60 bg-[#FFF5F8]/40 p-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-xs font-bold text-[#4a352c]">
                        บัญชีธนาคารรับเงิน (แก้ไขได้ ไม่จำกัดธนาคาร)
                      </label>
                      <p className="text-[11px] text-[#84685b]">
                        เลือกหรือพิมพ์ชื่อธนาคาร และระบุเลขบัญชี สามารถเพิ่มได้หลายบัญชี
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBankAccount}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#F8BBD0] bg-white px-2.5 py-1.5 text-xs font-bold text-[#b81452] shadow-xs hover:bg-[#FCE4EC] active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>เพิ่มธนาคาร</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {bankAccounts.map((account, index) => (
                      <div
                        key={account.id || index}
                        className="relative rounded-xl border border-white bg-white/90 p-3 shadow-xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#FCE4EC] px-2 py-0.5 text-[11px] font-bold text-[#b81452]">
                            ธนาคาร #{index + 1}
                          </span>
                          {bankAccounts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBankAccount(index)}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-red-500 hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
                              title="ลบบัญชีนี้"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>ลบ</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-[#6d5246] mb-1">
                              ชื่อธนาคาร
                            </label>
                            <input
                              type="text"
                              list={`bank-presets-${index}`}
                              value={account.bankName}
                              onChange={(e) =>
                                handleUpdateBankAccount(index, { bankName: e.target.value })
                              }
                              placeholder="เช่น กสิกรไทย (K-Plus), ไทยพาณิชย์ (SCB)"
                              className="w-full rounded-xl border border-[#F8BBD0] bg-white px-3 py-1.5 text-xs font-semibold text-[#4a352c] focus:border-[#e11d68] focus:outline-none focus:ring-1 focus:ring-[#e11d68]/20"
                            />
                            <datalist id={`bank-presets-${index}`}>
                              {COMMON_THAI_BANKS.map((b) => (
                                <option key={b} value={b} />
                              ))}
                            </datalist>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#6d5246] mb-1">
                              เลขที่บัญชี
                            </label>
                            <input
                              type="text"
                              value={account.accountNumber}
                              onChange={(e) =>
                                handleUpdateBankAccount(index, { accountNumber: e.target.value })
                              }
                              placeholder="เช่น 151-8-83098-4"
                              className="w-full rounded-xl border border-[#F8BBD0] bg-white px-3 py-1.5 text-xs font-bold text-[#4a352c] focus:border-[#e11d68] focus:outline-none focus:ring-1 focus:ring-[#e11d68]/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#84685b] mb-1">
                            ชื่อเจ้าของบัญชีนี้ (ถ้าต่างจากชื่อร้านหลัก &quot;{settings.accountName || "ภัทรธิดา"}&quot;)
                          </label>
                          <input
                            type="text"
                            value={account.accountName ?? ""}
                            onChange={(e) =>
                              handleUpdateBankAccount(index, { accountName: e.target.value })
                            }
                            placeholder={`ใช้ตามชื่อร้านหลัก: ${settings.accountName || "ภัทรธิดา"}`}
                            className="w-full rounded-xl border border-[#F8BBD0]/70 bg-white/70 px-3 py-1.5 text-xs text-[#4a352c] focus:border-[#e11d68] focus:outline-none focus:ring-1 focus:ring-[#e11d68]/20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TrueMoney Wallet */}
                <div>
                  <label className="block text-xs font-bold text-[#4a352c] mb-1">
                    เบอร์ TrueMoney Wallet
                  </label>
                  <input
                    type="text"
                    value={settings.trueNumber}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        trueNumber: e.target.value,
                      }))
                    }
                    placeholder="เช่น 096-018-0967"
                    className="w-full rounded-2xl border border-[#F8BBD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#4a352c] focus:border-[#e11d68] focus:outline-none focus:ring-2 focus:ring-[#e11d68]/20"
                  />
                </div>

                {/* Slip Note */}
                <div>
                  <label className="block text-xs font-bold text-[#4a352c] mb-1">
                    ข้อความโน้ตสลิปที่ลูกค้าต้องใส่
                  </label>
                  <input
                    type="text"
                    value={settings.slipNote}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        slipNote: e.target.value,
                      }))
                    }
                    placeholder="เช่น ยินยอมซื้อขายFb Pat Pattida"
                    className="w-full rounded-2xl border border-[#F8BBD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#4a352c] focus:border-[#e11d68] focus:outline-none focus:ring-2 focus:ring-[#e11d68]/20"
                  />
                  <p className="mt-1 text-[11px] text-[#84685b]">
                    ข้อความนี้จะแสดงในกรอบโน้ตสลิปและปุ่มกดคัดลอกข้อความในหน้าบัญชี
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveSettingsSubmit()}
                    disabled={savingSettings}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-white bg-[#FCE4EC] px-6 py-3 text-sm font-bold text-[#b81452] shadow-md transition-all hover:bg-[#F8BBD0] active:scale-98 disabled:opacity-60 cursor-pointer"
                  >
                    {savingSettings ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>บันทึกข้อมูลบัญชีทั้งหมด</span>
                  </button>
                </div>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-[28px] border border-[#F8BBD0]/60 bg-gradient-to-br from-[#FFF9FB] to-[#FFF5F8] p-5 shadow-sm">
                  <span className="inline-block rounded-full border border-[#F8BBD0] bg-white px-3 py-1 text-[11px] font-bold text-[#b81452] mb-3">
                    👀 ตัวอย่างการแสดงผลหน้าร้าน
                  </span>

                  <div className="flex flex-col items-center rounded-2xl border border-white bg-white/80 p-4 text-center shadow-xs">
                    <div className="relative h-44 w-44 overflow-hidden rounded-xl border border-pink-200 bg-white p-1 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.qrImage}
                        alt="QR Preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="mt-3 text-xs font-bold text-[#4a352c]">
                      ชื่อบัญชี: <span className="text-[#b81452]">{settings.accountName || "—"}</span>
                    </p>
                    <div className="mt-1 space-y-0.5 w-full">
                      {bankAccounts.map((b, i) => (
                        <p key={i} className="text-xs font-medium text-[#6d5246] truncate">
                          {b.bankName || "ธนาคาร"}:{" "}
                          <span className="font-bold text-[#4a352c]">
                            {b.accountNumber || "—"}
                          </span>
                          {b.accountName && b.accountName !== settings.accountName && (
                            <span className="text-[10px] text-[#84685b]"> ({b.accountName})</span>
                          )}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs font-medium text-[#6d5246] mt-1">
                      วอเลท: <span className="font-bold text-[#4a352c]">{settings.trueNumber || "—"}</span>
                    </p>

                    <div className="mt-3 w-full rounded-xl border border-amber-200 bg-[#FFFDE7] p-2 text-left">
                      <span className="text-[10px] font-bold text-[#84685b]">โน้ตสลิป:</span>
                      <p className="text-xs font-bold text-[#b81452]">
                        &quot;{settings.slipNote || "ยินยอมซื้อขาย"}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2 & 3: หมวดเกม & หมวดแอป (Games / Apps Management)     */}
        {/* ========================================================= */}
        {(activeTab === "game" || activeTab === "app") && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2
                  className="text-xl font-bold text-[#4a352c] flex items-center gap-2"
                  style={{ fontFamily: "var(--font-mali), sans-serif" }}
                >
                  {activeTab === "game" ? (
                    <>
                      <Gamepad2 className="h-6 w-6 text-[#b81452]" />
                      <span>รายการเรทราคา หมวดเกม ({displayedGames.length} เกม)</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-6 w-6 text-[#be1253]" />
                      <span>รายการเรทราคา หมวดแอป ({displayedGames.length} แอป)</span>
                    </>
                  )}
                </h2>
                <p className="text-xs font-medium text-[#6d5246]">
                  {activeTab === "game"
                    ? "จัดการรายชื่อเกม, ราคา iOS / Android และรูปไอคอนเกม"
                    : "จัดการรายชื่อแอป, ราคา iOS / Android และรูปไอคอนแอป"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => openAddModal(activeTab === "game" ? "game" : "app")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white bg-[#FCE4EC] px-5 py-2.5 text-sm font-bold text-[#b81452] shadow-md transition-all hover:bg-[#F8BBD0] active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>+ เพิ่ม{activeTab === "game" ? "เกมใหม่" : "แอปใหม่"}</span>
              </button>
            </div>

            {displayedGames.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[32px] border border-white bg-white/80 p-12 text-center shadow-sm">
                <CatMascot
                  variant="empty"
                  className="h-20 w-20 mb-3"
                  label="ยังไม่มีรายการ"
                />
                <h3 className="text-base font-bold text-[#4a352c]">
                  ยังไม่มีรายการในหมวด{activeTab === "game" ? "เกม" : "แอป"}นี้
                </h3>
                <p className="mt-1 text-xs text-[#6d5246]">
                  กดปุ่มด้านล่างเพื่อเริ่มเพิ่มรายการแรกได้เลยค่า
                </p>
                <button
                  type="button"
                  onClick={() => openAddModal(activeTab === "game" ? "game" : "app")}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white bg-[#FCE4EC] px-5 py-2 text-xs font-bold text-[#b81452] shadow-xs hover:bg-[#F8BBD0]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>เพิ่มรายการใหม่</span>
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[28px] border border-white bg-white/90 shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#F8BBD0]/50 bg-[#FFF5F8] text-xs font-bold text-[#6d5246]">
                        <th className="py-3 pl-4 pr-3 sm:pl-6">รายการ</th>
                        <th className="px-3 py-3 text-center">ระบบ</th>
                        <th className="px-3 py-3 text-center">ราคา iOS</th>
                        <th className="px-3 py-3 text-center">ราคา Android</th>
                        <th className="py-3 pr-4 pl-3 text-right sm:pr-6">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F8BBD0]/30 font-medium text-[#4a352c]">
                      {displayedGames.map((game) => {
                        const platBadge = getPlatformBadge(game.platform);
                        const isDeleting = deletingId === game.id;
                        const isConfirming = confirmDeleteId === game.id;

                        return (
                          <tr
                            key={game.id}
                            className="transition-colors hover:bg-[#FFF9FB]"
                          >
                            <td className="py-3.5 pl-4 pr-3 sm:pl-6">
                              <div className="flex items-center gap-3">
                                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-[#F8BBD0] bg-white p-0.5 shadow-xs">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={game.image}
                                    alt={game.name}
                                    className="h-full w-full rounded-[14px] object-cover"
                                  />
                                </div>
                                <span className="font-bold text-[#4a352c]">
                                  {game.name}
                                </span>
                              </div>
                            </td>

                            <td className="px-3 py-3.5 text-center">
                              <span
                                className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${platBadge.className}`}
                              >
                                {platBadge.label}
                              </span>
                            </td>

                            <td className="px-3 py-3.5 text-center font-bold text-[#b81452] tabular-nums">
                              {formatPriceThb(game.priceIos)}
                            </td>

                            <td className="px-3 py-3.5 text-center font-bold text-[#0f5137] tabular-nums">
                              {formatPriceThb(game.priceAndroid)}
                            </td>

                            <td className="py-3.5 pr-4 pl-3 text-right sm:pr-6">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(game)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-[#F8BBD0] bg-white px-2.5 py-1.5 text-xs font-bold text-[#4a352c] transition-colors hover:bg-[#FCE4EC] cursor-pointer"
                                >
                                  <Pencil className="h-3 w-3 text-[#b81452]" />
                                  <span>แก้ไข</span>
                                </button>

                                {isConfirming ? (
                                  <div className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 p-1">
                                    <button
                                      type="button"
                                      disabled={isDeleting}
                                      onClick={() => handleConfirmDelete(game.id)}
                                      className="rounded-lg bg-red-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-red-700 cursor-pointer disabled:opacity-60"
                                    >
                                      {isDeleting ? "กำลังลบ..." : "ยืนยัน"}
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isDeleting}
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="rounded-lg bg-white px-1.5 py-1 text-[11px] font-bold text-[#6d5246] hover:bg-gray-100 cursor-pointer"
                                    >
                                      ยกเลิก
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(game.id)}
                                    className="inline-flex items-center gap-1 rounded-xl border border-[#f43f5e]/30 bg-white px-2.5 py-1.5 text-xs font-bold text-[#9f1239] transition-colors hover:bg-red-50 cursor-pointer"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span>ลบ</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ติดต่อแอดมิน (Contact Admin Settings)             */}
        {/* ========================================================= */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2
                  className="text-xl font-bold text-[#4a352c]"
                  style={{ fontFamily: "var(--font-mali), sans-serif" }}
                >
                  💬 จัดการโปรไฟล์ & ช่องทางติดต่อแอดมิน
                </h2>
                <p className="text-xs font-medium text-[#6d5246]">
                  เปลี่ยนรูปโปรไฟล์แอดมิน, ชื่อแสดงผล, ลิงก์ Facebook และ LINE สำหรับลูกค้าทักแชทสั่งซื้อ
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSaveSettingsSubmit()}
                disabled={savingSettings}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white bg-[#FCE4EC] px-6 py-2.5 text-sm font-bold text-[#b81452] shadow-md transition-all hover:bg-[#F8BBD0] active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {savingSettings ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>บันทึกข้อมูลติดต่อ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Form Column */}
              <div className="lg:col-span-7 space-y-5 rounded-[28px] border border-white bg-white/90 p-5 sm:p-7 shadow-md">
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-xs font-bold text-[#4a352c] mb-1.5">
                    รูปโปรไฟล์แอดมิน (แสดงเป็นวงกลมตรงกลาง)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-[#F8BBD0] bg-white p-0.5 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.adminAvatar}
                        alt="รูปโปรไฟล์ปัจจุบัน"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="inline-flex items-center gap-2 rounded-full border border-[#F8BBD0] bg-[#FFFDE7] px-4 py-2 text-xs font-bold text-[#4a352c] shadow-xs transition-all hover:bg-[#FCE4EC] active:scale-95 disabled:opacity-60 cursor-pointer"
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#b81452]" />
                        ) : (
                          <Camera className="h-4 w-4 text-[#b81452]" />
                        )}
                        <span>{uploadingAvatar ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}</span>
                      </button>
                      <p className="text-[11px] text-[#84685b]">
                        รองรับ PNG, JPG หรือ WEBP รูปจะถูกแสดงเป็นทรงกลม
                      </p>
                      <input
                        type="text"
                        value={settings.adminAvatar}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            adminAvatar: e.target.value,
                          }))
                        }
                        placeholder="หรือกรอก URL รูปโปรไฟล์"
                        className="w-full rounded-xl border border-[#F8BBD0]/60 bg-white px-3 py-1.5 text-xs text-[#4a352c] focus:outline-none focus:border-[#e11d68]"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Name */}
                <div>
                  <label className="block text-xs font-bold text-[#4a352c] mb-1">
                    ชื่อแอดมิน / ร้าน
                  </label>
                  <input
                    type="text"
                    value={settings.adminName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        adminName: e.target.value,
                      }))
                    }
                    placeholder="เช่น Nongfo"
                    className="w-full rounded-2xl border border-[#F8BBD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#4a352c] focus:border-[#e11d68] focus:outline-none focus:ring-2 focus:ring-[#e11d68]/20"
                  />
                </div>

                {/* Facebook Name & URL */}
                <div className="space-y-3 rounded-2xl border border-[#F8BBD0]/40 bg-[#FFF5F8]/40 p-4">
                  <span className="text-xs font-bold text-[#b81452]">
                    ช่องทาง Facebook
                  </span>

                  <div>
                    <label className="block text-xs font-medium text-[#4a352c] mb-1">
                      ข้อความบนปุ่ม Facebook
                    </label>
                    <input
                      type="text"
                      value={settings.facebookName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          facebookName: e.target.value,
                        }))
                      }
                      placeholder="เช่น Thitima Nongfo"
                      className="w-full rounded-xl border border-[#F8BBD0] bg-white px-3.5 py-2 text-xs font-semibold text-[#4a352c] focus:border-[#e11d68] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4a352c] mb-1">
                      ลิงก์โปรไฟล์ / เพจ Facebook (URL)
                    </label>
                    <input
                      type="text"
                      value={settings.facebookUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          facebookUrl: e.target.value,
                        }))
                      }
                      placeholder="เช่น https://www.facebook.com/share/..."
                      className="w-full rounded-xl border border-[#F8BBD0] bg-white px-3.5 py-2 text-xs font-semibold text-[#4a352c] focus:border-[#e11d68] focus:outline-none"
                    />
                  </div>
                </div>

                {/* LINE Name & URL */}
                <div className="space-y-3 rounded-2xl border border-[#b8f0d6]/50 bg-[#eefbf5]/40 p-4">
                  <span className="text-xs font-bold text-[#0f5137]">
                    ช่องทาง LINE Official / LINE ส่วนตัว
                  </span>

                  <div>
                    <label className="block text-xs font-medium text-[#4a352c] mb-1">
                      ข้อความบนปุ่ม LINE
                    </label>
                    <input
                      type="text"
                      value={settings.lineName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          lineName: e.target.value,
                        }))
                      }
                      placeholder="เช่น Add LINE friend (@709qwuff)"
                      className="w-full rounded-xl border border-[#b8f0d6] bg-white px-3.5 py-2 text-xs font-semibold text-[#4a352c] focus:border-[#0f5137] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4a352c] mb-1">
                      ลิงก์เพิ่มเพื่อน LINE (URL)
                    </label>
                    <input
                      type="text"
                      value={settings.lineUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          lineUrl: e.target.value,
                        }))
                      }
                      placeholder="เช่น https://lin.ee/..."
                      className="w-full rounded-xl border border-[#b8f0d6] bg-white px-3.5 py-2 text-xs font-semibold text-[#4a352c] focus:border-[#0f5137] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4a352c] mb-1">
                      LINE ID สำหรับกดคัดลอก
                    </label>
                    <input
                      type="text"
                      value={settings.lineId}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          lineId: e.target.value,
                        }))
                      }
                      placeholder="เช่น @709qwuff"
                      className="w-full rounded-xl border border-[#b8f0d6] bg-white px-3.5 py-2 text-xs font-semibold text-[#4a352c] focus:border-[#0f5137] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveSettingsSubmit()}
                    disabled={savingSettings}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-white bg-[#FCE4EC] px-6 py-3 text-sm font-bold text-[#b81452] shadow-md transition-all hover:bg-[#F8BBD0] active:scale-98 disabled:opacity-60 cursor-pointer"
                  >
                    {savingSettings ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>บันทึกข้อมูลติดต่อทั้งหมด</span>
                  </button>
                </div>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-[28px] border border-[#F8BBD0]/60 bg-gradient-to-br from-[#FFF9FB] to-[#FFF5F8] p-5 shadow-sm">
                  <span className="inline-block rounded-full border border-[#F8BBD0] bg-white px-3 py-1 text-[11px] font-bold text-[#b81452] mb-3">
                    👀 ตัวอย่างการแสดงผลหน้าร้าน
                  </span>

                  <div className="flex flex-col items-center rounded-3xl border border-white bg-white/90 p-6 text-center shadow-xs">
                    {/* Circle Avatar */}
                    <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full border-4 border-[#F8BBD0] shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.adminAvatar}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <h3
                      className="text-lg font-bold text-[#4a352c]"
                      style={{ fontFamily: "var(--font-mali), sans-serif" }}
                    >
                      {settings.adminName || "Nongfo"}
                    </h3>
                    <p className="text-xs font-semibold text-[#b81452]">
                      ติดต่อแอดมิน
                    </p>

                    <div className="mt-4 w-full space-y-2">
                      <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1877F2] to-[#0D65D9] p-2.5 text-xs font-bold text-white shadow-xs">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white shadow-xs">
                          <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
                        </div>
                        <span className="truncate">Facebook: {settings.facebookName || "Thitima Nongfo"}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#06C755] to-[#00B900] p-2.5 text-xs font-bold text-white shadow-xs">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white shadow-xs">
                          <LineIcon className="h-5 w-5" />
                        </div>
                        <span className="truncate">LINE: {settings.lineName || "Add LINE friend"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* Bottom Navigation Bar (Synchronized with Storefront)     */}
      {/* ========================================================= */}
      <nav
        aria-label="เมนูจัดการสำหรับแอดมิน"
        className="pointer-events-none fixed bottom-3 inset-x-0 z-40 mx-auto max-w-md px-3"
      >
        <div className="pointer-events-auto rounded-[28px] border border-white/80 bg-white/95 p-1.5 shadow-[0_12px_36px_rgba(244,143,177,0.35)] backdrop-blur-md">
          <ul className="grid grid-cols-4 gap-1">
            {/* Tab 1: บัญชี */}
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("account");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`group flex w-full flex-col items-center justify-center rounded-[22px] py-1.5 transition-all active:scale-95 cursor-pointer ${
                  activeTab === "account"
                    ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                    : "text-[#6d5246] hover:bg-[#FFFDE7]/60"
                }`}
              >
                <CreditCard className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="mt-0.5 text-[11px] font-bold tracking-tight">
                  บัญชี
                </span>
              </button>
            </li>

            {/* Tab 2: หมวดเกม */}
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("game");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`group relative flex w-full flex-col items-center justify-center rounded-[22px] py-1.5 transition-all active:scale-95 cursor-pointer ${
                  activeTab === "game"
                    ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                    : "text-[#6d5246] hover:bg-[#FFFDE7]/60"
                }`}
              >
                <div className="relative">
                  <Gamepad2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e11d68] px-1 text-[9px] font-bold text-white">
                    {counts.game}
                  </span>
                </div>
                <span className="mt-0.5 text-[11px] font-bold tracking-tight">
                  หมวดเกม
                </span>
              </button>
            </li>

            {/* Tab 3: หมวดแอป */}
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("app");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`group relative flex w-full flex-col items-center justify-center rounded-[22px] py-1.5 transition-all active:scale-95 cursor-pointer ${
                  activeTab === "app"
                    ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                    : "text-[#6d5246] hover:bg-[#FFFDE7]/60"
                }`}
              >
                <div className="relative">
                  <Smartphone className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#be1253] px-1 text-[9px] font-bold text-white">
                    {counts.app}
                  </span>
                </div>
                <span className="mt-0.5 text-[11px] font-bold tracking-tight">
                  หมวดแอป
                </span>
              </button>
            </li>

            {/* Tab 4: ติดต่อแอดมิน */}
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`group flex w-full flex-col items-center justify-center rounded-[22px] py-1.5 transition-all active:scale-95 cursor-pointer ${
                  activeTab === "contact"
                    ? "bg-[#FCE4EC] text-[#b81452] shadow-xs"
                    : "text-[#6d5246] hover:bg-[#FFFDE7]/60"
                }`}
              >
                <User className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="mt-0.5 text-[11px] font-bold tracking-tight">
                  ติดต่อแอดมิน
                </span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Add / Edit Game Modal */}
      <GameFormModal
        open={modalOpen}
        editingGame={editingGame}
        defaultCategory={defaultCategory}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />

      {/* Password Change Modal */}
      {passwordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl border border-white bg-white/95 p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8BBD0]">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#b81452]" />
                <h3
                  className="text-base font-bold text-[#4a352c]"
                  style={{ fontFamily: "var(--font-mali), sans-serif" }}
                >
                  เปลี่ยนรหัสผ่านแอดมิน
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="rounded-full p-1 text-[#6d5246] hover:bg-[#FCE4EC]/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3.5">
              {passwordError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700">
                  {passwordError}
                </div>
              )}

              <div>
                <label
                  htmlFor="current-admin-password"
                  className="block text-xs font-bold text-[#4a352c]"
                >
                  รหัสผ่านปัจจุบัน
                </label>
                <input
                  id="current-admin-password"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านปัจจุบัน"
                  className="mt-1 w-full rounded-xl border border-[#F8BBD0] bg-white px-3.5 py-2 text-xs font-medium text-[#4a352c] focus:border-[#e11d68] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="new-admin-password"
                  className="block text-xs font-bold text-[#4a352c]"
                >
                  รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)
                </label>
                <input
                  id="new-admin-password"
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="ตั้งรหัสผ่านใหม่"
                  className="mt-1 w-full rounded-xl border border-[#F8BBD0] bg-white px-3.5 py-2 text-xs font-medium text-[#4a352c] focus:border-[#e11d68] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-admin-password"
                  className="block text-xs font-bold text-[#4a352c]"
                >
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  id="confirm-admin-password"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  className="mt-1 w-full rounded-xl border border-[#F8BBD0] bg-white px-3.5 py-2 text-xs font-medium text-[#4a352c] focus:border-[#e11d68] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  disabled={savingPassword}
                  className="rounded-full border border-[#F8BBD0] bg-white px-4 py-1.5 text-xs font-bold text-[#6d5246] hover:bg-[#FCE4EC]/50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white bg-[#FCE4EC] px-4 py-1.5 text-xs font-bold text-[#b81452] shadow-xs hover:bg-[#F8BBD0] disabled:opacity-60 cursor-pointer"
                >
                  {savingPassword && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>บันทึกรหัสผ่านใหม่</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
