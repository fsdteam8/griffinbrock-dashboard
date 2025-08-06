"use client";

import React, { useRef, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { ChangePasswordModal } from "./change-password-modal";
import axios from "axios";
import { Edit, Loader2, Upload, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function SettingsForm() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const userId = session?.user?.id;

  // Fetch user data
  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID not found");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/single-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    },
    enabled: !!userId,
  });

  // Update form data when user data is fetched
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.name || "",
        userName: userData.username || "",
        email: userData.email || "",
        phoneNumber: userData.phone || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender || "",
      });
      setAvatarPreview(userData.avatar?.url || "");
    }
  }, [userData]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    setAvatarPreview(userData?.avatar?.url || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { avatar?: File }) => {
      if (!userId) throw new Error("User ID not found");
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.fullName);
      formDataToSend.append("username", data.userName);
      formDataToSend.append("email", data.email);
      formDataToSend.append("phone", data.phoneNumber);
      if (data.dateOfBirth) formDataToSend.append("dateOfBirth", data.dateOfBirth);
      if (data.gender) formDataToSend.append("gender", data.gender);
      if (data.avatar) formDataToSend.append("avatar", data.avatar);
      // userId is appended in userApi.update

      return userApi.update(userId, formDataToSend, token);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setIsEditMode(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetch();
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (error.message.includes("User ID is required")) {
        toast.error("User ID is required. Please try again.");
      } else {
        toast.error(error.message || "Failed to update profile");
      }
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      ...formData,
      avatar: selectedFile || undefined,
    });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormData({
      fullName: userData?.name || "",
      userName: userData?.username || "",
      email: userData?.email || "",
      phoneNumber: userData?.phone || "",
      dateOfBirth: userData?.dateOfBirth || "",
      gender: userData?.gender || "",
    });
    setAvatarPreview(userData?.avatar?.url || "");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">Error: {(error as Error).message}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Dashboard</span>
          <span>›</span>
          <span>Settings</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Image
                src={avatarPreview || "/placeholder.svg?height=80&width=80"}
                alt="Profile"
                width={300}
                height={300}
                className="h-20 w-20 rounded-full object-cover"
              />
              {isEditMode && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload className="h-6 w-6 text-white" />
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}
                </>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {formData.fullName}
              </h2>
              <p className="text-gray-400">@{formData.userName}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(true)}
              className="border-slate-600 text-gray-300 hover:bg-[#22A7D333]/60 hover:text-white bg-[#22A7D333]"
            >
              Change Password
            </Button>
            {!isEditMode ? (
              <Button
                onClick={() => setIsEditMode(true)}
                variant="outline"
                className="border-slate-600 text-gray-300 hover:text-white hover:bg-[#22A7D333]/60 bg-[#22A7D333] flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="border-slate-600 text-gray-300 hover:bg-[#22A7D333]/60 bg-transparent hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-[#22A7D333] hover:bg-[#22A7D333]/60 flex items-center gap-2"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300 text-sm">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="bg-[#4A5568] border-[#4A5568] text-white h-12 rounded-lg"
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-gray-300 text-sm">
                User Name
              </Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="bg-[#4A5568] border-[#4A5568] text-white h-12 rounded-lg"
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-[#4A5568] border-[#4A5568] text-white h-12 rounded-lg"
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-300 text-sm">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="bg-[#4A5568] border-[#4A5568] text-white h-12 rounded-lg"
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-300 text-sm">
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="bg-[#4A5568] border-[#4A5568] text-white h-12 rounded-lg"
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-300 text-sm">
                Gender
              </Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="bg-[#4A5568] border-[#4A5568] text-white h-12 rounded-lg w-full px-3"
                disabled={!isEditMode}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}