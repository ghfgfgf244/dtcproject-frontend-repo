// src/components/manager/ScheduleManagement/ScheduleClientView/index.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { CalendarPlus, Plus, BookOpen, Car, Monitor, Users, CheckCircle2, ListTodo } from 'lucide-react';
import { ScheduleEvent, CourseStatusItem, WeeklyInsight, DailyInsight } from '@/types/schedule';

import ScheduleCalendar from '../ScheduleCalendar';
import ScheduleWeeklyCalendar from '../ScheduleWeeklyCalendar';
import ScheduleDailyCalendar from '../ScheduleDailyCalendar';
import ScheduleModal, { ScheduleFormData } from '@/components/manager/Modals/ScheduleModal';
import ConfirmModal from '@/components/ui/confirm-modal';

interface Props {
  initialEvents: ScheduleEvent[];
  courseStatuses: CourseStatusItem[];
  weeklyInsights?: WeeklyInsight;
  dailyEvents?: ScheduleEvent[];
  dailyInsights?: DailyInsight;
}

type ViewMode = 'MONTH' | 'WEEK' | 'DAY';

export default function ScheduleClientView({ initialEvents, courseStatuses, weeklyInsights, dailyEvents = [], dailyInsights }: Props) {
  // 1. STATE TỔNG (Single Source of Truth)
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    const combined = [...initialEvents, ...dailyEvents];
    return Array.from(new Map(combined.map(item => [item.id, item])).values());
  });

  const [viewMode, setViewMode] = useState<ViewMode>('DAY');
  const [selectedDate, setSelectedDate] = useState<number>(24);

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // 2. LỌC DATA CHO MODAL EDIT (Lấy từ state events động)
  const editingEvent = useMemo(() => {
    if (!editingEventId) return null;
    return events.find(e => e.id === editingEventId) || null;
  }, [editingEventId, events]);

  // 3. LỌC DATA CHO TAB NGÀY (Lấy từ state events động) -> ĐÂY LÀ CHÌA KHÓA ĐỂ UI CẬP NHẬT
  const currentDayEvents = useMemo(() => {
    return events
      .filter(e => e.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, selectedDate]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleDayClick = (day: number) => {
    setSelectedDate(day);
    setViewMode('DAY');
  };

  const handleAddSlot = () => {
    setEditingEventId(null); 
    setIsModalOpen(true);
  };

  const handleEditSlot = (id: string) => {
    setEditingEventId(id); 
    setIsModalOpen(true);
  };

  // --- SUBMIT FORM (THÊM / SỬA) ---
  const handleSubmitSchedule = (formData: ScheduleFormData) => {
    const targetDate = parseInt(formData.startTime.split('T')[0].split('-')[2], 10) || selectedDate;
    const extractedStartTime = formData.startTime.split('T')[1];
    const extractedEndTime = formData.endTime.split('T')[1];

    if (editingEventId) {
      // CẬP NHẬT (Update)
      setEvents(prev => prev.map(ev => 
        ev.id === editingEventId 
          ? { 
              ...ev, 
              courseId: formData.courseId,
              instructorName: formData.instructorId,
              startTime: extractedStartTime, 
              endTime: extractedEndTime,
              date: targetDate
            } 
          : ev
      ));
    } else {
      // THÊM MỚI (Create)
      const newEvent: ScheduleEvent = {
        id: `EV-NEW-${Date.now()}`,
        courseId: formData.courseId,
        courseName: 'Khóa học mới', // Tương lai có thể map tên từ courseId
        eventType: 'Lý thuyết',     
        startTime: extractedStartTime,
        endTime: extractedEndTime,
        instructorName: formData.instructorId,
        date: targetDate, 
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    setIsModalOpen(false); 
    setEditingEventId(null);
    
    // Tự động chuyển view sang ngày vừa thêm/sửa để user thấy kết quả
    if (targetDate !== selectedDate) {
      setSelectedDate(targetDate);
    }
  };

  // --- XÓA LỊCH (DELETE) ---
  const handleDeleteSlotClick = (id: string) => {
    setEventToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEvents(prev => prev.filter(ev => ev.id !== eventToDelete));
    }
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & View Toggles */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[30px] font-black tracking-tight text-slate-900 leading-none mb-2">
            {viewMode === 'MONTH' && 'Lịch học tháng 10/2023'}
            {viewMode === 'WEEK' && 'Lịch Học Tuần Này'}
            {viewMode === 'DAY' && `Lịch học Ngày ${selectedDate}/10/2023`}
          </h2>
          <p className="text-sm text-slate-500">
            {viewMode === 'DAY' ? 'Xem và điều phối lịch giảng dạy trong ngày của trung tâm.' : 'Quản lý và theo dõi tiến độ giảng dạy các khóa học.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-200/50 rounded-lg p-1 shadow-sm border border-slate-200">
            <button onClick={() => setViewMode('MONTH')} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${viewMode === 'MONTH' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Tháng</button>
            <button onClick={() => setViewMode('WEEK')} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${viewMode === 'WEEK' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Tuần</button>
            <button onClick={() => setViewMode('DAY')} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${viewMode === 'DAY' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Ngày</button>
          </div>
          <button onClick={handleAddSlot} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 hidden md:flex">
            <CalendarPlus className="w-5 h-5" /> Thêm lịch học
          </button>
        </div>
      </div>

      {/* ================= VIEW: THÁNG ================= */}
      {viewMode === 'MONTH' && (
        <ScheduleCalendar events={events} currentDay={selectedDate} onDayClick={handleDayClick} />
        // ... (Bạn có thể bỏ phần Bento stats vào đây như cũ nếu cần)
      )}

      {/* ================= VIEW: TUẦN ================= */}
      {viewMode === 'WEEK' && (
        <ScheduleWeeklyCalendar onDayClick={handleDayClick} />
        // ... (Thống kê tuần)
      )}

      {/* ================= VIEW: NGÀY ================= */}
      {viewMode === 'DAY' && (
        <>
          {/* FIX QUAN TRỌNG NHẤT LÀ Ở DÒNG NÀY: events={currentDayEvents} */}
          <ScheduleDailyCalendar 
            date={selectedDate} 
            events={currentDayEvents} 
            onDateChange={setSelectedDate}
            onEditClick={handleEditSlot}            
            onDeleteClick={handleDeleteSlotClick}   
          />
          
          {/* Bento Stats cho Lịch Ngày */}
          {dailyInsights && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><BookOpen className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiết lý thuyết</p>
                  <p className="text-xl font-black text-slate-900">{String(dailyInsights.theoryCount).padStart(2, '0')} Buổi</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><Car className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiết thực hành</p>
                  <p className="text-xl font-black text-slate-900">{String(dailyInsights.practiceCount).padStart(2, '0')} Buổi</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600"><Monitor className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiết mô phỏng</p>
                  <p className="text-xl font-black text-slate-900">{String(dailyInsights.simulationCount).padStart(2, '0')} Buổi</p>
                </div>
              </div>
              <div className="bg-blue-600 p-5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-white"><Users className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Tổng học viên</p>
                  <p className="text-xl font-black text-white">{dailyInsights.totalStudents} Người</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Floating Action Button cho Mobile */}
      <button onClick={handleAddSlot} className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-50">
        <Plus className="w-7 h-7" />
      </button>

      {/* MODAL THÊM / SỬA */}
      <ScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingEvent}
        onSubmit={handleSubmitSchedule}
        defaultDate={selectedDate}
      />

      {/* MODAL XÓA (CONFIRM) */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa lịch học"
        message="Bạn có chắc chắn muốn xóa lịch học này không? Hành động này không thể hoàn tác và hệ thống sẽ gửi thông báo hủy đến giảng viên liên quan."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}