// src/app/(manager)/training-manager/schedule/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { MOCK_SCHEDULE_EVENTS, MOCK_COURSE_STATUSES, MOCK_WEEKLY_INSIGHTS, MOCK_DAILY_EVENTS,MOCK_DAILY_INSIGHTS } from '@/constants/schedule-data';
import ScheduleClientView from '@/components/manager/ScheduleManagement/ScheduleClientView';

export const metadata = {
  title: 'Lịch học (Tháng) | Quản lý Đào tạo',
  description: 'Quản lý lịch học và tiến độ đào tạo',
};

export default function SchedulePage() {
  const breadcrumbsItems = [
    { label: 'Hệ thống', href: '/training-manager/dashboard' },
    { label: 'Quản lý Lớp học', href: '/training-manager/classes' },
    { label: 'Lịch học (Tháng)' }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        <ScheduleClientView 
          initialEvents={MOCK_SCHEDULE_EVENTS} 
          courseStatuses={MOCK_COURSE_STATUSES} 
          weeklyInsights={MOCK_WEEKLY_INSIGHTS}
          dailyEvents={MOCK_DAILY_EVENTS}
          dailyInsights={MOCK_DAILY_INSIGHTS}
        />
      </div>
    </div>
  );
}