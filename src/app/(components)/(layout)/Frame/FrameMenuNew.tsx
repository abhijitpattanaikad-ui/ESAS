"use client";

import ExIconLogo from "@/app/(components)/ui/icons/ExIconLogo";

export default function FrameMenuNew({
                                       onToggle,
                                       menuOpen,
                                     }: {
  onToggle?: () => void;
  menuOpen?: boolean;
}) {
  return (
    <div className="w-[60px] aspect-[0.42] relative frame-border-pulse">
      {/* Border Layer */}
      <div className="shape-menu-geom menu-border w-full h-full relative">
        {/* Fill Layer (5px inset = 10px total border thickness) */}
        <div className="shape-menu-geom menu-fill absolute top-[5px] left-[5px] w-[calc(100%-10px)] h-[calc(100%-10px)] flex items-center justify-center">
          
          {/* Only the logo is clickable */}
          <button
            onClick={onToggle}
            aria-label="Toggle Side Navigation"
            className="cursor-pointer select-none"
          >
            <ExIconLogo className="w-[55%] h-[55%] text-crimson-500" />
          </button>
        
        </div>
      </div>
    </div>
  );
}