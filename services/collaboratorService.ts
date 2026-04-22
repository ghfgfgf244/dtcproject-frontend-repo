// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\services\collaboratorService.ts

import api from "@/lib/api";

export interface ReferralCodeResponse {
  id: string;
  code: string;
  usedCount: number;
  isActive: boolean;
  commissionRate: number;
}

export interface ReferralCodeValidationResponse {
  isValid: boolean;
  code?: string;
  collaboratorId?: string;
  collaboratorName?: string;
  discountRate: number;
  commissionRate: number;
  message?: string;
}

export interface Commission {
  id: string;
  collaboratorId: string;
  referralRegistrationId?: string;
  amount: number;
  status: string;
  createdAt: string;
  paidAt?: string;
  referralCode?: string;
  studentName?: string;
  courseName?: string;
  discountAmount?: number;
}

export const collaboratorService = {
  /**
   * Fetch the personal referral code for the collaborator.
   */
  getMyReferralCode: async (): Promise<ReferralCodeResponse | null> => {
    try {
      const response = await api.get<{ data: ReferralCodeResponse }>("/Collaborator/token");
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  /**
   * Generate a new referral code.
   */
  generateReferralCode: async (code: string): Promise<string> => {
    const response = await api.post<{ message: string }>("/Collaborator/token", { code });
    return response.data.message;
  },

  validateReferralCode: async (
    code: string,
    courseId?: string,
  ): Promise<ReferralCodeValidationResponse> => {
    const response = await api.get<{ data: ReferralCodeValidationResponse }>(
      "/Collaborator/token/validate",
      {
        params: { code, courseId },
      },
    );

    return response.data.data;
  },

  /**
   * Fetch recent usage of the referral code.
   */
  getTokenUsage: async (): Promise<number> => {
    const response = await api.get<{ data: { usedCount: number } }>("/Collaborator/token/usage");
    return response.data.data.usedCount;
  },

  /**
   * Fetch commission history for the collaborator.
   */
  getMyCommissions: async (): Promise<Commission[]> => {
    const response = await api.get<{ data: Commission[] }>("/Collaborator/commission");
    return response.data.data;
  },

  /**
   * Fetch the global commission rate.
   */
  getCommissionRate: async (): Promise<number> => {
    const response = await api.get<{ data: { commissionRate: number } }>("/Collaborator/commission/rate");
    return response.data.data.commissionRate;
  }
};
