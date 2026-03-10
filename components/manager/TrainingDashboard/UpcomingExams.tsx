import React from 'react';
import Link from 'next/link';

export const UpcomingExams = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
      <h4 className="font-bold text-lg mb-6">Upcoming Exams</h4>
      
      <div className="space-y-4 flex-1">
        <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="bg-primary/10 text-primary p-2 rounded-lg text-center min-w-[50px]">
            <span className="block text-xs uppercase font-bold">Oct</span>
            <span className="block text-lg font-black">24</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Theory Final Exam</p>
            <p className="text-xs text-slate-500">18 Candidates • 09:00 AM</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-2 rounded-lg text-center min-w-[50px]">
            <span className="block text-xs uppercase font-bold">Oct</span>
            <span className="block text-lg font-black">26</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Practical Driving Test</p>
            <p className="text-xs text-slate-500">12 Candidates • 08:30 AM</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-2 rounded-lg text-center min-w-[50px]">
            <span className="block text-xs uppercase font-bold">Oct</span>
            <span className="block text-lg font-black">28</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">B1 Category Practical</p>
            <p className="text-xs text-slate-500">5 Candidates • 11:00 AM</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>
      </div>
      
      <Link href="/training/exams" className="block text-center w-full mt-6 text-sm font-bold text-primary py-2.5 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
        View All Exams
      </Link>
    </div>
  );
};