// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\services\authService.ts

import api from "@/lib/api";
import { SyncUserRequest, AuthResponse } from "@/types/auth";

export const authService = {
  /**
   * Synchronize Clerk user data with the backend database.
   */
  async syncUser(data: SyncUserRequest): Promise<AuthResponse | null> {
    try {
      const response = await api.post<{ data: AuthResponse }>("/Auth/sync", data);
      return response.data.data;
    } catch (error: any) {
      console.error("Failed to sync user with backend:", error.response?.data || error.message);
      return null;
    }
  },

  /**
   * Log out from the backend session.
   */
  async logout(): Promise<void> {
    try {
      await api.post("/Auth/logout");
    } catch (error) {
      console.error("Failed to logout from backend:", error);
    }
  },
};
