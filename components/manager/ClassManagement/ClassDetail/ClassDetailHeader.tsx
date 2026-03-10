'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { ClassDetailData } from '@/types/class';
import { ClassModal } from '@/components/manager/ClassManagement/ClassModal';

interface ClassDetailHeaderProps {
  data: ClassDetailData;
}

export const ClassDetailHeader = ({ data }: ClassDetailHeaderProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const breadcrumbs = [
    { label: 'Dashboard', href: '/training/dashboard' },
    { label: 'Classes', href: '/training/classes' },
    { label: data.className }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <h2 className="text-3xl font-extrabold tracking-tight mb-2 mt-[-10px]">{data.className}</h2>
          <p className="text-slate-500 dark:text-slate-400">Overview and student enrollment details for the current class.</p>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href="/training-manager/classes"
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to List
          </Link>
          
          {/* Sửa nút Edit để mở Modal */}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Class
          </button>
        </div>
      </div>

      {/* Gọi Modal và truyền dữ liệu hiện tại vào (Update Mode) */}
      <ClassModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        classData={data} 
      />
    </>
  );
};