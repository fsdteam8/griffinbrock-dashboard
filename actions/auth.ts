"use server"

import type { AuthResponse } from "@/types/auth"

export async function forgotPassword(email: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/forget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: "Failed to send OTP",
      data: null,
    }
  }
}

export async function verifyOTP(email: string, otp: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: "Failed to verify OTP",
      data: null,
    }
  }
}

export async function resetPassword(password: string, otp: string, email: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, otp, email }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: "Failed to reset password",
      data: null,
    }
  }
}
