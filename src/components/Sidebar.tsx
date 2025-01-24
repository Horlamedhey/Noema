"use client";

import Link from "next/link";
import { CalendarDays, Home, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect } from "react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [pathname]);

  const sidebarContent = (
    <>
      <SidebarHeader className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                >
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/submit-request"}
                >
                  <Link href="/submit-request">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Submit Request</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </>
  );

  if (isMobile) {
    return (
      <Sheet
        open={openMobile}
        onOpenChange={setOpenMobile}
      >
        <SheetContent
          side="left"
          className="p-0"
          data-sidebar="sidebar"
          data-mobile="true"
          addHiddenHeader={true}
          showClose={false}
        >
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return <Sidebar>{sidebarContent}</Sidebar>;
}
