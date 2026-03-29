// src/types/registration.ts
export type PaymentStatus = 'Đã đóng' | 'Chưa đóng';
export type ConditionStatus = 'Đủ giờ học' | 'Chưa đủ ĐK';
export type ApprovalStatus = 'Đang chờ duyệt' | 'Đã duyệt' | 'Bị từ chối';

export interface RegistrationRecord {
  id: string;
  studentName: string;
  studentId: string;
  avatarInitials: string;
  avatarColor: string; 
  course: string; // <-- THÊM TRƯỜNG KHÓA HỌC
  examBatch: string;
  registrationDate: string;
  paymentStatus: PaymentStatus;
  conditionStatus: ConditionStatus;
  approvalStatus: ApprovalStatus;
}