"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  UserPlus, 
  CalendarX, 
  FileText, 
  RefreshCw, 
  Settings, 
  DollarSign 
} from 'lucide-react';
import { BellNotification, UserRole } from '@/types/notification';
import { getNotificationsByRole } from '@/constants/notification-data';

interface Props {
  role: UserRole;
}

export default function NotificationBell({ role }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Lấy data theo role
  const notifications = getNotificationsByRole(role);
  const unreadCount = notifications.filter(n => n.isUnread).length;

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hàm helper chọn Icon dựa theo loại thông báo
  const getIconProps = (type: string) => {
    switch (type) {
      case 'enrollment': return { icon: <UserPlus className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-100' };
      case 'schedule': return { icon: <CalendarX className="w-5 h-5 text-red-600" />, bg: 'bg-red-100' };
      case 'exam': return { icon: <FileText className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' };
      case 'document': return { icon: <RefreshCw className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-100' };
      case 'finance': return { icon: <DollarSign className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' };
      case 'system': 
      default: return { icon: <Settings className="w-5 h-5 text-slate-600" />, bg: 'bg-slate-200' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Bell */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full h-10 w-10 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {/* Dropdown UI */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="text-slate-900 font-bold text-base">Thông báo</h3>
              <p className="text-xs text-slate-500">Bạn có {unreadCount} thông báo chưa đọc</p>
            </div>
            {unreadCount > 0 && (
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* Danh sách */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const { icon, bg } = getIconProps(notif.type);
                return (
                  <div 
                    key={notif.id} 
                    className={`flex gap-4 p-4 cursor-pointer transition-colors border-b border-slate-50 ${
                      notif.isUnread ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50 opacity-75'
                    }`}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
                      {icon}
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex justify-between items-start">
                        <p className={`text-sm ${notif.isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">
                          {notif.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                    {/* Dấu chấm xanh báo chưa đọc */}
                    {notif.isUnread && <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                Không có thông báo nào.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
            <span className="text-sm font-bold text-blue-600">Xem tất cả thông báo</span>
          </div>
        </div>
      )}
    </div>
  );
}