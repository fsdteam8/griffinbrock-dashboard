"use client"

import { Suspense } from "react"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Over View</h1>
          <p className="text-gray-400">Dashboard</p>
        </div>

        {/* Charts */}
        <OverviewCharts />
      </div>
    </Suspense>
  )
}
