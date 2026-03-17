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

  const isAdmin = !!profile?.isAdmin
  const sidebarData = isAdmin ? ADMIN_DATA : HOST_DATA
  const roleLabel = isAdmin ? "Yönetici" : "Ev Sahibi"
  const sidebarBg = "bg-[#1c1c21]"

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0">
      <SidebarHeader className={cn(sidebarBg, "border-b border-white/5 px-3 py-3")}>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
              asChild
              className={cn(
                "hover:bg-white/10! focus-visible:ring-2 focus-visible:ring-white/20 transition-colors rounded-xl w-full",
                "h-auto py-2 px-2.5",
                "group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center",
              )}
            >
              <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                {/* Logo icon */}
                <div className={cn(
                  "flex shrink-0 items-center justify-center rounded-lg bg-white text-[#1c1c21]",
                  "size-8 transition-[width,height] duration-300 ease-in-out",
                  "group-data-[collapsible=icon]:size-7",
                )}>
                  <ArrowUpCircleIcon className="size-5 transition-[width,height] duration-300 ease-in-out group-data-[collapsible=icon]:size-4" />
                </div>

                {/* Brand text – always rendered, hidden via CSS */}
                <div className={cn(
                  "flex min-w-0 flex-col overflow-hidden",
                  "transition-[opacity,max-width] duration-200 ease-in-out",
                  "max-w-[160px] opacity-100",
                  "group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0",
                )}>
                  <span className="truncate text-sm font-semibold text-white whitespace-nowrap">Rotaly</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/60 whitespace-nowrap">
                    {roleLabel}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className={cn(sidebarBg, "pt-3 no-scrollbar px-1 group-data-[collapsible=icon]:px-0")}>
        <NavMain items={sidebarData.navMain} />
        {sidebarData.documents.length > 0 && (
          <NavDocuments items={sidebarData.documents} />
        )}
        <NavSecondary items={SECONDARY_NAV} className="mt-auto mb-2" />
      </SidebarContent>

      <SidebarFooter className={cn(sidebarBg, "border-t border-white/10 p-3 group-data-[collapsible=icon]:px-1")}>
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
