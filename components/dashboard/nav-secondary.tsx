"use client"

import * as React from "react"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className={cn("gap-1", isCollapsed ? "px-0" : "px-1")}>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="flex justify-center">
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild
                className={cn(
                  "text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-white/30",
                  isCollapsed ? "h-9 w-9 p-0 flex items-center justify-center rounded-xl mx-auto" : "px-3 h-9 rounded-2xl"
                )}
              >
                <Link href={item.url} className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-2")}>
                  <item.icon className="size-4 shrink-0" />
                  {!isCollapsed && <span className="text-xs font-medium tracking-wide truncate">{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
