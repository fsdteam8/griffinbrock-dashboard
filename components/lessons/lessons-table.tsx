"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { conceptApi } from "@/lib/api";
import type { Concept, ConceptResponse } from "@/types/auth";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { AddLessonModal } from "./add-lesson-modal";
import { EditLessonModal } from "./edit-lesson-modal";
import { Pagination } from "@/components/ui/pagination";

export function LessonsTable() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editLesson, setEditLesson] = useState<Concept | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const queryClient = useQueryClient();

  const { data: conceptsData, isLoading, isError } = useQuery<ConceptResponse>({
    queryKey: ["concepts", currentPage, limit],
    queryFn: () => conceptApi.getAll({ page: currentPage, limit }), // Pass token if needed
  });

  const concepts = conceptsData?.data?.concepts || [];
  const total = conceptsData?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, total);

  const deleteMutation = useMutation({
    mutationFn: conceptApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concepts"] });
      toast.success("Lesson deleted successfully");
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete lesson");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-slate-700 rounded animate-pulse" />
            <div className="flex items-center space-x-2 mt-1">
              <div className="h-4 w-20 bg-slate-600 rounded animate-pulse" />
              <span>›</span>
              <div className="h-4 w-20 bg-slate-600 rounded animate-pulse" />
              <span>›</span>
              <div className="h-4 w-20 bg-slate-600 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-32 bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Table Skeleton */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-32 bg-slate-600 rounded animate-pulse" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-32 bg-slate-600 rounded animate-pulse" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-24 bg-slate-600 rounded animate-pulse" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-slate-600 rounded-full animate-pulse" />
                        <div className="h-4 w-40 bg-slate-600 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-slate-600 rounded animate-pulse" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-slate-600 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-slate-600 rounded animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-700">
            <div className="h-4 w-48 bg-slate-600 rounded animate-pulse" />
            <div className="flex items-center space-x-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-8 w-8 bg-slate-600 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Failed to load lessons</div>
      </div>
    );
  }

  if (!concepts.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">No lessons available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lessons</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
            <span>Dashboard</span>
            <span>›</span>
            <span>Lessons</span>
            <span>›</span>
            <span>List</span>
          </div>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#22A7D333]/20 hover:bg-[#22A7D333]/60 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Lessons
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Lessons Categories Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {concepts.map((concept: Concept) => (
                <tr key={concept._id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={concept.image || "/placeholder.svg?height=32&width=32"}
                        alt={concept.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">{concept.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(concept.createdAt).toLocaleDateString()}{" "}
                    {new Date(concept.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditLesson(concept)}
                        className="text-gray-400 hover:text-white hover:bg-slate-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(concept._id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-slate-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-700">
            <div className="text-sm text-gray-300">
              {total > 0
                ? `Showing ${startIndex} to ${endIndex} of ${total} results`
                : "No lessons to display"}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        isLoading={deleteMutation.isPending}
        title="Delete Lesson"
        description="Are you sure you want to delete this lesson? This action cannot be undone."
      />

      <AddLessonModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      <EditLessonModal
        isOpen={!!editLesson}
        onClose={() => setEditLesson(null)}
        lesson={editLesson}
      />
    </div>
  );
}