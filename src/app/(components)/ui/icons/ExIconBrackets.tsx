// src/app/(components)/ui/icons/ExIconBrackets.tsx
import * as React from "react";

export const ExIconBrackets: React.FC<React.SVGProps<SVGSVGElement>> = ({
                                                                         className = "",
                                                                         ...props
                                                                       }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="12" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="12" r="2" />
    <path d="M8 6h4v12H8" />
    <path d="M12 12h4" />
  </svg>
);
