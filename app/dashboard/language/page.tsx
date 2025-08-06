"use client"

import { Suspense } from "react"
import { LanguageTable } from "@/components/language/language-table"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"

export default function LanguagePage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <LanguageTable />
    </Suspense>
  )
}
