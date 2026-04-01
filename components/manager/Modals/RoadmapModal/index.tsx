// src/components/manager/RoadmapManagement/RoadmapModal/index.tsx
"use client";

import React, { useState } from 'react';
import { X, ChevronDown, Info } from 'lucide-react';
import { Roadmap } from '@/types/roadmap';

export interface RoadmapFormData {
  courseId: string;
  title: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: Roadmap | null;
  onSubmit: (data: RoadmapFormData) => void;
}

export default function RoadmapModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  // --- FORM STATES ---
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // --- SYNC STATE (Tránh lỗi cascading renders) ---
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<Roadmap | null>(null);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    
    if (isOpen) {
      if (initialData) {
        // Map dữ liệu cũ vào Form (Giả định relatedCourses lưu Course ID)
        setCourseId(initialData.relatedCourses);
        setTitle(initialData.title);
        setDescription(initialData.description);
      } else {
        setCourseId('');
        setTitle('');
        setDescription('');
      }
    }
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ courseId, title, description });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Cập nhật Lộ trình học tập' : 'Thêm mới Lộ trình học tập'}
            </h2>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Learning Roadmap Configuration</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors group active:scale-95">
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            
            {/* Course ID Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">Mã Khóa Học (Course ID)</label>
              <div className="relative">
                <select 
                  required 
                  value={courseId} 
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full h-11 bg-slate-100 border-none rounded-lg px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 appearance-none text-slate-900 cursor-pointer outline-none transition-all"
                >
                  <option disabled value="">Chọn mã khóa học...</option>
                  <option value="FIN-101">FIN-101: Phân tích Tài chính</option>
                  <option value="LD-202">LD-202: Kỹ năng Lãnh đạo</option>
                  <option value="OP-303">OP-303: Quản lý Vận hành</option>
                  <option value="MK-404">MK-404: Chiến lược Marketing</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-5 h-5" />
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">Tiêu đề Lộ trình (Title)</label>
              <input 
                required 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Lộ trình Đào tạo Quản lý Cấp cao 2024" 
                className="w-full h-11 bg-slate-100 border-none rounded-lg px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-400 outline-none transition-all"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">Mô tả chi tiết (Description)</label>
              <textarea 
                required 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cung cấp tóm tắt về mục tiêu và nội dung của lộ trình học tập này..." 
                rows={4}
                className="w-full bg-slate-100 border-none rounded-lg p-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-400 resize-none outline-none custom-scrollbar transition-all"
              ></textarea>
            </div>

            {/* Action Footer */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors active:scale-95"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-8 py-2.5 text-sm font-black rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
              >
                Lưu lộ trình
              </button>
            </div>
          </div>
          
          {/* Contextual Helper */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center gap-3">
            <Info className="text-blue-600 w-5 h-5 shrink-0" />
            <p className="text-[10px] font-medium text-slate-500 leading-tight">
              Việc cập nhật lộ trình sẽ ảnh hưởng đến tiến độ học tập của các thành viên đang tham gia. Hãy kiểm tra kỹ trước khi lưu.
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}