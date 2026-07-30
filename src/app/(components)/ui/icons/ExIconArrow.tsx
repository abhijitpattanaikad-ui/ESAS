// src/app/(components)/ui/icons/ExIconArrow.tsx
import * as React from "react";

export const ExIconArrow: React.FC<React.SVGProps<SVGSVGElement>> = ({
                                                                       className = "",
                                                                       ...props
                                                                     }) => (
  <svg
    className={`${className}`}
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M13.8218 15.2773H2.77734C3.47457 8.25929 9.3954 2.77734 16.5968 2.77734C24.2676 2.77734 30.4857 8.9954 30.4857 16.6662C30.4857 24.3371 24.2676 30.5551 16.5968 30.5551C9.3954 30.5551 3.47457 25.0732 2.77734 18.0551H13.819V22.2218L20.7635 16.6662L13.819 11.1107L13.8218 15.2773Z"
      fill="currentColor"
    />
  </svg>
);