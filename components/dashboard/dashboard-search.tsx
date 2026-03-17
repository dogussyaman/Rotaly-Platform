"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, ListIcon, Loader2, MessageSquare, Search } from "lucide-react"

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { useAppSelector } from "@/lib/store/hooks"
import { dashboardSearch, type DashboardSearchResults } from "@/lib/supabase/dashboard-search"

export function DashboardSearch() {
  const { profile } = useAppSelector((s) => s.user)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const role: "admin" | "host" | "guest" = useMemo(() => {
    if (!profile) return "guest"
    return profile.isAdmin ? "admin" : profile.isHost ? "host" : "guest"
  }, [profile])

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DashboardSearchResults>({
    listings: [],
    bookings: [],
    conversations: [],
  })

  useEffect(() => {
    if (!profile?.id) return
    const q = query.trim()
    if (q.length < 2) {
      setResults({ listings: [], bookings: [], conversations: [] })
      setLoading(false)
      return
    }

    setLoading(true)
    const handle = setTimeout(() => {
      dashboardSearch({ userId: profile.id, role, query: q, limit: 5 })
        .then(setResults)
        .finally(() => setLoading(false))
    }, 220)

    return () => clearTimeout(handle)
  }, [profile?.id, query, role])

  const hasAny =
    results.listings.length > 0 || results.bookings.length > 0 || results.conversations.length > 0

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <Popover open={open && (query.trim().length >= 2 || loading)} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="hidden md:flex relative max-w-md w-full ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false)
                inputRef.current?.blur()
              }
              if (e.key === "Enter") {
                const q = query.trim()
                if (q.length >= 2) go(`/dashboard/search?q=${encodeURIComponent(q)}`)
              }
            }}
            placeholder="İçerik, ilan veya rezervasyon ara..."
            className="h-9 w-full bg-muted/60 border border-border/60 rounded-xl pl-10 text-xs font-medium focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/40"
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        className="w-[520px] max-w-[calc(100vw-2rem)] p-0 rounded-2xl shadow-2xl border border-border/70 bg-popover/95 backdrop-blur-xl"
        align="start"
        sideOffset={10}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command className="bg-transparent">
          <CommandList className="max-h-[340px]">
            {loading ? (
              <div className="px-4 py-6 flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Aranıyor...
              </div>
            ) : !hasAny ? (
              <CommandEmpty className="py-8 text-sm text-muted-foreground">Sonuç bulunamadı.</CommandEmpty>
            ) : (
              <>
                {results.listings.length > 0 ? (
                  <CommandGroup heading="İlanlar">
                    {results.listings.map((l) => (
                      <CommandItem key={l.id} value={l.title} onSelect={() => go(`/dashboard/listings?q=${encodeURIComponent(query.trim())}`)}>
                        <ListIcon className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{l.title}</div>
                          <div className="text-[11px] text-muted-foreground">{l.location}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}

                {(results.listings.length > 0 && (results.bookings.length > 0 || results.conversations.length > 0)) ? (
                  <CommandSeparator />
                ) : null}

                {results.bookings.length > 0 ? (
                  <CommandGroup heading="Rezervasyonlar">
                    {results.bookings.map((b) => (
                      <CommandItem key={b.id} value={b.listingTitle ?? b.id} onSelect={() => go(`/dashboard/bookings?q=${encodeURIComponent(query.trim())}`)}>
                        <Calendar className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{b.listingTitle ?? "Rezervasyon"}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {b.checkIn} → {b.checkOut} · {b.status}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}

                {(results.bookings.length > 0 && results.conversations.length > 0) ? <CommandSeparator /> : null}

                {results.conversations.length > 0 ? (
                  <CommandGroup heading="Mesajlar">
                    {results.conversations.map((c) => (
                      <CommandItem key={c.id} value={c.otherUserName ?? c.id} onSelect={() => go(`/messages?conversation=${encodeURIComponent(c.id)}`)}>
                        <MessageSquare className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{c.otherUserName ?? "Konuşma"}</div>
                          <div className="text-[11px] text-muted-foreground">{c.unreadCount > 0 ? `${c.unreadCount} yeni` : "Okundu"}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}

                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => go(`/dashboard/search?q=${encodeURIComponent(query.trim())}`)}>
                    <Search className="h-4 w-4" />
                    Tüm sonuçları gör
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
