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
  centerId?: string;
  centerName?: string;
}

export interface UserListItem {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  roles?: string[];
  isActive: boolean;
  lastLoginAt?: string;
  centerId?: string;
  centerName?: string;
}

export interface ManagedUserCreateRequest {
  email: string;
  fullName: string;
  phone: string;
  isActive: boolean;
}

export interface ManagedUserUpdateRequest {
  fullName?: string;
  phone?: string;
  isActive?: boolean;
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

  async getStudents(): Promise<UserListItem[]> {
    const response = await api.get<{ data: UserListItem[] }>("/users/students");
    return response.data.data || [];
  },

  async getInstructors(): Promise<UserListItem[]> {
    const response = await api.get<{ data: UserListItem[] }>("/users/instructors");
    return response.data.data || [];
  },

  async createInstructor(data: ManagedUserCreateRequest): Promise<UserListItem> {
    const response = await api.post<{ data: UserListItem }>("/users/instructors", data);
    return response.data.data;
  },

  async updateInstructor(userId: string, data: ManagedUserUpdateRequest): Promise<UserListItem> {
    const response = await api.put<{ data: UserListItem }>(`/users/instructors/${userId}`, data);
    return response.data.data;
  },

  async toggleInstructorStatus(userId: string): Promise<void> {
    await api.put(`/users/instructors/${userId}/toggle-status`);
  },

  async deleteInstructor(userId: string): Promise<void> {
    await api.delete(`/users/instructors/${userId}`);
  },

  async createCollaborator(data: ManagedUserCreateRequest): Promise<UserListItem> {
    const response = await api.post<{ data: UserListItem }>("/users/collaborators", data);
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

  /**
   * [ADMIN/MANAGER] Assign center to user
   */
  async assignCenter(userId: string, centerId: string): Promise<void> {
    await api.put(`/users/${userId}/center/${centerId}`);
  },
};
