"use client"

import * as React from "react"
import Link from "next/link"
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
  const sidebarBg = "bg-gradient-to-b from-[#0F3D3E] via-[#0F3D3E] to-[#0B2F30]"

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0">
      <SidebarHeader className={`${sidebarBg} pt-4 px-3 pb-2`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30 transition-colors h-auto py-2 px-2 rounded-2xl"
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-[#0F3D3E] shadow-lg shadow-black/20">
                  <ArrowUpCircleIcon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 ml-2 leading-tight">
                  <span className="text-sm font-bold text-white tracking-tight">Rotaly</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black uppercase bg-white/20 text-white/90 px-1 py-0.5 rounded-md tracking-widest leading-none">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={`${sidebarBg} px-1 pt-3 no-scrollbar`}>
        <NavMain items={sidebarData.navMain} />
        {sidebarData.documents.length > 0 && (
          <NavDocuments items={sidebarData.documents} />
        )}
        <NavSecondary items={SECONDARY_NAV} className="mt-auto mb-2" />
      </SidebarContent>
      <SidebarFooter className={`${sidebarBg} p-3 border-t border-white/10`}>
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
