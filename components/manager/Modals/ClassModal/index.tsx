// src/app/(manager)/training-manager/classes/_components/Modals/ClassModal/index.tsx
"use client";

import React, { useState } from 'react';
import { X, Calendar, Info, CalendarClock, PlusCircle, Trash2 } from 'lucide-react';
import { ClassFormData, ClassSession, ClassStatus } from '@/types/class';
import styles from '@/components/manager/Modals/modal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ClassFormData | null;
  onSubmit: (data: ClassFormData) => void;
}

// Dữ liệu mẫu (Thực tế sẽ fetch từ API)
const MOCK_TERMS = [
  { id: 't1', name: 'Học kỳ I - 2024' },
  { id: 't2', name: 'Học kỳ II - 2024' },
  { id: 't3', name: 'Học kỳ III - 2024' },
];

const MOCK_INSTRUCTORS = [
  { id: 'ins1', name: 'Nguyễn Văn An' },
  { id: 'ins2', name: 'Trần Minh Tâm' },
  { id: 'ins3', name: 'Lê Thị Thu' },
];

const DEFAULT_FORM_DATA: ClassFormData = {
  name: '',
  termId: MOCK_TERMS[0].id,
  maxStudents: 30,
  status: 'Đang tuyển',
  sessions: []
};

export default function ClassModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  const [formData, setFormData] = useState<ClassFormData>(initialData || DEFAULT_FORM_DATA);

  // Sync state when Modal opens/closes
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    if (isOpen) {
      setFormData(initialData || DEFAULT_FORM_DATA);
    }
  }

  if (!isOpen) return null;

  // --- HÀM XỬ LÝ LỊCH HỌC (SESSIONS) ---
  const handleAddSession = () => {
    const newSession: ClassSession = {
      id: Math.random().toString(36).substring(7), // Random ID
      instructorId: MOCK_INSTRUCTORS[0].id,
      startTime: '',
      endTime: ''
    };
    setFormData({ ...formData, sessions: [...formData.sessions, newSession] });
  };

  const handleUpdateSession = (id: string, field: keyof ClassSession, value: string) => {
    const updatedSessions = formData.sessions.map(session => 
      session.id === id ? { ...session, [field]: value } : session
    );
    setFormData({ ...formData, sessions: updatedSessions });
  };

  const handleRemoveSession = (id: string) => {
    setFormData({ ...formData, sessions: formData.sessions.filter(s => s.id !== id) });
  };

  // --- HÀM SUBMIT ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={`${styles.modalContainer} max-w-2xl flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {initialData?.id ? 'Cập nhật Lớp học' : 'Tạo Lớp học mới'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {initialData?.id ? 'Chỉnh sửa chi tiết lớp đào tạo lái xe và lịch học' : 'Thiết lập thông tin cơ bản và phân bổ giảng viên'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="p-8 space-y-8 flex-1">
            
            {/* Section 1: Thông tin cơ bản */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Info className="w-5 h-5" />
                <h4 className="text-xs font-black uppercase tracking-widest">Thông tin cơ bản</h4>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Tên lớp học <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 transition-all outline-none" 
                    placeholder="VD: B2-K24/01" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Chọn học kỳ</label>
                  <select 
                    className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer outline-none"
                    value={formData.termId}
                    onChange={(e) => setFormData({...formData, termId: e.target.value})}
                  >
                    {MOCK_TERMS.map(term => (
                      <option key={term.id} value={term.id}>{term.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Số lượng tối đa</label>
                  <div className="relative">
                    <input 
                      required
                      type="number" 
                      min="1"
                      className="w-full bg-slate-100 border-none rounded-lg pl-4 pr-20 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
                      value={formData.maxStudents}
                      onChange={(e) => setFormData({...formData, maxStudents: Number(e.target.value)})}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase pointer-events-none">Học viên</span>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Trạng thái</label>
                  <div className="flex gap-2">
                    {(['Đang tuyển', 'Đang học', 'Kết thúc'] as ClassStatus[]).map(status => (
                      <label key={status} className="flex-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="status" 
                          className="hidden peer" 
                          checked={formData.status === status}
                          onChange={() => setFormData({...formData, status})}
                        />
                        <div className="text-center py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 peer-checked:bg-blue-50 peer-checked:border-blue-600 peer-checked:text-blue-600 transition-all select-none">
                          {status}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-slate-100 my-8"></div>

            {/* Section 2: Lịch học chi tiết */}
            <section className="space-y-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600">
                  <CalendarClock className="w-5 h-5" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Lịch học chi tiết</h4>
                </div>
                <button type="button" className="text-[10px] font-black text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors uppercase tracking-widest">
                  Nhập file Excel
                </button>
              </div>

              <div className="space-y-4">
                {formData.sessions.length === 0 && (
                  <p className="text-sm text-slate-400 font-medium italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Chưa có lịch học nào. Bấm &quot;Thêm buổi học&quot; để bắt đầu.
                  </p>
                )}

                {/* Danh sách các buổi học */}
                {formData.sessions.map((session, index) => (
                  <div key={session.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSession(session.id)}
                      className="absolute -right-2 -top-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-4 space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Buổi {index + 1} - Giảng viên</label>
                        <select 
                          className="w-full bg-white border-none rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-blue-600 shadow-sm outline-none cursor-pointer"
                          value={session.instructorId}
                          onChange={(e) => handleUpdateSession(session.id, 'instructorId', e.target.value)}
                        >
                          {MOCK_INSTRUCTORS.map(ins => <option key={ins.id} value={ins.id}>{ins.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-6 md:col-span-4 space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Thời gian bắt đầu</label>
                        <input 
                          type="datetime-local" 
                          required
                          className="w-full bg-white border-none rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-blue-600 shadow-sm outline-none" 
                          value={session.startTime}
                          onChange={(e) => handleUpdateSession(session.id, 'startTime', e.target.value)}
                        />
                      </div>
                      <div className="col-span-6 md:col-span-4 space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Thời gian kết thúc</label>
                        <input 
                          type="datetime-local" 
                          required
                          className="w-full bg-white border-none rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-blue-600 shadow-sm outline-none" 
                          value={session.endTime}
                          onChange={(e) => handleUpdateSession(session.id, 'endTime', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Session Button */}
                <button 
                  type="button" 
                  onClick={handleAddSession}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group"
                >
                  <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="text-xs font-bold uppercase tracking-widest">Thêm buổi học</span>
                </button>
              </div>
            </section>
          </div>

          {/* Footer (Sticky bottom inside modal) */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
            <p className="text-[10px] text-slate-400 font-medium italic hidden sm:block">
              {initialData?.id ? '* Bấm Lưu để cập nhật thay đổi lên hệ thống' : '* Các trường có dấu (*) là bắt buộc'}
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors uppercase tracking-widest">
                Hủy bỏ
              </button>
              <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white text-xs font-black rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-widest">
                Lưu thông tin
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}