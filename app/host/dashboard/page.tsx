'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Star,
  Users,
  Plus,
  LogOut,
  Settings,
  Eye,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchHostByUserId, fetchHostListings, fetchHostStats, fetchHostBookings, type HostListingCard, type HostBooking, type HostStats } from '@/lib/supabase/host';

export default function HostDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<HostStats | null>(null);
  const [listings, setListings] = useState<HostListingCard[]>([]);
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();
  const { profile } = useAppSelector((s) => s.user);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      setLoading(true);
      const hostProfile = await fetchHostByUserId(profile.id);
      if (!hostProfile) {
        setLoading(false);
        return;
      }
      const [hostListings, hostStats, hostBookings] = await Promise.all([
        fetchHostListings(hostProfile.hostId),
        fetchHostStats(hostProfile.hostId),
        fetchHostBookings(hostProfile.hostId),
      ]);
      setListings(hostListings);
      setStats(hostStats);
      setBookings(hostBookings);
      setLoading(false);
    };
    load();
  }, [profile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            StayHub
          </Link>
          <div className="flex items-center gap-4">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              {t.hostDashboardNewListing as string}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              {t.dashboardSettings as string}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4" />
              {t.dashboardLogout as string}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && !profile && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              Ev sahibi panelini görmek için önce giriş yapmalısınız.
            </p>
            <Link href="/auth/login" className="mt-4 inline-flex">
              <Button>{t.login as string}</Button>
            </Link>
          </div>
        )}

        {!loading && profile && stats && (
        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
        >
          {[
            {
              label: t.hostDashboardTotalEarnings as string,
              value: `₺${stats.totalEarnings.toLocaleString('tr-TR')}`,
              icon: DollarSign,
              color: 'text-green-500',
            },
            {
              label: t.hostDashboardThisMonth as string,
              value: `₺${stats.thisMonthEarnings.toLocaleString('tr-TR')}`,
              icon: TrendingUp,
              color: 'text-blue-500',
            },
            {
              label: t.hostDashboardBookings as string,
              value: stats.bookings,
              icon: Calendar,
              color: 'text-purple-500',
            },
            {
              label: t.hostDashboardRating as string,
              value: `${stats.averageRating.toFixed(2)}★`,
              icon: Star,
              color: 'text-yellow-500',
            },
            {
              label: t.hostDashboardResponseRate as string,
              value: `${stats.responseRate}%`,
              icon: MessageSquare,
              color: 'text-pink-500',
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={item}
                whileHover={{ scale: 1.05 }}
                className="border border-border rounded-xl bg-card/50 p-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-4 mb-8 border-b border-border"
        >
          {[
            { id: 'overview', label: t.hostDashboardTabOverview as string },
            { id: 'listings', label: t.hostDashboardTabListings as string },
            { id: 'bookings', label: t.hostDashboardTabBookings as string },
            { id: 'analytics', label: t.hostDashboardTabAnalytics as string },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && bookings && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Upcoming Bookings */}
            <motion.div variants={item}>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t.hostDashboardUpcomingBookings as string}
              </h2>
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    whileHover={{ scale: 1.01 }}
                    className="border border-border rounded-xl bg-card/50 p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {booking.guestName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {booking.listingTitle ?? 'İlan'} • {booking.nights} nights
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {booking.checkIn} - {booking.checkOut}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            ₺{booking.totalPrice.toLocaleString('tr-TR')}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                                : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                            }`}
                          >
                            {booking.status === 'confirmed'
                              ? (t.hostDashboardStatusConfirmed as string)
                              : (t.hostDashboardStatusPending as string)}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          {t.dashboardViewDetails as string}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: t.hostDashboardActiveListings as string,
                  value: '3',
                  desc: 'All performing well',
                },
                {
                  label: t.hostDashboardAvgResponseTime as string,
                  value: '2h',
                  desc: 'Keep it up!',
                },
                {
                  label: t.hostDashboardOccupancyRate as string,
                  value: '78%',
                  desc: 'Above average',
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="border border-border rounded-xl bg-card/50 p-4"
                >
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stat.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                whileHover={{ scale: 1.02 }}
                className="border border-border rounded-xl overflow-hidden bg-card/50"
              >
                <div className="relative h-48">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-green-500/20 rounded-full">
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Active
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground truncate">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {listing.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {listing.bookingsCount}
                      </p>
                    <p className="text-xs text-muted-foreground">
                      {t.hostDashboardBookingsLabel as string}
                    </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {listing.rating.toFixed(2)}
                      </p>
                    <p className="text-xs text-muted-foreground">
                      {t.hostDashboardRatingLabel as string}
                    </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        ₺{listing.earnings.toLocaleString('tr-TR')}
                      </p>
                    <p className="text-xs text-muted-foreground">
                      {t.hostDashboardEarnedLabel as string}
                    </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Eye className="w-4 h-4" />
                      {t.hostDashboardView as string}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      {t.hostDashboardEdit as string}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {UPCOMING_BOOKINGS.map((booking) => (
              <motion.div
                key={booking.id}
                whileHover={{ scale: 1.01 }}
                className="border border-border rounded-xl bg-card/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {booking.guestName}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {booking.listingTitle} • {booking.checkIn} to {booking.checkOut}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      ${booking.totalPrice}
                    </p>
                    <Button className="mt-2" variant="outline">
                      {t.hostDashboardMessageGuest as string}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="border border-border rounded-xl bg-card/50 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                {t.hostDashboardEarningsTrend as string}
              </h3>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                {/* Chart placeholder */}
                <p>{t.hostDashboardChartComingSoon as string}</p>
              </div>
            </div>

            <div className="border border-border rounded-xl bg-card/50 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                {t.hostDashboardBookingRate as string}
              </h3>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                {/* Chart placeholder */}
                <p>{t.hostDashboardChartComingSoon as string}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      )}
    </div>
  );
}
