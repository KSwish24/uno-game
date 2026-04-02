"use client";

import { Card, Color } from "@/lib/types";

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  red: { bg: "bg-red-600", border: "border-red-400", text: "text-white" },
  blue: { bg: "bg-blue-600", border: "border-blue-400", text: "text-white" },
  green: { bg: "bg-green-600", border: "border-green-400", text: "text-white" },
  yellow: { bg: "bg-yellow-400", border: "border-yellow-300", text: "text-gray-900" },
  wild: { bg: "bg-gray-900", border: "border-gray-600", text: "text-white" },
};

function cardLabel(card: Card): { top: string; center: string } {
  switch (card.type) {
    case "number":
      return { top: String(card.value), center: String(card.value) };
    case "skip":
      return { top: "\u00D8", center: "\u00D8" };
    case "reverse":
      return { top: "\u21C4", center: "\u21C4" };
    case "draw2":
      return { top: "+2", center: "+2" };
    case "wild":
      return { top: "", center: "W" };
    case "wild4":
      return { top: "+4", center: "+4" };
    default:
      return { top: "?", center: "?" };
  }
}

interface UnoCardProps {
  card: Card;
  onClick?: () => void;
  small?: boolean;
  currentColor?: Color | null;
}

export function UnoCard({ card, onClick, small, currentColor }: UnoCardProps) {
  const colors = COLOR_MAP[card.color] || COLOR_MAP.wild;
  const { top, center } = cardLabel(card);
  const isWild = card.type === "wild" || card.type === "wild4";

  const sizeClasses = small
    ? "w-[52px] h-[76px] text-xs"
    : "w-[72px] h-[104px] sm:w-[80px] sm:h-[116px] text-sm";

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        ${sizeClasses}
        relative rounded-xl border-2 ${colors.border} ${colors.bg} ${colors.text}
        flex flex-col items-center justify-center
        font-bold shadow-lg select-none
        transition-all duration-150
        ${onClick ? "cursor-pointer hover:brightness-110" : ""}
      `}
    >
      {/* Top-left label */}
      <span className={`absolute top-1 left-1.5 ${small ? "text-[10px]" : "text-xs"} font-extrabold`}>
        {top}
      </span>

      {/* Center */}
      <span className={`${small ? "text-xl" : "text-2xl sm:text-3xl"} font-black`}>
        {isWild ? (
          <WildIcon small={small} />
        ) : (
          center
        )}
      </span>

      {/* Bottom-right label */}
      <span className={`absolute bottom-1 right-1.5 ${small ? "text-[10px]" : "text-xs"} font-extrabold rotate-180`}>
        {top}
      </span>

      {/* Wild color indicator when played as top card */}
      {isWild && currentColor && (
        <div className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-white/50 ${COLOR_MAP[currentColor].bg}`} />
      )}
    </button>
  );
}

function WildIcon({ small }: { small?: boolean }) {
  const s = small ? 20 : 28;
  return (
    <svg width={s} height={s} viewBox="0 0 28 28">
      <path d="M14 0 L14 14 L0 14 Z" fill="#ef4444" />
      <path d="M14 0 L28 14 L14 14 Z" fill="#3b82f6" />
      <path d="M14 14 L28 14 L14 28 Z" fill="#eab308" />
      <path d="M0 14 L14 14 L14 28 Z" fill="#22c55e" />
    </svg>
  );
}

export function CardBack({ small, onClick }: { small?: boolean; onClick?: () => void }) {
  const sizeClasses = small
    ? "w-[52px] h-[76px]"
    : "w-[72px] h-[104px] sm:w-[80px] sm:h-[116px]";

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses}
        rounded-xl border-2 border-gray-500 bg-gray-800
        flex items-center justify-center
        font-black text-red-500 shadow-lg select-none
        ${onClick ? "cursor-pointer hover:shadow-2xl hover:scale-105 transition-transform" : ""}
      `}
    >
      <span className="text-lg sm:text-2xl font-black tracking-tighter bg-gradient-to-br from-red-500 to-yellow-400 bg-clip-text text-transparent">
        UNO
      </span>
    </button>
  );
}
