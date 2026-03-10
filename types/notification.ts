// Các loại danh mục để hiển thị icon/màu sắc trên UI
export type NotificationCategory = 'enrollment' | 'conflict' | 'exam' | 'update' | 'general';

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  
  // Các trường dùng cho quản lý (Broadcast)
  createdBy?: string;
  roleTarget?: string | null; 
  centerId?: string | null;
  
  // Trạng thái đọc (Join từ UserNotifications)
  isRead: boolean;
  
  // Custom UI Type để render màu/icon tương ứng
  category: NotificationCategory; 
}