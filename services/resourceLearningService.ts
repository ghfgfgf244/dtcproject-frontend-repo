import api from "@/lib/api";
import { ResourceLearningDTO } from "@/types/learning-resource";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const resourceLearningService = {
  async getAll(): Promise<ResourceLearningDTO[]> {
    const response = await api.get<ApiResponse<ResourceLearningDTO[]>>("/ResourceLearning");
    return response.data.data || [];
  },

  async getByCourse(courseId: string): Promise<ResourceLearningDTO[]> {
    const response = await api.get<ApiResponse<ResourceLearningDTO[]>>(`/ResourceLearning/course/${courseId}`);
    return response.data.data || [];
  },

  async create(data: {
    courseId: string;
    resourceType: number;
    title: string;
    resourceUrl: string;
  }): Promise<ResourceLearningDTO> {
    const response = await api.post<ApiResponse<ResourceLearningDTO>>("/ResourceLearning", data);
    return response.data.data;
  },

  async update(id: string, data: {
    resourceType?: number;
    title?: string;
    resourceUrl?: string;
  }): Promise<ResourceLearningDTO> {
    const response = await api.put<ApiResponse<ResourceLearningDTO>>(`/ResourceLearning/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<boolean> {
    await api.delete(`/ResourceLearning/${id}`);
    return true;
  }
};
