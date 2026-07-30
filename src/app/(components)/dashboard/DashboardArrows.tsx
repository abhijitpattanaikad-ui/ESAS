// src/app/(components)/dashboard/DashboardArrows.tsx
"use client";

import React from "react";

export type ArrowProps = {
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
  vertical?: boolean;
  size?: number;
};

export function ArrowButton({
                              onPrev,
                              onNext,
                              className = "",
                              vertical = false,
                              size = 40,
                            }: ArrowProps) {
  // vertical=true -> render up/down, else left/right
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={onPrev}
        aria-label={vertical ? "Previous" : "Previous"}
        className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-orange-500 border border-[#6C0D0D] flex items-center justify-center shadow-sm hover:scale-105 transition-transform shrink-0"
        style={{ boxShadow: "0 6px 18px rgba(108,13,13,0.18)" }}
      >
        {vertical ? (
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
            <path d="M7 15l5-5 5 5" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      
      <button
        onClick={onNext}
        aria-label={vertical ? "Next" : "Next"}
        className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-orange-500 border border-[#6C0D0D] flex items-center justify-center shadow-sm hover:scale-105 transition-transform shrink-0"
        style={{ boxShadow: "0 6px 18px rgba(108,13,13,0.18)" }}
      >
        {vertical ? (
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
            <path d="M7 9l5 5 5-5" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}