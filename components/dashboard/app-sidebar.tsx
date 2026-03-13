"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  Calendar,
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  FileTextIcon,
  Gift,
  HelpCircleIcon,
  Heart,
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

const ADMIN_DATA = {
  navMain: [
    { title: "Genel Bakış", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Kullanıcılar", url: "/dashboard/users", icon: UsersIcon },
    { title: "Roller & Partnerler", url: "/dashboard/roles", icon: ShieldCheck },
    { title: "Ev Sahipleri", url: "/dashboard/hosts", icon: Home },
    { title: "İlanlar", url: "/dashboard/listings", icon: ListIcon },
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
    { title: "İlanlarım", url: "/dashboard/listings", icon: ListIcon },
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

const GUEST_DATA = {
  navMain: [
    { title: "Genel Bakış", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Seyahatlerim", url: "/dashboard/bookings", icon: Calendar },
    { title: "Favoriler", url: "/dashboard/wishlists", icon: Heart },
    { title: "Mesajlar", url: "/dashboard/messages", icon: MessageSquare },
    { title: "Sadakat", url: "/dashboard/loyalty", icon: Gift },
    { title: "Kuponlar", url: "/dashboard/coupons", icon: TicketPercent },
    { title: "Turlar", url: "/dashboard/tours", icon: MapPin },
    { title: "Profil", url: "/dashboard/profile", icon: SettingsIcon },
  ],
  documents: [{ name: "Seyahat Belgeleri", url: "/dashboard/documents", icon: FileIcon }],
}

const SECONDARY_NAV = [
  { title: "Ayarlar", url: "/dashboard/settings", icon: SettingsIcon },
  { title: "Yardım", url: "/dashboard/help", icon: HelpCircleIcon },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAppSelector((s) => s.user)

  const isAdmin = !!profile?.isAdmin
  const isHost = !!profile?.isHost

  const sidebarData = isAdmin ? ADMIN_DATA : isHost ? HOST_DATA : GUEST_DATA
  const roleLabel = isAdmin ? "Yönetici" : isHost ? "Ev Sahibi" : "Misafir"

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
                  <span className="text-sm font-bold">Rotaly {roleLabel}</span>
                  <span className="text-xs text-muted-foreground">
                    Premium Platform
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        {sidebarData.documents.length > 0 && (
          <NavDocuments items={sidebarData.documents} />
        )}
        <NavSecondary items={SECONDARY_NAV} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
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

