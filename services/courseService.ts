// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\services\courseService.ts

import api from "@/lib/api";
import { Course } from "@/types/course";

export interface CreateCourseRequest {
  centerId: string;
  courseName: string;
  licenseType: number; // Enum value
  durationInWeeks: number;
  maxStudents: number;
  description: string;
  price: number;
  thumbnailUrl?: string;
}

export interface UpdateCourseRequest {
  courseName?: string;
  description?: string;
  thumbnailUrl?: string;
  price?: number;
  maxStudents?: number;
  durationInWeeks?: number;
  isActive?: boolean;
}

/**
 * Service to manage course-related API calls.
 */
export const courseService = {
  /**
   * Fetch all available courses (guest-accessible).
   */
  async getAvailableCourses(): Promise<Course[]> {
    try {
      const response = await api.get<{ data: Course[] }>("/Course/available");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch available courses:", error);
      return [];
    }
  },

  /**
   * [ADMIN/MANAGER] Fetch all courses including inactive ones.
   */
  async getAllAdminCourses(): Promise<Course[]> {
    try {
      const response = await api.get<{ data: Course[] }>("/Course/admin/all");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch admin courses:", error);
      return [];
    }
  },

  /**
   * Fetch a single course by its ID.
   * @param id The Course ID (Guid as string)
   */
  async getCourseById(id: string): Promise<Course | null> {
    try {
      console.log(`DTC: [API] Đang lấy chi tiết khóa học cho ID: ${id}`);
      const response = await api.get<{ data: Course }>(`/Course/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error(`DTC: [API] Thất bại khi lấy khóa học ${id}:`, error.response?.status || "Error", error.message);
      return null;
    }
  },

  /**
   * [ADMIN/MANAGER] Create a new course.
   */
  async createCourse(data: CreateCourseRequest): Promise<Course> {
    const response = await api.post<{ data: Course }>("/Course", data);
    return response.data.data;
  },

  /**
   * [ADMIN/MANAGER] Update an existing course.
   */
  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Course> {
    const response = await api.put<{ data: Course }>(`/Course/${id}`, data);
    return response.data.data;
  },

  /**
   * [ADMIN/MANAGER] Deactivate (soft-delete) a course.
   */
  async deactivateCourse(id: string): Promise<void> {
    await api.delete(`/Course/${id}`);
  },
};
