"use client"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardNotifications } from "@/components/dashboard/dashboard-notifications"
import { DashboardSearch } from "@/components/dashboard/dashboard-search"

type SiteHeaderProps = {
  title?: string
  subtitle?: string
}

export function SiteHeader({
  title = "Dashboard",
  subtitle = "Tüm operasyonları tek ekranda yönetin.",
}: SiteHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white rounded-2xl shadow-sm mx-4 my-2">
      <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex flex-1 items-center gap-3">
          <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-[#f0fdfa] hover:text-[#0d9488] transition-colors" />
          <Separator orientation="vertical" className="h-4 opacity-30" />

          <div className="min-w-0 flex-1 text-left">
            <h1 className="truncate text-[15px] font-semibold tracking-tight text-[#111]">
              {title}
            </h1>
            <p className="truncate text-[11px] text-muted-foreground">
              {subtitle}
            </p>
          </div>

          <DashboardSearch />
        </div>

        <div className="flex items-center gap-3">
          <DashboardNotifications />
          <div className="h-6 w-px bg-border/40 mx-1" />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

