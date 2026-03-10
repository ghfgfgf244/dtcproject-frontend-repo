import React from 'react';

export const InstructorStatus = () => {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Instructor Status</h4>
        <button className="text-sm font-medium text-primary hover:underline">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <th className="pb-4 font-bold">Instructor</th>
              <th className="pb-4 font-bold">Status</th>
              <th className="pb-4 font-bold">Current Load</th>
              <th className="pb-4 font-bold">Rating</th>
              <th className="pb-4 font-bold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:border-slate-800">
            {/* Marcus */}
            <tr className="group">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Marcus Johnson</span>
                </div>
              </td>
              <td className="py-4">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 uppercase">Available</span>
              </td>
              <td className="py-4">
                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[45%] rounded-full"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">45% capacity</span>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-1 text-orange-400">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">4.9</span>
                </div>
              </td>
              <td className="py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="material-symbols-outlined text-slate-400 hover:text-primary">more_vert</button>
              </td>
            </tr>
            
            {/* Elena */}
            <tr className="group">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Elena Rodriguez</span>
                </div>
              </td>
              <td className="py-4">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 uppercase">In Session</span>
              </td>
              <td className="py-4">
                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] rounded-full"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">85% capacity</span>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-1 text-orange-400">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">4.8</span>
                </div>
              </td>
              <td className="py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="material-symbols-outlined text-slate-400 hover:text-primary">more_vert</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};