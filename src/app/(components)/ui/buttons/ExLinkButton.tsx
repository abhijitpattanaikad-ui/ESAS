// src/app/(components)/ui/buttons/ExLinkButton.tsx
"use client";
import React from "react";

type ExLinkButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

/**
 * ExLinkButton Component
 * Blends cleanly into the page layout as a plain text link by default, 
 * and reveals a muted dark brown, rounded-rectangle container behind the text on hover.
 */
export const ExLinkButton = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ExLinkButtonProps) => {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        inline-flex justify-center items-center
        min-w-[100px] h-[42px] px-4
        text-white font-bold uppercase tracking-widest text-[14px] pt-[2px]
        rounded-[10px] bg-transparent
        transition-all duration-300 ease-out
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-[#27140b]"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
