"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/lib/store/hooks"
import { fetchNotificationSummary, type NotificationSummary } from "@/lib/supabase/notifications"

export function DashboardNotifications({ className }: { className?: string }) {
  const { profile } = useAppSelector((s) => s.user)
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState<NotificationSummary | null>(null)
  const [loading, setLoading] = useState(false)

  const role: "admin" | "host" | "guest" = useMemo(() => {
    if (!profile) return "guest"
    return profile.isAdmin ? "admin" : profile.isHost ? "host" : "guest"
  }, [profile])

  useEffect(() => {
    if (!open || !profile?.id) return
    setLoading(true)
    fetchNotificationSummary(profile.id, role)
      .then(setSummary)
      .finally(() => setLoading(false))
  }, [open, profile?.id, role])

  const unread = summary?.unreadMessages ?? 0
  const secondaryCount = role === "host" ? summary?.upcomingHostCheckins ?? 0 : summary?.upcomingTrips ?? 0
  const showDot = unread > 0 || secondaryCount > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center text-foreground cursor-pointer hover:bg-accent transition-colors relative",
            className,
          )}
          aria-label="Bildirimler"
        >
          <Bell className="size-4" />
          {showDot ? (
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive border border-white" />
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-80 rounded-2xl p-2 shadow-2xl border border-border/70 backdrop-blur-xl bg-popover/95"
      >
        <div className="px-3 py-2">
          <div className="text-sm font-extrabold text-foreground">Bildirimler</div>
          <div className="text-[11px] text-muted-foreground font-medium">
            {loading ? "Güncelleniyor..." : "Özet ve hızlı aksiyonlar"}
          </div>
        </div>

        <div className="px-2 pb-2 space-y-1">
          <Link
            href="/dashboard/messages"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-accent/60 transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-foreground">Yeni mesajlar</div>
              <div className="text-[11px] text-muted-foreground font-medium">Okunmamış mesaj sayısı</div>
            </div>
            <div className="text-xs font-black text-primary">{unread}</div>
          </Link>

          <Link
            href="/dashboard/bookings"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-accent/60 transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-foreground">
                {role === "host" ? "Yaklaşan girişler" : "Yaklaşan seyahatler"}
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">
                {role === "host" ? "Önümüzdeki 7 gün" : "Bugünden itibaren"}
              </div>
            </div>
            <div className="text-xs font-black text-primary">{secondaryCount}</div>
          </Link>

          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-accent/60 transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-foreground">Bildirim ayarları</div>
              <div className="text-[11px] text-muted-foreground font-medium">Tercihlerinizi yönetin</div>
            </div>
            <div className="text-xs font-bold text-muted-foreground">→</div>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
