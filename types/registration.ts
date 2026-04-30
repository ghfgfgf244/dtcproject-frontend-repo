export type CourseRegistrationStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export enum CourseRegistrationStatusValue {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Cancelled = 4,
}

export interface RegistrationRequest {
  courseId: string;
  totalFee: number;
  notes?: string;
  referralCode?: string;
}

export interface RegistrationResponse {
  id: string;
  courseId: string;
  userId: string;
  registrationDate: string;
  status: CourseRegistrationStatus;
  totalFee: number;
  originalFee: number;
  discountAmount: number;
  notes?: string;
  studentName?: string;
  email?: string;
  phone?: string;
  courseName?: string;
  licenseTypeLabel?: string;
  assignedTermId?: string;
  assignedTermName?: string;
  assignedClassId?: string;
  assignedClassName?: string;
  suggestedTermId?: string;
  suggestedTermName?: string;
  suggestedTermStartDate?: string;
  placementMessage?: string;
  appliedReferralCode?: string;
  appliedReferralCollaboratorName?: string;
  photoUrl?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
}

export enum ExamRegistrationStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Cancelled = 4,
}

export type ApprovalStatusLabel =
  | "Chờ duyệt"
  | "Đã duyệt"
  | "Từ chối"
  | "Đã hủy";

export type PaymentStatusLabel = "Đã nộp lệ phí" | "Chưa nộp lệ phí";

export interface RegistrationRecord {
  id: string;
  examBatchId?: string;
  examBatch?: string;
  courseId?: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  avatarInitials: string;
  avatarColor: string;
  registrationDate: string;
  paymentStatus?: PaymentStatusLabel;
  isPaid?: boolean;
  attendanceRate?: number;
  totalSessions?: number;
  presentCount?: number;
  approvalStatus: ApprovalStatusLabel;
  status: CourseRegistrationStatus | ExamRegistrationStatus;
  termId?: string;
  termName?: string;
  courseName?: string;
  licenseType?: string;
  isEligibleForApproval?: boolean;
  totalFee?: number;
  notes?: string;
  assignedTermId?: string;
  assignedTermName?: string;
  assignedClassId?: string;
  assignedClassName?: string;
  suggestedTermId?: string;
  suggestedTermName?: string;
  suggestedTermStartDate?: string;
  placementMessage?: string;
  photoUrl?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
}

export interface RegistrationTermOption {
  id: string;
  termName: string;
  startDate: string;
  endDate: string;
  currentStudents: number;
  maxStudents: number;
  isCurrentAssignment: boolean;
  isLateForAutoPlacement: boolean;
}

export interface TermRegistrationCandidate {
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  licenseTypeLabel: string;
  attendanceRate: number;
  totalSessions: number;
  presentCount: number;
  isEligibleForApproval: boolean;
  alreadyRegistered: boolean;
}

export interface RegistrationBatchPage {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  pendingCount: number;
  eligibleCount: number;
  items: RegistrationRecord[];
}

export interface CourseRegistrationPage {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  newRegistrationsThisMonth: number;
  pendingRegistrations: number;
  items: RegistrationRecord[];
}

export const EXAM_LEVEL_LABELS: Record<number, string> = {
  1: "A1",
  2: "A",
  3: "B1",
  4: "B",
  5: "C1",
  6: "C",
  7: "D1",
  8: "D2",
  9: "D",
  10: "BE",
  11: "C1E",
  12: "CE",
  13: "D1E",
  14: "D2E",
  15: "DE",
};
