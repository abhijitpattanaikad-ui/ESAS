import type { ApiTournamentStatus } from "@/app/(types)/event";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<ApiTournamentStatus, { label: string; indicator: string; className: string }> = {
  Upcoming: { label: "Upcoming", indicator: "○", className: "border-sky-300/50 bg-sky-400/10 text-sky-100" },
  Ongoing: { label: "Ongoing", indicator: "●", className: "border-violet-300/50 bg-violet-400/10 text-violet-100" },
  Completed: { label: "Completed", indicator: "✓", className: "border-slate-300/40 bg-slate-100/10 text-slate-200" },
  "Registration Open": { label: "Registration open", indicator: "✦", className: "border-emerald-300/50 bg-emerald-400/10 text-emerald-100" },
  "Starting Soon": { label: "Starting soon", indicator: "!", className: "border-orange-300/60 bg-orange-400/10 text-orange-100" },
  "Status unavailable": { label: "Status unavailable", indicator: "?", className: "border-slate-400/40 bg-slate-300/10 text-slate-200" },
};

export interface StatusBadgeProps {
  status: ApiTournamentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", config.className, className)}>
      <span aria-hidden="true" className="inline-flex w-3 justify-center font-bold">{config.indicator}</span>
      {config.label}
    </span>
  );
}
