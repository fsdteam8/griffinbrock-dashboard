"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import type { User } from "@/types/auth";
import { DeleteConfirmModal } from "../lessons/delete-confirm-modal";
import { Pagination } from "@/components/ui/pagination";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export function UserTable() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const queryClient = useQueryClient();

  const { data: session, status: sessionStatus } = useSession();
  const token = session?.user?.accessToken;

  const { data: usersData, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["users", currentPage, limit, token],
    queryFn: () => userApi.getAll({ page: currentPage, limit }, token),
    enabled: !!token && sessionStatus === "authenticated",
    retry: 2,
    staleTime: 1000 * 60,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
      setDeleteId(null);
      if (usersData?.data.users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.max(1, Math.ceil((usersData?.data.total ?? 0) / limit));
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const totalUsers = usersData?.data.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalUsers / limit));
  const startIndex = totalUsers > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endIndex = Math.min(currentPage * limit, totalUsers);

  // Skeleton Row Component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-600 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-slate-600 rounded-full"></div>
          <div className="h-4 bg-slate-600 rounded w-32"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-600 rounded w-48"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-8 w-8 bg-slate-600 rounded"></div>
      </td>
    </tr>
  );






  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
            <span>Dashboard</span>
            <span>›</span>
            <span>User Profile</span>
          </div>
        </div>
        <div className="bg-[#22A7D333] text-white px-4 py-2 rounded-lg">
          <div className="text-sm">Total Users</div>
          <div className="text-lg font-bold">+{totalUsers}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {isLoading ? (
                // Render 5 skeleton rows during initial loading
                Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
              ) : usersData?.data.users.length ? (
                usersData.data.users.map((user: User) => (
                  <tr key={user._id} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4 text-gray-300">{user._id.slice(-4)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={
                            typeof user.avatar === "string"
                              ? user.avatar
                              : user.avatar?.url || "/placeholder.svg?height=32&width=32"
                          }
                          alt={user.name || user.email}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(user._id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-slate-600"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-300">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalUsers > 10 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-700">
            <div className="text-sm text-gray-300">
              {totalUsers > 0
                ? `Showing ${startIndex} to ${endIndex} of ${totalUsers} results`
                : "No users to display"}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        isLoading={deleteMutation.isPending}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}