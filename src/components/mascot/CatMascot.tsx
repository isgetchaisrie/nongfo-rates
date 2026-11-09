import React from "react";

export interface CatMascotProps {
  variant?: "hero" | "empty" | "admin" | "badge";
  className?: string;
  label?: string;
}

const DEFAULT_LABELS: Record<NonNullable<CatMascotProps["variant"]>, string> = {
  hero: "น้องแมว Nongfo สวมหูฟังถือเครื่องเกมพกพา",
  empty: "น้องแมว Nongfo กำลังส่องแว่นขยายหาเกม",
  admin: "น้องแมวแอดมิน Nongfo สวมแว่นถือสมุดเช็กเรทราคา",
  badge: "สัญลักษณ์น้องแมว Nongfo",
};

export function PawSparkle({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cute main paw pad */}
      <path
        d="M18 17.5C14.4 17.5 11.5 20.1 11.5 23.2C11.5 25.6 13.6 27 15.8 27C16.8 27 17.4 26.6 18 26.6C18.6 26.6 19.2 27 20.2 27C22.4 27 24.5 25.6 24.5 23.2C24.5 20.1 21.6 17.5 18 17.5Z"
        fill="#FF85B3"
      />
      {/* Toe beans */}
      <ellipse cx="11.2" cy="15.5" rx="2.3" ry="3" transform="rotate(-20 11.2 15.5)" fill="#FF85B3" />
      <ellipse cx="15.6" cy="12.8" rx="2.3" ry="3.1" transform="rotate(-6 15.6 12.8)" fill="#FF85B3" />
      <ellipse cx="20.4" cy="12.8" rx="2.3" ry="3.1" transform="rotate(6 20.4 12.8)" fill="#FF85B3" />
      <ellipse cx="24.8" cy="15.5" rx="2.3" ry="3" transform="rotate(20 24.8 15.5)" fill="#FF85B3" />
      {/* Tiny 4-point sparkle accent */}
      <path
        d="M29.5 5.5L30.4 8.1L33 9L30.4 9.9L29.5 12.5L28.6 9.9L26 9L28.6 8.1L29.5 5.5Z"
        fill="#E11D68"
      />
    </svg>
  );
}

export function PawDivider({ className = "w-full max-w-xs mx-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-2 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-[#ffd6e5]" />
      <PawSparkle className="w-4 h-4 opacity-80" />
      <PawSparkle className="w-5 h-5" />
      <PawSparkle className="w-4 h-4 opacity-80" />
      <span className="h-px flex-1 bg-[#ffd6e5]" />
    </div>
  );
}

export function CatMascot({
  variant = "hero",
  className = "",
  label,
}: CatMascotProps) {
  const accessibleLabel = label ?? DEFAULT_LABELS[variant];

  if (variant === "badge") {
    return (
      <svg
        data-variant="badge"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={accessibleLabel}
        className={className}
      >
        <title>{accessibleLabel}</title>
        <circle cx="32" cy="32" r="30" fill="#FFF0F6" stroke="#FFC2DA" strokeWidth="2.5" />
        {/* Left & Right Cat Ears */}
        <path
          d="M14 28L11 12C10.8 10.6 12.3 9.7 13.5 10.5L26 19Z"
          fill="#FFFFFF"
          stroke="#2D1622"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M50 28L53 12C53.2 10.6 51.7 9.7 50.5 10.5L38 19Z"
          fill="#FFD6E5"
          stroke="#2D1622"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M15 24L13.5 14.5L22 20.5Z" fill="#FF85B3" />
        <path d="M49 24L50.5 14.5L42 20.5Z" fill="#FF85B3" />
        {/* Head */}
        <ellipse
          cx="32"
          cy="35"
          rx="19"
          ry="16.5"
          fill="#FFFFFF"
          stroke="#2D1622"
          strokeWidth="2.5"
        />
        {/* Strawberry Calico Ear Patch */}
        <path
          d="M36 18.8C43.5 19.5 49.5 24.5 50.6 31.5C45 32.5 39.5 29.5 36 18.8Z"
          fill="#FFD6E5"
        />
        {/* Eyes */}
        <circle cx="24.5" cy="34" r="2.7" fill="#2D1622" />
        <circle cx="23.7" cy="33" r="0.9" fill="#FFFFFF" />
        <circle cx="39.5" cy="34" r="2.7" fill="#2D1622" />
        <circle cx="38.7" cy="33" r="0.9" fill="#FFFFFF" />
        {/* Rosy Cheeks */}
        <ellipse cx="19.5" cy="38" rx="3.2" ry="1.8" fill="#FF85B3" opacity="0.65" />
        <ellipse cx="44.5" cy="38" rx="3.2" ry="1.8" fill="#FF85B3" opacity="0.65" />
        {/* Cute Nose & w-Mouth */}
        <path d="M30.5 36.2H33.5L32 38Z" fill="#E11D68" />
        <path
          d="M28.5 39.2C29.5 40.8 31.5 40.5 32 38.8C32.5 40.5 34.5 40.8 35.5 39.2"
          stroke="#2D1622"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Whiskers */}
        <path
          d="M11 34H16M11.5 38L16.5 37.5M53 34H48M52.5 38L47.5 37.5"
          stroke="#2D1622"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "empty") {
    return (
      <svg
        data-variant="empty"
        viewBox="0 0 220 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={accessibleLabel}
        className={className}
      >
        <title>{accessibleLabel}</title>
        {/* Soft background aura */}
        <ellipse cx="110" cy="146" rx="78" ry="18" fill="#FFD6E5" opacity="0.55" />
        {/* Floating question/paw sparkles */}
        <circle cx="44" cy="54" r="5" fill="#FF85B3" opacity="0.5" />
        <circle cx="176" cy="48" r="4" fill="#E11D68" opacity="0.35" />
        <path
          d="M164 28L165.5 32.5L170 34L165.5 35.5L164 40L162.5 35.5L158 34L162.5 32.5L164 28Z"
          fill="#FF85B3"
        />
        {/* Pastel Cushion */}
        <rect
          x="36"
          y="112"
          width="148"
          height="38"
          rx="19"
          fill="#FFF0F6"
          stroke="#2D1622"
          strokeWidth="3"
        />
        <path
          d="M52 131H168"
          stroke="#FFC2DA"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 8"
        />
        {/* Cat Ears */}
        <path
          d="M70 68L62 36C61.5 33.5 64 31.8 66 33.2L90 52Z"
          fill="#FFFFFF"
          stroke="#2D1622"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M150 68L158 36C158.5 33.5 156 31.8 154 33.2L130 52Z"
          fill="#FFD6E5"
          stroke="#2D1622"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M72 61L67 41L84 53Z" fill="#FF85B3" />
        <path d="M148 61L153 41L136 53Z" fill="#FF85B3" />
        {/* Cat Head Peeking Over Cushion */}
        <path
          d="M62 88C62 63 82 48 110 48C138 48 158 63 158 88C158 102 150 114 138 118H82C70 114 62 102 62 88Z"
          fill="#FFFFFF"
          stroke="#2D1622"
          strokeWidth="3"
        />
        {/* Calico Strawberry Patch */}
        <path
          d="M118 49C138 51 153 63 156 81C142 83 127 74 118 49Z"
          fill="#FFD6E5"
        />
        {/* Curious / Sleepy Expressive Eyes */}
        <circle cx="91" cy="83" r="5" fill="#2D1622" />
        <circle cx="89.5" cy="81" r="1.8" fill="#FFFFFF" />
        <circle cx="129" cy="83" r="5" fill="#2D1622" />
        <circle cx="127.5" cy="81" r="1.8" fill="#FFFFFF" />
        {/* Rosy Cheeks */}
        <ellipse cx="79" cy="91" rx="6" ry="3.4" fill="#FF85B3" opacity="0.65" />
        <ellipse cx="141" cy="91" rx="6" ry="3.4" fill="#FF85B3" opacity="0.65" />
        {/* Cute Nose & Mouth */}
        <path d="M107 87H113L110 90.5Z" fill="#E11D68" />
        <path
          d="M103 93.5C105 96 109 95.5 110 92.5C111 95.5 115 96 117 93.5"
          stroke="#2D1622"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Paws resting on cushion */}
        <ellipse
          cx="82"
          cy="116"
          rx="12"
          ry="8"
          fill="#FFFFFF"
          stroke="#2D1622"
          strokeWidth="3"
        />
        <ellipse
          cx="138"
          cy="116"
          rx="12"
          ry="8"
          fill="#FFFFFF"
          stroke="#2D1622"
          strokeWidth="3"
        />
        {/* Cute Magnifying Glass searching for games */}
        <g transform="translate(132, 68)">
          <line
            x1="24"
            y1="24"
            x2="38"
            y2="38"
            stroke="#E11D68"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle
            cx="14"
            cy="14"
            r="14"
            fill="#FFF0F6"
             fillOpacity="0.8"
            stroke="#2D1622"
            strokeWidth="3"
          />
          <path
            d="M8 9C10 7 13 6.5 16 7.5"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  if (variant === "admin") {
    return (
      <svg
        data-variant="admin"
        viewBox="0 0 220 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={accessibleLabel}
        className={className}
      >
        <title>{accessibleLabel}</title>
        <circle cx="110" cy="104" r="78" fill="#FFF0F6" stroke="#FFD6E5" strokeWidth="3" />
        {/* Cat Ears */}
        <path
          d="M68 68L60 32C59.5 29.5 62.2 28 64.2 29.5L90 50Z"
          fill="#FFFFFF"
          stroke="#2D1622"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M152 68L160 32C160.5 29.5 157.8 28 155.8 29.5L130 50Z"
          fill="#FFD6E5"
          stroke="#2D1622"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M70 60L65 38L84 52Z" fill="#FF85B3" />
        <path d="M150 60L155 38L136 52Z" fill="#FF85B3" />
        {/* Body */}
        <path
          d="M72 132C72 114 88 106 110 106C132 106 148 114 148 132V168H72V132Z"
          fill="#FFFFFF"
          stroke="#2D1622"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Head */}
        <ellipse
          cx="110"
          cy="82"
          rx="46"
          ry="38"
          fill="#FFFFFF"
          stroke="#2D1622"
          strokeWidth="3"
        />
        {/* Strawberry Calico Patch */}
        <path
          d="M118 45C138 47 152 59 155 77C140 79 126 70 118 45Z"
          fill="#FFD6E5"
        />
        {/* Eyes */}
        <circle cx="92" cy="80" r="4.8" fill="#2D1622" />
        <circle cx="90.5" cy="78.2" r="1.6" fill="#FFFFFF" />
        <circle cx="128" cy="80" r="4.8" fill="#2D1622" />
        <circle cx="126.5" cy="78.2" r="1.6" fill="#FFFFFF" />
        {/* Studious Round Glasses */}
        <circle
          cx="92"
          cy="80"
          r="12"
          stroke="#E11D68"
          strokeWidth="2.8"
          fill="#FFF0F6"
          fillOpacity="0.25"
        />
        <circle
          cx="128"
          cy="80"
          r="12"
          stroke="#E11D68"
          strokeWidth="2.8"
          fill="#FFF0F6"
          fillOpacity="0.25"
        />
        <path d="M104 80H116" stroke="#E11D68" strokeWidth="2.8" strokeLinecap="round" />
        {/* Cheeks & Smile */}
        <ellipse cx="76" cy="89" rx="5.5" ry="3" fill="#FF85B3" opacity="0.65" />
        <ellipse cx="144" cy="89" rx="5.5" ry="3" fill="#FF85B3" opacity="0.65" />
        <path d="M107 86H113L110 89.2Z" fill="#E11D68" />
        <path
          d="M103 92C105 94.5 109 94 110 91.5C111 94 115 94.5 117 92"
          stroke="#2D1622"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Pastel Berry Bow Tie */}
        <path
          d="M96 116L110 123L96 130V116ZM124 116L110 123L124 130V116Z"
          fill="#E11D68"
          stroke="#2D1622"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <circle cx="110" cy="123" r="3.8" fill="#FF85B3" stroke="#2D1622" strokeWidth="2" />
        {/* Rate Clipboard */}
        <g transform="translate(122, 114)">
          <rect
            x="0"
            y="6"
            width="42"
            height="52"
            rx="7"
            fill="#FFF0F6"
            stroke="#2D1622"
            strokeWidth="2.8"
          />
          <rect
            x="12"
            y="1"
            width="18"
            height="9"
            rx="4"
            fill="#FF85B3"
            stroke="#2D1622"
            strokeWidth="2.4"
          />
          <line x1="9" y1="22" x2="33" y2="22" stroke="#E11D68" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="9" y1="32" x2="29" y2="32" stroke="#6E485B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="9" y1="42" x2="25" y2="42" stroke="#0F5137" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // Default: "hero" variant — Cute white & strawberry-pink cat wearing pastel pink headphones, holding a handheld game console
  return (
    <svg
      data-variant="hero"
      viewBox="0 0 260 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={accessibleLabel}
      className={className}
    >
      <title>{accessibleLabel}</title>
      {/* Soft Strawberry Milk Halo */}
      <circle cx="130" cy="124" r="94" fill="#FFF0F6" stroke="#FFC2DA" strokeWidth="3" />
      <circle cx="130" cy="124" r="80" fill="#FFFFFF" opacity="0.7" />

      {/* Floating Paw & Sparkle Accents */}
      <g transform="translate(22, 40)">
        <circle cx="12" cy="14" r="4.5" fill="#FF85B3" />
        <circle cx="6" cy="7" r="2.2" fill="#FF85B3" />
        <circle cx="12" cy="5" r="2.2" fill="#FF85B3" />
        <circle cx="18" cy="7" r="2.2" fill="#FF85B3" />
      </g>
      <g transform="translate(208, 48)">
        <path
          d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
          fill="#E11D68"
        />
      </g>

      {/* Fluffy Tail wagging */}
      <path
        d="M174 176C198 174 214 156 208 138C204 126 190 132 188 144C186 154 178 160 168 162"
        fill="#FFD6E5"
        stroke="#2D1622"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Pastel Headphone Band */}
      <path
        d="M66 96C66 54 94 28 130 28C166 28 194 54 194 96"
        stroke="#FF85B3"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M66 96C66 54 94 28 130 28C166 28 194 54 194 96"
        stroke="#2D1622"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Cat Ears */}
      <path
        d="M78 78L68 36C67.3 33 70.6 30.8 73.2 32.6L104 56Z"
        fill="#FFFFFF"
        stroke="#2D1622"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M182 78L192 36C192.7 33 189.4 30.8 186.8 32.6L156 56Z"
        fill="#FFD6E5"
        stroke="#2D1622"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path d="M81 69L74 43L97 59Z" fill="#FF85B3" />
      <path d="M179 69L186 43L163 59Z" fill="#FF85B3" />

      {/* Cat Body */}
      <path
        d="M82 146C82 124 102 114 130 114C158 114 178 124 178 146V190C178 198 171 204 162 204H98C89 204 82 198 82 190V146Z"
        fill="#FFFFFF"
        stroke="#2D1622"
        strokeWidth="3.2"
      />
      {/* Belly Patch */}
      <ellipse cx="130" cy="166" rx="28" ry="24" fill="#FFF0F6" />

      {/* Cat Head */}
      <ellipse
        cx="130"
        cy="94"
        rx="54"
        ry="44"
        fill="#FFFFFF"
        stroke="#2D1622"
        strokeWidth="3.2"
      />
      {/* Strawberry Calico Patch on Forehead/Ear */}
      <path
        d="M138 51C162 53 179 67 183 89C165 92 148 80 138 51Z"
        fill="#FFD6E5"
      />
      {/* Cute Ear Tufts */}
      <path
        d="M124 50C127 44 133 44 136 50"
        stroke="#2D1622"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Headphone Ear Cups */}
      <rect
        x="58"
        y="78"
        width="18"
        height="34"
        rx="9"
        fill="#E11D68"
        stroke="#2D1622"
        strokeWidth="3.2"
      />
      <rect
        x="184"
        y="78"
        width="18"
        height="34"
        rx="9"
        fill="#E11D68"
        stroke="#2D1622"
        strokeWidth="3.2"
      />
      <circle cx="67" cy="95" r="4" fill="#FFD6E5" />
      <circle cx="193" cy="95" r="4" fill="#FFD6E5" />

      {/* Expressive Sparkly Eyes */}
      <circle cx="108" cy="93" r="6.2" fill="#2D1622" />
      <circle cx="106" cy="90.8" r="2.2" fill="#FFFFFF" />
      <circle cx="110.5" cy="95.5" r="1.1" fill="#FFFFFF" />

      <circle cx="152" cy="93" r="6.2" fill="#2D1622" />
      <circle cx="150" cy="90.8" r="2.2" fill="#FFFFFF" />
      <circle cx="154.5" cy="95.5" r="1.1" fill="#FFFFFF" />

      {/* Rosy Pastel Cheeks */}
      <ellipse cx="92" cy="103" rx="7.5" ry="4.2" fill="#FF85B3" opacity="0.7" />
      <ellipse cx="168" cy="103" rx="7.5" ry="4.2" fill="#FF85B3" opacity="0.7" />

      {/* Cute Pink Nose & Happy Mouth */}
      <path d="M126.5 98.5H133.5L130 102.5Z" fill="#E11D68" />
      <path
        d="M122 105C124.5 108.5 129 108 130 104.5C131 108 135.5 108.5 138 105"
        stroke="#2D1622"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Whiskers */}
      <path
        d="M78 96L87 97M79 104L88 103M182 96L173 97M181 104L172 103"
        stroke="#2D1622"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Handheld Game Console in Paws */}
      <g transform="translate(88, 138)">
        <rect
          x="0"
          y="0"
          width="84"
          height="42"
          rx="14"
          fill="#FF85B3"
          stroke="#2D1622"
          strokeWidth="3.2"
        />
        <rect
          x="22"
          y="7"
          width="40"
          height="28"
          rx="6"
          fill="#FFF6F9"
          stroke="#2D1622"
          strokeWidth="2.4"
        />
        {/* D-pad */}
        <path
          d="M11 16V26M6 21H16"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Action Buttons */}
        <circle cx="71" cy="17" r="2.8" fill="#FFFFFF" />
        <circle cx="75" cy="24" r="2.8" fill="#E11D68" />
        {/* Heart on Console Screen */}
        <path
          d="M42 25C42 25 35 20.5 35 16.8C35 14.8 36.6 13.5 38.5 13.5C39.9 13.5 41.2 14.3 42 15.5C42.8 14.3 44.1 13.5 45.5 13.5C47.4 13.5 49 14.8 49 16.8C49 20.5 42 25 42 25Z"
          fill="#E11D68"
        />
      </g>

      {/* Cute Paws Holding Console */}
      <ellipse
        cx="90"
        cy="159"
        rx="11"
        ry="8.5"
        fill="#FFFFFF"
        stroke="#2D1622"
        strokeWidth="3"
      />
      <ellipse
        cx="170"
        cy="159"
        rx="11"
        ry="8.5"
        fill="#FFFFFF"
        stroke="#2D1622"
        strokeWidth="3"
      />
    </svg>
  );
}
