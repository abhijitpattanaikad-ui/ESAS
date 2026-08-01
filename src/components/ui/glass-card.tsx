import type * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export function GlassCard({ as: Component = "section", className, children }: GlassCardProps) {
  return (
    <Component className={cn("rounded-[var(--radius-public-card)] border border-[var(--border-subtle)] bg-[var(--surface-glass)] p-6 shadow-[var(--shadow-public-card)] backdrop-blur-xl", className)}>
      {children}
    </Component>
  );
}
