import * as React from "react";
import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  primary: "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-slate-950 shadow-[var(--shadow-public-glow)] hover:border-[var(--brand-hover)] hover:bg-[var(--brand-hover)] hover:text-slate-950 focus-visible:outline-white disabled:border-orange-300 disabled:bg-orange-300 disabled:text-slate-950",
  secondary: "border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-white hover:border-orange-300/60 hover:bg-white/10",
  ghost: "border-transparent bg-transparent text-orange-100 hover:bg-orange-400/10 hover:text-white",
} as const;

const SIZE_CLASSES = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
} as const;

export interface ButtonStyleOptions {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-public-control)] border font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300 disabled:pointer-events-none disabled:opacity-50",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  ),
);

Button.displayName = "Button";
