import api from "@/lib/api";
import { 
  NotificationRecord, 
  SendNotificationRequest, 
  NOTIFICATION_TYPE_STRING_MAP 
} from "@/types/notification";

// Helper for time ago (Simplified)
const getTimeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " năm trước";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " tháng trước";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " ngày trước";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " giờ trước";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " phút trước";
  return "Vừa xong";
};

const mapToNotificationRecord = (dto: any): NotificationRecord => {
  return {
    id: dto.id,
    title: dto.title,
    message: dto.content,
    content: dto.content, // Map to both for compatibility with Detail types
    type: dto.type,
    typeLabel: NOTIFICATION_TYPE_STRING_MAP[dto.type] || 'Thông báo',
    isRead: dto.isRead,
    createdAt: dto.createdAt,
    timeAgo: getTimeAgo(dto.createdAt)
  };
};

export const notificationService = {
  /**
   * Fetch all notifications for the current user.
   */
  getMyNotifications: async (): Promise<NotificationRecord[]> => {
    try {
      const response = await api.get<any>("/Notification/me");
      return (response.data.data || []).map(mapToNotificationRecord);
    } catch (error) {
      console.error("Failed to fetch personal notifications:", error);
      return [];
    }
  },

  /**
   * [ADMIN] Fetch all system notifications.
   */
  getAllAdminNotifications: async (): Promise<NotificationRecord[]> => {
    try {
      const response = await api.get<any>("/Notification/all");
      return (response.data.data || []).map(mapToNotificationRecord);
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
      return [];
    }
  },

  /**
   * Get a single notification by local ID.
   */
  getNotificationById: async (id: string, isAdmin: boolean = false): Promise<NotificationRecord | null> => {
    const notifications = isAdmin 
      ? await notificationService.getAllAdminNotifications()
      : await notificationService.getMyNotifications();
    return notifications.find(n => n.id === id) || null;
  },

  /**
   * Mark a notification as read.
   */
  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/Notification/${id}/read`);
  },

  /**
   * Send a new notification (Admin/Manager).
   */
  sendNotification: async (request: SendNotificationRequest): Promise<void> => {
    await api.post("/Notification", request);
  }
};
