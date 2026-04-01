"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Edit3, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
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

const ITEMS_PER_PAGE = 10; // Cấu hình số lượng item mỗi trang

export default function NotificationClientView({ initialNotifications = [], alerts = [] }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();

  const [notifications, setNotifications] = useState<NotificationRecord[]>(initialNotifications);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State trang hiện tại

  // RESET trang khi đổi tab
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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

  // 1. Logic lọc
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      return activeTab === 'All' || notif.type === activeTab;
    });
  }, [notifications, activeTab]);

  // 2. Logic phân trang (Tính toán sau khi lọc)
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNotifications, currentPage]);

  const handleCreate = () => {
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

  const handleViewDetail = (id: string) => {
    router.push(`notifications/${id}`); 
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      <div className="flex-1 space-y-6 min-w-0">
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

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
              <NotificationList 
                notifications={paginatedNotifications} // Sử dụng list đã phân trang
                onViewDetail={handleViewDetail} 
              />
            </div>

            {/* UI ĐIỀU HƯỚNG PHÂN TRANG */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">
                  Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredNotifications.length)} trên tổng số {filteredNotifications.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                          currentPage === page 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
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