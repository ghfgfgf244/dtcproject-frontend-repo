import api from "@/lib/api";

export interface ClassDto {
  id: string;
  termId: string;
  courseId: string;
  instructorId: string;
  className: string;
  currentStudents: number;
  maxStudents: number;
  classType: "Theory" | "Practice";
  status: "Pending" | "InProgress" | "Completed" | "Cancelled";
  termName?: string;
  courseName?: string;
  instructorName?: string;
  centerId?: string;
  centerName?: string;
  termStartDate?: string;
  termEndDate?: string;
  createdAt: string;
}

export type Class = ClassDto;

export interface ClassStudent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isActive: boolean;
  roles: string[];
  morningDistanceKm: number;
  eveningDistanceKm: number;
  maxMorningDistanceKm: number;
  maxEveningDistanceKm: number;
  distanceRecordId?: string;
}

export interface CreateClassRequest {
  termId: string;
  instructorId: string;
  className: string;
  maxStudents: number;
  classType: 1 | 2;
}

export interface UpdateClassRequest {
  className?: string;
  maxStudents?: number;
  classType?: 1 | 2;
  status?: 1 | 2 | 3 | 4;
}

export interface AutoAssignClassesRequest {
  termId: string;
  classType: 1 | 2;
}

export interface AutoAssignClassesResponse {
  message: string;
  eligibleStudents: number;
  createdClasses: number;
  classes: ClassDto[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const classService = {
  async getAllClasses(): Promise<ClassDto[]> {
    const response = await api.get<ApiResponse<ClassDto[]>>("/Class");
    return response.data.data || [];
  },

  async getTeachingClasses(): Promise<ClassDto[]> {
    const response = await api.get<ApiResponse<ClassDto[]>>("/Class/teaching");
    return response.data.data || [];
  },

  async getClassDetail(id: string): Promise<ClassDto | null> {
    try {
      const response = await api.get<ApiResponse<ClassDto>>(`/Class/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch class detail for ID ${id}:`, error);
      return null;
    }
  },

  async createClass(data: CreateClassRequest): Promise<ClassDto> {
    const response = await api.post<ApiResponse<ClassDto>>("/Class", data);
    return response.data.data;
  },

  async updateClass(id: string, data: UpdateClassRequest): Promise<ClassDto> {
    const response = await api.put<ApiResponse<ClassDto>>(`/Class/${id}`, data);
    return response.data.data;
  },

  async deleteClass(id: string): Promise<void> {
    await api.delete(`/Class/${id}`);
  },

  async assignTeacher(classId: string, instructorId: string): Promise<void> {
    await api.post(`/Class/${classId}/teachers`, {
      instructorIds: [instructorId],
    });
  },

  async getClassStudents(classId: string): Promise<ClassStudent[]> {
    const response = await api.get<ApiResponse<ClassStudent[]>>(`/Class/${classId}/students`);
    return response.data.data || [];
  },

  async getAvailableStudents(classId: string): Promise<ClassStudent[]> {
    const response = await api.get<ApiResponse<ClassStudent[]>>(`/Class/${classId}/available-students`);
    return response.data.data || [];
  },

  async assignStudents(classId: string, studentIds: string[]): Promise<void> {
    await api.post(`/Class/${classId}/students`, { studentIds });
  },

  async removeStudent(classId: string, studentId: string): Promise<void> {
    await api.delete(`/Class/${classId}/students/${studentId}`);
  },

  async autoAssign(data: AutoAssignClassesRequest): Promise<AutoAssignClassesResponse> {
    const response = await api.post<ApiResponse<AutoAssignClassesResponse>>("/Class/auto-assign", data);
    return response.data.data;
  },
};
