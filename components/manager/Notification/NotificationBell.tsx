'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AppNotification, NotificationCategory } from '@/types/notification';
import styles from './NotificationBell.module.css';

// Mock Data bám sát HTML của bạn
const MOCK_NOTIFS: AppNotification[] = [
  { id: '1', title: 'New Student Enrollment', content: 'John Doe just signed up for the Advanced Manual Driving Course.', createdAt: '2026-03-10T15:14:00Z', isRead: false, category: 'enrollment' },
  { id: '2', title: 'Instructor Schedule Conflict', content: 'Coach Sarah has a double booking for tomorrow\'s 10:00 AM session.', createdAt: '2026-03-10T15:01:00Z', isRead: false, category: 'conflict' },
  { id: '3', title: 'Exam Results Ready', content: 'Class B written exam results are now available for batch 2024-A.', createdAt: '2026-03-10T14:16:00Z', isRead: false, category: 'exam' },
  { id: '4', title: 'Course Update', content: 'Safety regulations module has been updated to Version 2.4.', createdAt: '2026-03-10T12:16:00Z', isRead: true, category: 'update' },
];

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = MOCK_NOTIFS.filter(n => !n.isRead).length;

  // Click ra ngoài để đóng Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hàm render UI (Màu sắc & Icon) tự động theo thể loại
  const getCategoryStyles = (category: NotificationCategory) => {
    switch (category) {
      case 'enrollment': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', icon: 'person_add' };
      case 'conflict': return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', icon: 'event_busy' };
      case 'exam': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', icon: 'description' };
      case 'update': return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', icon: 'update' };
      default: return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', icon: 'notifications' };
    }
  };

  // Format thời gian hiển thị (ví dụ: 2m ago, 1h ago)
  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000); // phút
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      {/* Nút Chuông */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors relative"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
        )}
      </button>

      {/* Dropdown UI Overlay */}
      {isOpen && (
        <div className={`${styles.dropdownMenu} bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200`}>
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-xl shrink-0">
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-base">Notifications</h3>
              <p className="text-xs text-slate-500">You have {unreadCount} unread alerts</p>
            </div>
            {unreadCount > 0 && (
              <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className={styles.scrollArea}>
            {MOCK_NOTIFS.length > 0 ? (
              MOCK_NOTIFS.map((notif) => {
                const uiStyles = getCategoryStyles(notif.category);
                
                return (
                  <Link 
                    href={`/notifications/${notif.id}`} // Route chung cho inbox của mọi user
                    key={notif.id}
                    onClick={() => setIsOpen(false)}
                    className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 group"
                  >
                    {/* Icon */}
                    <div className={`shrink-0 size-10 rounded-lg flex items-center justify-center ${uiStyles.bg}`}>
                      <span className={`material-symbols-outlined ${uiStyles.text}`}>{uiStyles.icon}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-sm truncate ${!notif.isRead ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {notif.content}
                      </p>
                    </div>

                    {/* Unread Dot */}
                    {!notif.isRead && (
                      <div className="size-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    )}
                  </Link>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl opacity-20 mb-2">notifications_off</span>
                <p className="text-sm">You are all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-900/50 rounded-b-xl shrink-0">
            <Link 
              href="/notifications" 
              onClick={() => setIsOpen(false)}
              className="w-full inline-block py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};