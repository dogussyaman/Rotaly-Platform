"use client"

import { useRouter } from "next/navigation"
import { Settings, LogOut, User, ChevronDown } from "lucide-react"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardNotifications } from "@/components/dashboard/dashboard-notifications"
import { DashboardSearch } from "@/components/dashboard/dashboard-search"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { clearUser } from "@/lib/store/slices/user-slice"

type SiteHeaderProps = {
  title?: string
  subtitle?: string
}

export function SiteHeader({
  title = "Dashboard",
  subtitle = "Tüm operasyonları tek ekranda yönetin.",
}: SiteHeaderProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const profile = useAppSelector((s) => s.user.profile)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    dispatch(clearUser())
    router.replace("/auth/login")
  }

  return (
    <header className="mx-4 my-2 flex h-14 shrink-0 items-center justify-between rounded-2xl border border-border/80 bg-card/95 shadow-[0_1px_2px_0_rgba(17,24,39,0.06)] backdrop-blur">
      <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex flex-1 items-center gap-3">
          <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors" />
          <Separator orientation="vertical" className="h-4 opacity-30" />

          <div className="min-w-0 flex-1 text-left">
            <h1 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="truncate text-[11px] text-muted-foreground">
              {subtitle}
            </p>
          </div>

          <DashboardSearch />
        </div>

        <div className="flex items-center gap-2">
          {/* Quick shortcuts */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:bg-accent/80 hover:text-foreground"
            onClick={() => router.push("/dashboard/settings")}
            title="Ayarlar"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <DashboardNotifications />
          <div className="h-6 w-px bg-border/40 mx-1" />
          <LanguageSwitcher />
          <div className="h-6 w-px bg-border/40 mx-1" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-accent/80 hover:text-foreground"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline max-w-25 truncate">
                  {profile?.fullName ?? "Hesabım"}
                </span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-2xl border-border/70 bg-popover/95 p-1.5 shadow-xl">
              <DropdownMenuItem
                className="rounded-xl px-3 py-2 gap-2 cursor-pointer text-sm"
                onClick={() => router.push("/dashboard/profile")}
              >
                <User className="w-3.5 h-3.5" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl px-3 py-2 gap-2 cursor-pointer text-sm"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="w-3.5 h-3.5" />
                Ayarlar
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 opacity-50" />
              <DropdownMenuItem
                className="rounded-xl px-3 py-2 gap-2 cursor-pointer text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => void handleSignOut()}
              >
                <LogOut className="w-3.5 h-3.5" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

