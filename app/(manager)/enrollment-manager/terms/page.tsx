// src/app/(manager)/enrollment-manager/terms/page.tsx
import React from 'react';
import TermClientView from '@/components/manager/TermManagement/TermClientView';

export default function TermManagementPage() {
  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <TermClientView />
    </div>
  );
}