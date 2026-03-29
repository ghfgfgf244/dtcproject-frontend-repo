// src/components/manager/ScheduleManagement/ScheduleWeeklyCalendar/index.tsx
import React from 'react';
import { Clock, User, Utensils } from 'lucide-react';
import styles from './weekly.module.css';

const WEEK_DAYS = [
  { day: 'Thứ Hai', date: 22 },
  { day: 'Thứ Ba', date: 23 },
  { day: 'Thứ Tư', date: 24, isToday: true },
  { day: 'Thứ Năm', date: 25 },
  { day: 'Thứ Sáu', date: 26 },
  { day: 'Thứ Bảy', date: 27 },
  { day: 'Chủ Nhật', date: 28, isWeekend: true },
];

const START_HOUR = 8;   // Bắt đầu từ 08:00
const END_HOUR = 17;    // Kết thúc lúc 17:00
const TOTAL_HOURS = END_HOUR - START_HOUR + 1;
const HOUR_HEIGHT = 120; // px (Mỗi tiếng cao 120px)

interface Props {
  onDayClick: (day: number) => void;
}

export default function ScheduleWeeklyCalendar({ onDayClick }: Props) {
  
  // Hàm tính toán và render Event Card tự động kéo dài theo thời gian
  const renderEvent = (
    startHour: number,      // Giờ bắt đầu (VD: 10)
    duration: number,       // Thời lượng tính bằng giờ (VD: 2)
    type: 'Thực hành' | 'Mô phỏng' | 'Lý thuyết',
    title: string,
    instructor: string,
    timeString: string,
    colorClass: string,
    bgClass: string,
    borderClass: string
  ) => {
    // Logic tính toán vị trí tuyệt đối (Absolute)
    const topOffset = (startHour - START_HOUR) * HOUR_HEIGHT + 4; // +4px margin top
    const cardHeight = (duration * HOUR_HEIGHT) - 8;              // -8px margin bottom/top

    return (
      <div
        className={`absolute left-1.5 right-1.5 ${bgClass} border-l-4 ${borderClass} rounded-lg p-3 shadow-sm group cursor-pointer hover:brightness-95 transition-all flex flex-col z-20`}
        style={{ top: `${topOffset}px`, height: `${cardHeight}px` }}
      >
        <div className="flex justify-between items-start mb-2">
          {/* Font chữ Badge to hơn (text-xs) */}
          <span className={`bg-white/60 ${colorClass} text-xs font-black px-2 py-0.5 rounded uppercase tracking-wide`}>
            {type}
          </span>
        </div>
        {/* Font chữ Title to hơn (text-sm) */}
        <h4 className="text-sm font-black text-slate-900 leading-tight mb-2">{title}</h4>
        
        <div className="mt-auto space-y-1.5">
          {/* Font chữ Detail to hơn (text-xs) */}
          <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> {instructor}
          </p>
          <p className={`text-xs font-bold ${colorClass} flex items-center gap-1.5`}>
            <Clock className="w-3.5 h-3.5" /> {timeString}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      {/* 1. Header (Các ngày trong tuần) */}
      <div className={styles.headerGrid}>
        <div className="bg-slate-50/50 border-r border-slate-200 flex items-center justify-center p-4">
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
        {WEEK_DAYS.map((d, i) => (
          <div key={i} onClick={() => onDayClick(d.date)} className={`p-4 text-center border-r border-slate-100 ${d.isToday ? 'bg-blue-50/80' : 'bg-white'}`}>
            <p className={`text-xs font-bold uppercase tracking-widest ${d.isToday ? 'text-blue-600' : d.isWeekend ? 'text-red-400 opacity-60' : 'text-slate-400'}`}>
              {d.day}
            </p>
            <p className={`text-xl font-black mt-1 ${d.isToday ? 'text-blue-600' : d.isWeekend ? 'text-red-500 opacity-60' : 'text-slate-900'}`}>
              {d.date}
            </p>
          </div>
        ))}
      </div>

      {/* 2. Body (Các khung giờ và Lịch học) */}
      <div className={styles.bodyContainer} style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
        
        {/* Render Background Lines & Time Labels */}
        {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full border-b border-slate-100 flex pointer-events-none"
            style={{ top: `${i * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
          >
            {/* Cột hiển thị Giờ */}
            <div className="w-[80px] shrink-0 border-r border-slate-200 flex justify-center pt-2 bg-slate-50/30">
              <span className="text-xs font-bold text-slate-400">
                {String(START_HOUR + i).padStart(2, '0')}:00
              </span>
            </div>
            {/* Cột Kẻ dọc của ngày */}
            {WEEK_DAYS.map((d, colIdx) => (
              <div key={colIdx} className={`flex-1 border-r border-slate-50 ${d.isToday ? 'bg-blue-50/20' : ''}`} />
            ))}
          </div>
        ))}

        {/* Render Lớp Overlay Giờ Nghỉ Trưa (VD: 12:00 -> 13:00) */}
        <div
          className="absolute left-[80px] right-0 flex items-center justify-center bg-slate-50/90 border-y border-slate-200 z-10 pointer-events-none"
          style={{ top: `${(12 - START_HOUR) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
        >
          <div className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Utensils className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nghỉ trưa (12:00 - 13:00)</span>
          </div>
        </div>

        {/* Render Overlay Các Sự Kiện (Events) */}
        <div className="absolute inset-0 left-[80px] flex pointer-events-none">
          {WEEK_DAYS.map((_, colIdx) => (
            <div key={colIdx} className="flex-1 relative pointer-events-auto">
              {/* Thứ Hai */}
              {colIdx === 0 && renderEvent(8, 2, 'Thực hành', 'Lớp B2-01', 'Trần Thị B.', '08:00 - 10:00', 'text-blue-700', 'bg-blue-50', 'border-blue-500')}
              
              {/* Thứ Tư (Hôm nay) - Lớp từ 10h đến 12h */}
              {colIdx === 2 && renderEvent(10, 2, 'Mô phỏng', 'Lab D-02', 'Nguyễn Văn A.', '10:00 - 12:00', 'text-emerald-700', 'bg-emerald-50', 'border-emerald-500')}
              {colIdx === 2 && renderEvent(14, 2, 'Lý thuyết', 'Lớp C-05', 'Lê Văn C.', '14:00 - 16:00', 'text-purple-700', 'bg-purple-50', 'border-purple-500')}
              
              {/* Thứ Sáu - Demo lớp học dài 3 tiếng */}
              {colIdx === 4 && renderEvent(13, 3, 'Thực hành', 'Lớp B2-03', 'Hoàng Văn D.', '13:00 - 16:00', 'text-amber-700', 'bg-amber-50', 'border-amber-500')}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}