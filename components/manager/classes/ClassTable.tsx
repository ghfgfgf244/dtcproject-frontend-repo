import React from 'react';

const CLASSES_DATA = [
  { id: 'B2', name: 'Class B2-Jan2026', course: 'Standard Car B2', students: 24, start: '2026-01-05', end: '2026-03-30', color: 'bg-blue-100 text-blue-600' },
  { id: 'B1', name: 'Class B1-Feb2026', course: 'Premium Automatic B1', students: 18, start: '2026-02-10', end: '2026-05-15', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'A1', name: 'Class A1-Mar2026', course: 'Motorcycle Basics A1', students: 32, start: '2026-03-12', end: '2026-06-12', color: 'bg-purple-100 text-purple-600' },
];

export const ClassTable = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
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
            {CLASSES_DATA.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${item.color}`}>
                      {item.id}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.students} Students Enrolled</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {item.course}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-400">event</span>
                    {item.start}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-400">event</span>
                    {item.end}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                    <button className="p-2 text-slate-400 hover:text-amber-500 transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (Simplified for Component) */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Showing 1 to 4 of 24 results</p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-slate-400 disabled:opacity-50"><span className="material-symbols-outlined">chevron_left</span></button>
          <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">1</button>
          <button className="p-2 rounded-lg text-slate-400"><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>
    </div>
  );
};