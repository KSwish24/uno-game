"use client";

import { Color } from "@/lib/types";

interface ColorPickerProps {
  onPick: (color: Color) => void;
}

const colors: { color: Color; bg: string; label: string }[] = [
  { color: "red", bg: "bg-red-600 hover:bg-red-500", label: "Red" },
  { color: "blue", bg: "bg-blue-600 hover:bg-blue-500", label: "Blue" },
  { color: "green", bg: "bg-green-600 hover:bg-green-500", label: "Green" },
  { color: "yellow", bg: "bg-yellow-400 hover:bg-yellow-300", label: "Yellow" },
];

export function ColorPicker({ onPick }: ColorPickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h3 className="text-white text-lg font-bold text-center mb-5">
          Choose a color
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((c) => (
            <button
              key={c.color}
              onClick={() => onPick(c.color)}
              className={`${c.bg} w-24 h-24 sm:w-28 sm:h-28 rounded-2xl text-white font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
