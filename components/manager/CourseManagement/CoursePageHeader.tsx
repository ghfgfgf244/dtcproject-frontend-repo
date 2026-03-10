'use client';

import React, { useState } from 'react';
import { CourseModal } from './CourseModal';

export const CoursePageHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Courses</h1>
          <p className="text-slate-500 text-sm">Manage and monitor all driving license training programs in your branch.</p>
        </div>
        
        {/* Nút bấm mở Modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Create New Course
        </button>
      </div>

      {/* Render Modal */}
      <CourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        // Không truyền `course` prop vào đây vì đây là nút Create. 
        // Nếu là nút Edit trên từng row của table, bạn sẽ truyền `course={dataRow}` vào.
      />
    </>
  );
};