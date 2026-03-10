import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';

export default function EnrollmentNotificationDetailPage({ params }: { params: { id: string } }) {
  const breadcrumbs = [
    { label: 'Enrollment Manager', href: '/enrollment-manager/dashboard' },
    { label: 'Notifications', href: '/enrollment-manager/notifications' },
    { label: 'Detail' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="mt-4 mb-6">
        <Link href="/enrollment-manager/notifications" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Inbox
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Header Thông báo */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">New Collaborator Registered</h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                AW
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Anna White</p>
                <p className="text-xs text-slate-500">To: Enrollment Team</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Mar 10, 2026</p>
              <p className="text-xs text-slate-500">10:30 AM</p>
            </div>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-8">
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <p>Hello Team,</p>
            <p>A new collaborator, <strong>Anna White</strong>, has registered on the partner portal and is currently awaiting approval.</p>
            
            <ul className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 list-none my-4 space-y-2">
              <li><span className="font-semibold text-slate-500 mr-2">Email:</span> anna.white@example.com</li>
              <li><span className="font-semibold text-slate-500 mr-2">Phone:</span> +1 (555) 987-6543</li>
              <li><span className="font-semibold text-slate-500 mr-2">Region:</span> North District</li>
            </ul>
            
            <p>Please review her application and verify the provided documents in the Collaborator Management module.</p>
            
            <div className="mt-8">
              {/* Nút Call to Action (CTA) để Manager thao tác nhanh */}
              <Link href="/enrollment-manager/collaborators" className="inline-block px-6 py-2.5 bg-primary text-white rounded-lg font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                Review Application
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}