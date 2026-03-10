'use client';

import React, { useState } from 'react';
import { TermItem } from '@/types/term';
import { TermModal } from './TermModal';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import styles from './TermManagement.module.css';

interface TermTableProps { terms: TermItem[]; }

export const TermTable = ({ terms }: TermTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<TermItem | null>(null);

  const handleOpenModal = (term?: TermItem) => {
    setSelectedTerm(term || null);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Completed': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/training-manager/dashboard' }, { label: 'Terms' }]} />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-[-10px]">Training Terms</h2>
          <p className="text-slate-500 mt-1">Manage training batches, dates, and assigned curriculums.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95">
          <span className="material-symbols-outlined text-lg">add</span> Create New Term
        </button>
      </div>

      {/* Table */}
      <div className={`${styles.tableWrapper} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm`}>
        <div className={styles.scrollArea}>
          <table className={`${styles.mainTable} text-left`}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Term Name</th>
                <th className="px-6 py-4">Course Program</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4 text-center">Classes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {terms.map((term) => (
                <tr key={term.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{term.termName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{term.courseName}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-600 dark:text-slate-300">
                      {term.classCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(term.status)}`}>
                      {term.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(term)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TermModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} termData={selectedTerm} />
    </div>
  );
};