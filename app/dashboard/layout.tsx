import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-80">
        <DashboardHeader />
        <div className="p-6">
          
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
