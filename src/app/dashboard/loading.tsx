export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="mb-10 space-y-2">
        <div className="h-7 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
        <div className="h-4 w-80 animate-pulse rounded-lg bg-white/[0.04]" />
      </div>

      {/* Stats grid skeleton */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <div className="mb-3 h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
            <div className="mb-2 h-7 w-20 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* Actions skeleton */}
      <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06]" />
    </div>
  );
}
