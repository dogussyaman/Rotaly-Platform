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
  useSidebar,
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
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu className={cn("mb-3", isCollapsed ? "px-0" : "px-2")}>
          <SidebarMenuItem className="flex justify-center">
            {isCollapsed ? (
              <SidebarMenuButton tooltip="Hızlı Oluştur" className="h-9 w-9 p-0 flex items-center justify-center bg-secondary text-foreground rounded-xl hover:bg-white transition-colors">
                <PlusCircleIcon className="size-4" />
              </SidebarMenuButton>
            ) : (
              <Button
                className="w-full bg-secondary text-foreground hover:bg-white font-bold rounded-full gap-2 shadow-sm border-none h-9 px-3 text-[12px]"
              >
                <PlusCircleIcon className="size-4" />
                <span>Hızlı Oluştur</span>
              </Button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className={cn("gap-1", isCollapsed ? "px-0" : "px-2")}>
          {items.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url))

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={cn(
                    "relative flex items-center transition-colors duration-200 group focus-visible:ring-2 focus-visible:ring-white/30",
                    isCollapsed ? "justify-center h-10 w-10 p-0 rounded-xl mx-auto" : "gap-3 px-3 h-10 rounded-2xl",
                    isActive
                      ? "bg-white text-[#1c1c21] shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Link href={item.url} className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "size-4 transition-transform duration-200 shrink-0",
                          isActive ? "scale-100" : "group-hover:scale-105"
                        )}
                      />
                    )}
                    {!isCollapsed && (
                      <span className={cn(
                        "tracking-tight text-[13px] truncate",
                        isActive ? "font-bold" : "font-semibold"
                      )}>
                        {item.title}
                      </span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-secondary rounded-r-full" />
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
