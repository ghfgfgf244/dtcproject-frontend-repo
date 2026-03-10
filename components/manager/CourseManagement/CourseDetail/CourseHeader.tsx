'use client'; // Thêm dòng này vì chúng ta cần dùng useState cho Modal

import React, { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types/course';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { CourseModal } from '@/components/manager/CourseManagement/CourseModal'; // Import Modal vào

interface CourseHeaderProps {
  course: Course;
}

export const CourseHeader = ({ course }: CourseHeaderProps) => {
  // State quản lý việc đóng mở Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/training/dashboard' },
    { label: 'Courses', href: '/training/courses' },
    { label: course.courseName } 
  ];

  return (
    <div className="mb-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {course.courseName}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              course.isActive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {course.isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">license</span> 
            License Type: {course.licenseType}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/training-manager/courses" className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to List
          </Link>
          
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit Course
          </button>
        </div>
      </div>

      {/* Gắn CourseModal vào đây và truyền dữ liệu course hiện tại sang */}
      <CourseModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        course={course} // <-- Modal nhận thấy có data nên sẽ chuyển sang UI "Update Course"
      />
    </div>
  );
};