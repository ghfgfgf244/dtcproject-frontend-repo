// src/components/manager/ScheduleManagement/ScheduleCalendar/index.tsx
import React from 'react';
import { Clock } from 'lucide-react';
import styles from './calendar.module.css';
import { ScheduleEvent } from '@/types/schedule';

interface Props {
  events: ScheduleEvent[];
  currentDay: number; 
  onDayClick: (day: number) => void;
}

const WEEKDAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

export default function ScheduleCalendar({ events, currentDay, onDayClick }: Props) {
  
  const calendarCells = Array.from({ length: 35 }, (_, i) => {
    if (i < 6) return { date: 25 + i, isPrevMonth: true };
    return { date: i - 5, isPrevMonth: false };
  });

  // Ánh xạ màu sắc dựa trên data Tiếng Việt
  const getEventStyle = (type: string) => {
    switch (type) {
      case 'Lý thuyết': return 'bg-blue-50 border-blue-500 text-blue-800';
      case 'Thực hành': return 'bg-emerald-50 border-emerald-500 text-emerald-800';
      case 'Mô phỏng': return 'bg-amber-50 border-amber-500 text-amber-800';
      default: return 'bg-slate-50 border-slate-500 text-slate-800';
    }
  };

  return (
    <div className={styles.calendarWrapper}>
      {/* Header thứ tự ngày */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
        {WEEKDAYS.map((day, idx) => (
          <div key={day} className={`py-3 text-center border-r border-slate-200 ${idx >= 5 ? 'bg-slate-100/50' : ''}`}>
            <span className={`text-[11px] font-black uppercase tracking-widest ${idx === 6 ? 'text-red-400' : 'text-slate-400'}`}>
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Grid Lịch */}
      <div className={styles.calendarGrid}>
        {calendarCells.map((cell, idx) => {
          const dayEvents = !cell.isPrevMonth ? events.filter(e => e.date === cell.date) : [];
          const isToday = !cell.isPrevMonth && cell.date === currentDay;

          return (
            <div 
              key={idx} 
              onClick={() => {
                if (!cell.isPrevMonth) onDayClick(cell.date);
              }}
              className={`${styles.calendarCell} group ${cell.isPrevMonth ? styles.prevMonthCell : ''} ${isToday ? 'bg-blue-50/20' : ''}`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-sm font-bold ${cell.isPrevMonth ? 'text-slate-300 font-medium' : isToday ? 'text-blue-600 font-black' : 'text-slate-600 group-hover:text-blue-600'}`}>
                  {cell.date}
                </span>
                {isToday && (
                  <div className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block">Hôm nay</div>
                )}
              </div>

              {/* Render Sự kiện */}
              <div className="mt-2 space-y-1">
                {dayEvents.map(event => (
                  <div key={event.id} className={`p-2 border-l-4 rounded-r shadow-sm ${getEventStyle(event.eventType)}`}>
                    <p className="text-[10px] font-black uppercase leading-none mb-1">
                      {event.eventType}
                    </p>
                    <p className="text-xs font-bold text-slate-800 truncate" title={`${event.courseId}: ${event.courseName}`}>
                      {event.courseId}: {event.courseName}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3" />
                      {event.startTime} - {event.endTime}
                    </div>
                    {event.instructorName && (
                      <p className="text-[10px] text-slate-600 mt-1 truncate">GV: {event.instructorName}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}