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

type CatBreed = "sakura" | "lavender" | "mint" | "sky" | "calico" | "galaxy";
type CatBehaviorMode = "walking" | "sitting" | "waving" | "sleeping" | "happy";

interface BreedPalette {
  furMain: string;
  furShadow: string;
  belly: string;
  earInner: string;
  eyeUpper: string;
  eyeLower: string;
  outline: string;
  blush: string;
  accessory: "bow" | "bell" | "heart" | "fluff" | "patches" | "moon";
}

const BREED_PALETTES: Record<CatBreed, BreedPalette> = {
  sakura: {
    furMain: "#FFD0E0",
    furShadow: "#F8A5C2",
    belly: "#FFF5F8",
    earInner: "#FF8DA1",
    eyeUpper: "#4a352c",
    eyeLower: "#F48FB1",
    outline: "#4a352c",
    blush: "#FF85A2",
    accessory: "heart",
  },
  lavender: {
    furMain: "#E2D4F8",
    furShadow: "#C5B0EA",
    belly: "#FAF6FF",
    earInner: "#F4A2C8",
    eyeUpper: "#4a352c",
    eyeLower: "#CE93D8",
    outline: "#4a352c",
    blush: "#F48FB1",
    accessory: "bow",
  },
  mint: {
    furMain: "#CBEFE3",
    furShadow: "#9ED9C5",
    belly: "#F4FBF8",
    earInner: "#F7A8B8",
    eyeUpper: "#4a352c",
    eyeLower: "#80CBC4",
    outline: "#4a352c",
    blush: "#FF9EB5",
    accessory: "bell",
  },
  sky: {
    furMain: "#C7E4FC",
    furShadow: "#9AC9F5",
    belly: "#F5FAFF",
    earInner: "#F8ACC8",
    eyeUpper: "#4a352c",
    eyeLower: "#81D4FA",
    outline: "#4a352c",
    blush: "#FF9EBB",
    accessory: "fluff",
  },
  calico: {
    furMain: "#FFF8EE",
    furShadow: "#F3E5D0",
    belly: "#FFFFFF",
    earInner: "#FF9AA2",
    eyeUpper: "#4a352c",
    eyeLower: "#FFB74D",
    outline: "#4a352c",
    blush: "#FF8A80",
    accessory: "patches",
  },
  galaxy: {
    furMain: "#9B86D9",
    furShadow: "#7B63C2",
    belly: "#DFD5F8",
    earInner: "#F49AC2",
    eyeUpper: "#4a352c",
    eyeLower: "#FFD54F",
    outline: "#4a352c",
    blush: "#F48FB1",
    accessory: "moon",
  },
};

interface ArticulatedCatProps {
  breed: CatBreed;
  mode: CatBehaviorMode;
  phase: number;
  isBlinking: boolean;
  facing: "left" | "right";
  size: number;
}

/**
 * Full-body articulated anime kawaii cat with independently moving 4 legs,
 * wagging tail, bobbing head, twitching ears, blinking glossy eyes, and waving paw.
 */
function ArticulatedKawaiiCat({
  breed,
  mode,
  phase,
  isBlinking,
  facing,
  size,
}: ArticulatedCatProps) {
  const p = BREED_PALETTES[breed];
  const isWalking = mode === "walking";
  const isWaving = mode === "waving" || mode === "happy";
  const isSleeping = mode === "sleeping";

  // Quadruped alternating gait angles (degrees)
  const legSwingFL = isWalking ? Math.sin(phase) * 28 : 0;
  const legSwingBR = isWalking ? Math.sin(phase) * 26 : 0;
  const legSwingFR = isWalking ? -Math.sin(phase) * 28 : 0;
  const legSwingBL = isWalking ? -Math.sin(phase) * 26 : 0;

  const legLiftFL = isWalking ? Math.min(0, Math.cos(phase) * 3.5) : 0;
  const legLiftFR = isWalking ? Math.min(0, -Math.cos(phase) * 3.5) : 0;
  const legLiftBL = isWalking ? Math.min(0, -Math.cos(phase) * 3) : 0;
  const legLiftBR = isWalking ? Math.min(0, Math.cos(phase) * 3) : 0;

  // Body bounce & breathing
  const bodyBobY = isWalking
    ? -Math.abs(Math.sin(phase)) * 3.8
    : mode === "happy"
      ? -Math.abs(Math.sin(phase * 3)) * 8
      : Math.sin(phase * 1.6) * 1.4;

  // Head tilt & nod
  const headTilt = isWalking
    ? Math.sin(phase * 0.5) * 3.5
    : isWaving
      ? Math.sin(phase * 3) * 6
      : isSleeping
        ? 10
        : Math.sin(phase * 1.2) * 4;

  // Ear twitch
  const earTwitchL = Math.sin(phase * 2.3) > 0.85 ? -7 : 0;
  const earTwitchR = Math.cos(phase * 1.9) > 0.88 ? 8 : 0;

  // Tail wag angle
  const tailWag = isWalking
    ? Math.sin(phase * 0.65) * 18
    : isSleeping
      ? Math.sin(phase * 0.8) * 5
      : Math.sin(phase * 2.4) * 22;

  // Waving paw angle
  const waveAngle = isWaving ? Math.sin(phase * 6) * 24 : 0;

  // Natural SVG faces RIGHT (+X). Flip if facing left.
  const scaleX = facing === "left" ? -1 : 1;

  return (
    <svg
      viewBox="0 0 120 110"
      width={size}
      height={size}
      aria-hidden="true"
      style={{
        transform: `scaleX(${scaleX})`,
      }}
      className="overflow-visible select-none drop-shadow-[0_6px_10px_rgba(92,61,70,0.2)]"
    >
      {/* Soft ground shadow that pulses with body height */}
      <ellipse
        cx="58"
        cy="99"
        rx={isWalking ? 28 : 26}
        ry="5.5"
        fill="rgba(158, 136, 119, 0.22)"
      />

      <g
        style={{
          transform: `translateY(${ (isSleeping ? 6 : 0) + bodyBobY }px)`,
        }}
      >
        {/* FLUFFY SWISHING TAIL (anchored at rear hip 30, 74) */}
        <g
          style={{
            transformOrigin: "30px 74px",
            transform: `rotate(${tailWag}deg)`,
          }}
        >
          <path
            d="M 32 76 C 14 74, 6 56, 13 42 C 18 33, 28 36, 26 47 C 24 56, 28 66, 35 70 Z"
            fill={p.furMain}
            stroke={p.outline}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {p.accessory === "patches" && (
            <path
              d="M 13 44 C 16 36, 24 37, 25 45 C 21 47, 16 47, 13 44 Z"
              fill="#5D4037"
            />
          )}
        </g>

        {/* BACK LEFT LEG (far side) */}
        <g
          style={{
            transformOrigin: "38px 76px",
            transform: `translateY(${legLiftBL}px) rotate(${legSwingBL}deg)`,
          }}
        >
          <rect
            x="33"
            y="73"
            width="11"
            height="22"
            rx="5.5"
            fill={p.furShadow}
            stroke={p.outline}
            strokeWidth="2.3"
          />
          <ellipse cx="39" cy="93" rx="6" ry="3.5" fill={p.belly} />
        </g>

        {/* FRONT LEFT LEG (far side) */}
        {!isWaving && (
          <g
            style={{
              transformOrigin: "68px 75px",
              transform: `translateY(${legLiftFL}px) rotate(${legSwingFL}deg)`,
            }}
          >
            <rect
              x="63"
              y="72"
              width="11"
              height="23"
              rx="5.5"
              fill={p.furShadow}
              stroke={p.outline}
              strokeWidth="2.3"
            />
            <ellipse cx="69" cy="93" rx="6" ry="3.5" fill={p.belly} />
          </g>
        )}

        {/* PLUMP CHIBI TORSO */}
        <path
          d="M 30 68 C 28 55, 42 50, 58 51 C 74 52, 82 59, 80 73 C 79 84, 68 86, 54 86 C 39 86, 31 81, 30 68 Z"
          fill={p.furMain}
          stroke={p.outline}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Calico / Galaxy markings on torso */}
        {p.accessory === "patches" && (
          <>
            <path
              d="M 38 53 C 45 51, 52 54, 49 62 C 44 65, 37 61, 38 53 Z"
              fill="#FFB74D"
            />
            <path
              d="M 31 64 C 36 62, 41 67, 38 74 C 33 75, 30 70, 31 64 Z"
              fill="#5D4037"
            />
          </>
        )}

        {/* Soft cream belly & chest fluff */}
        <path
          d="M 46 66 C 54 62, 69 62, 76 70 C 75 81, 66 84, 54 84 C 46 84, 43 76, 46 66 Z"
          fill={p.belly}
        />

        {p.accessory === "moon" && (
          <g fill="#FFF59D">
            <circle cx="42" cy="64" r="1.5" />
            <circle cx="49" cy="70" r="1" />
            <circle cx="37" cy="73" r="1.2" />
            <path d="M 67 66 A 5 5 0 1 1 62 73 A 4 4 0 1 0 67 66 Z" fill="#FFD54F" />
          </g>
        )}

        {/* BACK RIGHT LEG (near side) */}
        <g
          style={{
            transformOrigin: "44px 77px",
            transform: `translateY(${legLiftBR}px) rotate(${legSwingBR}deg)`,
          }}
        >
          <rect
            x="38"
            y="74"
            width="12"
            height="22"
            rx="6"
            fill={p.furMain}
            stroke={p.outline}
            strokeWidth="2.4"
          />
          <ellipse cx="45" cy="94" rx="6.2" ry="3.5" fill={p.belly} />
          <circle cx="47" cy="94" r="1.6" fill={p.earInner} />
        </g>

        {/* FRONT RIGHT LEG (near side - or WAVING PAW when waving/happy!) */}
        {isWaving ? (
          <g
            style={{
              transformOrigin: "71px 68px",
              transform: `rotate(${-38 + waveAngle}deg)`,
            }}
          >
            <rect
              x="66"
              y="52"
              width="12"
              height="22"
              rx="6"
              fill={p.furMain}
              stroke={p.outline}
              strokeWidth="2.4"
            />
            {/* Cute pink paw pad waving */}
            <circle cx="72" cy="56" r="3.2" fill={p.earInner} />
            <circle cx="69" cy="52.5" r="1.3" fill={p.earInner} />
            <circle cx="72" cy="51.5" r="1.3" fill={p.earInner} />
            <circle cx="75" cy="52.5" r="1.3" fill={p.earInner} />
          </g>
        ) : (
          <g
            style={{
              transformOrigin: "62px 77px",
              transform: `translateY(${legLiftFR}px) rotate(${legSwingFR}deg)`,
            }}
          >
            <rect
              x="56"
              y="74"
              width="12"
              height="22"
              rx="6"
              fill={p.furMain}
              stroke={p.outline}
              strokeWidth="2.4"
            />
            <ellipse cx="63" cy="94" rx="6.2" ry="3.5" fill={p.belly} />
            <circle cx="65" cy="94" r="1.6" fill={p.earInner} />
          </g>
        )}

        {/* NECK ACCESSORIES (Bow or Golden Bell Collar) */}
        {p.accessory === "bell" && (
          <g>
            <path
              d="M 55 58 Q 66 64 76 57"
              fill="none"
              stroke="#F06292"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle
              cx="68"
              cy="63"
              r="4.5"
              fill="#FFD54F"
              stroke={p.outline}
              strokeWidth="1.8"
            />
            <line
              x1="66"
              y1="64"
              x2="70"
              y2="64"
              stroke={p.outline}
              strokeWidth="1.4"
            />
          </g>
        )}

        {p.accessory === "bow" && (
          <g transform="translate(67, 61)">
            <path
              d="M 0 0 L -8 -5 L -7 5 Z M 0 0 L 8 -5 L 7 5 Z"
              fill="#CE93D8"
              stroke={p.outline}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle
              cx="0"
              cy="0"
              r="2.8"
              fill="#BA68C8"
              stroke={p.outline}
              strokeWidth="1.6"
            />
          </g>
        )}

        {/* ANIME CAT HEAD (anchored at neck 64, 54) */}
        <g
          style={{
            transformOrigin: "64px 54px",
            transform: `rotate(${headTilt}deg)`,
          }}
        >
          {/* LEFT EAR */}
          <g
            style={{
              transformOrigin: "50px 26px",
              transform: `rotate(${earTwitchL}deg)`,
            }}
          >
            <path
              d="M 42 30 L 38 9 L 58 21 Z"
              fill={p.furMain}
              stroke={p.outline}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M 43 27 L 41 13 L 54 22 Z" fill={p.earInner} />
          </g>

          {/* RIGHT EAR */}
          <g
            style={{
              transformOrigin: "78px 26px",
              transform: `rotate(${earTwitchR}deg)`,
            }}
          >
            <path
              d="M 70 21 L 90 9 L 86 31 Z"
              fill={p.accessory === "patches" ? "#5D4037" : p.furMain}
              stroke={p.outline}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M 73 22 L 87 13 L 84 28 Z" fill={p.earInner} />
          </g>

          {/* FLUFFY CHEEK HEAD SHAPE */}
          <path
            d="M 38 38 C 36 24, 49 17, 64 17 C 79 17, 91 24, 90 38 C 94 42, 93 49, 87 52 C 83 58, 74 60, 64 60 C 53 60, 44 58, 40 52 C 34 49, 34 42, 38 38 Z"
            fill={p.furMain}
            stroke={p.outline}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Calico head patch */}
          {p.accessory === "patches" && (
            <path
              d="M 42 24 C 48 18, 57 18, 58 26 C 53 31, 44 30, 42 24 Z"
              fill="#FFB74D"
            />
          )}

          {/* Forehead fluff tuft */}
          <path
            d="M 60 18 Q 64 12 67 18"
            fill="none"
            stroke={p.outline}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Rosy anime blush cheeks */}
          <ellipse cx="46" cy="46" rx="5.2" ry="3" fill={p.blush} opacity="0.55" />
          <ellipse cx="83" cy="46" rx="5.2" ry="3" fill={p.blush} opacity="0.55" />

          {/* ANIME EYES (Blink / Sleep / Wink / Glossy Open) */}
          {isSleeping || isBlinking ? (
            <g
              fill="none"
              stroke={p.outline}
              strokeWidth="2.6"
              strokeLinecap="round"
            >
              <path d="M 47 40 Q 53 45 59 40" />
              <path d="M 71 40 Q 77 45 83 40" />
            </g>
          ) : isWaving ? (
            <>
              {/* Happy winking left eye */}
              <path
                d="M 47 41 Q 53 34 59 41"
                fill="none"
                stroke={p.outline}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* Big glossy right anime eye */}
              <g>
                <ellipse cx="77" cy="39" rx="6.2" ry="7.2" fill={p.eyeUpper} />
                <path
                  d="M 71.5 41 A 5.8 6 0 0 0 82.5 41 Z"
                  fill={p.eyeLower}
                />
                <circle cx="74.5" cy="36" r="2.5" fill="#FFFFFF" />
                <circle cx="79.5" cy="42" r="1.2" fill="#FFFFFF" />
              </g>
            </>
          ) : (
            <>
              {/* Left glossy anime eye */}
              <g>
                <ellipse cx="53" cy="39" rx="6.2" ry="7.2" fill={p.eyeUpper} />
                <path
                  d="M 47.5 41 A 5.8 6 0 0 0 58.5 41 Z"
                  fill={p.eyeLower}
                />
                <circle cx="50.5" cy="36" r="2.5" fill="#FFFFFF" />
                <circle cx="55.5" cy="42" r="1.2" fill="#FFFFFF" />
              </g>
              {/* Right glossy anime eye */}
              <g>
                <ellipse cx="77" cy="39" rx="6.2" ry="7.2" fill={p.eyeUpper} />
                <path
                  d="M 71.5 41 A 5.8 6 0 0 0 82.5 41 Z"
                  fill={p.eyeLower}
                />
                <circle cx="74.5" cy="36" r="2.5" fill="#FFFFFF" />
                <circle cx="79.5" cy="42" r="1.2" fill="#FFFFFF" />
              </g>
            </>
          )}

          {/* Tiny pink nose */}
          <polygon points="63,43 67,43 65,45.8" fill="#FF85A2" />

          {/* Cute "ω" cat mouth + tiny pink tongue when happy/walking */}
          <path
            d="M 60 47.5 Q 62.5 50.5 65 47.5 Q 67.5 50.5 70 47.5"
            fill="none"
            stroke={p.outline}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {(isWalking || isWaving) && !isSleeping && (
            <path
              d="M 63 48.8 Q 65 53.5 67 48.8 Z"
              fill="#FF8DA1"
              stroke={p.outline}
              strokeWidth="1.2"
            />
          )}

          {/* Whiskers */}
          <g stroke={p.outline} strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
            <line x1="37" y1="43" x2="29" y2="41" />
            <line x1="37" y1="47" x2="29" y2="48" />
            <line x1="91" y1="43" x2="99" y2="41" />
            <line x1="91" y1="47" x2="99" y2="48" />
          </g>

          {/* Floating kawaii expression badges */}
          {(p.accessory === "heart" || mode === "happy") && !isSleeping && (
            <path
              d="M 96 24 C 96 21, 92 21, 92 24 C 92 21, 88 21, 88 24 C 88 27, 92 30, 92 31 C 92 30, 96 27, 96 24 Z"
              fill="#FF6B9D"
            />
          )}

          {isSleeping && (
            <g fill="#8E7CC3" fontWeight="bold" fontSize="10">
              <text x="88" y="22">z</text>
              <text x="95" y="14" fontSize="12">Z</text>
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}

interface RoamingKittyConfig {
  id: string;
  name: string;
  quote: string;
  breed: CatBreed;
  col: number;
  row: number;
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
  blinkTimerSec: number;
  isBlinking: boolean;
  footsteps: FootstepPrint[];
}

const ROAMING_KITTIES: RoamingKittyConfig[] = [
  {
    id: "sakura-kitty",
    name: "น้องซากุระชมพู",
    quote: "เมี๊ยว~ เกมแท้ราคาน่ารักทุกเกมเลยน้า!",
    breed: "sakura",
    col: 1,
    row: 3,
    size: 82,
    mobileSize: 54,
    showOnMobile: true,
    initialX: 10,
    initialY: 88,
    initialTargetX: 78,
    initialTargetY: 84,
    speedPctPerSec: 4.5,
  },
  {
    id: "lavender-bow",
    name: "น้องโบว์ม่วงพาสเทล",
    quote: "จิ้มเลือกดูหมวดเกมหรือแอปด้านบนได้เลยค่า~",
    breed: "lavender",
    col: 0,
    row: 3,
    size: 80,
    mobileSize: 52,
    showOnMobile: true,
    initialX: 86,
    initialY: 16,
    initialTargetX: 14,
    initialTargetY: 22,
    speedPctPerSec: 4.0,
  },
  {
    id: "calico-walker",
    name: "น้องสามสีเดินทัวร์",
    quote: "ย่ำต๊อกๆ มาช่วยเช็กเรทราคาเกมแล้วเมี๊ยว~",
    breed: "calico",
    col: 0,
    row: 4,
    size: 82,
    mobileSize: 54,
    showOnMobile: true,
    initialX: 48,
    initialY: 90,
    initialTargetX: 12,
    initialTargetY: 62,
    speedPctPerSec: 4.8,
  },
  {
    id: "mint-bell",
    name: "น้องกระดิ่งมินต์",
    quote: "น้องแมวมาเดินทัวร์เป็นเพื่อนเลือกเกมน้า~",
    breed: "mint",
    col: 3,
    row: 3,
    size: 78,
    mobileSize: 50,
    showOnMobile: false,
    initialX: 84,
    initialY: 70,
    initialTargetX: 18,
    initialTargetY: 34,
    speedPctPerSec: 4.2,
  },
  {
    id: "sky-fluffy",
    name: "น้องฟ้าปุยเมฆ",
    quote: "รองรับทั้ง iOS และ Android เช็กเรทไวสุดๆ เมี๊ยว!",
    breed: "sky",
    col: 2,
    row: 3,
    size: 80,
    mobileSize: 50,
    showOnMobile: false,
    initialX: 12,
    initialY: 42,
    initialTargetX: 82,
    initialTargetY: 78,
    speedPctPerSec: 3.9,
  },
  {
    id: "galaxy-star",
    name: "น้องกาแล็กซีดาววิ้ง",
    quote: "แอปแท้ Procreate & ibisPaint X ก็มีน้า~",
    breed: "galaxy",
    col: 5,
    row: 3,
    size: 78,
    mobileSize: 50,
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
      blinkTimerSec: 1.5 + idx * 0.6,
      isBlinking: false,
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

          // Natural eye blink cycle
          let nextBlinkTimer = state.blinkTimerSec - dt;
          let nextIsBlinking = state.isBlinking;
          if (nextBlinkTimer <= 0) {
            if (nextIsBlinking) {
              nextIsBlinking = false;
              nextBlinkTimer = 2.4 + ((idx * 1.1 + tickCountRef.current * 0.1) % 2.5);
            } else {
              nextIsBlinking = true;
              nextBlinkTimer = 0.16;
            }
          }

          // Non-walking behaviors (sitting, waving, sleeping, happy)
          if (state.mode !== "walking") {
            const nextRemaining = state.modeRemainingSec - dt;
            if (nextRemaining > 0) {
              return {
                ...state,
                modeRemainingSec: nextRemaining,
                stepPhase: state.stepPhase + dt * 2.6,
                blinkTimerSec: nextBlinkTimer,
                isBlinking: nextIsBlinking,
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
              blinkTimerSec: nextBlinkTimer,
              isBlinking: nextIsBlinking,
            };
          }

          // Walking toward targetX, targetY
          const dx = state.targetX - state.x;
          const dy = state.targetY - state.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 1.2) {
            // Reached destination! Pick a natural cat idle pose: wave paw, sit, or nap
            const roll = (tickCountRef.current + idx) % 5;
            const idleMode: CatBehaviorMode =
              roll === 0 ? "sleeping" : roll <= 2 ? "waving" : "sitting";
            const duration =
              idleMode === "sleeping"
                ? 4.2
                : 2.2 + ((idx * 0.7 + tickCountRef.current) % 1.8);
            return {
              ...state,
              mode: idleMode,
              modeRemainingSec: duration,
              blinkTimerSec: nextBlinkTimer,
              isBlinking: nextIsBlinking,
            };
          }

          const moveDist = config.speedPctPerSec * dt;
          const ratio = Math.min(1, moveDist / dist);
          const nextX = state.x + dx * ratio;
          const nextY = state.y + dy * ratio;
          const nextFacing =
            Math.abs(dx) > 0.2 ? (dx > 0 ? "right" : "left") : state.facing;

          const prevStrideIndex = Math.floor(state.stepPhase / Math.PI);
          const nextPhase = state.stepPhase + dt * 11;
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
            blinkTimerSec: nextBlinkTimer,
            isBlinking: nextIsBlinking,
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
        data-sprites="/cats/cat_3_1.png,/cats/cat_4_0.png"
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
                  opacity: ((fpIdx + 1) / (live.footsteps.length + 1)) * 0.35,
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
                          ? { ...item, mode: "happy", modeRemainingSec: 3.4 }
                          : item,
                      ),
                    );
                  }}
                  aria-label={`ทักทาย${kitty.name}`}
                  className="pointer-events-auto group relative flex items-center justify-center p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]"
                >
                  <ArticulatedKawaiiCat
                    breed={kitty.breed}
                    mode={live.mode}
                    phase={live.stepPhase}
                    isBlinking={live.isBlinking}
                    facing={live.facing}
                    size={spriteSize}
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
