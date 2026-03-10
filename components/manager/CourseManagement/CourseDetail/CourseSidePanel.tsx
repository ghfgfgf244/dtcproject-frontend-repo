import React from 'react';
import { CourseItem } from '@/types/course';

interface CourseSidePanelProps {
  course: CourseItem;
}

export const CourseSidePanel = ({ course }: CourseSidePanelProps) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('vi-VN', { 
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sticky top-24">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        Audit Info
      </h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Created At</p>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_add_on</span>
            {formatDate(course.createdAt)}
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Created By</p>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
            {course.createdBy || 'System'}
          </div>
        </div>

        {course.updatedAt && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Last Updated</p>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-[18px] text-slate-400">update</span>
              {formatDate(course.updatedAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};