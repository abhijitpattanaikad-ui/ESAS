"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";

type FrameSideNavProps = {
  useSvgLogo?: boolean;
  imgSrc?: string;
  className?: string;
  onClick?: () => void;
};

export default function FrameSideNav({
                                    useSvgLogo = true,
                                    imgSrc = "images/xEsports.svg",
                                    className = "",
                                    onClick,
                                  }: FrameSideNavProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Frame Menu"
      onKeyDown={(e) => (e.key === "Enter" ? onClick?.() : null)}
      className={clsx(
        "fixed z-50 cursor-pointer select-none top-42 left-56",
        className
      )}
      style={{ touchAction: "manipulation" }}
    >
      {/* Border layer */}
      <div className="relative">
        <div className="relative shape-side-nav-frame border-layer w-[3.125vw] flex justify-center items-center">
          {/* Inner fill layer */}
          <div className="absolute shape-side-nav-frame fill-layer w-[95%] h-[99%] flex justify-center items-center">
            {useSvgLogo ? (
              <Image
                src="images/xEsports.svg"
                alt="xEsports Logo"
                width={50}
                height={50}
                className="object-contain pointer-events-none"
                priority
              />
            ) : (
              <Image
                src={imgSrc}
                alt="Menu Logo"
                width={70}
                height={70}
                className="object-contain pointer-events-none"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}