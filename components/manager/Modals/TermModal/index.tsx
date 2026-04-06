"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { X, FileText, ChevronDown, Info, Save, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { setAuthToken } from '@/lib/api';
import { TermRecord } from '@/types/term';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';
import styles from '@/components/manager/Modals/modal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: TermRecord | null;
  onSubmit: (data: Partial<TermRecord>) => void;
}

export default function TermModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // State quản lý form
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    startDate: '',
    endDate: '',
    maxStudents: 30,
    isActive: true
  });

  const fetchCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data = await courseService.getAllAdminCourses();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses for modal:", err);
    } finally {
      setLoadingCourses(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen, fetchCourses]);

  // Nạp dữ liệu khi mở Modal (Edit vs Create)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        courseId: initialData.courseId || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        maxStudents: initialData.maxStudents || 30,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    } else {
      setFormData({
        name: '',
        courseId: '',
        startDate: '',
        endDate: '',
        maxStudents: 30,
        isActive: true
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      ...formData
    } as any);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={`${styles.modalContainer} ${styles.modalMax2Xl}`}>
        <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {initialData ? 'Cập nhật Học kỳ' : 'Thêm mới Học kỳ'}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hệ thống Quản lý Đào tạo</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="termForm" onSubmit={handleSubmit} className={`${styles.modalBody} space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Tên Học kỳ <span className="text-red-500">*</span></label>
              <input 
                required
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400 outline-none transition-all" 
                placeholder="VD: Học kỳ 3 - 2024" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Chọn Khóa học <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  required
                  disabled={loadingCourses}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 appearance-none outline-none cursor-pointer text-slate-700 disabled:opacity-50"
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                >
                  <option disabled value="">{loadingCourses ? 'Đang tải danh sách khóa học...' : 'Chọn khóa học phù hợp'}</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.courseName} ({course.licenseType})</option>
                  ))}
                </select>
                {loadingCourses ? (
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 text-left">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider text-left">Ngày Bắt đầu <span className="text-red-500">*</span></label>
              <input 
                required
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none" 
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider text-left">Ngày Kết thúc <span className="text-red-500">*</span></label>
              <input 
                required
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none" 
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider text-left">Số lượng học viên tối đa <span className="text-red-500">*</span></label>
              <input 
                required
                type="number"
                min="1"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="VD: 30" 
                value={formData.maxStudents}
                onChange={(e) => setFormData({...formData, maxStudents: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Trạng thái Hoạt động</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-wide">Cho phép hiển thị học kỳ này</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
            <Info className="text-indigo-600 shrink-0 w-5 h-5" />
            <p className="text-xs text-indigo-900 leading-relaxed font-medium text-left">
              <span className="font-bold">Lưu ý:</span> Ngày kết thúc phải sau ngày bắt đầu ít nhất 3 tháng đối với các khóa hạng B2 và C.
            </p>
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors active:scale-95"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            form="termForm"
            className="px-8 py-2.5 rounded-lg text-sm font-black bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
          >
            Lưu thông tin
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
