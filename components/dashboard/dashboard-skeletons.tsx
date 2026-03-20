import { Skeleton } from '@/components/ui/skeleton';

// ── Dashboard Overview ────────────────────────────────────────────────────────
export function DashboardOverviewSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      {/* Quick links */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ── Listings ──────────────────────────────────────────────────────────────────
export function ListingsSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Search row */}
      <Skeleton className="h-9 w-64 rounded-lg" />
      {/* Table rows */}
      <div className="rounded-2xl border border-border/60 overflow-hidden">
        <div className="flex flex-col divide-y divide-border/40">
          {/* Header */}
          <div className="flex gap-4 px-4 py-3">
            {[120, 200, 120, 80, 80, 80].map((w, i) => (
              <Skeleton key={i} className="h-4 rounded" style={{ width: w }} />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-10 w-16 rounded-lg shrink-0" />
              <Skeleton className="h-4 flex-1 max-w-50 rounded" />
              <Skeleton className="h-4 w-30 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export function ReviewsSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border/60 overflow-hidden">
        <div className="flex flex-col divide-y divide-border/40">
          {/* Header */}
          <div className="flex gap-6 px-4 py-3">
            {[120, 120, 60, 70, 80, 70, 60, 80].map((w, i) => (
              <Skeleton key={i} className="h-4 rounded" style={{ width: w }} />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4 py-3">
              {[120, 120, 60, 70, 80, 70, 60, 80].map((w, j) => (
                <Skeleton key={j} className="h-4 rounded" style={{ width: w }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Coupons ───────────────────────────────────────────────────────────────────
export function CouponsSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      {/* Coupon cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// ── Earnings ──────────────────────────────────────────────────────────────────
export function EarningsSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header + period buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-44 rounded-lg" />
          <Skeleton className="h-4 w-56 rounded" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-16 rounded-lg" />
          ))}
        </div>
      </div>
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
      {/* Recent bookings */}
      <div className="rounded-2xl border border-border/60 overflow-hidden">
        <div className="flex flex-col divide-y divide-border/40">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-4 flex-1 max-w-50 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Availability Calendar ─────────────────────────────────────────────────────
export function AvailabilityCalendarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Listing select + nav row */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-9 w-60 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-5 w-28 rounded" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
      {/* Calendar grid */}
      <div className="rounded-xl border border-border/70 bg-card/90 p-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday labels */}
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((w) => (
            <div key={w} className="py-1 text-center">
              <Skeleton className="mx-auto h-4 w-8 rounded" />
            </div>
          ))}
          {/* Day cells — 35 slots */}
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="min-h-10 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
