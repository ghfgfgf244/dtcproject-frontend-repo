'use client';

import React, { FormEvent } from 'react';
import { CourseItem } from '@/types/course';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseData?: CourseItem | null; // null = Create, có data = Update
}

export const CourseModal = ({ isOpen, onClose, courseData }: CourseModalProps) => {
  if (!isOpen) return null;

  const isEditMode = !!courseData;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic submit API ở đây
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isEditMode ? 'Update Course Program' : 'Create New Course'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isEditMode ? 'Modify existing curriculum details and pricing.' : 'Define a new training curriculum for your center.'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            
            {/* Course Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Course Name <span className="text-red-500">*</span></label>
                <input type="text" name="courseName" defaultValue={courseData?.courseName || ''} placeholder="e.g. Standard Car B2" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Category <span className="text-red-500">*</span></label>
                <select name="category" defaultValue={courseData?.category || ''} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none" required>
                  <option value="" disabled>Select category</option>
                  <option value="Car">Car (B1, B2)</option>
                  <option value="Motorcycle">Motorcycle (A1, A2)</option>
                  <option value="Truck">Heavy Truck (C, D, E)</option>
                </select>
              </div>
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Price (VND) <span className="text-red-500">*</span></label>
                <input type="number" name="price" defaultValue={courseData?.price || ''} placeholder="e.g. 15000000" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Duration (Months) <span className="text-red-500">*</span></label>
                <input type="number" name="durationMonths" defaultValue={courseData?.durationMonths || ''} placeholder="e.g. 3" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none" required />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
              <textarea name="description" rows={3} defaultValue={courseData?.description || ''} placeholder="Brief details about the course..." className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none resize-none"></textarea>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
              <select name="status" defaultValue={courseData?.status || 'Active'} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="Active">Active (Public)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span> 
              {isEditMode ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};