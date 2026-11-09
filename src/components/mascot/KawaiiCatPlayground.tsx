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
    naturalFacing: "right",
    initialX: 6,
    initialY: 78,
    initialTargetX: 84,
    initialTargetY: 22,
    speedPctPerSec: 4.2,
  },
  {
    id: "lavender-bow",
    name: "น้องโบว์ม่วงพาสเทล",
    quote: "จิ้มเลือกดูหมวดเกมหรือแอปด้านบนได้เลยค่า~",
    col: 0,
    row: 3,
    size: 72,
    naturalFacing: "right",
    initialX: 88,
    initialY: 18,
    initialTargetX: 12,
    initialTargetY: 64,
    speedPctPerSec: 3.8,
  },
  {
    id: "rainbow-pastel",
    name: "น้องสายรุ้งมาร์ชแมลโลว์",
    quote: "รองรับทั้ง iOS และ Android เช็กเรทไวสุดๆ เมี๊ยว!",
    col: 4,
    row: 3,
    size: 76,
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
    naturalFacing: "right",
    initialX: 45,
    initialY: 85,
    initialTargetX: 8,
    initialTargetY: 42,
    speedPctPerSec: 4.6,
  },
  {
    id: "galaxy-star",
    name: "น้องกาแล็กซีดาววิ้ง",
    quote: "แอปแท้ Procreate & ibisPaint X ก็มีน้า~",
    col: 5,
    row: 3,
    size: 70,
    naturalFacing: "left",
    initialX: 90,
    initialY: 48,
    initialTargetX: 24,
    initialTargetY: 84,
    speedPctPerSec: 3.5,
  },
];

// Curated scenic waypoints around the viewport so cats tour top, sides, middle, and bottom naturally
const TOUR_WAYPOINTS: Array<{ x: number; y: number }> = [
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

function pickNextWaypoint(currentX: number, currentY: number, seed: number) {
  const candidates = TOUR_WAYPOINTS.filter(
    (wp) => Math.hypot(wp.x - currentX, wp.y - currentY) > 25,
  );
  const pool = candidates.length > 0 ? candidates : TOUR_WAYPOINTS;
  const chosen = pool[Math.abs(Math.floor(seed)) % pool.length];
  const jitterX = ((seed * 17) % 7) - 3.5;
  const jitterY = ((seed * 29) % 7) - 3.5;
  return {
    x: Math.min(92, Math.max(3, chosen.x + jitterX)),
    y: Math.min(88, Math.max(8, chosen.y + jitterY)),
  };
}

export function KawaiiCatPlayground() {
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
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
              idleRemainingSec: 1.8 + ((idx * 0.7 + tickCountRef.current) % 1.8),
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
  }, []);

  return (
    <div
      aria-label="สนามวิ่งเล่นน้องแมว Nongfo ทัวร์รอบหน้าเว็บ"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {ROAMING_KITTIES.map((kitty, idx) => {
        const live = kitties[idx];
        const shouldFlipX = live.facing !== kitty.naturalFacing;
        const bobOffsetPx =
          live.mode === "walking"
            ? -Math.abs(Math.sin(live.stepPhase)) * 7
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
            className="cat-roam-tour pointer-events-auto absolute flex flex-col items-center will-change-[left,top]"
          >
            {activeSpeech === kitty.id && (
              <div className="mb-1 whitespace-nowrap rounded-full border border-[#F8BBD0] bg-white/95 px-3 py-1 text-xs font-bold text-[#4a352c] shadow-sm">
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
              className="cat-trot group relative flex items-center justify-center p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]"
            >
              <KawaiiCatSprite
                col={kitty.col}
                row={kitty.row}
                size={kitty.size}
                flipX={shouldFlipX}
                label={kitty.name}
              />
              <span className="pointer-events-none absolute -top-2 -right-1 rounded-full border border-white bg-[#FCE4EC] px-2 py-0.5 text-xs font-bold text-[#b81452] opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                เมี๊ยว!
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
