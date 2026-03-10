import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';

export default function AdminNotificationDetailPage({ params }: { params: { id: string } }) {
  const breadcrumbs = [
    { label: 'System Admin', href: '/admin/dashboard' },
    { label: 'System Logs & Alerts', href: '/admin/notifications' },
    { label: 'Alert Detail' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="mt-4 mb-6">
        <Link href="/admin/notifications" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to System Logs
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/30 rounded-2xl shadow-sm overflow-hidden">
        {/* Header Thông báo - Theme Đỏ Cảnh Báo */}
        <div className="p-8 border-b border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/10">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl text-red-500">warning</span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Unusual Login Activity Detected</h1>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Security Bot</p>
                <p className="text-xs text-slate-500">To: Super Admins</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Mar 10, 2026</p>
              <p className="text-xs text-slate-500">18:22 PM</p>
            </div>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-8">
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <p className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wide text-sm">CRITICAL ALERT</p>
            <p>The system has detected multiple failed login attempts targeting the Finance module.</p>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 my-4 font-mono text-sm shadow-inner">
              <p className="mb-1"><span className="text-slate-500 w-32 inline-block">IP Address:</span> <span className="font-semibold text-slate-900 dark:text-white">192.168.1.105</span></p>
              <p className="mb-1"><span className="text-slate-500 w-32 inline-block">Target Module:</span> <span className="font-semibold text-slate-900 dark:text-white">/admin/financials</span></p>
              <p className="mb-1"><span className="text-slate-500 w-32 inline-block">Failed Attempts:</span> <span className="font-semibold text-red-500">14</span></p>
              <p><span className="text-slate-500 w-32 inline-block">Status:</span> <span className="font-semibold text-orange-500">IP temporarily blocked for 24 hours.</span></p>
            </div>
            
            <p>No successful breaches have been detected. However, we recommend reviewing the access logs and considering enforcing 2FA for all users with Financial access.</p>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold shadow-md shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95">
                Ban IP Permanently
              </button>
              <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 active:scale-95">
                View Security Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}