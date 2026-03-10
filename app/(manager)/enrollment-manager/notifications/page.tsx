'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { AppNotification } from '@/types/notification';
import { SendNotificationModal } from '@/components/manager/Notification/SendNotificationModal';
import styles from './NotificationList.module.css';

// Mock data chuyên biệt cho Tuyển sinh
const ENROLLMENT_NOTIFS: AppNotification[] = [
  { id: 'e1', category:'general', title: 'New Collaborator Registered', content: 'Anna White has registered as a new collaborator and is pending approval.', createdAt: '2026-03-10T10:30:00Z', createdBy: 'System', isRead: false, category: 'enrollment' },
  { id: 'e2', category:'general', title: 'Admission Post Needs Review', content: 'James Smith has submitted a new admission campaign for the B2 Course. Please review before publishing.', createdAt: '2026-03-09T16:45:00Z', createdBy: 'James Smith', isRead: false, category: 'general' },
  { id: 'e3', category:'general', title: 'Monthly Target Reached', content: 'Congratulations! The enrollment target for March has been reached (120%).', createdAt: '2026-03-08T09:00:00Z', createdBy: 'System', isRead: true, category: 'update' },
];

export default function EnrollmentNotificationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const breadcrumbs = [
    { label: 'Enrollment Manager', href: '/enrollment-manager/dashboard' }, 
    { label: 'Notifications' }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <h2 className="text-3xl font-extrabold tracking-tight mt-[-10px] text-slate-900 dark:text-white">Inbox & Alerts</h2>
        </div>
        {/* Quyền quản lý Broadcast của Enrollment Manager */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-lg">campaign</span>
          Send Broadcast
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Filter/Tabs Bar */}
        <div className="border-b border-slate-200 dark:border-slate-800 p-2 flex gap-2 bg-slate-50/50 dark:bg-slate-800/20">
          <button className="px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-lg">All</button>
          <button className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Pending Actions</button>
          <button className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Sent by me</button>
        </div>

        {/* List */}
        <div className={styles.listContainer}>
          {ENROLLMENT_NOTIFS.map(notif => (
            <Link 
              href={`/enrollment-manager/notifications/${notif.id}`} 
              key={notif.id}
              className={`p-5 flex gap-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
            >
              <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <span className="material-symbols-outlined">{!notif.isRead ? 'notifications_active' : 'notifications'}</span>
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
              </div>
            </Link>
          ))}
        </div>
      </div>
      <SendNotificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}