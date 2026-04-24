import api from "@/lib/api";
import { TermRecord } from "@/types/term";

/**
 * Maps the backend TermResponseDto to the frontend TermRecord.
 */
const mapToTermRecord = (dto: any): TermRecord => {
  const startDate = dto.startDate ? String(dto.startDate).split('T')[0] : '';
  const endDate = dto.endDate ? String(dto.endDate).split('T')[0] : '';

  return {
    id: dto.id,
    courseId: dto.courseId,
    name: dto.termName,
    courseName: dto.courseName || 'Khóa học không xác định',
    startDate,
    endDate,
    currentStudents: dto.currentStudents || 0,
    maxStudents: dto.maxStudents || 0,
    isActive: dto.isActive
  };
};

export const termService = {
  /**
   * Fetches all terms from the backend.
   */
  getAllTerms: async (): Promise<TermRecord[]> => {
    try {
      const response = await api.get<any>("/Term");
      const terms = response.data.data || [];
      return terms.map(mapToTermRecord);
    } catch (error) {
      console.error("Failed to fetch terms:", error);
      return [];
    }
  },

  /**
   * Fetches a specific term by ID.
   */
  getTermById: async (id: string): Promise<TermRecord | null> => {
    try {
      const response = await api.get<any>(`/Term/${id}`);
      if (response.data.success) {
        return mapToTermRecord(response.data.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch term ${id}:`, error);
      return null;
    }
  },

  /**
   * Creates a new term.
   */
  createTerm: async (data: { 
    courseId: string; 
    termName: string; 
    startDate: string; 
    endDate: string; 
    maxStudents: number;
    isActive?: boolean;
  }): Promise<TermRecord | null> => {
    try {
      const response = await api.post<any>("/Term", data);
      if (response.data.success) {
        return mapToTermRecord(response.data.data);
      }
      return null;
    } catch (error) {
      console.error("Failed to create term:", error);
      throw error;
    }
  },

  /**
   * Updates an existing term.
   */
  updateTerm: async (id: string, data: { 
    termName?: string; 
    startDate?: string; 
    endDate?: string; 
    maxStudents?: number;
    isActive?: boolean;
  }): Promise<TermRecord | null> => {
    try {
      const response = await api.put<any>(`/Term/${id}`, data);
      if (response.data.success) {
        return mapToTermRecord(response.data.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to update term ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a term.
   */
  deleteTerm: async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete<any>(`/Term/${id}`);
      return response.data.success;
    } catch (error) {
      console.error(`Failed to delete term ${id}:`, error);
      throw error;
    }
  }
};
