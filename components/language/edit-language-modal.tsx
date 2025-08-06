"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { languageApi } from "@/lib/api"
import type { Language } from "@/types/auth"

interface EditLanguageModalProps {
  isOpen: boolean
  onClose: () => void
  language: Language | null
}

export function EditLanguageModal({ isOpen, onClose, language }: EditLanguageModalProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [about, setAbout] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (language) {
      setName(language.name)
      setCode(language.code)
      setDescription(language.description || "")
      setAbout(language.about || "")
      setImagePreview(language.image)
    }
  }, [language])

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => languageApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["languages"] })
      toast.success("Language updated successfully")
      handleClose()
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update language")
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!language) return

    const formData = new FormData()
    formData.append("name", name)
    formData.append("code", code)
    formData.append("description", description)
    formData.append("about", about)
    if (image) {
      formData.append("imageLink", image)
    }

    updateMutation.mutate({ id: language._id, data: formData })
  }

  const handleClose = () => {
    setName("")
    setCode("")
    setDescription("")
    setAbout("")
    setImage(null)
    setImagePreview(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Language</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Language Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add your Language Name..."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="text-gray-300">
              Language Code
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., en, bn, es"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the language..."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about" className="text-gray-300">
              About
            </Label>
            <Input
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Additional details about the language..."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label className="text-gray-300">Thumbnail</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-slate-500">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Click to upload image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateMutation.isPending}
              className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="bg-[#22A7D333] hover:bg-[#22A7D333]/60">
              {updateMutation.isPending ? "Updating..." : "Update Language"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}