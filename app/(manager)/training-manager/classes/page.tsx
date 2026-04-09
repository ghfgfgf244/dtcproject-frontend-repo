// src/app/(manager)/training-manager/classes/page.tsx
import React from 'react';
import ClassClientView from '@/components/manager/ClassManagement/ClassClientView';

export default function ClassManagementPage() {
  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <ClassClientView />
    </div>
  );
}
