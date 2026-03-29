// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\services\centerService.ts

import api from "@/lib/api";

export interface Center {
  id: string;
  centerName: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export const centerService = {
  /**
   * Fetch all centers.
   */
  async getAllCenters(): Promise<Center[]> {
    try {
      const response = await api.get<{ data: Center[] }>("/Center");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch centers:", error);
      return [];
    }
  },

  /**
   * Fetch a single center by ID.
   */
  async getCenterById(id: string): Promise<Center | null> {
    try {
      const response = await api.get<{ data: Center }>(`/Center/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch center ${id}:`, error);
      return null;
    }
  }
};
