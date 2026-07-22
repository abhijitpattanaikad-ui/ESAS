"use client";

import { useEffect, useState } from "react";
import FrameMenuNew from "./FrameMenuNew";
import FrameSideNavNew from "./FrameSideNavNew";

export default function FrameStackNew() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  
  return (
    <div className="fixed top-6 left-10 flex flex-col gap-4 z-[999] pointer-events-none">
      
      {/* Menu */}
      <div className="pointer-events-auto">
        <FrameMenuNew onToggle={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
      </div>
      
      {/* SideNav */}
      <div className="pointer-events-auto">
        <FrameSideNavNew visible={!isMobile || menuOpen} />
      </div>
    
    </div>
  );
}