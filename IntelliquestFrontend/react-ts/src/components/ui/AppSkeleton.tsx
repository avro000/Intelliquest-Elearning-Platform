import { Skeleton } from "@/components/ui/skeleton"

export function AppSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar Skeleton */}
      <header className="h-16 border-b border-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </header>

      {/* Main Body Skeleton */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
        {/* Hero / Banner Skeleton */}
        <div className="rounded-3xl p-8 bg-muted/30 border border-border space-y-4">
          <Skeleton className="h-10 w-2/5 rounded-xl" />
          <Skeleton className="h-5 w-3/5 rounded-lg" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-28 rounded-xl" />
          </div>
        </div>

        {/* Content Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-2xl border border-border p-5 space-y-4 bg-card shadow-sm">
                <Skeleton className="h-44 w-full rounded-xl" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  )
}
