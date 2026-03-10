import React from 'react';
import { CourseItem } from '@/types/course';

interface CourseContentProps {
  course: CourseItem;
}

export const CourseContent = ({ course }: CourseContentProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Course Information
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {/* Info Blocks */}
        <div>
          <p className="text-sm text-slate-500 mb-1 font-medium">License Type</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">badge</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">Class {course.licenseType}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500 mb-1 font-medium">Standard Price (VND)</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-green-500">payments</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(course.price)}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
        <p className="text-sm text-slate-500 mb-2 font-medium">Course Description</p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {course.description || 'No description provided for this course.'}
        </p>
      </div>
    </div>
  );
};