'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import {
  Heart,
  MapPin,
  Star,
  LogOut,
  Settings,
  MessageSquare,
  Calendar,
  Home,
  User,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';

const SAVED_LISTINGS = [
  {
    id: '1',
    title: 'Luxurious Beachfront Villa',
    location: 'Bali, Indonesia',
    pricePerNight: 450,
    rating: 4.95,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Modern Apartment in Downtown',
    location: 'New York, USA',
    pricePerNight: 320,
    rating: 4.88,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Historic Parisian Apartment',
    location: 'Paris, France',
    pricePerNight: 380,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  },
];

const UPCOMING_TRIPS = [
  {
    id: 'trip-1',
    listingTitle: 'Tropical Island Bungalow',
    location: 'Maldives',
    checkIn: '2024-04-15',
    checkOut: '2024-04-22',
    totalPrice: 3640,
    hostName: 'Sarah Wilson',
  },
  {
    id: 'trip-2',
    listingTitle: 'Mountain Cabin Retreat',
    location: 'Colorado, USA',
    checkIn: '2024-05-10',
    checkOut: '2024-05-17',
    totalPrice: 1960,
    hostName: 'James Miller',
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate traveler and explorer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  });
  const { t } = useLocale();

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-border rounded-2xl bg-card/50 backdrop-blur-sm p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Image
                src={profileData.avatar}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full border-4 border-primary"
              />
            </motion.div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {profileData.fullName}
              </h1>
              <p className="text-muted-foreground mb-4">{profileData.bio}</p>
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t.dashboardMemberSince as string}
                  </p>
                  <p className="font-semibold text-foreground">January 2022</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t.dashboardReviewsLabel as string}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <p className="font-semibold text-foreground">4.95 (48)</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-primary hover:bg-primary/90"
            >
              {isEditing ? (t.dashboardSaveProfile as string) : (t.dashboardEditProfile as string)}
            </Button>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="border-t border-border pt-8 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">
                    {t.signupFullName as string}
                  </Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    {t.loginEmailLabel as string}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-foreground">
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-4 mb-8 border-b border-border"
        >
          {[
            { id: 'overview', label: t.dashboardOverview as string, icon: Home },
            { id: 'trips', label: t.dashboardTrips as string, icon: Calendar },
            { id: 'saved', label: t.dashboardSaved as string, icon: Heart },
            { id: 'messages', label: t.dashboardMessages as string, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Quick Stats */}
            <motion.div
              variants={item}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {[
                { label: t.dashboardTotalBookings as string, value: '12', icon: Calendar },
                { label: t.dashboardSavedPlaces as string, value: '23', icon: Heart },
                { label: t.dashboardMessagesStat as string, value: '5', icon: MessageSquare },
                { label: t.dashboardWishlists as string, value: '3', icon: User },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="border border-border rounded-xl bg-card/50 p-6 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={item}>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t.dashboardUpcomingTripsTitle as string}
              </h2>
              <div className="space-y-4">
                {UPCOMING_TRIPS.map((trip) => (
                  <motion.div
                    key={trip.id}
                    whileHover={{ scale: 1.02 }}
                    className="border border-border rounded-xl bg-card/50 p-6 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {trip.listingTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {trip.location}
                        </span>
                        <span>{trip.checkIn} to {trip.checkOut}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        ${trip.totalPrice}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        {t.dashboardViewDetails as string}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'trips' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {UPCOMING_TRIPS.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ scale: 1.01 }}
                className="border border-border rounded-xl bg-card/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {trip.listingTitle}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {trip.checkIn} - {trip.checkOut}
                    </p>
                  </div>
                  <Button>{t.dashboardViewTrip as string}</Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'saved' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SAVED_LISTINGS.map((listing) => (
              <motion.div
                key={listing.id}
                whileHover={{ scale: 1.02 }}
                className="border border-border rounded-xl overflow-hidden bg-card/50 hover:border-primary/50 transition-colors"
              >
                <div className="relative h-48">
                  <Image
                    src={listing.imageUrl}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </motion.button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground truncate">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1 mb-3">
                    <MapPin className="w-4 h-4" />
                    {listing.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">
                        ${listing.pricePerNight}
                      </p>
                      <p className="text-xs text-muted-foreground">per night</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-semibold text-foreground">
                        {listing.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t.dashboardNoMessagesTitle as string}
            </h3>
            <p className="text-muted-foreground">
              {t.dashboardNoMessagesSubtitle as string}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
