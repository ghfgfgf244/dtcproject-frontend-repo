import api from "@/lib/api";

export interface CollaboratorAdminStats {
  totalCollaborators: number;
  totalCommissions: number;
  paidCommissions: number;
  unpaidCommissions: number;
}

export interface CollaboratorAdminRecord {
  userId: string;
  fullName: string;
  email: string;
  referralCode: string;
  usedCount: number;
  isCodeActive: boolean;
  totalPendingCommission: number;
  totalPaidCommission: number;
}

export interface CommissionAdminRecord {
  id: string;
  collaboratorId: string;
  referralRegistrationId?: string;
  collaboratorName: string;
  amount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
  referralCode?: string;
  studentName?: string;
  courseName?: string;
  discountAmount?: number;
}

export const collaboratorAdminService = {
  getStats: async (): Promise<CollaboratorAdminStats> => {
    try {
      const response = await api.get<{ data: CollaboratorAdminStats }>("/Collaborator/admin/stats");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      throw error;
    }
  },

  getCollaborators: async (): Promise<CollaboratorAdminRecord[]> => {
    try {
      const response = await api.get<{ data: CollaboratorAdminRecord[] }>("/Collaborator/admin/collaborators");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch admin collaborators:", error);
      throw error;
    }
  },

  getCommissions: async (): Promise<CommissionAdminRecord[]> => {
    try {
      const response = await api.get<{ data: CommissionAdminRecord[] }>("/Collaborator/admin/commissions");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch admin commissions:", error);
      throw error;
    }
  },

  toggleReferralCode: async (collaboratorId: string): Promise<void> => {
    try {
      await api.put(`/Collaborator/admin/code/${collaboratorId}/toggle`);
    } catch (error) {
      console.error("Failed to toggle referral code:", error);
      throw error;
    }
  },

  payCommissions: async (collaboratorId: string): Promise<void> => {
    try {
      await api.post(`/Collaborator/admin/commissions/${collaboratorId}/pay`);
    } catch (error) {
      console.error("Failed to pay commissions:", error);
      throw error;
    }
  }
};
