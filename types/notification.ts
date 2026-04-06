// src/types/notification.ts

export type NotificationCategory = 'Enrollment' | 'Schedule' | 'Exams' | 'System' | 'Document';
export type NotificationStatus = 'unread' | 'read';
export type UserRole = 'training_manager' | 'enrollment_manager' | 'admin';

export enum NotificationType {
  System = 1,
  Exam = 2,
  Class = 3,
  Welcome = 4,
  RoleChanged = 5,
  Referral = 6,
  Attendance = 7,
  ExamResult = 8,
  Registration = 9
}

export const NOTIFICATION_TYPE_MAP: Record<NotificationType, string> = {
  [NotificationType.System]: 'Thông báo hệ thống',
  [NotificationType.Exam]: 'Thông báo kỳ thi',
  [NotificationType.Class]: 'Thông báo lớp học',
  [NotificationType.Welcome]: 'Chào mừng',
  [NotificationType.RoleChanged]: 'Thay đổi vai trò',
  [NotificationType.Referral]: 'Hoa hồng',
  [NotificationType.Attendance]: 'Điểm danh',
  [NotificationType.ExamResult]: 'Kết quả thi',
  [NotificationType.Registration]: 'Đăng ký khóa học'
};

// Map string keys from backend type (n.Type.ToString()) if needed
export const NOTIFICATION_TYPE_STRING_MAP: Record<string, string> = {
  'System': 'Thông báo hệ thống',
  'Exam': 'Thông báo kỳ thi',
  'Class': 'Thông báo lớp học',
  'Welcome': 'Chào mừng',
  'RoleChanged': 'Thay đổi vai trò',
  'Referral': 'Hoa hồng',
  'Attendance': 'Điểm danh',
  'ExamResult': 'Kết quả thi',
  'Registration': 'Đăng ký khóa học'
};

export interface BellNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  isUnread: boolean;
  type: 'enrollment' | 'schedule' | 'system' | 'exam' | 'document' | 'finance';
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  content: string; // The backend provides this in both list and detail
  type: string; // From backend string
  typeLabel: string; // Vietnamese label
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
}

export interface NotificationDetailRecord extends NotificationRecord {}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning';
}
export interface UserAudit {
  id: string;
  name: string;
  initials: string;
}

// For creating notifications
export interface SendNotificationRequest {
  title: string;
  content: string;
  type: NotificationType;
  targetRoles?: number[]; // Enum UserRole as int
  centerId?: string;
}