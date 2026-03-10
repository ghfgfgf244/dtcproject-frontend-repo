import React from 'react';
import { Course } from '@/types/course';

interface CourseContentProps {
  course: Course;
}

export const CourseContent = ({ course }: CourseContentProps) => {
  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Course Overview Section */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">description</span>
          Course Overview
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>
          
          {/* Mock dữ liệu bổ sung không có trong bảng Courses gốc nhưng cần cho UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Duration</h4>
              <p className="text-slate-900 dark:text-white font-medium">3 Months (Standard)</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Inclusions</h4>
              <p className="text-slate-900 dark:text-white font-medium">Simulator, 810km Road Test, Materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Details Section */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">payments</span>
          Pricing Details
        </h3>
        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Total Package Price</p>
              <p className="text-3xl font-black text-primary">
                {course.price.toLocaleString('vi-VN')} <span className="text-lg font-bold">VND</span>
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">*All taxes and administrative fees included</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                <span className="material-symbols-outlined text-sm">verified</span> Verified Price
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};