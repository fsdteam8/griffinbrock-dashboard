"use client"

import { Suspense } from "react"
import { LessonsTable } from "@/components/lessons/lessons-table"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"

export default function LessonsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <LessonsTable />
    </Suspense>
  )
}
