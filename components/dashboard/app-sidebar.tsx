"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  Calendar,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavDocuments } from "./nav-documents"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"

import { useAppSelector } from "@/lib/store/hooks"

const ADMIN_DATA = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Lifecycle", url: "#", icon: ListIcon },
    { title: "Analytics", url: "#", icon: BarChartIcon },
    { title: "Projects", url: "#", icon: FolderIcon },
    { title: "Users", url: "#", icon: UsersIcon },
  ],
  documents: [
    { name: "Global Reports", url: "#", icon: ClipboardListIcon },
    { name: "System Logs", url: "#", icon: DatabaseIcon },
  ]
};

const HOST_DATA = {
  navMain: [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "My Listings", url: "#", icon: ListIcon },
    { title: "Reservations", url: "#", icon: Calendar, isActive: true },
    { title: "Earnings", url: "#", icon: BarChartIcon },
  ],
  documents: [
    { name: "Booking Reports", url: "#", icon: ClipboardListIcon },
    { name: "Tax Documents", url: "#", icon: FileTextIcon },
  ]
};

const SECONDARY_NAV = [
  { title: "Settings", url: "#", icon: SettingsIcon },
  { title: "Help Center", url: "#", icon: HelpCircleIcon },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAppSelector((s) => s.user);
  
  const isAdmin = !!profile?.isAdmin;
  const isHost = !!profile?.isHost;
  
  const sidebarData = isAdmin ? ADMIN_DATA : isHost ? HOST_DATA : { navMain: [], documents: [] };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ArrowUpCircleIcon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-sm font-bold">Rotaly {isAdmin ? 'Admin' : 'Host'}</span>
                  <span className="text-xs text-muted-foreground">Premium Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        {sidebarData.documents.length > 0 && <NavDocuments items={sidebarData.documents} />}
        <NavSecondary items={SECONDARY_NAV} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: profile?.fullName || "Guest",
          email: profile?.email || "",
          avatar: profile?.avatarUrl || ""
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
