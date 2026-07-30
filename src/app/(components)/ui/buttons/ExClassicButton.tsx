"use client";
import React from "react";

type ExClassicButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  className?: string;
};

export const ExClassicButton = ({
                                  children,
                                  onClick,
                                  disabled = false,
                                  size = "md",
                                  type = "button",
                                  className = "",
                                }: ExClassicButtonProps) => {
  const sizes = {
    sm: "text-[12px] px-4 py-2",
    md: "text-[14px] px-6 py-3",
    lg: "text-[15px] px-8 py-4",
  };
  
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-xl text-white font-medium
        bg-linear-to-r from-[#bb622f] to-[#f07f3f]
        transition-all duration-300
        ${disabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};