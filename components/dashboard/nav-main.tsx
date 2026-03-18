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
            {/* Expanded: full pill button */}
            <Button
              asChild
              variant="secondary"
              className={cn(
                "w-full font-semibold rounded-xl gap-2 shadow-sm h-9 px-3 text-[12px]",
                "group-data-[collapsible=icon]:hidden",
              )}
            >
              <Link href="/dashboard/listings/new" className="flex items-center gap-2">
                <PlusCircleIcon className="size-4 shrink-0" />
                <span>Hızlı Oluştur</span>
              </Link>
            </Button>
            {/* Collapsed: icon-only */}
            <SidebarMenuButton
              asChild
              tooltip="Hızlı Oluştur"
              className={cn(
                "hidden group-data-[collapsible=icon]:flex",
                "items-center justify-center",
                "bg-sidebar-accent text-sidebar-accent-foreground rounded-xl hover:bg-sidebar-accent/80 transition-colors",
              )}
            >
              <Link href="/dashboard/listings/new">
                <PlusCircleIcon className="size-4" />
              </Link>
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
                  isActive={isActive}
                  className={cn(
                    "relative h-10 gap-3 px-3 rounded-xl",
                    "flex items-center group/nav-item",
                    "transition-colors duration-200",
                  )}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "size-4 shrink-0 transition-transform duration-200",
                          isActive ? "scale-100" : "group-hover/nav-item:scale-105",
                        )}
                      />
                    )}

                    {/* Text — always in DOM, fades + shrinks via CSS */}
                    <span
                      className={cn(
                        "text-[13px] tracking-tight whitespace-nowrap overflow-hidden",
                        "transition-[opacity,max-width] duration-200 ease-in-out",
                        "max-w-40 opacity-100",
                        "group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0",
                        isActive ? "font-bold" : "font-semibold",
                      )}
                    >
                      {item.title}
                    </span>

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
