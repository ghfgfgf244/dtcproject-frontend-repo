import api from "@/lib/api";
import {
  AdminOperationalDashboardDto,
  EnrollmentOperationalDashboardDto,
  TrainingOperationalDashboardDto,
} from "@/types/dashboard";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
};

export const dashboardService = {
  async getEnrollmentDashboard(): Promise<EnrollmentOperationalDashboardDto> {
    const response = await api.get<ApiEnvelope<EnrollmentOperationalDashboardDto>>("/Dashboard/enrollment");
    return response.data.data;
  },

  async getTrainingDashboard(): Promise<TrainingOperationalDashboardDto> {
    const response = await api.get<ApiEnvelope<TrainingOperationalDashboardDto>>("/Dashboard/training");
    return response.data.data;
  },

  async getAdminDashboard(): Promise<AdminOperationalDashboardDto> {
    const response = await api.get<ApiEnvelope<AdminOperationalDashboardDto>>("/Dashboard/admin-overview");
    return response.data.data;
  },
};
