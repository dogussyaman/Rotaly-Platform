"use client"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Bell } from "lucide-react"

type SiteHeaderProps = {
  title?: string
  subtitle?: string
}

export function SiteHeader({
  title = "Dashboard",
  subtitle = "Tüm operasyonları tek ekranda yönetin.",
}: SiteHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex w-full items-center justify-between gap-4 px-5 lg:px-7">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-2 hover:bg-[#F4F7F6] h-9 w-9 rounded-xl" />
          <Separator
            orientation="vertical"
            className="h-4 opacity-20"
          />
          <div className="flex flex-col gap-0">
            <h1 className="text-[15px] font-extrabold text-[#0F3D3E] tracking-tight">{title}</h1>
            <p className="text-[11px] font-medium text-muted-foreground/80">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="h-6 w-px bg-border/40 mx-1" />
          <div className="flex items-center gap-2">
             <div className="h-9 w-9 rounded-xl bg-[#F4F7F6] flex items-center justify-center text-[#0F3D3E] cursor-pointer hover:bg-[#CFE8E4]/60 transition-colors">
                <Search className="size-4" />
             </div>
             <div className="h-9 w-9 rounded-xl bg-[#F4F7F6] flex items-center justify-center text-[#0F3D3E] cursor-pointer hover:bg-[#CFE8E4]/60 transition-colors relative">
                <Bell className="size-4" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive border border-white"></span>
             </div>
          </div>
        </div>
      </div>
    </header>
  )
}
