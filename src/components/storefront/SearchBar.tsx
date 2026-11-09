"use client";

import React from "react";
import { Search, X } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "ค้นหาชื่อเกมหรือแอป เช่น Stardew, Procreate...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a35c7d]"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="ค้นหาชื่อเกมหรือแอป"
        className="h-12 w-full rounded-2xl border border-[#ffd6e5] bg-white pl-11 pr-11 text-base font-medium text-[#2d1622] placeholder:text-[#6e485b] shadow-[0_6px_18px_-10px_rgba(225,29,104,0.18)] transition-colors duration-200 focus:border-[#e11d68] focus:outline-none focus:ring-2 focus:ring-[#e11d68]/25"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="ล้างคำค้นหา"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff0f6] text-[#6e485b] transition-colors hover:bg-[#ffd6e5] hover:text-[#2d1622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
