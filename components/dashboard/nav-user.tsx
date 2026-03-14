"use client"

import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="text-white hover:bg-white/10 active:bg-white/20 transition-colors px-3 rounded-2xl focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <Avatar className="h-10 w-10 rounded-xl border border-white/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl bg-white/10 text-white font-bold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-bold tracking-tight">{user.name}</span>
                <span className="truncate text-[10px] text-white/50 uppercase font-black">
                  Premium Hesap
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-2xl p-2 shadow-2xl border-none backdrop-blur-xl bg-white/95"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={12}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 text-left">
                <Avatar className="h-10 w-10 rounded-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-xl bg-[#0F3D3E] text-white font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate font-bold text-[#1A1A1A]">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground font-medium">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-xl px-4 py-2.5 font-semibold text-[#1A1A1A] focus:bg-[#F4F7F6]">
                <UserCircleIcon className="mr-2 h-4 w-4" />
                Hesabım
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-4 py-2.5 font-semibold text-[#1A1A1A] focus:bg-[#F4F7F6]">
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Ödemeler
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-4 py-2.5 font-semibold text-[#1A1A1A] focus:bg-[#F4F7F6]">
                <BellIcon className="mr-2 h-4 w-4" />
                Bildirimler
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem className="rounded-xl px-4 py-2.5 font-bold text-destructive focus:bg-destructive/5 cursor-pointer">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
