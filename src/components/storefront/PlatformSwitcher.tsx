"use client";

import React from "react";
import type { FilterPlatform } from "./filterGames";

export interface PlatformSwitcherProps {
  value: FilterPlatform;
  onChange: (platform: FilterPlatform) => void;
  counts: Record<FilterPlatform, number>;
}

export function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.365 12.642c.018 2.09 1.832 2.785 1.852 2.794-.015.05-.29 1.002-.956 1.98-.576.846-1.174 1.689-2.115 1.706-.924.017-1.222-.55-2.28-.55-1.058 0-1.39.533-2.263.568-.906.034-1.599-.912-2.18-1.755-1.19-1.724-2.099-4.872-.878-6.996.606-1.054 1.69-1.722 2.866-1.739.895-.017 1.74.604 2.286.604.547 0 1.573-.747 2.651-.638.451.019 1.719.182 2.533 1.375-.066.041-1.512.885-1.496 2.651Zm-1.74-5.134c.483-.586.809-1.4.72-2.213-.696.028-1.539.464-2.039 1.05-.448.519-.84 1.35-.734 2.146.777.06 1.57-.396 2.053-.983Z" />
    </svg>
  );
}

export function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.523 15.341a.858.858 0 1 1 0-1.716.858.858 0 0 1 0 1.716Zm-11.046 0a.858.858 0 1 1 0-1.716.858.858 0 0 1 0 1.716Zm11.405-5.02 1.907-3.303a.396.396 0 0 0-.686-.396l-1.93 3.344a10.427 10.427 0 0 0-5.173-1.27 10.427 10.427 0 0 0-5.173 1.27L4.897 6.622a.396.396 0 0 0-.686.396l1.907 3.303C2.85 12.11.682 15.468.5 19.391h23c-.182-3.923-2.35-7.281-5.618-9.07Z" />
    </svg>
  );
}

function AllGridIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
  );
}

const TABS: Array<{
  id: FilterPlatform;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "all", label: "ทั้งหมด", Icon: AllGridIcon },
  { id: "ios", label: "iOS", Icon: AppleIcon },
  { id: "android", label: "Android", Icon: AndroidIcon },
];

export function PlatformSwitcher({
  value,
  onChange,
  counts,
}: PlatformSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="กรองตามระบบปฏิบัติการ"
      className="inline-flex flex-wrap items-center gap-2"
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = value === id;
        const count = counts[id] ?? 0;

        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(id)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68] focus-visible:ring-offset-2 sm:h-11 sm:gap-2 sm:px-4 sm:text-sm ${
              isActive
                ? "border-white bg-[#FCE4EC] text-[#4a352c] shadow-[0_6px_16px_-4px_rgba(244,143,177,0.5)]"
                : "border-[#F8BBD0]/60 bg-white/90 text-[#6d5246] hover:bg-[#FCE4EC]/50 hover:text-[#4a352c]"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-[#d81b60] sm:h-4 sm:w-4" />
            <span>{label}</span>
            <span
              className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 font-[var(--font-fredoka)] text-xs font-bold tabular-nums sm:min-w-6 sm:px-2 ${
                isActive
                  ? "bg-white text-[#b81452]"
                  : "bg-[#FCE4EC] text-[#b81452]"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
