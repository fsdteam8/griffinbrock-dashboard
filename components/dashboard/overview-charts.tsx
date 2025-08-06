"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

export function OverviewCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Most Popular Languages Chart */}
      <Card className="bg-[#4A5568] border-[#4A5568] rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white text-lg font-medium">Most popular 5 Language</CardTitle>
          <button className="flex items-center space-x-1 text-gray-300 text-sm">
            <span>June</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="relative flex items-center justify-center h-64">
            {/* Pie Chart */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* English (US) - Cyan */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#22D3EE"
                  strokeWidth="20"
                  strokeDasharray="65.97 219.91"
                  strokeDashoffset="0"
                />
                {/* Abkhaz - Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="20"
                  strokeDasharray="43.98 219.91"
                  strokeDashoffset="-65.97"
                />
                {/* Hindi - Dark Gray */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#374151"
                  strokeWidth="20"
                  strokeDasharray="43.98 219.91"
                  strokeDashoffset="-109.95"
                />
                {/* English (UK) - Purple */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="20"
                  strokeDasharray="32.99 219.91"
                  strokeDashoffset="-153.93"
                />
                {/* Spanish - Yellow */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="20"
                  strokeDasharray="32.99 219.91"
                  strokeDashoffset="-186.92"
                />
              </svg>
            </div>

            {/* Labels */}
            <div className="absolute right-0 space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-sm"></div>
                <span className="text-gray-300">English (US)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span className="text-gray-300">Abkhaz</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                <span className="text-gray-300">Hindi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                <span className="text-gray-300">English (UK)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                <span className="text-gray-300">Spanish</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Users Chart */}
      <Card className="bg-[#4A5568] border-[#4A5568] rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white text-lg font-medium">Our new user</CardTitle>
          <button className="flex items-center space-x-1 text-gray-300 text-sm">
            <span>June</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              {/* Circular Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - 0.8)}`}
                  className="text-cyan-400"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-cyan-400">80%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
