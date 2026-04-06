import api from "@/lib/api";
import {
  CourseRegistrationStatus,
  CourseRegistrationStatusValue,
  ExamRegistrationStatus,
  RegistrationRecord,
  RegistrationResponse
} from "@/types/registration";

// Define the standard unified API response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors: string[];
}

/**
 * Maps the backend DTO to the frontend UI model.
 * Note: Some UI fields are derived as they don't exist in the simple backend DTO.
 */
const mapToRegistrationRecord = (dto: any): RegistrationRecord => {
  const avatarColors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-slate-200 text-slate-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
  ];
  
  // Use id hash to pick a stable color/initials for the UI if not provided
  const idHash = dto.id.split('-')[0].length;
  const initials = dto.studentName ? dto.studentName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '??';

  return {
    id: dto.id,
    studentName: dto.studentName,
    studentId: (dto.userId || dto.id || "").slice(0, 8), // Use userId or fallback to id
    avatarInitials: initials,
    avatarColor: avatarColors[idHash % avatarColors.length],
    courseId: dto.courseId,
    courseName: dto.courseName || dto.batchName?.split(' - ')[0] || "Khóa học",
    licenseType: dto.licenseTypeLabel || "B2",
    registrationDate: new Date(dto.registrationDate).toLocaleDateString('vi-VN'),
    conditionStatus: 'Đủ giờ học',
    approvalStatus: 
      dto.status === 'Pending' ? 'Đang chờ duyệt' :
      dto.status === 'Approved' ? 'Đã duyệt' :
      dto.status === 'Rejected' ? 'Bị từ chối' : 'Đã hủy',
    status: dto.status,
    email: dto.email || "N/A",
    phone: dto.phone || "N/A",
    totalFee: dto.totalFee,
    notes: dto.notes,
    photoUrl: dto.photoUrl,
    idFrontUrl: dto.idFrontUrl,
    idBackUrl: dto.idBackUrl
  };
};

export const registrationService = {
  /**
   * Fetch all course registrations for Enrollment Manager.
   */
  getAllCourseRegistrations: async (): Promise<RegistrationRecord[]> => {
    try {
      const response = await api.get<{ data: any[] }>("/CourseRegistration/all");
      return (response.data.data || []).map(mapToRegistrationRecord);
    } catch (error) {
      console.error("Failed to fetch all course registrations:", error);
      return [];
    }
  },

  /**
   * Fetch registration stats.
   */
  getRegistrationStats: async (): Promise<any> => {
    try {
      const response = await api.get<{ data: any }>("/CourseRegistration/stats");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch registration stats:", error);
      return { newRegistrationsThisMonth: 0, pendingRegistrations: 0 };
    }
  },

  /**
   * Update course registration status (Approve/Reject).
   */
  updateCourseStatus: async (
    id: string,
    status: CourseRegistrationStatus,
    reason: string = ""
  ): Promise<void> => {
    const statusValueMap: Record<CourseRegistrationStatus, number> = {
      Pending: CourseRegistrationStatusValue.Pending,
      Approved: CourseRegistrationStatusValue.Approved,
      Rejected: CourseRegistrationStatusValue.Rejected,
      Cancelled: CourseRegistrationStatusValue.Cancelled
    };

    await api.put(`/CourseRegistration/${id}/status`, {
      status: statusValueMap[status],
      reason: reason.trim()
    });
  },

  /**
   * Fetch all registrations for a specific exam batch (Legacy).
   */
  getRegistrationsByBatch: async (batchId: string): Promise<RegistrationRecord[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(`/ExamRegistration/Batch/${batchId}`);
      return (response.data.data || []).map(mapToRegistrationRecord);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
      return [];
    }
  },

  /**
   * Update the approval status of a registration.
   */
  updateStatus: async (id: string, status: ExamRegistrationStatus): Promise<void> => {
    await api.patch(`/ExamRegistration/${id}/status`, { status });
  },

  /**
   * Mark a registration as paid.
   */
  markAsPaid: async (id: string): Promise<void> => {
    await api.patch(`/ExamRegistration/${id}/pay`);
  },

  /**
   * Create bulk registrations (Admin/Manager utility).
   */
  createBulk: async (examBatchId: string, studentIds: string[]): Promise<void> => {
    await api.post("/ExamRegistration/bulk", {
      examBatchId,
      studentIds
    });
  },

  /**
   * Fetch authenticated student's course registrations.
   */
  getMyRegistrations: async (): Promise<RegistrationResponse[]> => {
    try {
      const response = await api.get<{ data: RegistrationResponse[] }>("/CourseRegistration/me");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch my registrations:", error);
      return [];
    }
  },

  /**
   * Register a new course with required documents
   * @param formData FormData containing courseId, notes, referralCode, and optional files (Photo, IdFront, IdBack)
   */
  registerCourse: async (formData: FormData): Promise<void> => {
    try {
      await api.post("/CourseRegistration", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error("Failed to register course:", error);
      throw error;
    }
  }
};
