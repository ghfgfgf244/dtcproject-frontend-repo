import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { KPICards } from '@/components/manager/Dashboard/KPICards';
import { EnrollmentChart } from '@/components/manager/Dashboard/EnrollmentChart';
import { UpcomingExams } from '@/components/manager/Dashboard/UpcomingExams';
import { InstructorStatus } from '@/components/manager/Dashboard/InstructorStatus';

export default function TrainingDashboardPage() {
  const breadcrumbs = [
    { label: 'Dashboard' } // Đang ở Dashboard nên chỉ cần 1 cấp
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      
      {/* 1. Row: KPIs */}
      <KPICards />
      
      {/* 2. Row: Chart & Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EnrollmentChart />
        <UpcomingExams />
      </div>
      
      {/* 3. Row: Instructors & Activity */}
      <div className="w-full">
        <InstructorStatus />
      </div>
    </div>
  );
}