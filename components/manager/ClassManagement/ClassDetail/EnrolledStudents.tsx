import React from 'react';
import { EnrolledStudent } from '@/types/class';

interface EnrolledStudentsProps {
  students: EnrolledStudent[];
  totalCount: number;
}

export const EnrolledStudents = ({ students, totalCount }: EnrolledStudentsProps) => {
  // Tạo Initials (Chữ cái đầu) cho Avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">group</span>
          Enrolled Students
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs py-0.5 px-2 rounded-full ml-1">
            {totalCount} Total
          </span>
        </h3>
        <button className="text-primary text-sm font-medium hover:underline">Add Student</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Enroll Date</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {getInitials(student.fullName)}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{student.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{student.email}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                  {new Date(student.enrollDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-200 dark:border-slate-800">
        <button className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
          View All Students
        </button>
      </div>
    </div>
  );
};