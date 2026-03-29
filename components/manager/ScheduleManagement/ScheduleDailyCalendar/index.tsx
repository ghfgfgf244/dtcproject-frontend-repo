// src/components/manager/ScheduleManagement/ScheduleDailyCalendar/index.tsx
import React from 'react';
import { BookOpen, Car, Monitor, User, MapPin, Clock, Edit, Trash2, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import { ScheduleEvent } from '@/types/schedule';
import styles from './daily.module.css';

interface Props {
  date: number;
  events: ScheduleEvent[];
  onDateChange: (newDate: number) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

const WEEK_STRIP = [
  { day: 'T2', date: 22 }, { day: 'T3', date: 23 }, { day: 'T4', date: 24 }, 
  { day: 'T5', date: 25 }, { day: 'T6', date: 26 }, { day: 'T7', date: 27 }, { day: 'CN', date: 28 }
];

export default function ScheduleDailyCalendar({ date, events, onDateChange, onEditClick, onDeleteClick }: Props) {
  
  const getEventStyles = (type: string) => {
    switch (type) {
      case 'Lý thuyết': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700', icon: <BookOpen className="w-6 h-6" /> };
      case 'Thực hành': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-700', icon: <Car className="w-6 h-6" /> };
      case 'Mô phỏng': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700', icon: <Monitor className="w-6 h-6" /> };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-l-slate-500', badge: 'bg-slate-100 text-slate-700', icon: <BookOpen className="w-6 h-6" /> };
    }
  };

  return (
    <div>
      {/* Quick Date Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-8 flex items-center justify-between">
        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 active:scale-95">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-1 justify-around overflow-x-auto custom-scrollbar">
          {WEEK_STRIP.map((item) => (
            <button 
              key={item.date}
              onClick={() => onDateChange(item.date)}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors min-w-[50px] ${
                date === item.date 
                  ? 'bg-blue-50 border border-blue-200 ring-1 ring-blue-200' 
                  : 'hover:bg-slate-50 group'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase ${date === item.date ? 'text-blue-600' : 'text-slate-400'}`}>
                {item.day}
              </span>
              <span className={`text-sm font-black mt-1 ${date === item.date ? 'text-blue-600' : 'text-slate-900'}`}>
                {item.date}
              </span>
            </button>
          ))}
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 active:scale-95">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Timeline Main View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className={`${styles.timelineGrid} border-b border-slate-100 bg-slate-50/50`}>
          <div className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 text-center">Thời gian</div>
          <div className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 md:px-8">Chi tiết lớp học</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-slate-100">
          
          {/* === 1. RENDER CA SÁNG (Trước 12:00) === */}
          {events.filter(e => e.startTime < '12:00').map((event) => {
            const ui = getEventStyles(event.eventType);
            return (
              <div key={event.id} className={`${styles.timelineGrid} min-h-[140px] hover:bg-slate-50/30 transition-colors group`}>
                {/* Cột thời gian */}
                <div className="p-4 border-r border-slate-100 flex flex-col items-center">
                  <span className="text-sm font-black text-slate-900">{event.startTime}</span>
                  <div className="w-px h-full bg-slate-100 my-2 group-hover:bg-blue-600/20 transition-colors"></div>
                </div>

                {/* Cột Nội dung */}
                <div className="p-4 px-4 md:px-8 relative">
                  <div className={`bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all border-l-4 ${ui.border} flex flex-col md:flex-row items-start justify-between gap-4`}>
                    <div className="flex gap-4 md:gap-5 w-full">
                      <div className={`${ui.bg} ${ui.text} p-3 rounded-lg shrink-0 h-fit`}>{ui.icon}</div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                          <h4 className="text-base font-bold text-slate-900">{event.courseId}</h4>
                          <span className={`px-2 py-0.5 rounded-full ${ui.badge} text-[10px] font-bold uppercase`}>{event.eventType}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 font-medium">{event.courseName}</p>
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5"><User className="w-4 h-4" /> <span>GV. {event.instructorName}</span></div>
                          {event.location && <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> <span>{event.location}</span></div>}
                          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> <span>{event.startTime} - {event.endTime}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 md:gap-2 self-end md:self-start shrink-0">
                      <button onClick={() => onEditClick(event.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Sửa lịch"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => onDeleteClick(event.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Xóa lịch"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* === 2. RENDER NGHỈ TRƯA CỐ ĐỊNH Ở GIỮA === */}
          <div className={`${styles.timelineGrid} min-h-[60px] hover:bg-slate-50/30 transition-colors`}>
            <div className="p-4 border-r border-slate-100 flex flex-col items-center">
              <span className="text-sm font-black text-slate-400">11:00</span>
            </div>
            <div className="p-4 px-4 md:px-8 flex items-center">
              <div className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Utensils className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nghỉ trưa (11:00 - 13:00)</span>
              </div>
            </div>
          </div>

          {/* === 3. RENDER CA CHIỀU (Từ 12:00 trở đi) === */}
          {events.filter(e => e.startTime >= '12:00').map((event) => {
            const ui = getEventStyles(event.eventType);
            return (
              <div key={event.id} className={`${styles.timelineGrid} min-h-[140px] hover:bg-slate-50/30 transition-colors group`}>
                <div className="p-4 border-r border-slate-100 flex flex-col items-center">
                  <span className="text-sm font-black text-slate-900">{event.startTime}</span>
                  <div className="w-px h-full bg-slate-100 my-2 group-hover:bg-blue-600/20 transition-colors"></div>
                </div>
                <div className="p-4 px-4 md:px-8 relative">
                  <div className={`bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all border-l-4 ${ui.border} flex flex-col md:flex-row items-start justify-between gap-4`}>
                    <div className="flex gap-4 md:gap-5 w-full">
                      <div className={`${ui.bg} ${ui.text} p-3 rounded-lg shrink-0 h-fit`}>{ui.icon}</div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                          <h4 className="text-base font-bold text-slate-900">{event.courseId}</h4>
                          <span className={`px-2 py-0.5 rounded-full ${ui.badge} text-[10px] font-bold uppercase`}>{event.eventType}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 font-medium">{event.courseName}</p>
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5"><User className="w-4 h-4" /> <span>GV. {event.instructorName}</span></div>
                          {event.location && <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> <span>{event.location}</span></div>}
                          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> <span>{event.startTime} - {event.endTime}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 md:gap-2 self-end md:self-start shrink-0">
                      <button onClick={() => onEditClick(event.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Sửa lịch"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => onDeleteClick(event.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Xóa lịch"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dấu mốc kết thúc ngày */}
          <div className={`${styles.timelineGrid} min-h-[60px] hover:bg-slate-50/30 transition-colors`}>
            <div className="p-4 border-r border-slate-100 flex flex-col items-center">
              <span className="text-sm font-black text-slate-400">17:00</span>
            </div>
            <div className="p-4 px-4 md:px-8 flex items-center">
              <div className="w-full h-px bg-slate-100"></div>
              <span className="ml-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">Kết thúc ngày làm việc</span>
            </div>
          </div>

        </div>

        </div>
      </div>
  );
}