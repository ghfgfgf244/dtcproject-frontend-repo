import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { DocStats } from '@/components/manager/EnrollmentDocuments/DocStats';
import { ContractsTable } from '@/components/manager/EnrollmentDocuments/ContractsTable';
import { OtherDocsGrid } from '@/components/manager/EnrollmentDocuments/OtherDocsGrid';

export default function EnrollmentDocumentsPage() {
  const breadcrumbs = [
    { label: 'Enrollment Hub', href: '/enrollment-manager/dashboard' },
    { label: 'My Documents' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-1">
          <Breadcrumbs items={breadcrumbs} />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-[-10px]">My Documents</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your employment contracts, compliance NDAs, and certifications.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-primary/20 shrink-0">
          <span className="material-symbols-outlined text-xl">upload_file</span>
          <span>Upload Document</span>
        </button>
      </div>

      <DocStats />
      <ContractsTable />
      <OtherDocsGrid />
    </div>
  );
}