'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CourseItem } from '@/types/course';
import { CourseModal } from '@/components/manager/CourseManagement/CourseModal';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';

interface CourseDetailHeaderProps {
  course: CourseItem;
}

export const CourseDetailHeader = ({ course }: CourseDetailHeaderProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/training-manager/dashboard' },
    { label: 'Courses', href: '/training-manager/courses' },
    { label: course.courseName }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex items-center gap-3 mt-[-10px] mb-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {course.courseName}
            </h2>
            {course.isActive ? (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                Active
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                Inactive
              </span>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400">Manage curriculum details and pricing.</p>
        </div>
        
        <div className="flex gap-3 shrink-0">
          <Link 
            href="/training-manager/courses"
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to List
          </Link>
          
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Course
          </button>
        </div>
      </div>

      <CourseModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        courseData={course} 
      />
    </>
  );
};