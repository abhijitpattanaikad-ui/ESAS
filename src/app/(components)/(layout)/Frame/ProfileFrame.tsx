// src/app/(components)/(layout)/Frame/ProfileFrame.tsx
"use client";

import Image from "next/image";
import React from "react";

export interface ProfileFrameProps {
  src?: string | null;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * ProfileFrame
 * - uses CSS shape() clip-path provided by you
 * - preserves aspect ratio 0.72 (use width to scale)
 * - NOT a <button>; it's a <div> wrapper to maintain layer behavior
 */
export default function ProfileFrame({
                                       src,
                                       onClick,
                                       className = "",
                                       ariaLabel = "Profile",
                                     }: ProfileFrameProps) {
  // CSS shape() clip-path (verbatim from your earlier snippet)
  const clipPath =
    "shape(from 20.54% 14.56%,line to 79.46% 0.74%,curve by 20.54% 10.79% with 11.39% -2.67%/20.54% 2.14%,vline by 53.5%,curve by -20.54% 20.42% with 0% 8.65%/-9.28% 17.74%,line by -58.91% 13.82%,curve by -20.54% -10.79% with -11.39% 2.67%/-20.54% -2.14%,vline by -53.5%,curve by 20.54% -20.42% with 0% -8.65%/9.28% -17.74%,close)";
  
  const fallback = "/images/byClient/defaultProfile.png";
  
  return (
    <div
      role="button"
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        // allow Enter / Space to trigger the same as click
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      className={`relative overflow-hidden transition-all duration-200 focus:outline-none ${className}`}
      style={{
        // enforce exact clip-path as provided
        clipPath,
        WebkitClipPath: clipPath,
      }}
    >
      {/* aspect ratio wrapper (use width to scale; height will follow) */}
      <div className="aspect-[0.72] relative">
        {/* Image fills the shape */}
        <div className="absolute inset-0">
          <Image
            src={src ?? fallback}
            alt="Profile avatar"
            fill
            sizes="(max-width: 768px) 48px, 64px"
            className="object-cover object-center"
            onError={(ev) => {
              // fallback on error — set the native src to fallback if needed
              // Next/Image doesn't provide direct src mutation; ignore if already fallback
            }}
            priority
          />
        </div>
        
        {/* subtle overlay so image blends with dark theme */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>
    </div>
  );
}