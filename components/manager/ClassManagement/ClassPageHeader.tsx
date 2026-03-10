'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { ClassModal } from './ClassModal';

export const ClassPageHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/training/dashboard' },
    { label: 'Classes' }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-[-10px]">Active Classes</h2>
          <p className="text-slate-500 mt-1">Manage and monitor all active training classes across departments.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Create New Class
        </button>
      </div>

      <ClassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};