'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { AppNotification } from '@/types/notification';
import { SendNotificationModal } from '@/components/manager/Notification/SendNotificationModal';
import styles from './NotificationList.module.css'; 

// Mock data chuyên biệt cho System Admin
const ADMIN_NOTIFS: AppNotification[] = [
  { id: 'a1', category:'general', title: 'Unusual Login Activity', content: 'Multiple failed login attempts detected from IP 192.168.1.105 trying to access the Finance module.', createdAt: '2026-03-10T18:22:00Z', createdBy: 'Security Bot', isRead: false, category: 'conflict' },
  { id: 'a2', category:'general', title: 'Manager Access Request', content: 'Alex Rivera has requested access to the "Collaborator Payouts" permission group.', createdAt: '2026-03-10T09:15:00Z', createdBy: 'Alex Rivera', isRead: false, category: 'enrollment' },
  { id: 'a3', category:'general', title: 'Database Backup Completed', content: 'Automated global database backup completed successfully to AWS S3 bucket.', createdAt: '2026-03-09T02:00:00Z', createdBy: 'System', isRead: true, category: 'update' },
];

export default function AdminNotificationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const breadcrumbs = [
    { label: 'System Admin', href: '/admin/dashboard' }, 
    { label: 'System Logs & Alerts' }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <h2 className="text-3xl font-extrabold tracking-tight mt-[-10px] text-slate-900 dark:text-white">System Alerts</h2>
        </div>
        {/* Admin cũng có quyền gửi thông báo hệ thống */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-lg">campaign</span>
          System Broadcast
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Filter/Tabs Bar */}
        <div className="border-b border-slate-200 dark:border-slate-800 p-2 flex gap-2 bg-slate-50/50 dark:bg-slate-800/20">
          <button className="px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-lg">All Logs</button>
          <button className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Security Risks</button>
          <button className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Access Requests</button>
        </div>

        {/* List */}
        <div className={styles.listContainer}>
          {ADMIN_NOTIFS.map(notif => (
            <Link 
              href={`/admin/notifications/${notif.id}`} 
              key={notif.id}
              className={`p-5 flex gap-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.isRead ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}
            >
              <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <span className="material-symbols-outlined">{notif.category === 'conflict' ? 'warning' : 'admin_panel_settings'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-base truncate pr-4 ${!notif.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap font-medium mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{notif.content}</p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded-md">
                    Src: {notif.createdBy}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <SendNotificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}