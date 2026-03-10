'use client';

import React, { FormEvent } from 'react';
import { ClassItem } from '@/types/class';
import styles from './ClassModal.module.css';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData?: ClassItem | null; // null = Create, có data = Update
}

// Mock danh sách Khóa học và Giáo viên (Sau này lấy qua API)
const MOCK_COURSES = [
  { id: 'c1', name: 'Standard Car B2' },
  { id: 'c2', name: 'Premium Automatic B1' },
  { id: 'c3', name: 'Heavy Truck License C' },
];

const MOCK_INSTRUCTORS = [
  { id: 'inst-1', name: 'Marcus Johnson' },
  { id: 'inst-2', name: 'Elena Rodriguez' },
];

export const ClassModal = ({ isOpen, onClose, classData }: ClassModalProps) => {
  if (!isOpen) return null;

  const isEditMode = !!classData;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('Class Form Submitted:', data);
    onClose();
  };

  return (
    <div className={`${styles.overlay} bg-slate-900/40 backdrop-blur-[2px]`}>
      <div className={`${styles.modalContainer} bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isEditMode ? 'Update Class' : 'Create New Class'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isEditMode ? 'Modify existing class schedule and details.' : 'Set up a new training class and assign a course.'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form bọc Body và Footer để xử lý submit */}
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          
          <div className={styles.modalBody}>
            {/* Chọn Khóa Học */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Course Program <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  name="courseId"
                  defaultValue={classData?.courseId || ""}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none font-normal" 
                  required
                >
                  <option disabled value="">Select a course</option>
                  {MOCK_COURSES.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Tên Lớp Học */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Class Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="className"
                defaultValue={classData?.className || ""}
                placeholder="e.g. Class B2-Jan2026" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-normal" 
                required 
              />
            </div>

            {/* Khung chia 2 cột cho Ngày bắt đầu / kết thúc */}
            <div className={styles.formGrid}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  name="startDate"
                  defaultValue={classData?.startDate || ""}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-normal dark:[color-scheme:dark]" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  name="endDate"
                  defaultValue={classData?.endDate || ""}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-normal dark:[color-scheme:dark]" 
                  required 
                />
              </div>
            </div>

            {/* Chọn Giáo Viên (Tùy chọn) */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Assign Instructor
              </label>
              <div className="relative">
                <select 
                  name="instructorId"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none font-normal" 
                >
                  <option value="">-- Unassigned --</option>
                  {MOCK_INSTRUCTORS.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
              </div>
              <p className="text-xs text-slate-500">You can assign an instructor later.</p>
            </div>
          </div>

          {/* Footer */}
          <div className={`${styles.modalFooter} border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900`}>
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              Save Class
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};