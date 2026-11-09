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
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b81452]"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="ค้นหาชื่อเกมหรือแอป"
        className="h-12 w-full rounded-full border-2 border-[#F8BBD0]/75 bg-[#FFFDF9] pl-11 pr-11 text-base font-medium text-[#4a352c] placeholder:text-[#7c6155] shadow-[0_6px_18px_-10px_rgba(158,136,119,0.2)] transition-colors duration-200 focus:border-[#f06292] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F8BBD0]/50"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="ล้างคำค้นหา"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#FCE4EC] text-[#6d5246] transition-colors hover:bg-[#F8BBD0] hover:text-[#4a352c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d68]"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
