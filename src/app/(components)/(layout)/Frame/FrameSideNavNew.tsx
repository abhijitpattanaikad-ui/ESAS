"use client";

import clsx from "clsx";
import ExIconLogo from "@/app/(components)/ui/icons/ExIconLogo";
import {Gamepad2, Home, LayoutDashboard, Swords} from "lucide-react";
import Link from "next/link";
import {ComingSoonBadgeMini} from "@/app/(components)/ui/icons/ComingSoonBadgeMini";

import { usePathname } from "next/navigation";

export default function FrameSideNavNew({ visible = true }: { visible?: boolean }) {
  const pathname = usePathname();
  
  return (
    <div
      className={clsx(
        "w-[60px] aspect-[0.093] relative transition-all duration-500 ease-out",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-8 pointer-events-none"
      )}
    >
      <div className="shape-sidenav-geom sidenav-border w-full h-full relative">
        <div className="shape-sidenav-geom sidenav-fill absolute top-[5px] left-[5px] w-[calc(100%-10px)] h-[calc(100%-10px)] flex flex-col items-center pt-6 gap-8">
          
          <div className="opacity-70">
            <ExIconLogo className="w-[50%] h-[50%] text-crimson-500" />
          </div>
          
          <nav className="flex flex-col items-center gap-6 mt-8">
            
            <SideNavItem
              label="Home"
              icon={<Home size={18} />}
              href="/"
              active={pathname === "/"}
            />
            
            <SideNavItem
              label="Dashboard"
              icon={<LayoutDashboard size={18} />}
              href="/dashboard"
              active={pathname.startsWith("/dashboard")}
            />
            
            {/*<SideNavItem
              label="Tournament"
              icon={<Swords size={18} />}
              disabled
            />
            
            <SideNavItem
              label="Games"
              icon={<Gamepad2 size={18} />}
              disabled
            />*/}
          
          </nav>
        </div>
      </div>
    </div>
  );
}

function SideNavItem({
                       icon,
                       label,
                       href,
                       disabled = false,
                       active = false,
                     }: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  disabled?: boolean;
  active?: boolean;
}) {
  if (disabled) {
    return (
      <div className="sidenav-item sidenav-item-disabled flex flex-col items-center gap-1 text-gray-400 relative">
        {icon}
        <span className="text-[10px]">{label}</span>
        <ComingSoonBadgeMini className="absolute -right-3 -top-2 scale-90" />
      </div>
    );
  }
  
  return (
    <Link
      href={href ?? "#"}
      className={clsx(
        "sidenav-item flex flex-col items-center gap-1 text-white cursor-pointer relative transition-all",
        active && "sidenav-item-active"
      )}
    >
      {icon}
      <span className="text-[10px] opacity-80">{label}</span>
    </Link>
  );
}