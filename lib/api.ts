// lib/api.ts
import apiClient from "./axios";
import type {
  Language,
  Concept,
  ConceptResponse,
  User,
  UserResponse,
  PaginationParams,
  LanguageResponse,
} from "@/types/auth";

export const languageApi = {
  getAll: async (
    params?: PaginationParams,
    token?: string
  ): Promise<LanguageResponse> => {
    const response = await apiClient.get("/language/all-language", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        ...params,
      },
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    });
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch languages");
    }
    return response.data as LanguageResponse;
  },

  create: async (languageData: FormData, token?: string): Promise<Language> => {
    const response = await apiClient.post(
      "/language/create-language",
      languageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  update: async (
    id: string,
    languageData: FormData,
    token?: string
  ): Promise<Language> => {
    const response = await apiClient.patch(
      `/language/update-language/${id}`,
      languageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  delete: async (id: string, token?: string): Promise<void> => {
    const response = await apiClient.delete(`/language/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    });
    if (!response.data.success) throw new Error(response.data.message);
  },
};

export const conceptApi = {
  getAll: async (
    params?: PaginationParams,
    token?: string
  ): Promise<ConceptResponse> => {
    const response = await apiClient.get("/concept", {
      params,
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    });
    return response.data;
  },

  create: async (conceptData: FormData, token?: string): Promise<Concept> => {
    const response = await apiClient.post("/concept", conceptData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  update: async (
    id: string,
    conceptData: FormData,
    token?: string
  ): Promise<Concept> => {
    const response = await apiClient.patch(`/concept/${id}`, conceptData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  delete: async (id: string, token?: string): Promise<void> => {
    const response = await apiClient.delete(`/concept/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    });
    if (!response.data.success) throw new Error(response.data.message);
  },
};

export const userApi = {
  getAll: async (
    params?: PaginationParams,
    token?: string
  ): Promise<UserResponse> => {
    const response = await apiClient.get("/user/all-user", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        ...params,
      },
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch users");
    }
    return response.data;
  },

  update: async (
    userId: string,
    data: FormData,
    token?: string
  ): Promise<User> => {
    data.append("id", userId); // Ensure userId is in the body
    const response = await apiClient.put(`/user/update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update user");
    }
    return response.data.data;
  },

  delete: async (userId: string, token?: string): Promise<void> => {
    const response = await apiClient.delete(`/user/delete-user/${userId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete user");
    }
  },
};
