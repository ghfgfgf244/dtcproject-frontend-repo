import { DashboardInsightResponse } from "@/types/ai";
import api from "@/lib/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
};

export const dashboardAiService = {
  async getEnrollmentSummary(): Promise<DashboardInsightResponse> {
    const response = await api.get<ApiEnvelope<DashboardInsightResponse>>("/Dashboard/enrollment-ai-summary");
    return response.data.data;
  },

  async getTrainingSummary(): Promise<DashboardInsightResponse> {
    const response = await api.get<ApiEnvelope<DashboardInsightResponse>>("/Dashboard/training-ai-summary");
    return response.data.data;
  },

  async getAdminSummary(): Promise<DashboardInsightResponse> {
    const response = await api.get<ApiEnvelope<DashboardInsightResponse>>("/Dashboard/admin-ai-summary");
    return response.data.data;
  },
};
