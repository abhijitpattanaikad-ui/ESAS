// src/app/(components)/ui/buttons/ExGlowButton.tsx
"use client";
import React from "react";

type ExGlowButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

/**
 * ExGlowButton Component
 * Uses the Masked Border technique defined in globals.css (#component-glow-button)
 */
export const ExGlowButton = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ExGlowButtonProps) => {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        btn-glow-esports 
        inline-flex justify-center items-center
        min-w-[100px] h-[42px] px-8
        text-white font-bold uppercase tracking-widest text-[14px] pt-[2px]
        z-10 relative
        ${disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
