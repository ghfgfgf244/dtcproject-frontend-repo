import api from "@/lib/api";

export interface ClassSchedule {
  id: string;           // ClassSchedule entity ID (same as scheduleId)
  classId: string;
  instructorId: string;
  className: string;
  instructorName: string;
  startTime: string;
  endTime: string;
  addressId: number;
  addressName: string;
  location: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const scheduleService = {
  getMySchedules: async (): Promise<ClassSchedule[]> => {
    try {
      const response = await api.get<ApiResponse<ClassSchedule[]>>("/Schedule/me");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch my schedules:", error);
      return [];
    }
  },
  getTeachingSchedule: async (): Promise<ClassSchedule[]> => {
    try {
      const response = await api.get<ApiResponse<ClassSchedule[]>>("/Schedule/teaching");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch teaching schedule:", error);
      return [];
    }
  }
};
