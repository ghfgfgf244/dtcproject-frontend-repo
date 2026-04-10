import api from "@/lib/api";

export interface Center {
  id: string;
  centerName: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  numberOfClasses: number;
  maxStudentPerClass: number;
  createdAt?: string;
}

export interface CreateCenterPayload {
  centerName: string;
  address: string;
  phone: string;
  email: string;
  numberOfClasses?: number;
  maxStudentPerClass?: number;
}

export interface UpdateCenterPayload {
  centerName?: string;
  address?: string;
  phone?: string;
  email?: string;
  numberOfClasses?: number;
  maxStudentPerClass?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const centerService = {
  getAll: async (): Promise<Center[]> => {
    const res = await api.get<ApiResponse<Center[]>>("/Center");
    return res.data.data || [];
  },

  getById: async (id: string): Promise<Center> => {
    const res = await api.get<ApiResponse<Center>>(`/Center/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateCenterPayload): Promise<Center> => {
    const res = await api.post<ApiResponse<Center>>("/Center", payload);
    return res.data.data;
  },

  update: async (id: string, payload: UpdateCenterPayload): Promise<Center> => {
    const res = await api.put<ApiResponse<Center>>(`/Center/${id}`, payload);
    return res.data.data;
  },

  /** Soft-deactivate (backend uses DELETE as toggle-off) */
  deactivate: async (id: string): Promise<void> => {
    await api.delete(`/Center/${id}`);
  },

  /** Activate (backend uses POST to /Center/{id}/activate) */
  activate: async (id: string): Promise<void> => {
    await api.post(`/Center/${id}/activate`);
  },
};
