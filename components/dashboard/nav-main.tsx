"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu className="px-2 mb-3">
          <SidebarMenuItem>
            <Button
              className="w-full bg-[#CFE8E4] text-[#0F3D3E] hover:bg-white font-bold rounded-2xl gap-2 shadow-sm border-none h-9 px-3 text-[12px]"
            >
              <PlusCircleIcon className="size-4" />
              <span>Hızlı Oluştur</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="gap-1 px-2">
          {items.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url))

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={cn(
                    "relative flex items-center gap-3 px-3 h-10 rounded-2xl transition-colors duration-200 group focus-visible:ring-2 focus-visible:ring-white/30",
                    isActive
                      ? "bg-white/95 text-[#0F3D3E] shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && (
                      <item.icon 
                        className={cn(
                          "size-4 transition-transform duration-200 shrink-0",
                          isActive ? "scale-100" : "group-hover:scale-105"
                        )} 
                      />
                    )}
                    <span className={cn(
                      "tracking-tight text-[13px]",
                      isActive ? "font-bold" : "font-semibold"
                    )}>
                      {item.title}
                    </span>
                    {isActive && (
                      <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#CFE8E4] rounded-r-full" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
