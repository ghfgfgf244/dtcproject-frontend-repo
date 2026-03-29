import api from "@/lib/api";
import { ExamRegistrationStatus, RegistrationRecord } from "@/types/registration";

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
    studentId: dto.studentId.slice(0, 8), // Assuming it's a GUID, take first chunk as display ID
    avatarInitials: initials,
    avatarColor: avatarColors[idHash % avatarColors.length],
    course: dto.batchName.split(' - ')[0] || "Khóa học", // Backend DTO has BatchName
    examBatch: dto.batchName,
    registrationDate: new Date(dto.registrationDate).toLocaleDateString('vi-VN'),
    paymentStatus: dto.isPaid ? 'Đã đóng' : 'Chưa đóng',
    conditionStatus: 'Đủ giờ học', // Mock logic: assume all in DB are eligible for now
    approvalStatus: 
      dto.status === ExamRegistrationStatus.Pending ? 'Đang chờ duyệt' :
      dto.status === ExamRegistrationStatus.Approved ? 'Đã duyệt' :
      dto.status === ExamRegistrationStatus.Rejected ? 'Bị từ chối' : 'Đã hủy',
    isPaid: dto.isPaid,
    status: dto.status
  };
};

export const registrationService = {
  /**
   * Fetch all registrations for a specific exam batch.
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
  }
};
