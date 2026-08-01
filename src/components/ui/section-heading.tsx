import type * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-orange-300">{eyebrow}</p> : null}
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-base text-slate-200/80">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
