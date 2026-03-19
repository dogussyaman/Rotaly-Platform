"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  Calendar,
  ClipboardListIcon,
  FileSearch,
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
  type LucideIcon,
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

import {
  ADMIN_MODULES,
  HOST_MODULES,
  type DashboardIconKey,
  type DashboardModuleDefinition,
} from "@/lib/dashboard/admin-structure"
import { useAppSelector } from "@/lib/store/hooks"
import { fetchAdminSidebarBadges, type AdminSidebarBadgeMap } from "@/lib/supabase/admin"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<DashboardIconKey, LucideIcon> = {
  overview: LayoutDashboardIcon,
  users: UsersIcon,
  roles: ShieldCheck,
  hosts: Home,
  applications: FileSearch,
  listings: ListIcon,
  availability: Calendar,
  bookings: ClipboardListIcon,
  reviews: Star,
  wishlists: Heart,
  messages: MessageSquare,
  loyalty: Gift,
  coupons: TicketPercent,
  tours: MapPin,
  reports: BarChartIcon,
  systemLogs: DatabaseIcon,
  earnings: BarChartIcon,
}

function buildMainNavItems(modules: DashboardModuleDefinition[], badges?: AdminSidebarBadgeMap) {
  return modules
    .filter((module) => module.placement === "main")
    .map((module) => ({
      key: module.key,
      title: module.title,
      url: module.url,
      icon: ICON_MAP[module.iconKey],
      badge: badges?.[module.key],
    }))
}

function buildDocumentItems(modules: DashboardModuleDefinition[]) {
  return modules
    .filter((module) => module.placement === "documents")
    .map((module) => ({
      key: module.key,
      name: module.title,
      url: module.url,
      icon:
        module.iconKey === "reports"
          ? FileTextIcon
          : module.iconKey === "bookings"
            ? ClipboardListIcon
            : ICON_MAP[module.iconKey],
    }))
}

const SECONDARY_NAV = [
  { title: "Ayarlar", url: "/dashboard/settings", icon: SettingsIcon },
  { title: "Yardım", url: "/dashboard/help", icon: HelpCircleIcon },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAppSelector((s) => s.user)

  const isAdmin = !!profile?.isAdmin
  const [adminBadges, setAdminBadges] = React.useState<AdminSidebarBadgeMap>({})

  React.useEffect(() => {
    let active = true

    async function loadAdminBadges() {
      if (!isAdmin) {
        setAdminBadges({})
        return
      }

      const badgeMap = await fetchAdminSidebarBadges()
      if (active) {
        setAdminBadges(badgeMap)
      }
    }

    void loadAdminBadges()

    return () => {
      active = false
    }
  }, [isAdmin])

  const modules = isAdmin ? ADMIN_MODULES : HOST_MODULES
  const sidebarData = {
    navMain: buildMainNavItems(modules, isAdmin ? adminBadges : undefined),
    documents: buildDocumentItems(modules),
  }
  const roleLabel = isAdmin ? "Yönetici" : "Ev Sahibi"
  const sidebarBg = "bg-sidebar"

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0">
      <SidebarHeader className={cn(sidebarBg, "border-b border-sidebar-border/60 px-3 py-3")}>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
              asChild
              className={cn(
                "hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring/40 transition-colors rounded-xl w-full",
                "h-auto py-2 px-2.5",
                "group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center",
              )}
            >
              <Link href="/" className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                {/* Logo icon */}
                <div className={cn(
                  "flex shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground",
                  "size-8 transition-[width,height] duration-300 ease-in-out shadow-sm",
                  "group-data-[collapsible=icon]:size-7",
                )}>
                  <ArrowUpCircleIcon className="size-4.5 transition-[width,height] duration-300 ease-in-out group-data-[collapsible=icon]:size-4" />
                </div>

                {/* Brand text – always rendered, hidden via CSS */}
                <div className={cn(
                  "flex min-w-0 flex-col overflow-hidden",
                  "transition-[opacity,max-width] duration-200 ease-in-out",
                  "max-w-40 opacity-100",
                  "group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0",
                )}>
                  <span className="truncate text-sm font-bold text-sidebar-foreground whitespace-nowrap">Rotaly</span>
                  <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary whitespace-nowrap">
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

      <SidebarFooter className={cn(sidebarBg, "border-t border-sidebar-border/60 p-3 group-data-[collapsible=icon]:px-1")}>
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
