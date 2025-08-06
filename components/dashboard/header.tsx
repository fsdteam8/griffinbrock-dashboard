"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export function DashboardHeader() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const token = session?.user?.accessToken;

  const {
    data: userData,
    isLoading,
    error,
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
    enabled: !!userId && !!token,
  });

  return (
    <div className="flex items-center justify-between mb-8 bg-[#1F2937] bg-[#ffffff]/10 h-[100px] px-8">
      <div className="flex-1" />
      <div className="flex items-center space-x-3">
        {isLoading ? (
          <>
            <span className="text-white font-medium animate-pulse">
              Loading...
            </span>
            <div className="h-10 w-10 rounded-full bg-gray-600 animate-pulse" />
          </>
        ) : error ? (
          <>
            <span className="text-red-400 font-medium">Error loading user</span>
            <div className="h-10 w-10 rounded-full bg-gray-600" />
          </>
        ) : (
          <>
            <Link href="/dashboard/settings" className="flex items-center space-x-2">
              <span className="text-white font-medium">
                {userData?.name || "User"}
              </span>
              <Image
                src={userData?.image || "/placeholder.svg?height=40&width=40"}
                alt="Profile"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
