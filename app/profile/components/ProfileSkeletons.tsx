'use client';

export function BookingSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card/40 p-5 space-y-4">
      <div className="flex gap-4 md:gap-6">
        <div className="w-28 h-24 bg-muted animate-pulse rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <div className="h-5 bg-muted animate-pulse rounded-full w-48" />
            <div className="h-4 bg-muted animate-pulse rounded-full w-16" />
          </div>
          <div className="flex gap-3">
            <div className="h-3 bg-muted animate-pulse rounded-full w-24" />
            <div className="h-3 bg-muted animate-pulse rounded-full w-32" />
            <div className="h-3 bg-muted animate-pulse rounded-full w-20" />
          </div>
          <div className="h-5 bg-muted animate-pulse rounded-full w-32 mt-2" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <div className="h-8 bg-muted animate-pulse rounded-2xl w-16" />
        <div className="h-8 bg-muted animate-pulse rounded-2xl w-20" />
        <div className="h-8 bg-muted animate-pulse rounded-2xl w-16" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
      <aside className="lg:col-span-3 space-y-6">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-20 mb-4 ml-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted rounded-2xl w-full" />
          ))}
        </div>
        <div className="h-24 bg-muted rounded-2xl w-full" />
      </aside>
      <div className="lg:col-span-9 space-y-12">
        <div className="h-40 bg-muted rounded-3xl w-full" />
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="h-8 bg-muted rounded-lg w-48" />
            <div className="h-8 bg-muted rounded-lg w-32" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-3xl w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
