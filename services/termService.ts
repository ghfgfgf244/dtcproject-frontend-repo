import api from "@/lib/api";
import { TermRecord } from "@/types/term";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface TermPage {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: TermRecord[];
}

const mapToTermRecord = (dto: any): TermRecord => {
  const startDate = dto.startDate ? String(dto.startDate).split("T")[0] : "";
  const endDate = dto.endDate ? String(dto.endDate).split("T")[0] : "";

  return {
    id: dto.id,
    courseId: dto.courseId,
    name: dto.termName,
    courseName: dto.courseName || "Khóa học không xác định",
    licenseType: dto.licenseType || "",
    startDate,
    endDate,
    currentStudents: dto.currentStudents || 0,
    maxStudents: dto.maxStudents || 0,
    isActive: dto.isActive,
  };
};

export const termService = {
  async getAllTerms(): Promise<TermRecord[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>("/Term");
      return (response.data.data || []).map(mapToTermRecord);
    } catch (error) {
      console.error("Failed to fetch terms:", error);
      return [];
    }
  },

  async getTermsPaged(options?: {
    pageNumber?: number;
    pageSize?: number;
    licenseType?: string;
  }): Promise<TermPage> {
    try {
      const response = await api.get<
        ApiResponse<{
          pageNumber: number;
          pageSize: number;
          totalItems: number;
          totalPages: number;
          items: any[];
        }>
      >("/Term/paged", {
        params: {
          pageNumber: options?.pageNumber ?? 1,
          pageSize: options?.pageSize ?? 8,
          licenseType:
            options?.licenseType && options.licenseType !== "All"
              ? options.licenseType
              : undefined,
        },
      });

      const payload = response.data.data;
      return {
        pageNumber: payload?.pageNumber ?? 1,
        pageSize: payload?.pageSize ?? options?.pageSize ?? 8,
        totalItems: payload?.totalItems ?? 0,
        totalPages: payload?.totalPages ?? 0,
        items: (payload?.items || []).map(mapToTermRecord),
      };
    } catch (error) {
      console.error("Failed to fetch paged terms:", error);
      return {
        pageNumber: options?.pageNumber ?? 1,
        pageSize: options?.pageSize ?? 8,
        totalItems: 0,
        totalPages: 0,
        items: [],
      };
    }
  },

  async getTermById(id: string): Promise<TermRecord | null> {
    try {
      const response = await api.get<ApiResponse<any>>(`/Term/${id}`);
      if (response.data.success) {
        return mapToTermRecord(response.data.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch term ${id}:`, error);
      return null;
    }
  },

  async createTerm(data: {
    courseId: string;
    termName: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
    isActive?: boolean;
  }): Promise<TermRecord | null> {
    try {
      const response = await api.post<ApiResponse<any>>("/Term", data);
      if (response.data.success) {
        return mapToTermRecord(response.data.data);
      }
      return null;
    } catch (error) {
      console.error("Failed to create term:", error);
      throw error;
    }
  },

  async updateTerm(
    id: string,
    data: {
      termName?: string;
      startDate?: string;
      endDate?: string;
      maxStudents?: number;
      isActive?: boolean;
    },
  ): Promise<TermRecord | null> {
    try {
      const response = await api.put<ApiResponse<any>>(`/Term/${id}`, data);
      if (response.data.success) {
        return mapToTermRecord(response.data.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to update term ${id}:`, error);
      throw error;
    }
  },

  async deleteTerm(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<unknown>>(`/Term/${id}`);
      return response.data.success;
    } catch (error) {
      console.error(`Failed to delete term ${id}:`, error);
      throw error;
    }
  },
};
