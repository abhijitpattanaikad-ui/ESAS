import React, {JSX} from "react";
import clsx from "clsx";

/**
 * Wraps an inline SVG into a proper React icon component.
 * - Preserves viewBox
 * - Supports className
 * - Supports all SVG props
 * - Supports Tailwind color control via currentColor
 */
export function createIcon(svg: JSX.Element) {
  return function Icon({
                         className = "",
                         ...props
                       }: React.SVGProps<SVGSVGElement>) {
    return React.cloneElement(svg, {
      className: clsx("inline-block", className),
      ...props,
    });
  };
}