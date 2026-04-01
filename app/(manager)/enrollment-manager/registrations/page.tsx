// src/app/(manager)/enrollment-manager/registrations/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { MOCK_REGISTRATIONS, MOCK_REGISTRATION_STATS, MOCK_RECENT_ACTIVITIES } from '@/constants/course-registration-data';
import CourseRegistrationClientView from '@/components/manager/CourseRegistrationClientView';

export const metadata = {
  title: 'Duyệt Đăng ký | Quản lý Tuyển sinh',
  description: 'Hệ thống xét duyệt hồ sơ học viên đăng ký',
};

export default function RegistrationsPage() {
  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/enrollment-manager/dashboard' },
    { label: 'Quản lý Đăng ký', href: '#' },
    { label: 'Duyệt Đăng ký Mới' }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        <CourseRegistrationClientView 
          initialRegistrations={MOCK_REGISTRATIONS}
          stats={MOCK_REGISTRATION_STATS}
          recentActivities={MOCK_RECENT_ACTIVITIES}
        />
      </div>
    </div>
  );
}