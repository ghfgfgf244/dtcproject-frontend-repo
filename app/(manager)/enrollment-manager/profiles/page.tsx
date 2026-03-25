// src/app/(manager)/enrollment-manager/profiles/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index'; // Nhớ điều chỉnh path nếu cần
import ProfileClientView from '@/components/manager/ProfileManagement/ProfileClientView';
import { MOCK_STUDENTS, MOCK_COLLABORATORS } from '@/constants/profile-data';

export default function ProfileManagementPage() {
  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/enrollment-manager/dashboard' },
    { label: 'Quản lý Hồ sơ', href: '/enrollment-manager/profiles' }
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <div className="max-w-7xl mx-auto w-full">
        {/* Đẩy cả 2 mảng Mock Data xuống Client */}
        <ProfileClientView 
          initialStudents={MOCK_STUDENTS} 
          initialCollaborators={MOCK_COLLABORATORS} 
        />
      </div>
    </div>
  );
}