"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import NotificationDetail from '@/components/manager/Shared/NotificationDetail';
import { notificationService } from '@/services/notificationService';
import { NotificationRecord } from '@/types/notification';

export default function NotificationDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { getToken } = useAuth();
  const [data, setData] = useState<NotificationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/training-manager/dashboard' },
    { label: 'Thông báo', href: '/training-manager/notifications' },
    { label: 'Chi tiết thông báo' }
  ];

  const fetchData = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      
      const detail = await notificationService.getNotificationById(id);
      if (detail) {
        setData(detail);
        // Tự động đánh dấu đã đọc khi xem chi tiết
        if (!detail.isRead) {
          await notificationService.markAsRead(id);
          setData({ ...detail, isRead: true });
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching notification detail:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setCurrentId(resolved.id);
      fetchData(resolved.id);
    };
    resolveParams();
  }, [params, fetchData]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-slate-200">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy thông báo</h2>
          <p className="text-slate-500">Thông báo mang mã (ID: {currentId}) không tồn tại hoặc bạn không có quyền xem.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <NotificationDetail data={data as any} />
    </div>
  );
}