"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { languageApi } from "@/lib/api";
import type { Language, LanguageResponse } from "@/types/auth";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { AddLanguageModal } from "./add-language-modal";
import { EditLanguageModal } from "./edit-language-modal";
import { Pagination } from "@/components/ui/pagination"; // Assuming this is your Pagination component

export function LanguageTable() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editLanguage, setEditLanguage] = useState<Language | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Set default limit to 10, adjust as needed
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<LanguageResponse>({
    queryKey: ["languages", currentPage, limit],
    queryFn: () => languageApi.getAll({ page: currentPage, limit }),
  });

  const languages = data?.data?.languages || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, total);

  const deleteMutation = useMutation({
    mutationFn: languageApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["languages"] });
      toast({
        title: "Success",
        description: "Language deleted successfully",
      });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete language",
        variant: "destructive",
      });
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-slate-700 rounded animate-pulse" />
            <div className="flex items-center space-x-2 mt-1">
              <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
              <span>›</span>
              <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
              <span>›</span>
              <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
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

  if (!languages.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">No languages available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Language</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
            <span>Dashboard</span>
            <span>›</span>
            <span>Language</span>
            <span>›</span>
            <span>List</span>
          </div>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-[#22A7D333]/20 hover:bg-[#22A7D333]/60 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Language Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {languages.map((language: Language) => (
                <tr key={language._id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={language.image || "/placeholder.svg?height=32&width=32"}
                        alt={language.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">
                        {language.name} ({language.code?.toUpperCase()})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(language.createdAt).toLocaleDateString()}{" "}
                    {new Date(language.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditLanguage(language)}
                        className="text-gray-400 hover:text-white hover:bg-slate-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(language._id)}
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
                : "No languages to display"}
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
      />

      <AddLanguageModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      <EditLanguageModal isOpen={!!editLanguage} onClose={() => setEditLanguage(null)} language={editLanguage} />
    </div>
  );
}