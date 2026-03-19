"use client"

import { useRouter } from "next/navigation"
import { BellIcon, CreditCardIcon, LogOutIcon, MoreVerticalIcon, UserCircleIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAppDispatch } from "@/lib/store/hooks"
import { clearUser } from "@/lib/store/slices/user-slice"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const router = useRouter()
  const dispatch = useAppDispatch()
  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    dispatch(clearUser())
    router.replace("/auth/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className={cn("flex justify-center", isCollapsed ? "" : "px-0")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "text-sidebar-foreground hover:bg-sidebar-accent active:bg-sidebar-accent/80 transition-colors rounded-2xl focus-visible:ring-2 focus-visible:ring-sidebar-ring/40",
                isCollapsed ? "h-10 w-10 p-0 flex items-center justify-center rounded-xl" : "px-3 h-14",
              )}
            >
              <Avatar
                className={cn("rounded-xl border border-sidebar-border/60 shrink-0", isCollapsed ? "h-8 w-8" : "h-10 w-10")}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl bg-sidebar-accent text-sidebar-accent-foreground font-bold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-bold tracking-tight text-sidebar-foreground">{user.name}</span>
                    <span className="truncate text-[9px] font-black uppercase tracking-widest text-primary/80">Premium Hesap</span>
                  </div>
                  <MoreVerticalIcon className="ml-auto size-4 opacity-50" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-2xl p-2 shadow-2xl border border-border/70 backdrop-blur-xl bg-popover/95"
            side={isMobile ? "bottom" : isCollapsed ? "right" : "top"}
            align="end"
            sideOffset={isCollapsed ? 18 : 12}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 text-left">
                <Avatar className="h-10 w-10 rounded-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-xl bg-foreground text-background font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate font-bold text-foreground">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground font-medium">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="rounded-xl px-4 py-2.5 font-semibold text-foreground focus:bg-accent"
                onSelect={() => router.push("/dashboard/profile")}
              >
                <UserCircleIcon className="mr-2 h-4 w-4" />
                Hesabım
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl px-4 py-2.5 font-semibold text-foreground focus:bg-accent"
                onSelect={() => router.push("/dashboard/settings")}
              >
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Ödemeler
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl px-4 py-2.5 font-semibold text-foreground focus:bg-accent"
                onSelect={() => router.push("/dashboard/settings")}
              >
                <BellIcon className="mr-2 h-4 w-4" />
                Bildirimler
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              className="rounded-xl px-4 py-2.5 font-bold text-destructive focus:bg-destructive/5 cursor-pointer"
              onSelect={() => void signOut()}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
