"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Edit3, Loader2 } from 'lucide-react';
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { NotificationRecord, SystemAlert, NotificationType } from '@/types/notification';
import { notificationService } from '@/services/notificationService';

import NotificationList from '../NotificationList';
import NotificationModal from '@/components/manager/Modals/NotificationModal';

interface Props {
  initialNotifications?: NotificationRecord[];
  alerts?: SystemAlert[];
}

const TABS = [
  { id: 'All', label: 'Tất cả' },
  { id: 'System', label: 'Hệ thống' },
  { id: 'Exam', label: 'Kỳ thi' },
  { id: 'Class', label: 'Lớp học' },
  { id: 'Registration', label: 'Đăng ký' }
];

export default function NotificationClientView({ initialNotifications = [], alerts = [] }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();

  const [notifications, setNotifications] = useState<NotificationRecord[]>(initialNotifications);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<NotificationRecord | null>(null);

  // DATA FETCHING
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      return activeTab === 'All' || notif.type === activeTab;
    });
  }, [notifications, activeTab]);

  const handleCreate = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;

    try {
      const token = await getToken();
      setAuthToken(token);
      await Promise.all(unreadIds.map(id => notificationService.markAsRead(id)));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // 3. Cập nhật hàm xử lý click để chuyển trang
  const handleViewDetail = (id: string) => {
    // Điều hướng tương đối: Thêm ID vào sau URL hiện tại 
    // VD: Đang ở /training-manager/notifications -> sẽ nhảy sang /training-manager/notifications/[id]
    router.push(`notifications/${id}`); 
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      
      {/* Cột Trái: Nội dung chính */}
      <div className="flex-1 space-y-6 min-w-0">
        
        {/* Thanh Tabs & Nút bấm Hành động */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
            {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-xs rounded transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'font-bold bg-blue-600 text-white' : 'font-medium text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 hover:underline px-2 py-1 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Đã đọc tất cả
            </button>
            
            <button 
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm active:scale-95"
            >
              <Edit3 className="w-4 h-4" /> Soạn thông báo
            </button>
          </div>
        </div>

      {/* Component Danh sách */}
        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
        ) : (
          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <NotificationList 
              notifications={filteredNotifications} 
              onViewDetail={handleViewDetail} 
            />
          </div>
        )}

      </div>
      
      {/* Modal Soạn thông báo */}
      <NotificationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          try {
            const token = await getToken();
            setAuthToken(token);
            await notificationService.sendNotification({
              title: data.title!,
              content: data.content!,
              type: data.type as any || NotificationType.System
            });
            fetchNotifications();
            setIsModalOpen(false);
          } catch (err) {
            alert("Lỗi khi gửi thông báo.");
          }
        }}
      />
      
    </div>
  );
}