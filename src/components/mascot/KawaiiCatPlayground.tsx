"use client";

import React, { useEffect, useRef, useState } from "react";

export interface KawaiiCatSpriteProps {
  col: number; // 0..5
  row: number; // 0..4
  size?: number;
  flipX?: boolean;
  className?: string;
  label?: string;
}

/**
 * Renders one of the 30 full-body transparent kawaii cats from /cats/cat_<row>_<col>.png.
 */
export function KawaiiCatSprite({
  col,
  row,
  size = 76,
  flipX = false,
  className = "",
  label = "น้องแมว Nongfo",
}: KawaiiCatSpriteProps) {
  return (
    <img
      src={`/cats/cat_${row}_${col}.png`}
      alt={label}
      width={size}
      height={size}
      draggable={false}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: flipX ? "scaleX(-1)" : undefined,
      }}
      className={`inline-block shrink-0 object-contain select-none drop-shadow-[0_6px_12px_rgba(158,136,119,0.25)] ${className}`}
    />
  );
}

interface RoamingKittyConfig {
  id: string;
  name: string;
  quote: string;
  col: number;
  row: number;
  size: number;
  mobileSize: number;
  showOnMobile: boolean;
  naturalFacing: "left" | "right";
  initialX: number; // vw %
  initialY: number; // vh %
  initialTargetX: number;
  initialTargetY: number;
  speedPctPerSec: number;
}

interface KittyLiveState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  facing: "left" | "right";
  mode: "walking" | "idle";
  idleRemainingSec: number;
  stepPhase: number;
}

const ROAMING_KITTIES: RoamingKittyConfig[] = [
  {
    id: "sakura-kitty",
    name: "น้องซากุระชมพู",
    quote: "เมี๊ยว~ เกมแท้ราคาน่ารักทุกเกมเลยน้า!",
    col: 1,
    row: 3,
    size: 74,
    mobileSize: 48,
    showOnMobile: true,
    naturalFacing: "right",
    initialX: 10,
    initialY: 90,
    initialTargetX: 78,
    initialTargetY: 91,
    speedPctPerSec: 4.2,
  },
  {
    id: "lavender-bow",
    name: "น้องโบว์ม่วงพาสเทล",
    quote: "จิ้มเลือกดูหมวดเกมหรือแอปด้านบนได้เลยค่า~",
    col: 0,
    row: 3,
    size: 72,
    mobileSize: 46,
    showOnMobile: true,
    naturalFacing: "right",
    initialX: 84,
    initialY: 12,
    initialTargetX: 16,
    initialTargetY: 10,
    speedPctPerSec: 3.8,
  },
  {
    id: "rainbow-pastel",
    name: "น้องสายรุ้งมาร์ชแมลโลว์",
    quote: "รองรับทั้ง iOS และ Android เช็กเรทไวสุดๆ เมี๊ยว!",
    col: 4,
    row: 3,
    size: 76,
    mobileSize: 46,
    showOnMobile: false,
    naturalFacing: "left",
    initialX: 14,
    initialY: 32,
    initialTargetX: 78,
    initialTargetY: 82,
    speedPctPerSec: 3.6,
  },
  {
    id: "mint-bell",
    name: "น้องกระดิ่งมินต์",
    quote: "น้องแมวมาเดินทัวร์เป็นเพื่อนเลือกเกมน้า~",
    col: 3,
    row: 3,
    size: 70,
    mobileSize: 44,
    showOnMobile: false,
    naturalFacing: "right",
    initialX: 82,
    initialY: 72,
    initialTargetX: 18,
    initialTargetY: 14,
    speedPctPerSec: 4.0,
  },
  {
    id: "bengal-walker",
    name: "น้องลายเสือเดินทัวร์",
    quote: "เดินสำรวจเรทราคาทั่วหน้าเว็บเลย เมี๊ยว~",
    col: 0,
    row: 4,
    size: 74,
    mobileSize: 48,
    showOnMobile: true,
    naturalFacing: "right",
    initialX: 48,
    initialY: 92,
    initialTargetX: 14,
    initialTargetY: 89,
    speedPctPerSec: 4.4,
  },
  {
    id: "galaxy-star",
    name: "น้องกาแล็กซีดาววิ้ง",
    quote: "แอปแท้ Procreate & ibisPaint X ก็มีน้า~",
    col: 5,
    row: 3,
    size: 70,
    mobileSize: 44,
    showOnMobile: false,
    naturalFacing: "left",
    initialX: 90,
    initialY: 48,
    initialTargetX: 24,
    initialTargetY: 84,
    speedPctPerSec: 3.5,
  },
];

// Desktop full-page tour waypoints
const DESKTOP_TOUR_WAYPOINTS: Array<{ x: number; y: number }> = [
  { x: 4, y: 14 },
  { x: 18, y: 10 },
  { x: 82, y: 12 },
  { x: 91, y: 20 },
  { x: 5, y: 38 },
  { x: 90, y: 42 },
  { x: 8, y: 64 },
  { x: 88, y: 66 },
  { x: 6, y: 84 },
  { x: 32, y: 86 },
  { x: 64, y: 85 },
  { x: 86, y: 82 },
  { x: 24, y: 48 },
  { x: 74, y: 52 },
];

// Mobile edge-only waypoints so cats patrol the top/bottom/outer borders without blocking price cards in the center
const MOBILE_PERIMETER_WAYPOINTS: Array<{ x: number; y: number }> = [
  { x: 12, y: 9 },
  { x: 48, y: 8 },
  { x: 86, y: 10 },
  { x: 88, y: 89 },
  { x: 52, y: 92 },
  { x: 16, y: 91 },
  { x: 8, y: 48 },
  { x: 91, y: 52 },
];

function pickNextWaypoint(
  currentX: number,
  currentY: number,
  seed: number,
  isMobile: boolean,
) {
  const waypoints = isMobile
    ? MOBILE_PERIMETER_WAYPOINTS
    : DESKTOP_TOUR_WAYPOINTS;
  const candidates = waypoints.filter(
    (wp) => Math.hypot(wp.x - currentX, wp.y - currentY) > 22,
  );
  const pool = candidates.length > 0 ? candidates : waypoints;
  const chosen = pool[Math.abs(Math.floor(seed)) % pool.length];
  const jitterX = ((seed * 17) % 5) - 2.5;
  const jitterY = ((seed * 29) % 4) - 2;
  return {
    x: Math.min(92, Math.max(5, chosen.x + jitterX)),
    y: Math.min(93, Math.max(7, chosen.y + jitterY)),
  };
}

export function KawaiiCatPlayground() {
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);

  const [kitties, setKitties] = useState<KittyLiveState[]>(() =>
    ROAMING_KITTIES.map((k, idx) => ({
      x: k.initialX,
      y: k.initialY,
      targetX: k.initialTargetX,
      targetY: k.initialTargetY,
      facing: k.initialTargetX >= k.initialX ? "right" : "left",
      mode: "walking",
      idleRemainingSec: 0,
      stepPhase: idx * 1.3,
    })),
  );

  const tickCountRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateViewport = () => {
      const mobile = window.innerWidth < 768;
      isMobileRef.current = mobile;
      setIsMobile(mobile);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    let animationFrameId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.08, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      tickCountRef.current += 1;

      setKitties((prev) =>
        prev.map((state, idx) => {
          const config = ROAMING_KITTIES[idx];

          if (state.mode === "idle") {
            const nextIdle = state.idleRemainingSec - dt;
            if (nextIdle > 0) {
              return {
                ...state,
                idleRemainingSec: nextIdle,
                stepPhase: state.stepPhase + dt * 2.2,
              };
            }
            const nextWp = pickNextWaypoint(
              state.x,
              state.y,
              tickCountRef.current + idx * 19 + now * 0.01,
              isMobileRef.current,
            );
            return {
              ...state,
              mode: "walking",
              targetX: nextWp.x,
              targetY: nextWp.y,
              facing: nextWp.x >= state.x ? "right" : "left",
              idleRemainingSec: 0,
            };
          }

          const dx = state.targetX - state.x;
          const dy = state.targetY - state.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 1.2) {
            return {
              ...state,
              mode: "idle",
              idleRemainingSec:
                1.8 + ((idx * 0.7 + tickCountRef.current) % 1.8),
            };
          }

          const moveDist = config.speedPctPerSec * dt;
          const ratio = Math.min(1, moveDist / dist);
          const nextX = state.x + dx * ratio;
          const nextY = state.y + dy * ratio;
          const nextFacing =
            Math.abs(dx) > 0.2 ? (dx > 0 ? "right" : "left") : state.facing;

          return {
            ...state,
            x: nextX,
            y: nextY,
            facing: nextFacing,
            stepPhase: state.stepPhase + dt * 9.5,
          };
        }),
      );

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <>
      <div
        aria-label="สนามวิ่งเล่นน้องแมว Nongfo ทัวร์รอบหน้าเว็บ"
        className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      >
        {!isPaused &&
          ROAMING_KITTIES.map((kitty, idx) => {
            if (isMobile && !kitty.showOnMobile) {
              return null;
            }
            const live = kitties[idx];
            const shouldFlipX = live.facing !== kitty.naturalFacing;
            const spriteSize = isMobile ? kitty.mobileSize : kitty.size;
            const bobOffsetPx =
              live.mode === "walking"
                ? -Math.abs(Math.sin(live.stepPhase)) * (isMobile ? 4.5 : 7)
                : Math.sin(live.stepPhase) * 2;
            const tiltDeg =
              live.mode === "walking" ? Math.sin(live.stepPhase) * 4.5 : 0;

            return (
              <div
                key={kitty.id}
                style={{
                  left: `${live.x}%`,
                  top: `${live.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="cat-roam-tour pointer-events-none sm:pointer-events-auto absolute flex flex-col items-center will-change-[left,top]"
              >
                {activeSpeech === kitty.id && (
                  <div className="mb-1 whitespace-nowrap rounded-full border border-[#F8BBD0] bg-white/95 px-2.5 py-0.5 text-xs font-bold text-[#4a352c] shadow-sm">
                    {kitty.quote}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSpeech((prev) =>
                      prev === kitty.id ? null : kitty.id,
                    );
                    setKitties((prev) =>
                      prev.map((item, i) =>
                        i === idx
                          ? { ...item, mode: "idle", idleRemainingSec: 3.2 }
                          : item,
                      ),
                    );
                  }}
                  aria-label={`ทักทาย${kitty.name}`}
                  style={{
                    transform: `translateY(${bobOffsetPx.toFixed(1)}px) rotate(${tiltDeg.toFixed(1)}deg)`,
                  }}
                  className="cat-trot pointer-events-auto group relative flex items-center justify-center p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]"
                >
                  <KawaiiCatSprite
                    col={kitty.col}
                    row={kitty.row}
                    size={spriteSize}
                    flipX={shouldFlipX}
                    label={kitty.name}
                  />
                  <span className="pointer-events-none absolute -top-2 -right-1 hidden rounded-full border border-white bg-[#FCE4EC] px-2 py-0.5 text-xs font-bold text-[#b81452] opacity-0 shadow-xs transition-opacity group-hover:opacity-100 sm:inline-block">
                    เมี๊ยว!
                  </span>
                </button>
              </div>
            );
          })}
      </div>

      {/* Quick toggle button at bottom-left so mobile/desktop users can hide/show roaming cats anytime */}
      <button
        type="button"
        onClick={() => setIsPaused((prev) => !prev)}
        aria-pressed={isPaused}
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-[#FFFDE7]/95 px-3 py-1.5 text-xs font-bold text-[#4a352c] shadow-sm backdrop-blur-xs transition-all hover:bg-[#FCE4EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]"
      >
        <span>{isPaused ? "แสดงน้องแมวเดินเล่น" : "พักน้องแมวเดินเล่น"}</span>
      </button>
    </>
  );
}
