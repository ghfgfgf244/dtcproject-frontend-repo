'use client';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import NotificationClientView from '@/components/manager/Shared/NotificationClientView';
import { MOCK_NOTIFICATIONS, MOCK_ALERTS } from '@/constants/notification-data';


export default function NotificationsPage() {
  const breadcrumbItems = [
    { label: 'Bảng điều khiển', href: '/admin/dashboard' },
    { label: 'Trung tâm thông báo' }
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <NotificationClientView 
        isAdmin={true}
      />
    </div>
  );
}
