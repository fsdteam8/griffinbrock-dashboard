"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from "@/actions/auth"

export function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  // Default to provided email and OTP if not in URL
  const email = searchParams.get("email") || "sozibbdcalling2025@gmail.com"
  const otp = searchParams.get("otp") || "428930"
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword(password, otp, email)

      if (result.success) {
        toast({
          title: "Success",
          description: "Password reset successfully!",
        })
        router.push("/auth/login")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#1F2937] bg-[#ffffff]/10 rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-400 mb-2">Create a new password</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter set new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-12 h-14 bg-slate-600 border-0 text-white placeholder:text-gray-300 rounded-lg"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-12 pr-12 h-14 bg-slate-600 border-0 text-white placeholder:text-gray-300 rounded-lg"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-[#22A7D3] hover:bg-[#22A7D3] text-white font-medium rounded-lg"
        >
          {isLoading ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </div>
  )
}