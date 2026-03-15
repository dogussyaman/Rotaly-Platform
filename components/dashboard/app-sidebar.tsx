"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  Calendar,
  ClipboardListIcon,
  DatabaseIcon,
  FileTextIcon,
  Gift,
  Heart,
  HelpCircleIcon,
  Home,
  LayoutDashboardIcon,
  ListIcon,
  MapPin,
  MessageSquare,
  SettingsIcon,
  ShieldCheck,
  Star,
  TicketPercent,
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
  useSidebar,
} from "@/components/ui/sidebar"
import { NavDocuments } from "./nav-documents"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"

import { useAppSelector } from "@/lib/store/hooks"
import { cn } from "@/lib/utils"

const ADMIN_DATA = {
  navMain: [
    { title: "Genel Bakış", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Kullanıcılar", url: "/dashboard/users", icon: UsersIcon },
    { title: "Roller & Partnerler", url: "/dashboard/roles", icon: ShieldCheck },
    { title: "Ev Sahipleri", url: "/dashboard/hosts", icon: Home },
    { title: "Otel İlanları", url: "/dashboard/listings", icon: ListIcon },
    { title: "Uygunluk Takvimi", url: "/dashboard/availability", icon: Calendar },
    { title: "Rezervasyonlar", url: "/dashboard/bookings", icon: ClipboardListIcon },
    { title: "Değerlendirmeler", url: "/dashboard/reviews", icon: Star },
    { title: "Favoriler", url: "/dashboard/wishlists", icon: Heart },
    { title: "Mesajlar", url: "/dashboard/messages", icon: MessageSquare },
    { title: "Sadakat & Puan", url: "/dashboard/loyalty", icon: Gift },
    { title: "Kuponlar", url: "/dashboard/coupons", icon: TicketPercent },
    { title: "Turlar", url: "/dashboard/tours", icon: MapPin },
  ],
  documents: [
    { name: "Raporlar", url: "/dashboard/reports", icon: BarChartIcon },
    { name: "Sistem Kayıtları", url: "/dashboard/reports", icon: DatabaseIcon },
  ],
}

const HOST_DATA = {
  navMain: [
    { title: "Genel Bakış", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Otel ilanlarım", url: "/dashboard/listings", icon: ListIcon },
    { title: "Uygunluk", url: "/dashboard/availability", icon: Calendar },
    { title: "Rezervasyonlar", url: "/dashboard/bookings", icon: ClipboardListIcon },
    { title: "Değerlendirmeler", url: "/dashboard/reviews", icon: Star },
    { title: "Mesajlar", url: "/dashboard/messages", icon: MessageSquare },
    { title: "Sadakat", url: "/dashboard/loyalty", icon: Gift },
    { title: "Kuponlar", url: "/dashboard/coupons", icon: TicketPercent },
    { title: "Turlar", url: "/dashboard/tours", icon: MapPin },
    { title: "Gelirler", url: "/dashboard/earnings", icon: BarChartIcon },
  ],
  documents: [
    { name: "Rezervasyon Raporları", url: "/dashboard/reports", icon: ClipboardListIcon },
    { name: "Vergi Belgeleri", url: "/dashboard/reports", icon: FileTextIcon },
  ],
}

const SECONDARY_NAV = [
  { title: "Ayarlar", url: "/dashboard/settings", icon: SettingsIcon },
  { title: "Yardım", url: "/dashboard/help", icon: HelpCircleIcon },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAppSelector((s) => s.user)
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const isAdmin = !!profile?.isAdmin
  const isHost = !!profile?.isHost
  const sidebarData = isAdmin ? ADMIN_DATA : HOST_DATA
  const roleLabel = isAdmin ? "Yönetici" : "Ev Sahibi"
  const sidebarBg = "bg-[#1c1c21]" // Project foreground color (oklch 0.13 0.005 285)

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0">
      <SidebarHeader className={cn(sidebarBg, "border-b border-white/5 px-3 py-3 transition-all", isCollapsed ? "px-2" : "px-3")}>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
              asChild
              className={cn(
                "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/20 transition-all rounded-xl w-full",
                isCollapsed ? "h-9 w-9 p-0 flex items-center justify-center" : "h-auto py-2 px-2.5"
              )}
            >
              <Link href="/" className={cn("flex items-center gap-2", isCollapsed ? "justify-center" : "")}>
                <div className={cn(
                  "flex shrink-0 items-center justify-center rounded-lg bg-white text-[#1c1c21]",
                  isCollapsed ? "size-7" : "size-8"
                )}>
                  <ArrowUpCircleIcon className={cn(isCollapsed ? "size-4" : "size-5")} />
                </div>
                {!isCollapsed && (
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-white">Rotaly</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                      {roleLabel}
                    </span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={cn(sidebarBg, "pt-3 no-scrollbar transition-all", isCollapsed ? "px-0" : "px-1")}>
        <NavMain items={sidebarData.navMain} />
        {sidebarData.documents.length > 0 && (
          <NavDocuments items={sidebarData.documents} />
        )}
        <NavSecondary items={SECONDARY_NAV} className="mt-auto mb-2" />
      </SidebarContent>
      <SidebarFooter className={cn(sidebarBg, "p-3 border-t border-white/10 transition-all", isCollapsed ? "px-1" : "p-3")}>
        <NavUser
          user={{
            name: profile?.fullName || "Guest",
            email: profile?.email || "",
            avatar: profile?.avatarUrl || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
