import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import NotificationDetail from '@/components/manager/Shared/NotificationDetail';
import { MOCK_NOTIFICATION_DETAILS } from '@/constants/notification-data';

export default async function EnrollmentNotificationDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  // Breadcrumbs dành riêng cho Enrollment Manager
  const breadcrumbsItems = [
    { label: 'Dashboard', href: '/enrollment-manager/dashboard' },
    { label: 'Thông báo', href: '/enrollment-manager/notifications' },
    { label: 'Chi tiết thông báo' }
  ];

  // 1. Lấy ID từ URL an toàn (Hỗ trợ Next 15+)
  const resolvedParams = await params;
  const currentId = resolvedParams.id;

  // 2. Lấy dữ liệu
  const detailData = MOCK_NOTIFICATION_DETAILS[currentId];

  // 3. Lớp phòng thủ (Guard Clause)
  if (!detailData) {
    return (
      <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy thông báo</h2>
          <p className="text-slate-500">Thông báo mang mã (ID: {currentId}) không tồn tại hoặc bạn không có quyền truy cập.</p>
        </div>
      </div>
    );
  }

  // 4. Render Component
  return (
    <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <NotificationDetail data={detailData} />
    </div>
  );
}