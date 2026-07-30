// src/app/(components)/ui/icons/ExIconBracketType.tsx
import * as React from "react";

export const ExIconBracketType: React.FC<React.SVGProps<SVGSVGElement>> = ({
                                                                            className = "",
                                                                            ...props
                                                                          }) => (
  <svg
    width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={`${className}`} aria-hidden="true" {...props}
  >
    <path
      d="M1.4375 1.42969V2.86131H5.01656V5.72456H1.4375V7.15618H5.01656C5.81111 7.15618 6.44818 6.51911 6.44818 5.72456V5.00875H10.0272V12.1669H6.44818V11.4511C6.44818 10.6565 5.81111 10.0194 5.01656 10.0194H1.4375V11.4511H5.01656V14.3143H1.4375V15.7459H5.01656C5.81111 15.7459 6.44818 15.1089 6.44818 14.3143V13.5985H10.0272C10.8218 13.5985 11.4589 12.9614 11.4589 12.1669V9.30362H15.7537V7.87199H11.4589V5.00875C11.4589 4.2142 10.8218 3.57712 10.0272 3.57712H6.44818V2.86131C6.44818 2.06676 5.81111 1.42969 5.01656 1.42969H1.4375Z"
      fill="currentColor"
    />
  </svg>

);