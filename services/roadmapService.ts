import api from "@/lib/api";
import { LearningRoadmapItem } from "@/types/course";

export interface CreateRoadmapPayload {
  courseId: string;
  orderNo: number;
  title: string;
  description: string;
}

export interface UpdateRoadmapPayload {
  orderNo?: number;
  title?: string;
  description?: string;
}

export const roadmapService = {
  getByCourse: async (courseId: string): Promise<LearningRoadmapItem[]> => {
    const response = await api.get(`/LearningRoadmap/course/${courseId}`);
    return response.data.data || [];
  },

  create: async (payload: CreateRoadmapPayload): Promise<LearningRoadmapItem> => {
    const response = await api.post("/LearningRoadmap", payload);
    return response.data.data;
  },

  update: async (id: string, payload: UpdateRoadmapPayload): Promise<LearningRoadmapItem> => {
    const response = await api.put(`/LearningRoadmap/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/LearningRoadmap/${id}`);
  }
};
