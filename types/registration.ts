// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\types\registration.ts

export type CourseRegistrationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

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
  avatarInitials: string;
  avatarColor: string;
  course: string;
  examBatch: string;
  registrationDate: string;
  paymentStatus: 'Đã đóng' | 'Chưa đóng';
  conditionStatus: 'Đủ giờ học' | 'Chưa đủ ĐK';
  approvalStatus: 'Đang chờ duyệt' | 'Đã duyệt' | 'Bị từ chối' | 'Đã hủy';
  isPaid: boolean;
  status: ExamRegistrationStatus;
}