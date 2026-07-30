"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";

type FrameMenuProps = {
  useSvgLogo?: boolean;
  imgSrc?: string;
  className?: string;
  onClick?: () => void;
};

export default function FrameMenu({
                                    useSvgLogo = true,
                                    imgSrc = "images/xEsports.svg",
                                    className = "",
                                    onClick,
                                  }: FrameMenuProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Frame Menu"
      onKeyDown={(e) => (e.key === "Enter" ? onClick?.() : null)}
      className={clsx(
        "fixed z-50 cursor-pointer select-none top-6 left-56",
        className
      )}
      style={{ touchAction: "manipulation" }}
    >
      {/* Border layer */}
      <div className="relative">
        <div className="relative aspect-[0.42] shape-frame border-layer w-[3.125vw] flex justify-center items-center">
          {/* Inner fill layer */}
          <div className="absolute fill-layer shape-frame aspect-[0.42] w-[95%] flex justify-center items-center">
            {useSvgLogo ? (
              <Image
                src="images/xEsports.svg"
                alt="xEsports Logo"
                width={40}
                height={40}
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