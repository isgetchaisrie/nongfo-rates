"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Gamepad2,
  LayoutGrid,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { CategoryType, GameRate, PlatformType } from "@/types/game";
import { CatMascot } from "@/components/mascot/CatMascot";
import { GameFormModal } from "@/components/admin/GameFormModal";

export interface AdminDashboardClientProps {
  initialGames: GameRate[];
}

function getCategoryBadge(category: CategoryType): {
  label: string;
  className: string;
  Icon: React.ComponentType<{ className?: string }>;
} {
  if (category === "app") {
    return {
      label: "แอป",
      className: "border-[#fbcfe8] bg-[#fff0f6] text-[#be1253]",
      Icon: Sparkles,
    };
  }
  return {
    label: "เกม",
    className: "border-[#ffd6e5] bg-[#fff6f9] text-[#2d1622]",
    Icon: Gamepad2,
  };
}

function getPlatformBadge(platform: PlatformType): {
  label: string;
  className: string;
} {
  switch (platform) {
    case "both":
      return {
        label: "iOS & Android",
        className:
          "border-[#ffd6e5] bg-[#fff0f6] text-[#9d174d]",
      };
    case "ios":
      return {
        label: "เฉพาะ iOS",
        className:
          "border-[#fbcfe8] bg-[#fdf2f8] text-[#831843]",
      };
    case "android":
      return {
        label: "เฉพาะ Android",
        className:
          "border-[#bbf7d0] bg-[#eefbf5] text-[#134e32]",
      };
  }
}

function formatPriceThb(price: number | null): string {
  if (price === null) return "—";
  return `฿${price.toLocaleString("th-TH")}`;
}

export function AdminDashboardClient({
  initialGames,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [games, setGames] = useState<GameRate[]>(initialGames);
  const [categoryFilter, setCategoryFilter] = useState<"all" | CategoryType>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameRate | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

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

  const filteredGames = useMemo(() => {
    if (categoryFilter === "all") return games;
    return games.filter((g) => g.category === categoryFilter);
  }, [games, categoryFilter]);

  function openAddModal() {
    setEditingGame(null);
    setModalOpen(true);
  }

  function openEditModal(game: GameRate) {
    setEditingGame(game);
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
        setFeedbackError(body.error ?? "ลบรายการเกมไม่สำเร็จ กรุณาลองใหม่");
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

  return (
    <div className="min-h-screen bg-[#fff6f9] text-[#2d1622]">
      <header className="border-b border-[#ffd6e5] bg-white/95">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#ffd6e5] bg-[#fff0f6] p-1.5">
              <CatMascot
                variant="admin"
                className="h-11 w-11"
                label="มาสคอตแมวแอดมิน Nuggetkub"
              />
            </div>
            <div>
              <h1
                className="text-xl font-bold text-[#2d1622] sm:text-2xl"
                style={{ fontFamily: "var(--font-mali), sans-serif" }}
              >
                จัดการเรทราคาเกมและแอป (Admin)
              </h1>
              <p className="mt-0.5 text-sm text-[#6e485b]">
                รายการทั้งหมด{" "}
                <span className="font-semibold tabular-nums text-[#2d1622]">
                  {counts.all}
                </span>{" "}
                รายการ (เกม{" "}
                <span className="font-semibold tabular-nums text-[#2d1622]">
                  {counts.game}
                </span>{" "}
                · แอป{" "}
                <span className="font-semibold tabular-nums text-[#be1253]">
                  {counts.app}
                </span>
                )
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#ffd6e5] bg-[#fff6f9] px-3.5 py-2 text-sm font-semibold text-[#2d1622] transition-colors hover:border-[#ff85b3] hover:bg-[#ffe4ee]"
            >
              <ExternalLink className="h-4 w-4 text-[#e11d68]" />
              <span>ดูหน้าเว็บจริง</span>
            </Link>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[#e11d68] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(225,29,104,0.25)] transition-colors hover:bg-[#be1253]"
            >
              <Plus className="h-4 w-4" />
              <span>+ เพิ่มเกม / แอปใหม่</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#ffd6e5] bg-white px-3.5 py-2 text-sm font-semibold text-[#6e485b] transition-colors hover:bg-[#fff0f6] hover:text-[#2d1622] disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {feedbackError && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-[#f43f5e]/30 bg-[#fff1f2] px-4 py-3 text-sm font-medium text-[#9f1239]"
          >
            {feedbackError}
          </div>
        )}

        {games.length > 0 && (
          <div
            role="group"
            aria-label="กรองรายการแอดมินตามหมวดหมู่"
            className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-[#ffd6e5] bg-white p-1.5"
          >
            {(
              [
                { id: "all", label: "ทั้งหมด", count: counts.all, Icon: LayoutGrid },
                { id: "game", label: "หมวดเกม", count: counts.game, Icon: Gamepad2 },
                { id: "app", label: "หมวดแอป", count: counts.app, Icon: Sparkles },
              ] as const
            ).map(({ id, label, count, Icon }) => {
              const active = categoryFilter === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategoryFilter(id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                    active
                      ? "bg-[#2d1622] text-white"
                      : "text-[#6e485b] hover:bg-[#fff0f6] hover:text-[#2d1622]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{label}</span>
                  <span
                    className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#fff0f6] text-[#be1253]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {filteredGames.length === 0 ? (
          <section className="flex flex-col items-center justify-center rounded-3xl border border-[#ffd6e5] bg-white px-6 py-14 text-center shadow-[0_10px_28px_rgba(45,22,34,0.06)]">
            <CatMascot
              variant="empty"
              className="h-24 w-24"
              label="ยังไม่มีรายการเกมหรือแอป"
            />
            <h2
              className="mt-4 text-lg font-bold text-[#2d1622]"
              style={{ fontFamily: "var(--font-mali), sans-serif" }}
            >
              ยังไม่มีรายการเรทราคาในหมวดนี้
            </h2>
            <p className="mt-1 max-w-md text-sm text-[#6e485b]">
              เริ่มต้นเพิ่มเกมหรือแอปพร้อมอัปโหลดรูปปกและระบุราคา iOS / Android ได้ทันที
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#e11d68] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(225,29,104,0.25)] transition-colors hover:bg-[#be1253]"
            >
              <Plus className="h-4 w-4" />
              <span>+ เพิ่มเกม / แอปใหม่</span>
            </button>
          </section>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-3xl border border-[#ffd6e5] bg-white shadow-[0_10px_30px_rgba(45,22,34,0.06)] md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#ffd6e5] bg-[#fff0f6] text-xs font-bold text-[#6e485b]">
                    <th scope="col" className="px-5 py-3.5">
                      รูปปก
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      ชื่อรายการ
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      หมวดหมู่
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      ระบบที่รองรับ
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      ราคา iOS
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      ราคา Android
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ffe4ee] text-sm">
                  {filteredGames.map((game) => {
                    const badge = getPlatformBadge(game.platform);
                    const catBadge = getCategoryBadge(game.category);
                    const CatIcon = catBadge.Icon;
                    const isConfirmingDelete = confirmDeleteId === game.id;
                    const isDeleting = deletingId === game.id;

                    return (
                      <tr
                        key={game.id}
                        className="transition-colors hover:bg-[#fff6f9]"
                      >
                        <td className="px-5 py-3.5">
                          <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[#ffd6e5] bg-[#fff6f9]">
                            <img
                              src={game.image}
                              alt={game.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[#2d1622]">
                          {game.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${catBadge.className}`}
                          >
                            <CatIcon className="h-3.5 w-3.5 text-[#e11d68]" />
                            <span>{catBadge.label}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-[#2d1622]">
                          {formatPriceThb(game.priceIos)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-[#134e32]">
                          {formatPriceThb(game.priceAndroid)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {isConfirmingDelete ? (
                            <div className="inline-flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleConfirmDelete(game.id)}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-1 rounded-xl bg-[#be123c] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#9f1239] disabled:opacity-60"
                              >
                                {isDeleting && (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                )}
                                <span>ยืนยันลบ</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                disabled={isDeleting}
                                className="rounded-xl border border-[#ffd6e5] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#6e485b] hover:bg-[#fff6f9]"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(game)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd6e5] bg-[#fff6f9] px-3 py-1.5 text-xs font-semibold text-[#2d1622] transition-colors hover:border-[#ff85b3] hover:bg-[#ffe4ee]"
                              >
                                <Pencil className="h-3.5 w-3.5 text-[#e11d68]" />
                                <span>แก้ไข</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(game.id)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd6e5] bg-white px-3 py-1.5 text-xs font-semibold text-[#9f1239] transition-colors hover:border-[#fda4af] hover:bg-[#fff1f2]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>ลบ</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="space-y-3.5 md:hidden">
              {filteredGames.map((game) => {
                const badge = getPlatformBadge(game.platform);
                const catBadge = getCategoryBadge(game.category);
                const CatIcon = catBadge.Icon;
                const isConfirmingDelete = confirmDeleteId === game.id;
                const isDeleting = deletingId === game.id;

                return (
                  <article
                    key={game.id}
                    className="rounded-3xl border border-[#ffd6e5] bg-white p-4 shadow-[0_8px_20px_rgba(45,22,34,0.05)]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#ffd6e5] bg-[#fff6f9]">
                        <img
                          src={game.image}
                          alt={game.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-bold text-[#2d1622]">
                          {game.name}
                        </h2>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${catBadge.className}`}
                          >
                            <CatIcon className="h-3 w-3 text-[#e11d68]" />
                            <span>{catBadge.label}</span>
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                      <div className="rounded-2xl border border-[#ffd6e5] bg-[#fff0f6] px-3 py-2">
                        <span className="block text-xs font-medium text-[#6e485b]">
                          ราคา iOS
                        </span>
                        <span className="mt-0.5 block text-sm font-bold tabular-nums text-[#2d1622]">
                          {formatPriceThb(game.priceIos)}
                        </span>
                      </div>
                      <div className="rounded-2xl border border-[#bbf7d0] bg-[#eefbf5] px-3 py-2">
                        <span className="block text-xs font-medium text-[#134e32]">
                          ราคา Android
                        </span>
                        <span className="mt-0.5 block text-sm font-bold tabular-nums text-[#134e32]">
                          {formatPriceThb(game.priceAndroid)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 flex items-center justify-end gap-2 border-t border-[#ffe4ee] pt-3">
                      {isConfirmingDelete ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(game.id)}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1 rounded-xl bg-[#be123c] px-3.5 py-1.5 text-xs font-semibold text-white"
                          >
                            {isDeleting && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            )}
                            <span>ยืนยันลบ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isDeleting}
                            className="rounded-xl border border-[#ffd6e5] bg-white px-3 py-1.5 text-xs font-semibold text-[#6e485b]"
                          >
                            ยกเลิก
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => openEditModal(game)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd6e5] bg-[#fff6f9] px-3.5 py-1.5 text-xs font-semibold text-[#2d1622]"
                          >
                            <Pencil className="h-3.5 w-3.5 text-[#e11d68]" />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(game.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd6e5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#9f1239]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>ลบ</span>
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>

      <GameFormModal
        open={modalOpen}
        editingGame={editingGame}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  );
}
