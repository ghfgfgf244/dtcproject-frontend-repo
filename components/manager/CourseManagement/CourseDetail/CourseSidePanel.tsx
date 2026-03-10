import React from 'react';
import { Course } from '@/types/course';

interface CourseSidePanelProps {
  course: Course;
}

export const CourseSidePanel = ({ course }: CourseSidePanelProps) => {
  // Format Date Helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* System Metadata Section */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">info</span>
          System Metadata
        </h3>
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <span className="material-symbols-outlined text-slate-500 text-base">person</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">CREATED BY</p>
              {/* Ở DB thật, bạn sẽ join bảng Users để lấy tên dựa vào CreatedBy (ID) */}
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{course.createdBy || 'System Admin'}</p>
              <p className="text-xs text-slate-400">{formatDate(course.createdAt)}</p>
            </div>
          </div>
          
          <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <span className="material-symbols-outlined text-slate-500 text-base">edit_note</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">LAST UPDATED</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{course.updatedBy || 'System Automator'}</p>
              <p className="text-xs text-slate-400">{formatDate(course.updatedAt)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats/Info Card */}
      <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-primary/20">
        <h4 className="font-bold mb-4">Course Health</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="opacity-80">Active Students</span>
            <span className="font-bold">142</span>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full">
            <div className="bg-white w-3/4 h-full rounded-full"></div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="opacity-80">Completion Rate</span>
            <span className="font-bold">92%</span>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full">
            <div className="bg-white w-[92%] h-full rounded-full"></div>
          </div>
        </div>
        <button className="w-full mt-6 py-2 bg-white text-primary font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors">
          View Full Analytics
        </button>
      </div>
    </div>
  );
};