"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
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
import { notificationService } from "@/services/notificationService";
import { NotificationRecord } from "@/types/notification";
import styles from "@/styles/header.module.css";

function getItemIcon(type: string) {
  switch (type) {
    case "Registration":
      return {
        icon: <UserPlus size={16} />,
        className: `${styles.notiIcon} ${styles.green}`,
      };
    case "Class":
    case "Attendance":
      return {
        icon: <CalendarX size={16} />,
        className: `${styles.notiIcon} ${styles.blue}`,
      };
    case "Exam":
    case "ExamResult":
      return {
        icon: <FileText size={16} />,
        className: `${styles.notiIcon} ${styles.yellow}`,
      };
    case "RoleChanged":
    case "Referral":
      return {
        icon: <RefreshCw size={16} />,
        className: `${styles.notiIcon} ${styles.blue}`,
      };
    default:
      return {
        icon: <Settings size={16} />,
        className: `${styles.notiIcon} ${styles.blue}`,
      };
  }
}

export default function NotificationDropdown() {
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const fetchNotifications = useCallback(async () => {
    if (!isSignedIn || !user?.id) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setNotifications([]);
        return;
      }

      setAuthToken(token);
      const data = await notificationService.getMyNotifications();
      setNotifications(data.slice(0, 6));
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [getToken, isSignedIn, user?.id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchNotifications();
  }, [fetchNotifications, mounted]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification.id);
    if (unreadIds.length === 0) return;

    try {
      const token = await getToken();
      if (!token) return;

      setAuthToken(token);
      await Promise.all(unreadIds.map((id) => notificationService.markAsRead(id)));
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
    } catch {
      // Silent in header
    }
  };

  const handleOpenNotification = async (notification: NotificationRecord) => {
    if (notification.isRead) return;

    try {
      const token = await getToken();
      if (!token) return;

      setAuthToken(token);
      await notificationService.markAsRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );
    } catch {
      // Silent in header
    }
  };

  if (!mounted || !isSignedIn) {
    return null;
  }

  return (
    <div className={styles.notiWrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.notiBell}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell size={18} />
        {unreadCount > 0 ? <span className={styles.notiBadge} /> : null}
      </button>

      {open ? (
        <div className={`${styles.notiDropdown} ${styles.show}`}>
          <div className={styles.notiHeader}>
            <div>
              <span>Thông báo</span>
              <small className={styles.notiSubtext}>
                {unreadCount > 0
                  ? `Bạn có ${unreadCount} thông báo chưa đọc`
                  : "Bạn đã đọc hết thông báo"}
              </small>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                className={styles.notiAction}
                onClick={handleMarkAllAsRead}
              >
                Đánh dấu đã đọc
              </button>
            ) : null}
          </div>

          <div className={styles.notiList}>
            {loading ? (
              <div className={styles.notiState}>
                <Loader2 size={16} className={styles.notiSpinner} />
                <span>Đang tải thông báo...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                const icon = getItemIcon(notification.type);
                return (
                  <button
                    key={notification.id}
                    type="button"
                    className={`${styles.notiItem} ${
                      notification.isRead ? styles.notiItemRead : ""
                    }`}
                    onClick={() => handleOpenNotification(notification)}
                  >
                    <div className={icon.className}>{icon.icon}</div>
                    <div className={styles.notiBody}>
                      <p>{notification.title}</p>
                      <span>{notification.timeAgo}</span>
                      <small>{notification.message}</small>
                    </div>
                    {!notification.isRead ? (
                      <span className={styles.notiUnreadDot} />
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className={styles.notiState}>
                <span>Chưa có thông báo nào.</span>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
