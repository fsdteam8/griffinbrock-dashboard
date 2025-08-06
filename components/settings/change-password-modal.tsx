"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Loader2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { data: session } = useSession()
  const token = session?.user?.accessToken

  const mutation = useMutation({
    mutationFn: async ({ oldPassword, newPassword, confirmPassword }: { 
      oldPassword: string, 
      newPassword: string, 
      confirmPassword: string 
    }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/change-password`,
        {
          oldPassword,
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    },
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message || "Failed to change password")
      }
      toast.success("Password changed successfully")
      handleClose()
    },
    onError: (error: any) => {
      console.error("Password change error:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to change password")
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    mutation.mutate({
      oldPassword: currentPassword,
      newPassword,
      confirmPassword
    })
  }

  const handleClose = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white">Change Password</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose} 
            className="text-gray-400 hover:text-white"
            disabled={mutation.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-gray-300">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white pr-10"
                required
                disabled={mutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={mutation.isPending}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-gray-300">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white pr-10"
                required
                disabled={mutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={mutation.isPending}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters</p>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white pr-10"
                required
                disabled={mutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={mutation.isPending}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={mutation.isPending} 
              className="bg-cyan-500 hover:bg-cyan-600 flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}