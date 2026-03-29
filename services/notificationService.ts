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
      // Backend returns a standard ApiResponse<IEnumerable<NotificationResponseDto>>
      return (response.data.data || []).map(mapToNotificationRecord);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  },

  /**
   * Get a single notification by local ID (from the list state).
   * Note: Backend doesn't have a direct GetById that is personalized, 
   * so we usually find it in the list or fetch the full list.
   */
  getNotificationById: async (id: string): Promise<NotificationRecord | null> => {
    const notifications = await notificationService.getMyNotifications();
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
