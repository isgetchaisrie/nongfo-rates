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

type CatBehaviorMode = "walking" | "idle" | "happy";

interface RoamingKittyConfig {
  id: string;
  name: string;
  quote: string;
  walkCol: number;
  walkRow: number;
  walkNaturalFacing: "left" | "right";
  idleCol: number;
  idleRow: number;
  idleNaturalFacing: "left" | "right";
  size: number;
  mobileSize: number;
  showOnMobile: boolean;
  initialX: number; // vw %
  initialY: number; // vh %
  initialTargetX: number;
  initialTargetY: number;
  speedPctPerSec: number;
}

interface FootstepPrint {
  id: number;
  x: number;
  y: number;
  angleDeg: number;
}

interface KittyLiveState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  facing: "left" | "right";
  mode: CatBehaviorMode;
  modeRemainingSec: number;
  stepPhase: number;
  footsteps: FootstepPrint[];
}

const ROAMING_KITTIES: RoamingKittyConfig[] = [
  {
    id: "bengal-walker",
    name: "น้องลายเสือเดินทัวร์",
    quote: "ย่ำต๊อกๆ พาทัวร์เช็กเรทราคาเกมทั่วหน้าเว็บเลยเมี๊ยว~",
    walkCol: 0,
    walkRow: 4, // Real mid-stride walking cat from sheet
    walkNaturalFacing: "right",
    idleCol: 4,
    idleRow: 4, // Sitting waving paw tabby
    idleNaturalFacing: "left",
    size: 76,
    mobileSize: 52,
    showOnMobile: true,
    initialX: 12,
    initialY: 88,
    initialTargetX: 78,
    initialTargetY: 84,
    speedPctPerSec: 4.5,
  },
  {
    id: "sakura-kitty",
    name: "น้องซากุระชมพู",
    quote: "เมี๊ยว~ เกมแท้ราคาน่ารักทุกเกมเลยน้า!",
    walkCol: 1,
    walkRow: 3, // Pastel pink cat
    walkNaturalFacing: "right",
    idleCol: 1,
    idleRow: 3,
    idleNaturalFacing: "right",
    size: 74,
    mobileSize: 50,
    showOnMobile: true,
    initialX: 85,
    initialY: 16,
    initialTargetX: 15,
    initialTargetY: 22,
    speedPctPerSec: 4.0,
  },
  {
    id: "lavender-bow",
    name: "น้องโบว์ม่วงพาสเทล",
    quote: "จิ้มเลือกดูหมวดเกมหรือแอปด้านบนได้เลยค่า~",
    walkCol: 0,
    walkRow: 3, // Pastel lavender bow cat
    walkNaturalFacing: "right",
    idleCol: 0,
    idleRow: 3,
    idleNaturalFacing: "right",
    size: 74,
    mobileSize: 50,
    showOnMobile: true,
    initialX: 48,
    initialY: 90,
    initialTargetX: 14,
    initialTargetY: 62,
    speedPctPerSec: 3.9,
  },
  {
    id: "orange-pouncer",
    name: "น้องส้มดุ๊กดิ๊ก",
    quote: "รองรับทั้ง iOS และ Android เช็กเรทไวสุดๆ เมี๊ยว!",
    walkCol: 3,
    walkRow: 0, // Playful pouncing orange tabby
    walkNaturalFacing: "left",
    idleCol: 3,
    idleRow: 1, // Sitting smiling orange tabby
    idleNaturalFacing: "left",
    size: 76,
    mobileSize: 50,
    showOnMobile: false,
    initialX: 84,
    initialY: 70,
    initialTargetX: 18,
    initialTargetY: 34,
    speedPctPerSec: 4.3,
  },
  {
    id: "mint-bell",
    name: "น้องกระดิ่งมินต์",
    quote: "น้องแมวมาเดินเล่นเป็นเพื่อนเลือกเกมน้า~",
    walkCol: 3,
    walkRow: 3, // Pastel mint cat with golden bell
    walkNaturalFacing: "right",
    idleCol: 3,
    idleRow: 3,
    idleNaturalFacing: "right",
    size: 72,
    mobileSize: 48,
    showOnMobile: false,
    initialX: 10,
    initialY: 42,
    initialTargetX: 82,
    initialTargetY: 78,
    speedPctPerSec: 3.8,
  },
  {
    id: "galaxy-star",
    name: "น้องกาแล็กซีดาววิ้ง",
    quote: "แอปแท้ Procreate & ibisPaint X ก็มีน้า~",
    walkCol: 5,
    walkRow: 3, // Galaxy starry purple cat
    walkNaturalFacing: "left",
    idleCol: 5,
    idleRow: 3,
    idleNaturalFacing: "left",
    size: 72,
    mobileSize: 48,
    showOnMobile: false,
    initialX: 90,
    initialY: 48,
    initialTargetX: 24,
    initialTargetY: 84,
    speedPctPerSec: 3.7,
  },
];

// Desktop full-page tour waypoints
const DESKTOP_TOUR_WAYPOINTS: Array<{ x: number; y: number }> = [
  { x: 5, y: 14 },
  { x: 20, y: 11 },
  { x: 82, y: 12 },
  { x: 91, y: 22 },
  { x: 6, y: 38 },
  { x: 90, y: 44 },
  { x: 8, y: 64 },
  { x: 88, y: 66 },
  { x: 7, y: 85 },
  { x: 34, y: 87 },
  { x: 64, y: 86 },
  { x: 86, y: 83 },
  { x: 24, y: 48 },
  { x: 74, y: 52 },
];

// Mobile edge-only waypoints so cats patrol the top/bottom/outer borders without blocking price cards
const MOBILE_PERIMETER_WAYPOINTS: Array<{ x: number; y: number }> = [
  { x: 12, y: 9 },
  { x: 48, y: 8 },
  { x: 86, y: 10 },
  { x: 88, y: 89 },
  { x: 52, y: 91 },
  { x: 16, y: 90 },
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
    y: Math.min(92, Math.max(7, chosen.y + jitterY)),
  };
}

/**
 * Computes natural Live2D / Spine2D-style bottom-anchored squash-and-stretch
 * and step hop transforms so the original anime cat cutout moves with realistic
 * weight and elasticity without ever detaching limbs.
 */
function computeLive2DMotion(
  mode: CatBehaviorMode,
  phase: number,
  shouldFlipX: boolean,
  isMobile: boolean,
) {
  const dirSign = shouldFlipX ? -1 : 1;

  if (mode === "walking") {
    const strideSin = Math.sin(phase);
    const hopProgress = Math.abs(strideSin); // 0 at ground contact, 1 at peak of step
    const hopHeightPx = (isMobile ? 6.5 : 10) * hopProgress;
    // Squash on ground contact (hopProgress ~ 0), stretch at peak of stride (hopProgress ~ 1)
    const scaleY = 0.92 + hopProgress * 0.14;
    const scaleX = (1.07 - hopProgress * 0.12) * dirSign;
    const tiltDeg = strideSin * 5.5;
    const skewXDeg = Math.cos(phase) * 3;
    const shadowScale = 1.08 - hopProgress * 0.28;

    return {
      spriteTransform: `translateY(${-hopHeightPx.toFixed(1)}px) rotate(${tiltDeg.toFixed(1)}deg) skewX(${skewXDeg.toFixed(1)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`,
      shadowScale: shadowScale.toFixed(2),
    };
  }

  if (mode === "happy") {
    const bounce = Math.abs(Math.sin(phase * 2.5));
    const hopHeightPx = (isMobile ? 10 : 15) * bounce;
    const scaleY = 0.88 + bounce * 0.22;
    const scaleX = (1.12 - bounce * 0.18) * dirSign;
    const tiltDeg = Math.sin(phase * 2.5) * 8;
    const shadowScale = 1.1 - bounce * 0.35;

    return {
      spriteTransform: `translateY(${-hopHeightPx.toFixed(1)}px) rotate(${tiltDeg.toFixed(1)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`,
      shadowScale: shadowScale.toFixed(2),
    };
  }

  // Idle breathing & gentle tail/body sway anchored at the paws
  const breath = Math.sin(phase * 1.1);
  const sway = Math.cos(phase * 0.7);
  const scaleY = 1 + breath * 0.04;
  const scaleX = (1 - breath * 0.03) * dirSign;
  const skewXDeg = sway * 2.4;

  return {
    spriteTransform: `skewX(${skewXDeg.toFixed(1)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`,
    shadowScale: "1",
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
      modeRemainingSec: 0,
      stepPhase: idx * 1.4,
      footsteps: [],
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

          if (state.mode !== "walking") {
            const nextRemaining = state.modeRemainingSec - dt;
            if (nextRemaining > 0) {
              return {
                ...state,
                modeRemainingSec: nextRemaining,
                stepPhase: state.stepPhase + dt * 2.6,
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
              modeRemainingSec: 0,
            };
          }

          const dx = state.targetX - state.x;
          const dy = state.targetY - state.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 1.2) {
            return {
              ...state,
              mode: "idle",
              modeRemainingSec:
                2.4 + ((idx * 0.8 + tickCountRef.current) % 2.0),
            };
          }

          const moveDist = config.speedPctPerSec * dt;
          const ratio = Math.min(1, moveDist / dist);
          const nextX = state.x + dx * ratio;
          const nextY = state.y + dy * ratio;
          const nextFacing =
            Math.abs(dx) > 0.2 ? (dx > 0 ? "right" : "left") : state.facing;

          const prevStrideIndex = Math.floor(state.stepPhase / Math.PI);
          const nextPhase = state.stepPhase + dt * 8.5;
          const nextStrideIndex = Math.floor(nextPhase / Math.PI);

          let nextFootsteps = state.footsteps;
          if (nextStrideIndex > prevStrideIndex) {
            const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
            nextFootsteps = [
              ...state.footsteps.slice(-4),
              {
                id: tickCountRef.current + idx * 1000,
                x: state.x,
                y: state.y + 1.8,
                angleDeg,
              },
            ];
          }

          return {
            ...state,
            x: nextX,
            y: nextY,
            facing: nextFacing,
            stepPhase: nextPhase,
            footsteps: nextFootsteps,
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
        {/* Subtle fading paw-print trail behind walking cats */}
        {!isPaused &&
          kitties.map((live, idx) => {
            const config = ROAMING_KITTIES[idx];
            if (isMobile && !config.showOnMobile) return null;
            return live.footsteps.map((fp, fpIdx) => (
              <svg
                key={fp.id}
                viewBox="0 0 20 20"
                aria-hidden="true"
                style={{
                  left: `${fp.x}%`,
                  top: `${fp.y}%`,
                  opacity: ((fpIdx + 1) / (live.footsteps.length + 1)) * 0.32,
                  transform: `translate(-50%, -50%) rotate(${fp.angleDeg}deg)`,
                }}
                className="pointer-events-none absolute h-3.5 w-3.5 text-[#F48FB1]"
                fill="currentColor"
              >
                <ellipse cx="10" cy="12" rx="4" ry="3.2" />
                <circle cx="6" cy="7" r="1.6" />
                <circle cx="10" cy="5.8" r="1.6" />
                <circle cx="14" cy="7" r="1.6" />
              </svg>
            ));
          })}

        {!isPaused &&
          ROAMING_KITTIES.map((kitty, idx) => {
            if (isMobile && !kitty.showOnMobile) {
              return null;
            }
            const live = kitties[idx];
            const spriteSize = isMobile ? kitty.mobileSize : kitty.size;
            const isWalking = live.mode === "walking";
            const activeCol = isWalking ? kitty.walkCol : kitty.idleCol;
            const activeRow = isWalking ? kitty.walkRow : kitty.idleRow;
            const naturalFacing = isWalking
              ? kitty.walkNaturalFacing
              : kitty.idleNaturalFacing;
            const shouldFlipX = live.facing !== naturalFacing;

            const { spriteTransform, shadowScale } = computeLive2DMotion(
              live.mode,
              live.stepPhase,
              shouldFlipX,
              isMobile,
            );

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
                  <div className="mb-1.5 whitespace-nowrap rounded-full border border-[#F8BBD0] bg-white/95 px-2.5 py-0.5 text-xs font-bold text-[#4a352c] shadow-sm">
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
                          ? { ...item, mode: "happy", modeRemainingSec: 3.2 }
                          : item,
                      ),
                    );
                  }}
                  aria-label={`ทักทาย${kitty.name}`}
                  className="pointer-events-auto group relative flex flex-col items-center justify-center p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]"
                >
                  <div
                    style={{
                      transformOrigin: "50% 92%",
                      transform: spriteTransform,
                    }}
                    className="will-change-transform"
                  >
                    <KawaiiCatSprite
                      col={activeCol}
                      row={activeRow}
                      size={spriteSize}
                      flipX={false}
                      label={kitty.name}
                    />
                  </div>
                  {/* Soft reactive ground shadow underneath the paws */}
                  <span
                    aria-hidden="true"
                    style={{
                      width: `${Math.round(spriteSize * 0.58)}px`,
                      height: "7px",
                      transform: `scaleX(${shadowScale})`,
                    }}
                    className="-mt-1.5 rounded-full bg-[#9E8877]/25 blur-[1px]"
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
