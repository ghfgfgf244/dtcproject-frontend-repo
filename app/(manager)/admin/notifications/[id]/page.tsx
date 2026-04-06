'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import NotificationDetail from '@/components/manager/Shared/NotificationDetail';
import { notificationService } from '@/services/notificationService';
import { NotificationRecord } from '@/types/notification';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AdminNotificationDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { getToken } = useAuth();
  
  const [data, setData] = useState<NotificationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbsItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Quản lý Thông báo', href: '/admin/notifications' },
    { label: 'Chi tiết thông báo' }
  ];

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const detail = await notificationService.getNotificationById(id, true);
      if (detail) {
        setData(detail);
      } else {
        setError("Không tìm thấy thông báo này.");
      }
    } catch (err) {
      console.error("Error fetching notification detail:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [id, getToken]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return (
    <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      {loading ? (
         <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang truy xuất dữ liệu hệ thống...</p>
         </div>
      ) : error || !data ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-2xl border border-slate-100 shadow-xl shadow-red-50/50">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Lỗi truy xuất</h2>
          <p className="text-slate-400 font-medium mb-6 text-center max-w-sm">
            {error || "Thông báo này không còn tồn tại trong hệ thống hoặc bạn không có quyền truy cập."}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Quay lại danh sách
          </button>
        </div>
      ) : (
        <NotificationDetail data={data} showActions={false} />
      )}
    </div>
  );
}