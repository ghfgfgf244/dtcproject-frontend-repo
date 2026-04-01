// src/app/(manager)/enrollment-manager/collaborators/page.tsx
import React from 'react';
import CollaboratorClientView from '@/components/manager/CollaboratorManagement/CollaboratorClientView';
import { MOCK_COLLABORATORS, MOCK_COLLAB_STATS, REGIONAL_DATA } from '@/constants/collaborator-data';

export const metadata = {
  title: 'Quản lý Cộng tác viên | Enrollment Manager',
};

export default function CollaboratorsPage() {
  // Dữ liệu này sau này sẽ được fetch từ API thông qua server action/service
  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Breadcrumbs có thể thêm ở đây nếu cần */}
        <CollaboratorClientView 
          initialData={MOCK_COLLABORATORS}
          stats={MOCK_COLLAB_STATS}
          regions={REGIONAL_DATA}
        />
      </div>
    </main>
  );
}