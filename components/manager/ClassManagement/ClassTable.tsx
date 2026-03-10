import React from 'react';
import { ClassItem } from '@/types/class';
import styles from './ClassTable.module.css';

interface ClassTableProps {
  classes: ClassItem[];
}

// Map màu License Type chuẩn của trung tâm lái xe
const getLicenseBadgeStyles = (grade: string) => {
  switch (grade) {
    case 'B2': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'B1': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
    case 'A1': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'C':  return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    default:   return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  }
};

export const ClassTable = ({ classes }: ClassTableProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
  };

  return (
    <div className={`${styles.tableWrapper} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm`}>
      <div className={styles.scrollArea}>
        <table className={`${styles.mainTable} text-left`}>
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4">Class Name</th>
              <th className="px-6 py-4">Course Name</th>
              <th className="px-6 py-4">Start Date</th>
              <th className="px-6 py-4">End Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {classes.map((cls) => (
              <tr key={cls.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${getLicenseBadgeStyles(cls.licenseType)}`}>
                      {cls.licenseType}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{cls.className}</p>
                      <p className="text-xs text-slate-500">{cls.studentCount} Students Enrolled</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {cls.courseName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-sm text-slate-400">event</span>
                    {formatDate(cls.startDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-sm text-slate-400">event_available</span>
                    {formatDate(cls.endDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors tooltip-trigger" title="View Details">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-amber-500 transition-colors tooltip-trigger" title="Edit">
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

      {/* Pagination */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Showing 1 to {classes.length} of 24 results
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-400 disabled:opacity-50 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600" disabled>
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold shadow-sm">1</button>
          <button className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600">2</button>
          <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-400 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};