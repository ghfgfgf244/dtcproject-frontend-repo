'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CourseItem } from '@/types/course';
import { CourseModal } from './CourseModal';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';

interface CourseTableProps {
  courses: CourseItem[];
}

export const CourseTable = ({ courses }: CourseTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  // Hàm mở modal (Nếu truyền course vào => Edit Mode, Nếu không truyền => Create Mode)
  const handleOpenModal = (course?: CourseItem) => {
    setSelectedCourse(course || null);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Draft': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Archived': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // Hàm format tiền tệ (VND)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div>
      {/* Header & Create Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/training-manager/dashboard' }, { label: 'Courses' }]} />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-[-10px]">Training Courses</h2>
          <p className="text-slate-500 mt-1">Manage standard curriculums and pricing configurations.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span> 
          Create New Course
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Course Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{course.courseName}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs">{course.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatPrice(course.price)}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{course.durationMonths} Months</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(course.status)}`}>
                      {course.status}
                    </span>
                  </td>
                  
                  {/* Cột Actions (View & Edit) */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Nút View chuyển hướng sang trang chi tiết */}
                      <Link 
                        href={`/training-manager/courses/${course.id}`}
                        className="p-2 text-slate-400 hover:text-primary transition-colors tooltip-trigger" 
                        title="View Course Details"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </Link>

                      {/* Nút Edit mở Modal với data của Course hiện tại */}
                      <button 
                        onClick={() => handleOpenModal(course)} 
                        className="p-2 text-slate-400 hover:text-amber-500 transition-colors tooltip-trigger"
                        title="Edit Course"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors tooltip-trigger" title="Delete">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Modal */}
      <CourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseData={selectedCourse} 
      />
    </div>
  );
};