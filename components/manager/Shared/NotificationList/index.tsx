// src/app/(manager)/training-manager/notifications/_components/NotificationList/index.tsx
import React from 'react';
import { CheckCircle, Calendar, Info, FileQuestion, FileText } from 'lucide-react';
import { NotificationRecord } from '@/types/notification';

interface Props {
  notifications: NotificationRecord[];
  onViewDetail: (id: string) => void;
}

export default function NotificationList({ notifications, onViewDetail }: Props) {
  
  const getIconAndStyle = (category: string) => {
    switch(category) {
      case 'Enrollment': return { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-100' };
      case 'Schedule': return { icon: <Calendar className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' };
      case 'System': return { icon: <Info className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' };
      case 'Exams': return { icon: <FileQuestion className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' };
      case 'Document': return { icon: <FileText className="w-5 h-5 text-slate-600" />, bg: 'bg-slate-200' };
      default: return { icon: <Info className="w-5 h-5 text-slate-600" />, bg: 'bg-slate-100' };
    }
  };

  return (
    <div className="space-y-3">
      {notifications.map((notif) => {
        const isUnread = notif.status === 'unread';
        const { icon, bg } = getIconAndStyle(notif.category);

        return (
          <div 
            key={notif.id} 
            className={`group border border-slate-200 p-4 rounded-xl transition-all flex items-start gap-4 relative overflow-hidden cursor-pointer ${isUnread ? 'bg-white shadow-sm hover:shadow-md' : 'bg-slate-50'}`}
            onClick={() => onViewDetail(notif.id)}
          >
            {/* Thanh dọc bên trái báo Unread */}
            {isUnread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
            
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
              {icon}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-sm ${isUnread ? 'font-bold text-slate-900' : 'font-bold text-slate-700'}`}>
                  {notif.title}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.timeAgo}</span>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{notif.message}</p>
            </div>
            
            {/* Chấm xanh báo Unread */}
            {isUnread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
          </div>
        );
      })}

      {/* Pagination Mock */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Showing 1-5 of 42 notifications</p>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center border border-blue-600 bg-blue-600 rounded text-white text-xs font-bold">1</button>
          <button className="w-8 h-8 flex items-center justify-center border border-slate-200 bg-white rounded text-slate-600 text-xs font-bold hover:border-blue-600 hover:text-blue-600">2</button>
        </div>
      </div>
    </div>
  );
}