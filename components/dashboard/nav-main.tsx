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
        {/* Quick Create button */}
        <SidebarMenu className="mb-3 px-2 group-data-[collapsible=icon]:px-0">
          <SidebarMenuItem className="flex justify-center">
            {/* Expanded: full button */}
            <Button
              className={cn(
                "w-full bg-secondary text-foreground hover:bg-white font-bold rounded-full gap-2 shadow-sm border-none h-9 px-3 text-[12px]",
                "transition-[opacity,max-width] duration-200 ease-in-out overflow-hidden",
                "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:hidden",
              )}
            >
              <PlusCircleIcon className="size-4 shrink-0" />
              <span>Hızlı Oluştur</span>
            </Button>
            {/* Collapsed: icon-only button */}
            <SidebarMenuButton
              tooltip="Hızlı Oluştur"
              className={cn(
                "h-9 w-9 p-0 flex items-center justify-center bg-secondary text-foreground rounded-xl hover:bg-white transition-colors",
                "hidden group-data-[collapsible=icon]:flex",
              )}
            >
              <PlusCircleIcon className="size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Nav items */}
        <SidebarMenu className="gap-1 px-2 group-data-[collapsible=icon]:px-0">
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/dashboard" && pathname.startsWith(item.url))

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={cn(
                    "relative flex items-center gap-3 px-3 h-10 rounded-2xl",
                    "transition-colors duration-200 group/nav-item",
                    "focus-visible:ring-2 focus-visible:ring-white/30",
                    /* collapsed overrides – base class forces size-8 so we just align */
                    "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
                    isActive
                      ? "bg-white text-[#1c1c21] shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                      : "text-white/70 hover:text-white hover:bg-white/10",
                  )}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "size-4 shrink-0 transition-transform duration-200",
                          isActive ? "scale-100" : "group-hover/nav-item:scale-105",
                        )}
                      />
                    )}

                    {/* Text: always rendered, hidden via CSS during collapse */}
                    <span
                      className={cn(
                        "text-[13px] tracking-tight truncate overflow-hidden whitespace-nowrap",
                        "transition-[opacity,max-width] duration-200 ease-in-out",
                        "max-w-[160px] opacity-100",
                        "group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0",
                        isActive ? "font-bold" : "font-semibold",
                      )}
                    >
                      {item.title}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <div
                        className={cn(
                          "absolute left-[-6px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-secondary rounded-r-full",
                          "transition-opacity duration-200",
                          "group-data-[collapsible=icon]:opacity-0",
                        )}
                      />
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
