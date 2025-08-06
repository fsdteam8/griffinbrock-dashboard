import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-slate-700 px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-700">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="bg-slate-700 px-6 py-4 flex justify-between items-center">
          <Skeleton className="h-4 w-48" />
          <div className="flex space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
