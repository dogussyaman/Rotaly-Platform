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
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1 px-1 group-data-[collapsible=icon]:px-0">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="flex justify-center">
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={cn(
                  "flex items-center gap-2 px-3 h-9 rounded-2xl",
                  "text-white/60 hover:text-white hover:bg-white/10",
                  "transition-colors duration-200",
                  "focus-visible:ring-2 focus-visible:ring-white/30",
                  "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
                )}
              >
                <Link
                  href={item.url}
                  className="flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                >
                  <item.icon className="size-4 shrink-0" />
                  <span
                    className={cn(
                      "text-xs font-medium tracking-wide truncate overflow-hidden whitespace-nowrap",
                      "transition-[opacity,max-width] duration-200 ease-in-out",
                      "max-w-[160px] opacity-100",
                      "group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0",
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
