'use client';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import NotificationClientView from '@/components/manager/Shared/NotificationClientView';
import { MOCK_NOTIFICATIONS, MOCK_ALERTS } from '@/constants/notification-data';


export default function NotificationsPage() {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/training-manager/dashboard' },
    { label: 'Thông báo' }
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <NotificationClientView 
        initialNotifications={MOCK_NOTIFICATIONS} 
        alerts={MOCK_ALERTS} 
        isAdmin={true}
      />
    </div>
  );
}