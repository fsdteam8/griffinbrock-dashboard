export interface Avatar {
  public_id: string;
  url: string;
}

export interface Language {
  _id: string;
  name: string;
  description: string;
  about: string;
  image: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface LanguageResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    languages: Language[];
  };
}

export interface User {
  _id: string;
  avatar: Avatar;
  name: string;
  email: string;
  username: string;
  phone: string;
  credit: number | null;
  role: string;
  fine: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginatedUsers {
  total: number;
  page: number;
  limit: number;
  users: User[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: any; // Can be more specific based on different responses
  token?: string;
}

// For the specific response in your example
export interface UsersResponse extends AuthResponse {
  data: PaginatedUsers;
}

export interface Concept {
  _id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConceptResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    concepts: Concept[];
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    users: User[];
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
