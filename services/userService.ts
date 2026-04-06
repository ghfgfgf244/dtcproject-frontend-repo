import api from "@/lib/api";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  roleName: string; // Used for "me" call
  roles?: string[]; // Used for "all" list (from UserResponseDto)
  lastLoginAt?: string;
  isActive: boolean;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdateUserRolesRequest {
  roleIds: number[];
}

export interface UserStats {
  totalUsers: number;
  staffCount: number;
  instructorCount: number;
  collaboratorCount: number;
  studentCount: number;
}

export const userService = {
  /**
   * Fetch the current user's profile from the backend.
   */
  async getMe(): Promise<UserProfile | null> {
    try {
      const response = await api.get<{ data: UserProfile }>("/users/me");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }
  },

  /**
   * Update the current user's profile.
   */
  async updateMe(data: UpdateProfileRequest): Promise<UserProfile | null> {
    try {
      const response = await api.put<{ data: UserProfile }>("/users/me", data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  },

  /**
   * [ADMIN] Get all users across the system.
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const response = await api.get<{ data: UserProfile[] }>("/users");
    return response.data.data;
  },

  /**
   * [ADMIN] Update roles for a specific user.
   */
  async updateUserRoles(userId: string, roleIds: number[]): Promise<void> {
    await api.put(`/users/${userId}/roles`, { roleIds });
  },

  /**
   * [ADMIN] Toggle user active/inactive status.
   */
  async toggleUserStatus(userId: string): Promise<void> {
    await api.put(`/users/${userId}/toggle-status`);
  },

  /**
   * [ADMIN] Soft-delete a user.
   */
  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  /**
   * [ADMIN] Get user statistics for dashboard cards.
   */
  async getStats(): Promise<UserStats> {
    const response = await api.get<{ data: UserStats }>("/users/stats");
    return response.data.data;
  },
};
