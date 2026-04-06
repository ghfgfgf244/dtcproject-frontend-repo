// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\types\registration.ts

export type CourseRegistrationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export enum CourseRegistrationStatusValue {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Cancelled = 4
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
  notes?: string;
}

// Exam Registration Status
export enum ExamRegistrationStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Cancelled = 4
}

// Model in UI
export interface RegistrationRecord {
  id: string;
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
  avatarInitials: string;
  avatarColor: string;
  courseId: string;
  courseName: string;
  licenseType: string;
  registrationDate: string;
  conditionStatus: 'Đủ giờ học' | 'Chưa đủ ĐK';
  approvalStatus: 'Đang chờ duyệt' | 'Đã duyệt' | 'Bị từ chối' | 'Đã hủy';
  status: CourseRegistrationStatus;
  totalFee: number;
  notes?: string;
  photoUrl?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
}

export const EXAM_LEVEL_LABELS: Record<number, string> = {
  1: 'A1', 2: 'A', 3: 'B1', 4: 'B', 5: 'C1', 6: 'C', 7: 'D1', 8: 'D2', 9: 'D', 10: 'BE', 11: 'C1E', 12: 'CE', 13: 'D1E', 14: 'D2E', 15: 'DE'
};
