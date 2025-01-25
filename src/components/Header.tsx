"use client";
import { useMemo } from "react";
import { MobileSidebarToggle } from "./MobileToggle";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const title = useMemo(() => {
    switch (pathname) {
      case "/":
        return "Home";
      case "/submit-request":
        return "Submit Financing Request";
      default:
        return "Dashboard";
    }
  }, [pathname]);
  return (
    <header className="flex items-center border-b md:py-[0.87rem] py-2  px-4 md:px-6">
      <MobileSidebarToggle />
      <h1 className="text-lg sm:text-xl font-semibold md:text-2xl">{title}</h1>
    </header>
  );
}
