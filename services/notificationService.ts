import api from "@/lib/api";
import {
  NOTIFICATION_TYPE_STRING_MAP,
  NotificationRecord,
  SendNotificationRequest,
} from "@/types/notification";

const getTimeAgo = (date: string) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} năm trước`;

  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} tháng trước`;

  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} ngày trước`;

  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} giờ trước`;

  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} phút trước`;

  return "Vừa xong";
};

const mapToNotificationRecord = (dto: any): NotificationRecord => ({
  id: dto.id,
  title: dto.title,
  message: dto.content,
  content: dto.content,
  type: dto.type,
  typeLabel: NOTIFICATION_TYPE_STRING_MAP[dto.type] || "Thông báo",
  isRead: dto.isRead,
  createdAt: dto.createdAt,
  timeAgo: getTimeAgo(dto.createdAt),
});

export const notificationService = {
  async getMyNotifications(): Promise<NotificationRecord[]> {
    try {
      const response = await api.get<any>("/Notification/me");
      return (response.data.data || []).map(mapToNotificationRecord);
    } catch {
      return [];
    }
  },

  async getAllAdminNotifications(): Promise<NotificationRecord[]> {
    try {
      const response = await api.get<any>("/Notification/all");
      return (response.data.data || []).map(mapToNotificationRecord);
    } catch {
      return [];
    }
  },

  async getNotificationById(
    id: string,
    isAdmin = false,
  ): Promise<NotificationRecord | null> {
    const notifications = isAdmin
      ? await notificationService.getAllAdminNotifications()
      : await notificationService.getMyNotifications();

    return notifications.find((item) => item.id === id) || null;
  },

  async markAsRead(id: string): Promise<void> {
    await api.put(`/Notification/${id}/read`);
  },

  async sendNotification(request: SendNotificationRequest): Promise<void> {
    await api.post("/Notification", request);
  },
};
