import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';

export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/training-manager/dashboard' },
    { label: 'Notifications', href: '/training-manager/notifications' },
    { label: 'Detail' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="mt-4 mb-6">
        <Link href="/training-manager/notifications" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Inbox
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Header Thông báo */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">System Update v2.4</h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                SA
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">System Admin</p>
                <p className="text-xs text-slate-500">To: All Users</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Mar 10, 2026</p>
              <p className="text-xs text-slate-500">08:00 AM</p>
            </div>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-8">
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <p>Dear Team,</p>
            <p>Please be informed that the system will be down for scheduled maintenance at midnight tonight (12:00 AM to 02:00 AM).</p>
            <p>During this window, the portal will be inaccessible. Please ensure all classes are concluded and attendance records are saved before 11:30 PM to prevent any data loss.</p>
            <p>Thank you for your cooperation.</p>
            <p>Best regards,<br/><strong>IT Operations Team</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}