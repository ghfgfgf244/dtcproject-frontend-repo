// src/types/notification.ts

export type NotificationCategory = 'Enrollment' | 'Schedule' | 'Exams' | 'System' | 'Document';
export type NotificationStatus = 'unread' | 'read';
export type UserRole = 'training_manager' | 'enrollment_manager' | 'admin';

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
  timeAgo: string;
  message: string;
  category: NotificationCategory;
  status: NotificationStatus;
  actionText?: string;
}

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

export interface NotificationDetailRecord {
  id: string;
  tag: string;           // VD: 'CẢNH BÁO HỆ THỐNG'
  title: string;
  type: string;          // VD: 'Bắt buộc tuân thủ'
  content: string[];     // Array các đoạn văn (paragraphs)
  centerId: string;
  isDeleted: boolean;
  createdAt: string;
  createdBy: UserAudit;
  updatedAt: string;
  updatedBy: UserAudit;
}