"use client"

import { Suspense } from "react"
import { UserTable } from "@/components/user-profile/user-table"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"

export default function ProfilePage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <UserTable />
    </Suspense>
  )
}
