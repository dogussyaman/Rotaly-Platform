"use client"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

type SiteHeaderProps = {
  title?: string
  subtitle?: string
}

export function SiteHeader({
  title = "Dashboard",
  subtitle = "Tüm operasyonları tek ekranda yönetin.",
}: SiteHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 flex h-14 shrink-0 items-center border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-3 px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold leading-tight">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

