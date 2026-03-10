'use client';

import React, { FormEvent } from 'react';
import { Course } from '@/types/course';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null; // Nếu null thì là Create, nếu có data thì là Update
}

export const CourseModal = ({ isOpen, onClose, course }: CourseModalProps) => {
  if (!isOpen) return null;

  const isEditMode = !!course;

  // Xử lý submit form (Tạm thời log ra console, sau này sẽ gọi Server Action/API)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    // Xử lý checkbox (FormData không ghi nhận checkbox nếu nó không được check)
    data.isActive = formData.get('isActive') === 'on' ? 'true' : 'false';
    
    console.log('Form Data Submitted:', data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      {/* Modal Content */}
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isEditMode ? 'Update Course' : 'Create New Course'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isEditMode ? 'Update the details of the existing program.' : 'Configure the details for the new training program.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form bọc toàn bộ Body và Footer */}
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(100vh-8rem)]">
          {/* Modal Body */}
          <div className="p-6 space-y-5 overflow-y-auto">
            
            {/* Training Center */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Training Center <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  name="centerId"
                  defaultValue={course?.centerId || ""}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none font-normal" 
                  required
                >
                  <option disabled value="">Select training center</option>
                  <option value="center-1">Main Campus</option>
                  <option value="center-2">Downtown Branch</option>
                  <option value="center-3">North Training Wing</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Course Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="courseName"
                defaultValue={course?.courseName || ""}
                placeholder="e.g. Advanced B2 Driving Course" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-normal" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* License Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  License Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="licenseType"
                    defaultValue={course?.licenseType || ""}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none font-normal" 
                    required
                  >
                    <option disabled value="">Select type</option>
                    <option value="A1">A1 - Motorcycle</option>
                    <option value="B1">B1 - Automatic Car</option>
                    <option value="B2">B2 - Manual Car</option>
                    <option value="C">C - Heavy Truck</option>
                    <option value="D">D - Bus</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Price (VND) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="price"
                    defaultValue={course?.price || ""}
                    min="0" 
                    step="0.01" 
                    placeholder="0" 
                    className="w-full pl-4 pr-16 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-normal" 
                    required 
                  />
                  <span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400">VND</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea 
                name="description"
                defaultValue={course?.description || ""}
                rows={3}
                placeholder="Provide details about the course syllabus, duration, and requirements..." 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-normal resize-none"
              ></textarea>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Active Status</p>
                  <p className="text-xs text-slate-500">Enable this to make the course visible to students</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isActive"
                  defaultChecked={course ? course.isActive : true}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col-reverse sm:flex-row gap-3 justify-end shrink-0">
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
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};