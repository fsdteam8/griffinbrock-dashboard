import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex items-center justify-center h-64">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex items-center justify-center h-64">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
