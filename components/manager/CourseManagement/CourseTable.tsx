import React from 'react';
import { Course } from '@/types/course';
import styles from './CourseTable.module.css';

interface CourseTableProps {
  courses: Course[];
}

// Hàm phụ trợ map màu badge theo loại bằng lái
const getGradeBadgeStyles = (grade: string) => {
  switch (grade) {
    case 'B2': return 'bg-blue-100 text-blue-700';
    case 'B1': return 'bg-sky-100 text-sky-700';
    case 'A1': return 'bg-indigo-100 text-indigo-700';
    case 'C': return 'bg-slate-100 text-slate-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const CourseTable = ({ courses }: CourseTableProps) => {
  return (
    <div className={`${styles.tableWrapper} bg-white rounded-xl border border-primary/10 shadow-sm`}>
      <div className={styles.scrollArea}>
        <table className={`${styles.mainTable} text-left`}>
          <thead>
            <tr className="bg-slate-50 border-b border-primary/5">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">License Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">{course.icon || 'auto_stories'}</span>
                    </div>
                    <div>
                      {/* Đổi thành course.courseName */}
                      <p className="font-bold text-slate-900">{course.courseName}</p>
                      <p className="text-xs text-slate-500">{course.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {/* Đổi thành course.licenseType */}
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getGradeBadgeStyles(course.licenseType)}`}>
                    Grade {course.licenseType}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">
                  ${course.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* Xử lý isActive (boolean) */}
                    <span className={`w-2 h-2 rounded-full ${course.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className={`text-sm font-medium ${course.isActive ? 'text-slate-600' : 'text-slate-500'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors tooltip-trigger" title="Edit">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors tooltip-trigger" title="Delete">
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-primary/5 flex items-center justify-between">
        <p className="text-sm text-slate-500">Showing <span className="font-semibold">1-{courses.length}</span> of <span className="font-semibold">24</span> courses</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90">Next</button>
        </div>
      </div>
    </div>
  );
};