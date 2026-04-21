import api from "@/lib/api";
import axios from "axios";
import {
  CourseRegistrationStatus,
  CourseRegistrationStatusValue,
  ExamRegistrationStatus,
  RegistrationRecord,
  RegistrationResponse,
  TermRegistrationCandidate,
} from "@/types/registration";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors: string[];
}

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-slate-200 text-slate-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

const getStatusLabel = (status: number): RegistrationRecord["approvalStatus"] => {
  switch (status) {
    case ExamRegistrationStatus.Approved:
      return "Đã duyệt";
    case ExamRegistrationStatus.Rejected:
      return "Từ chối";
    case ExamRegistrationStatus.Cancelled:
      return "Đã hủy";
    default:
      return "Chờ duyệt";
  }
};

const getCourseStatusValue = (
  status: number | string | undefined,
): CourseRegistrationStatus => {
  if (status === CourseRegistrationStatusValue.Approved || status === "Approved") {
    return "Approved";
  }
  if (status === CourseRegistrationStatusValue.Rejected || status === "Rejected") {
    return "Rejected";
  }
  if (status === CourseRegistrationStatusValue.Cancelled || status === "Cancelled") {
    return "Cancelled";
  }
  return "Pending";
};

const getCourseApprovalLabel = (
  status: CourseRegistrationStatus,
): RegistrationRecord["approvalStatus"] => {
  switch (status) {
    case "Approved":
      return "Đã duyệt";
    case "Rejected":
      return "Từ chối";
    case "Cancelled":
      return "Đã hủy";
    default:
      return "Chờ duyệt";
  }
};

const mapToRegistrationRecord = (dto: any): RegistrationRecord => {
  const initials = dto.studentName
    ? dto.studentName
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "HV";

  const colorIndex = `${dto.id ?? dto.studentId ?? ""}`.length % avatarColors.length;
  const attendanceRate = Number(dto.attendanceRate ?? 0);

  return {
    id: dto.id,
    examBatchId: dto.examBatchId,
    examBatch: dto.batchName ?? "Đợt thi chưa xác định",
    studentId: dto.studentId,
    studentName: dto.studentName ?? "Học viên",
    email: dto.email ?? "",
    phone: dto.phone ?? "",
    avatarInitials: initials,
    avatarColor: avatarColors[colorIndex],
    registrationDate: dto.registrationDate
      ? new Date(dto.registrationDate).toLocaleDateString("vi-VN")
      : "",
    paymentStatus: dto.isPaid ? "Đã nộp lệ phí" : "Chưa nộp lệ phí",
    isPaid: Boolean(dto.isPaid),
    attendanceRate,
    totalSessions: Number(dto.totalSessions ?? 0),
    presentCount: Number(dto.presentCount ?? 0),
    approvalStatus: getStatusLabel(Number(dto.status)),
    status: Number(dto.status) as ExamRegistrationStatus,
    termId: dto.termId ?? undefined,
    termName: dto.termName ?? undefined,
    courseName: dto.courseName ?? undefined,
    licenseType: dto.licenseTypeLabel ?? undefined,
    isEligibleForApproval: Boolean(dto.isEligibleForApproval),
  };
};

const mapToCandidate = (dto: any): TermRegistrationCandidate => ({
  studentId: dto.studentId,
  studentName: dto.studentName ?? "Học viên",
  email: dto.email ?? "",
  phone: dto.phone ?? "",
  courseName: dto.courseName ?? "",
  licenseTypeLabel: dto.licenseTypeLabel ?? "",
  attendanceRate: Number(dto.attendanceRate ?? 0),
  totalSessions: Number(dto.totalSessions ?? 0),
  presentCount: Number(dto.presentCount ?? 0),
  isEligibleForApproval: Boolean(dto.isEligibleForApproval),
  alreadyRegistered: Boolean(dto.alreadyRegistered),
});

const mapToCourseRegistrationRecord = (dto: any): RegistrationRecord => {
  const initials = dto.studentName
    ? dto.studentName
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "HV";
  const colorIndex = `${dto.id ?? dto.userId ?? ""}`.length % avatarColors.length;
  const status = getCourseStatusValue(dto.status);

  return {
    id: dto.id,
    courseId: dto.courseId,
    studentId: dto.userId ?? "",
    studentName: dto.studentName ?? "Học viên",
    email: dto.email ?? "",
    phone: dto.phone ?? "",
    avatarInitials: initials,
    avatarColor: avatarColors[colorIndex],
    registrationDate: dto.registrationDate
      ? new Date(dto.registrationDate).toLocaleDateString("vi-VN")
      : "",
    approvalStatus: getCourseApprovalLabel(status),
    status,
    courseName: dto.courseName ?? "",
    licenseType: dto.licenseTypeLabel ?? "",
    totalFee: Number(dto.totalFee ?? 0),
    notes: dto.notes ?? undefined,
    assignedTermId: dto.assignedTermId ?? undefined,
    assignedTermName: dto.assignedTermName ?? undefined,
    assignedClassId: dto.assignedClassId ?? undefined,
    assignedClassName: dto.assignedClassName ?? undefined,
    suggestedTermId: dto.suggestedTermId ?? undefined,
    suggestedTermName: dto.suggestedTermName ?? undefined,
    suggestedTermStartDate: dto.suggestedTermStartDate ?? undefined,
    placementMessage: dto.placementMessage ?? undefined,
    photoUrl: dto.photoUrl ?? undefined,
    idFrontUrl: dto.idFrontUrl ?? undefined,
    idBackUrl: dto.idBackUrl ?? undefined,
  };
};

const extractApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; errors?: string[]; error?: string }
      | undefined;

    const validationMessage =
      Array.isArray(responseData?.errors) && responseData.errors.length > 0
        ? responseData.errors[0]
        : undefined;

    return (
      validationMessage ||
      responseData?.message ||
      responseData?.error ||
      error.message ||
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};

export const registrationService = {
  async getAllCourseRegistrations(): Promise<RegistrationRecord[]> {
    try {
      const response = await api.get<{ data: any[] }>("/CourseRegistration/all");
      return (response.data.data || []).map(mapToCourseRegistrationRecord);
    } catch (error) {
      console.error("Failed to fetch all course registrations:", error);
      return [];
    }
  },

  async getRegistrationStats(): Promise<any> {
    try {
      const response = await api.get<{ data: any }>("/CourseRegistration/stats");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch registration stats:", error);
      return { newRegistrationsThisMonth: 0, pendingRegistrations: 0 };
    }
  },

  async updateCourseStatus(
    id: string,
    status: CourseRegistrationStatus,
    reason = "",
  ): Promise<void> {
    const statusValueMap: Record<CourseRegistrationStatus, number> = {
      Pending: CourseRegistrationStatusValue.Pending,
      Approved: CourseRegistrationStatusValue.Approved,
      Rejected: CourseRegistrationStatusValue.Rejected,
      Cancelled: CourseRegistrationStatusValue.Cancelled,
    };

    await api.put(`/CourseRegistration/${id}/status`, {
      status: statusValueMap[status],
      reason: reason.trim(),
    });
  },

  async getRegistrationsByBatch(batchId: string): Promise<RegistrationRecord[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>(`/ExamRegistration/Batch/${batchId}`);
      return (response.data.data || []).map(mapToRegistrationRecord);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
      return [];
    }
  },

  async updateStatus(id: string, status: ExamRegistrationStatus): Promise<void> {
    await api.patch(`/ExamRegistration/${id}/status`, { status });
  },

  async setPaymentStatus(id: string, isPaid: boolean): Promise<void> {
    await api.patch(`/ExamRegistration/${id}/payment`, { isPaid });
  },

  async markAsPaid(id: string): Promise<void> {
    await api.patch(`/ExamRegistration/${id}/pay`);
  },

  async createRegistration(examBatchId: string, studentId: string, isPaid = false): Promise<void> {
    try {
      await api.post("/ExamRegistration", {
        examBatchId,
        studentId,
        isPaid,
      });
    } catch (error) {
      throw new Error(
        extractApiErrorMessage(error, "Không thể tạo đăng ký thi cho học viên này."),
      );
    }
  },

  async createBulk(examBatchId: string, studentIds: string[], isPaid = false): Promise<void> {
    try {
      await api.post("/ExamRegistration/bulk", {
        examBatchId,
        studentIds,
        isPaid,
      });
    } catch (error) {
      throw new Error(
        extractApiErrorMessage(error, "Không thể tạo đăng ký thi hàng loạt."),
      );
    }
  },

  async getTermCandidates(termId: string, examBatchId: string): Promise<TermRegistrationCandidate[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `/ExamRegistration/Term/${termId}/candidates`,
        {
          params: { examBatchId },
        },
      );
      return (response.data.data || []).map(mapToCandidate);
    } catch (error) {
      console.error("Failed to fetch term candidates:", error);
      return [];
    }
  },

  async getMyRegistrations(): Promise<RegistrationResponse[]> {
    try {
      const response = await api.get<{ data: RegistrationResponse[] }>("/CourseRegistration/me");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch my registrations:", error);
      return [];
    }
  },

  async registerCourse(formData: FormData): Promise<RegistrationResponse | null> {
    try {
      const response = await api.post<ApiResponse<RegistrationResponse>>(
        "/CourseRegistration",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data.data ?? null;
    } catch (error) {
      console.error("Failed to register course:", error);
      throw error;
    }
  },

  async getMyCourseRegistrations(): Promise<RegistrationRecord[]> {
    try {
      const response = await api.get<{ data: any[] }>("/CourseRegistration/me");
      return (response.data.data || []).map(mapToCourseRegistrationRecord);
    } catch (error) {
      console.error("Failed to fetch mapped my registrations:", error);
      return [];
    }
  },

  async cancelCourseRegistration(id: string, reason: string): Promise<void> {
    await api.put(`/CourseRegistration/${id}/cancel`, {
      reason,
    });
  },
};
