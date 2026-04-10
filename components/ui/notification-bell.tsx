"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Bell,
  CalendarX,
  FileText,
  Loader2,
  RefreshCw,
  Settings,
  UserPlus,
} from "lucide-react";
import { setAuthToken } from "@/lib/api";
import { NotificationRecord, UserRole } from "@/types/notification";
import { notificationService } from "@/services/notificationService";

interface Props {
  role: UserRole;
}

const getNotificationRoute = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "/admin/notifications";
    case "enrollment_manager":
      return "/enrollment-manager/notifications";
    default:
      return "/training-manager/notifications";
  }
};

const getIconProps = (type: string) => {
  switch (type) {
    case "Registration":
      return {
        icon: <UserPlus className="h-5 w-5 text-emerald-600" />,
        bg: "bg-emerald-100",
      };
    case "Class":
    case "Attendance":
      return {
        icon: <CalendarX className="h-5 w-5 text-red-600" />,
        bg: "bg-red-100",
      };
    case "Exam":
    case "ExamResult":
      return {
        icon: <FileText className="h-5 w-5 text-blue-600" />,
        bg: "bg-blue-100",
      };
    case "RoleChanged":
    case "Referral":
      return {
        icon: <RefreshCw className="h-5 w-5 text-amber-600" />,
        bg: "bg-amber-100",
      };
    case "System":
    case "Welcome":
    default:
      return {
        icon: <Settings className="h-5 w-5 text-slate-600" />,
        bg: "bg-slate-200",
      };
  }
};

export default function NotificationBell({ role }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data =
        role === "admin"
          ? await notificationService.getAllAdminNotifications()
          : await notificationService.getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load header notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [getToken, role]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((notification) => !notification.isRead).map((notification) => notification.id);
    if (unreadIds.length === 0) return;

    try {
      const token = await getToken();
      setAuthToken(token);
      await Promise.all(unreadIds.map((id) => notificationService.markAsRead(id)));
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const handleOpenNotification = async (notification: NotificationRecord) => {
    try {
      if (!notification.isRead) {
        const token = await getToken();
        setAuthToken(token);
        await notificationService.markAsRead(notification.id);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id ? { ...item, isRead: true } : item,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setIsOpen(false);
      router.push(`${getNotificationRoute(role)}/${notification.id}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Thông báo</h3>
              <p className="text-xs text-slate-500">Bạn có {unreadCount} thông báo chưa đọc</p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs font-bold text-blue-600 transition-colors hover:text-blue-800"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-3 p-8 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang tải thông báo...
              </div>
            ) : notifications.length > 0 ? (
              notifications.slice(0, 8).map((notification) => {
                const { icon, bg } = getIconProps(notification.type);
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleOpenNotification(notification)}
                    className={`flex w-full gap-4 border-b border-slate-50 p-4 text-left transition-colors ${
                      notification.isRead
                        ? "bg-slate-50/50 opacity-75 hover:bg-slate-100/50"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                      {icon}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between">
                        <p
                          className={`text-sm ${
                            notification.isRead
                              ? "font-medium text-slate-700"
                              : "font-bold text-slate-900"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <span className="ml-2 whitespace-nowrap text-[10px] font-bold text-slate-400">
                          {notification.timeAgo}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                Không có thông báo nào.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              router.push(getNotificationRoute(role));
            }}
            className="w-full cursor-pointer border-t border-slate-100 bg-slate-50 p-3 text-center transition-colors hover:bg-slate-100"
          >
            <span className="text-sm font-bold text-blue-600">Xem tất cả thông báo</span>
          </button>
        </div>
      )}
    </div>
  );
}
