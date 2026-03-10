'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClassItem } from '@/types/class';
import { ClassModal } from './ClassModal';
import { ClassStats } from './ClassStats'; // Component thống kê KPI
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';

interface ClassTableProps {
  classes: ClassItem[];
}

export const ClassTable = ({ classes }: ClassTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  // Hàm mở Modal (Có data = Edit, Không data = Create)
  const handleOpenModal = (cls?: ClassItem) => {
    setSelectedClass(cls || null);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* 1. Page Header & Create Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/training-manager/dashboard' }, 
            { label: 'Classes & Schedules' }
          ]} />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-[-10px]">
            Active Classes
          </h2>
          <p className="text-slate-500 mt-1">
            Manage and monitor all active training classes across terms.
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Create New Class
        </button>
      </div>

      {/* 2. KPIs / Stats */}
      <div className="mb-8">
        <ClassStats />
      </div>

      {/* 3. Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Class Name</th>
                <th className="px-6 py-4">Program / Term</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4 text-center">Students</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  
                  {/* Class Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {cls.licenseType}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{cls.className}</p>
                        <p className="text-xs text-slate-500 mt-0.5">ID: {cls.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>

                  {/* Program / Term */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{cls.courseName}</p>
                  </td>

                  {/* Timeline */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">calendar_today</span>
                      {new Date(cls.startDate).toLocaleDateString()} - {new Date(cls.endDate).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Students Count */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      {cls.studentCount}
                    </div>
                  </td>
                  
                  {/* 🚀 Actions: View & Edit */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {/* Nút View */}
                      <Link 
                        href={`/training-manager/classes/${cls.id}`}
                        className="p-2 text-slate-400 hover:text-primary transition-colors tooltip-trigger" 
                        title="View Class Details"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </Link>

                      {/* Nút Edit */}
                      <button 
                        onClick={() => handleOpenModal(cls)} 
                        className="p-2 text-slate-400 hover:text-amber-500 transition-colors tooltip-trigger"
                        title="Edit Class"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Render Modal (Dùng chung cho cả Create và Edit) */}
      <ClassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        classData={selectedClass} 
      />
    </div>
  );
};