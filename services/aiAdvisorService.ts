import api from "@/lib/api";
import {
  CourseAdvisorRequest,
  CourseAdvisorResponse,
  DashboardInsightRequest,
  DashboardInsightResponse,
  TheoryAssistantRequest,
  TheoryAssistantResponse,
} from "@/types/ai";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
};

export const aiAdvisorService = {
  async getCourseAdvice(payload: CourseAdvisorRequest): Promise<CourseAdvisorResponse> {
    const response = await api.post<ApiEnvelope<CourseAdvisorResponse>>("/AiAdvisor/course", payload);
    return response.data.data;
  },

  async askTheory(payload: TheoryAssistantRequest): Promise<TheoryAssistantResponse> {
    const response = await api.post<ApiEnvelope<TheoryAssistantResponse>>("/AiAdvisor/theory", payload);
    return response.data.data;
  },

  async getDashboardSummary(payload: DashboardInsightRequest): Promise<DashboardInsightResponse> {
    const response = await api.post<ApiEnvelope<DashboardInsightResponse>>("/AiAdvisor/dashboard-summary", payload);
    return response.data.data;
  },
};
