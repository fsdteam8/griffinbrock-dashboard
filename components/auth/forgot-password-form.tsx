"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { forgotPassword } from "@/actions/auth"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await forgotPassword(email)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`)
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
        <h1 className="text-2xl font-semibold text-gray-400 mb-2">Forget Password?</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-[#D1D5DB]">Enter your Personal Information</p>
        </div>
        <div className="relative"> 
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 h-14 bg-slate-600 border-0 text-white placeholder:text-gray-300 rounded-lg"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-[#22A7D3] hover:bg-[#22A7D3] text-white font-medium rounded-lg"
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </div>
  )
}
