import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import NotificationDetail from '@/components/manager/Shared/NotificationDetail';
import { MOCK_NOTIFICATION_DETAILS } from '@/constants/notification-data';

// Thêm async và hỗ trợ Promise cho params (Chuẩn Next.js 15+)
export default async function NotificationDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  const breadcrumbsItems = [
    { label: 'Dashboard', href: '/training-manager/dashboard' },
    { label: 'Notifications', href: '/training-manager/notifications' },
    { label: 'Detail' }
  ];

  // 1. Lấy ID từ URL an toàn
  const resolvedParams = await params;
  const currentId = resolvedParams.id;

  // 2. Tra cứu đúng 1 bài thông báo cụ thể từ Từ điển (Mock Data)
  const detailData = MOCK_NOTIFICATION_DETAILS[currentId];

  // 3. Lớp phòng thủ: Nếu ID trên URL bịa đặt hoặc không tồn tại
  if (!detailData) {
    return (
      <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy thông báo</h2>
          <p className="text-slate-500">Thông báo mang mã (ID: {currentId}) không tồn tại trong hệ thống.</p>
        </div>
      </div>
    );
  }

  // 4. Nếu tìm thấy, truyền ĐÚNG 1 BÀI VÀO COMPONENT
  return (
    <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      {/* Sửa lại ở đây: Truyền detailData thay vì cả cục MOCK_NOTIFICATION_DETAILS */}
      <NotificationDetail data={detailData} />
    </div>
  );
}