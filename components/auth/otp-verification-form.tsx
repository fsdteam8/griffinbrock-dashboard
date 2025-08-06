"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { forgotPassword, resetPassword } from "@/actions/auth"

export function OTPVerificationForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "sozibbdcalling2025@gmail.com" // Default email from provided data
  const { toast } = useToast()

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter all 6 digits",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Use resetPassword to verify OTP with hardcoded password
      const result = await resetPassword("1234567", otpString, email)
      if (result.success) {
        toast({
          title: "Success",
          description: "OTP verified successfully!",
        })
        // Redirect to ResetPasswordForm with email and otp
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otpString}`)
      } else {
        toast({
          title: "Error",
          description: result.message || "Invalid OTP",
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

  const handleResend = async () => {
    setIsResending(true)
    try {
      const result = await forgotPassword(email)
      if (result.success) {
        toast({
          title: "Success",
          description: "OTP sent successfully!",
        })
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
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
        description: "Failed to resend OTP",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#1F2937] rounded-2xl p-8 shadow-lg">
      <div className="text-center text-white mb-4 text-[32px] font-bold">
        <h1>Verify Email</h1>
      </div>
      <div className="text-center mb-8">
        <p className="text-gray-400 mb-6 space-y-4">
          {"We’ve sent a verification code to "}
          <span className="text-gray-200">{email}</span>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg ${
                digit ? "bg-cyan-100 border-cyan-300 text-gray-800" : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-red-500">{"Didn't receive OTP?"}</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-cyan-500 hover:text-cyan-600 font-medium"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-[#22A7D3] hover:bg-[#22A7D3] text-white font-medium rounded-lg"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </div>
  )
}