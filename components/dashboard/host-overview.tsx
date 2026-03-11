'use client';

import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Star,
  Plus,
  Briefcase,
  Home as HomeIcon,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChartAreaInteractive } from "./chart-area-interactive";

const HOST_STATS = [
  {
    title: "Toplam Kazanç",
    value: "₺42,500",
    description: "Geçen aya göre %12 artış",
    icon: DollarSign,
    trend: "+12.5%",
    trendUp: true
  },
  {
    title: "Aktif Rezervasyonlar",
    value: "18",
    description: "Bu hafta 4 yeni giriş",
    icon: Calendar,
    trend: "+2",
    trendUp: true
  },
  {
    title: "Doluluk Oranı",
    value: "%85",
    description: "Bölge ortalamasının üstünde",
    icon: TrendingUp,
    trend: "+5%",
    trendUp: true
  },
  {
    title: "Ev Sahibi Puanı",
    value: "4.9",
    description: "Toplam 124 değerlendirme",
    icon: Star,
    trend: "Süper Ev Sahibi",
    trendUp: true
  }
];

const RECENT_BOOKINGS = [
  {
    id: "BK-721",
    guest: "Ahmet Yılmaz",
    listing: "Ege Manzaralı Villa",
    checkIn: "15 Haz 2024",
    status: "Confirmed",
    amount: "₺4,200",
    avatar: "AY"
  },
  {
    id: "BK-845",
    guest: "Elif Demir",
    listing: "Luxury City Loft",
    checkIn: "18 Haz 2024",
    status: "Pending",
    amount: "₺2,100",
    avatar: "ED"
  },
  {
    id: "BK-912",
    guest: "Caner Öz",
    listing: "Boğaz Manzaralı Daire",
    checkIn: "20 Haz 2024",
    status: "Cancelled",
    amount: "₺3,500",
    avatar: "CÖ"
  }
];

export function HostOverview() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ev Sahibi Paneli</h1>
          <p className="text-muted-foreground">İşletmenizin performansını ve rezervasyonlarınızı yönetin.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-2xl shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Yeni İlan Ekle
          </Button>
          <Button variant="outline" className="rounded-2xl">
            <Calendar className="mr-2 h-4 w-4" /> Takvim
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {HOST_STATS.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden group border-none bg-gradient-to-br from-card to-muted/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.trendUp ? 'bg-primary' : 'bg-destructive'}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground/80">
              <CardDescription className="text-sm font-medium">{stat.title}</CardDescription>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
              <div className="flex items-center mt-1">
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-4 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Kazanç Analizi</CardTitle>
            <CardDescription>Son 30 günlük gelir değişimi</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartAreaInteractive />
          </CardContent>
        </Card>

        {/* Recent Messages / Action Center */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mesajlar</CardTitle>
              <CardDescription>Misafirlerinizden gelen son sorular</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    M{i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-bold truncate">Misafir {i}</p>
                      <span className="text-[10px] text-muted-foreground">10dk önce</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                      Merhaba, giriş saatini 14:00 yerine 12:00 yapabilir miyiz?
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="secondary" className="w-full rounded-2xl text-xs flex items-center gap-1 group">
                Tüm Mesajları Gör <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Son Rezervasyonlar</CardTitle>
            <CardDescription>Onay bekleyen ve yaklaşan seyahatler</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl">Tümünü Gör</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-muted/20">
                <TableHead>Misafir</TableHead>
                <TableHead>İlan</TableHead>
                <TableHead>Giriş Tarihi</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_BOOKINGS.map((booking) => (
                <TableRow key={booking.id} className="group hover:bg-muted/30 border-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10">
                        {booking.avatar}
                      </div>
                      <span className="font-medium">{booking.guest}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{booking.listing}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Pending' ? 'secondary' : 'destructive'}
                      className="rounded-lg text-[10px] uppercase font-bold tracking-tight px-2 py-0.5"
                    >
                      {booking.status === 'Confirmed' ? 'Onaylandı' : booking.status === 'Pending' ? 'Beklemede' : 'İptal'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">{booking.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
