import React from "react";

export interface CatMascotProps {
  variant?: "hero" | "empty" | "admin" | "badge";
  className?: string;
  label?: string;
}

export function CatMascot({ variant = "hero", className = "", label }: CatMascotProps) {
  return <div data-variant={variant} className={className} aria-label={label} />;
}
