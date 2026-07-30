// src/app/(components)/ui/buttons/ExButtonOld.tsx
"use client";

import * as React from "react";
import clsx from "clsx";

const arrowSvgPath =
  "M3.82031 0L18.4834 17L3.82031 34H0V0H3.82031ZM50.8203 34H45.4521L43.4932 31.7285C44.6729 31.0468 45.7625 30.2271 46.7412 29.292L50.8203 34ZM46.1934 4.20605C49.7521 7.32208 52 11.8982 52 17C52 21.8345 49.9809 26.1966 46.7412 29.292L35.8955 16.7734L46.1934 4.20605ZM46.1934 4.20605C45.1589 3.30025 44.0144 2.51679 42.7812 1.88086L44.2744 0H49.6416L46.1934 4.20605ZM35 0C37.804 0 40.4497 0.678487 42.7812 1.88086L30.79 17L43.4932 31.7285C40.9941 33.1727 38.0938 34 35 34H20.709L29.4805 24.0264L27.124 21.3066L18.876 30.2598H12.0684L23.7197 16.7734L12.0684 3.62695H18.876L27.124 12.8066L29.4805 9.74707L20.709 0H35Z";

export interface ExButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gradient";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const ExButton = React.forwardRef<HTMLButtonElement, ExButtonProps>(
  (
    {
      children,
      className,
      variant = "gradient",
      size = "md",
      loading = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "h-8 text-xs pl-4",
      md: "h-10 text-sm pl-6",
      lg: "h-12 text-base pl-8",
    };
    
    const variantStyles = {
      primary:
        "bg-crimson-500 hover:bg-crimson-600 text-white shadow-[0_0_12px_rgba(239,66,66,0.35)]",
      secondary:
        "bg-woodsmoke-700 hover:bg-woodsmoke-800 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]",
      gradient:
        "bg-gradient-to-r from-[#EF4242] via-[#9B1A1A] to-[#6C0D0D] text-white hover:opacity-90 shadow-[0_0_15px_rgba(239,66,66,0.35)]",
    };
    
    const wedgeBg =
      variant === "gradient"
        ? "bg-[#0A0505]" // dark wedge for CTA
        : "bg-[#1A1A1A]"; // neutral wedge for form use
    
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={clsx(
          "relative flex items-center justify-between group rounded-l-full overflow-hidden font-semibold transition-all duration-200",
          sizeStyles[size],
          variantStyles[variant],
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:scale-[1.03]",
          className
        )}
        {...props}
      >
        {/* Button Text */}
        <span className="pl-6 heading-font whitespace-nowrap truncate">
          {loading ? "Please wait..." : children}
        </span>
        
        {/* Arrow wedge */}
        <div
          className={clsx(
            "h-full w-12 flex items-center justify-center overflow-hidden transition-colors duration-200",
            wedgeBg
          )}
        >
          <svg
            className="block h-full w-12 fill-crimson-500 group-hover:fill-crimson-600"
            preserveAspectRatio="none"
            viewBox="0 0 52 35"
            aria-hidden="true"
          >
            <path d={arrowSvgPath} />
          </svg>
        </div>
      </button>
    );
  }
);

ExButton.displayName = "ExButton";