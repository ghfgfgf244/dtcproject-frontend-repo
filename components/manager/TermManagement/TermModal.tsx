'use client';

import React, { FormEvent } from 'react';
import { TermItem } from '@/types/term';

interface TermModalProps {
  isOpen: boolean;
  onClose: () => void;
  termData?: TermItem | null;
}

// Lấy danh sách Course để gán vào Term
const MOCK_COURSES = [
  { id: 'c1', name: 'Standard Car B2' },
  { id: 'c2', name: 'Premium Automatic B1' },
];

export const TermModal = ({ isOpen, onClose, termData }: TermModalProps) => {
  if (!isOpen) return null;
  const isEditMode = !!termData;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isEditMode ? 'Update Term' : 'Create New Term (Batch)'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-5">
            {/* Term Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Term Name <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={termData?.termName || ''} placeholder="e.g. Khóa K122 - B2" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none" required />
            </div>

            {/* Link to Course */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Curriculum (Course) <span className="text-red-500">*</span></label>
              <select defaultValue={termData?.courseId || ''} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none" required>
                <option value="" disabled>Select a base course program</option>
                {MOCK_COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                <input type="date" defaultValue={termData?.startDate || ''} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none dark:[color-scheme:dark]" required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Expected End Date</label>
                <input type="date" defaultValue={termData?.endDate || ''} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none dark:[color-scheme:dark]" required />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
              <select defaultValue={termData?.status || 'Upcoming'} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span> Save Term
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};