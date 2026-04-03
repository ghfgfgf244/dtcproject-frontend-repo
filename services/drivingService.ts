import api from "@/lib/api";

export interface DrivingDistanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  requiredDistance: number;
  actualDistance: number;
  dateRecorded: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const drivingService = {
  getMyDistances: async (): Promise<DrivingDistanceRecord[]> => {
    try {
      const response = await api.get<ApiResponse<DrivingDistanceRecord[]>>("/StudentDrivingDistance/my");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch my driving distances:", error);
      return [];
    }
  },

  recordActualDistance: async (id: string, morning: number, evening: number): Promise<void> => {
    try {
      await api.put(`/StudentDrivingDistance/${id}/actual`, {
        morningDistanceKm: morning,
        eveningDistanceKm: evening
      });
    } catch (error) {
      console.error("Failed to record actual distance:", error);
      throw error;
    }
  }
};
