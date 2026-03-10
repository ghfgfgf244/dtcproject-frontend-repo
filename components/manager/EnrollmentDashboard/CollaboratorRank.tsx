import React from 'react';

export const CollaboratorRank = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Collaborator Rank</h3>
        <button className="text-primary text-sm font-semibold hover:underline">View All</button>
      </div>
      
      <div className="space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">JS</div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">James Smith</p>
              <p className="text-xs text-slate-500">142 Enrolled</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-500">98%</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-tight">Success</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-sm">AW</div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Anna White</p>
              <p className="text-xs text-slate-500">128 Enrolled</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-500">94%</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-tight">Success</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 text-sm">RL</div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Robert Lee</p>
              <p className="text-xs text-slate-500">115 Enrolled</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-orange-500">89%</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-tight">Success</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-bold mb-4 text-slate-900 dark:text-white">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-500">Active Ad Posts</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">12</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-500">Pending Review</p>
            <p className="text-lg font-bold text-primary">04</p>
          </div>
        </div>
      </div>
    </div>
  );
};