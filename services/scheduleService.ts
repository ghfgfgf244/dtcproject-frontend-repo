import api from "@/lib/api";

export interface ClassSchedule {
  id: string;
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

export interface CreateScheduleRequest {
  classId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  addressId: number;
}

export interface UpdateScheduleRequest {
  instructorId?: string;
  startTime: string;
  endTime: string;
  addressId?: number;
}

export interface ScheduleDraft {
  instructorId: string;
  startTime: string;
  endTime: string;
  addressId: number;
}

export interface ScheduleImportPreview {
  schedules: ScheduleDraft[];
  warnings: string[];
}

export interface ScheduleConflictExplainRequest {
  classId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  addressId: number;
  ignoreScheduleId?: string;
}

export interface ScheduleConflictDetail {
  conflictType: string;
  scheduleId: string;
  classId: string;
  className: string;
  instructorId: string;
  instructorName: string;
  addressId: number;
  addressName: string;
  startTime: string;
  endTime: string;
  message: string;
}

export interface ScheduleAlternativeSlot {
  startTime: string;
  endTime: string;
  reason: string;
}

export interface ScheduleConflictExplainResponse {
  hasConflict: boolean;
  summary: string;
  model: string;
  conflicts: ScheduleConflictDetail[];
  suggestions: ScheduleAlternativeSlot[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const scheduleService = {
  async getDetail(id: string): Promise<ClassSchedule | null> {
    const response = await api.get<ApiResponse<ClassSchedule>>(`/Schedule/${id}`);
    return response.data.data ?? null;
  },

  async getByClass(classId: string): Promise<ClassSchedule[]> {
    const response = await api.get<ApiResponse<ClassSchedule[]>>(`/Schedule/Class/${classId}`);
    return response.data.data || [];
  },

  async create(data: CreateScheduleRequest): Promise<ClassSchedule> {
    const response = await api.post<ApiResponse<ClassSchedule>>("/Schedule", data);
    return response.data.data;
  },

  async update(id: string, data: UpdateScheduleRequest): Promise<ClassSchedule> {
    const response = await api.put<ApiResponse<ClassSchedule>>(`/Schedule/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/Schedule/${id}`);
  },

  async createBulk(classId: string, schedules: ScheduleDraft[]): Promise<ClassSchedule[]> {
    const response = await api.post<ApiResponse<ClassSchedule[]>>("/Schedule/bulk", {
      classId,
      schedules,
    });
    return response.data.data || [];
  },

  async importPreview(file: File, defaultInstructorId?: string): Promise<ScheduleImportPreview> {
    const formData = new FormData();
    formData.append("file", file);
    if (defaultInstructorId) {
      formData.append("defaultInstructorId", defaultInstructorId);
    }

    const response = await api.post<ApiResponse<ScheduleImportPreview>>("/Schedule/import-preview", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  },

  async getMySchedules(): Promise<ClassSchedule[]> {
    const response = await api.get<ApiResponse<ClassSchedule[]>>("/Schedule/me");
    return response.data.data || [];
  },

  async getTeachingSchedule(): Promise<ClassSchedule[]> {
    const response = await api.get<ApiResponse<ClassSchedule[]>>("/Schedule/teaching");
    return response.data.data || [];
  },

  async explainConflict(data: ScheduleConflictExplainRequest): Promise<ScheduleConflictExplainResponse> {
    const response = await api.post<ApiResponse<ScheduleConflictExplainResponse>>("/Schedule/conflict-explain", data);
    return response.data.data;
  },
};
