'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';

const HOST_STATS = {
  totalEarnings: 15840,
  thisMonthEarnings: 3420,
  bookings: 24,
  reviews: 4.92,
  reviewCount: 127,
  responseRate: 98,
};

const HOST_LISTINGS = [
  {
    id: '1',
    title: 'Luxurious Beachfront Villa',
    location: 'Bali, Indonesia',
    bookings: 8,
    rating: 4.95,
    earnings: 3600,
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=400&h=300&fit=crop',
    status: 'active',
  },
  {
    id: '2',
    title: 'Modern Apartment in Downtown',
    location: 'New York, USA',
    bookings: 12,
    rating: 4.88,
    earnings: 3840,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    status: 'active',
  },
  {
    id: '3',
    title: 'Cozy Mountain Cabin',
    location: 'Colorado, USA',
    bookings: 4,
    rating: 4.92,
    earnings: 1120,
    image: 'https://images.unsplash.com/photo-1537671608828-cc564c51e25d?w=400&h=300&fit=crop',
    status: 'active',
  },
];

const UPCOMING_BOOKINGS = [
  {
    id: 'book-1',
    guestName: 'Sarah Anderson',
    listingTitle: 'Beachfront Villa',
    checkIn: '2024-03-20',
    checkOut: '2024-03-27',
    nights: 7,
    totalPrice: 3150,
    status: 'confirmed',
  },
  {
    id: 'book-2',
    guestName: 'Michael Chen',
    listingTitle: 'Downtown Apartment',
    checkIn: '2024-03-15',
    checkOut: '2024-03-18',
    nights: 3,
    totalPrice: 960,
    status: 'confirmed',
  },
  {
    id: 'book-3',
    guestName: 'Emma Davis',
    listingTitle: 'Beachfront Villa',
    checkIn: '2024-03-28',
    checkOut: '2024-04-04',
    nights: 7,
    totalPrice: 3150,
    status: 'pending',
  },
];

export default function HostDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useLocale();

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
              value: `$${HOST_STATS.totalEarnings.toLocaleString()}`,
              icon: DollarSign,
              color: 'text-green-500',
            },
            {
              label: t.hostDashboardThisMonth as string,
              value: `$${HOST_STATS.thisMonthEarnings}`,
              icon: TrendingUp,
              color: 'text-blue-500',
            },
            {
              label: t.hostDashboardBookings as string,
              value: HOST_STATS.bookings,
              icon: Calendar,
              color: 'text-purple-500',
            },
            {
              label: t.hostDashboardRating as string,
              value: `${HOST_STATS.reviews}★`,
              icon: Star,
              color: 'text-yellow-500',
            },
            {
              label: t.hostDashboardResponseRate as string,
              value: `${HOST_STATS.responseRate}%`,
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
        {activeTab === 'overview' && (
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
                {UPCOMING_BOOKINGS.map((booking) => (
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
                          {booking.listingTitle} • {booking.nights} nights
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {booking.checkIn} - {booking.checkOut}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            ${booking.totalPrice}
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
            {HOST_LISTINGS.map((listing) => (
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
                        {listing.bookings}
                      </p>
                    <p className="text-xs text-muted-foreground">
                      {t.hostDashboardBookingsLabel as string}
                    </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {listing.rating}
                      </p>
                    <p className="text-xs text-muted-foreground">
                      {t.hostDashboardRatingLabel as string}
                    </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        ${listing.earnings / 100}k
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
    </div>
  );
}
