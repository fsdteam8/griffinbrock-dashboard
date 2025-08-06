"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { conceptApi } from "@/lib/api"
import type { Concept } from "@/types/auth"

interface EditLessonModalProps {
  isOpen: boolean
  onClose: () => void
  lesson: Concept | null
}

export function EditLessonModal({ isOpen, onClose, lesson }: EditLessonModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (lesson) {
      setName(lesson.name)
      setDescription(lesson.description)
      setImagePreview(lesson.image)
    }
  }, [lesson])

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => conceptApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concepts"] })
      toast.success("Lesson updated successfully")
      handleClose()
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update lesson")
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
    if (!lesson) return

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    if (image) {
      formData.append("image", image)
    }

    updateMutation.mutate({ id: lesson._id, data: formData })
  }

  const handleClose = () => {
    setName("")
    setDescription("")
    setImage(null)
    setImagePreview(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Lesson</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">
              Lessons Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add your Lessons Name..."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add lesson description..."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              rows={3}
              required
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
              className="border-slate-600 text-gray-300 hover:bg-slate-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="bg-cyan-500 hover:bg-cyan-600">
              {updateMutation.isPending ? "Updating..." : "Update Lessons"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
