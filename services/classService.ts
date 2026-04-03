import api from "@/lib/api";

export interface Class {
  id: string;
  termId: string;
  className: string;
  currentStudents: number;
  maxStudents: number;
  classType: string; // "Theory" | "Practice"
  status: string;
}

export interface ClassStudent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isActive: boolean;
  morningDistanceKm: number;
  eveningDistanceKm: number;
  maxMorningDistanceKm: number;
  maxEveningDistanceKm: number;
  distanceRecordId?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const classService = {
  getTeachingClasses: async (): Promise<Class[]> => {
    try {
      const response = await api.get<ApiResponse<Class[]>>("/Class/teaching");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch teaching classes:", error);
      return [];
    }
  },

  getClassDetail: async (id: string): Promise<Class | null> => {
    try {
      const response = await api.get<ApiResponse<Class>>(`/Class/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch class detail for ID ${id}:`, error);
      return null;
    }
  },

  getClassStudents: async (classId: string): Promise<ClassStudent[]> => {
    try {
      const response = await api.get<ApiResponse<ClassStudent[]>>(`/Class/${classId}/students`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Failed to fetch students for class ${classId}:`, error);
      return [];
    }
  }
};
