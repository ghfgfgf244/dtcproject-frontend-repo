import React from 'react';
import styles from './stats.module.css';
import { Users, BarChart2, BadgeCheck } from 'lucide-react';

export default function ResultStats() {
  return (
    <div className={styles.statsGrid}>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Students</p>
          <p className="text-2xl font-black text-slate-900">1,284</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
          <BarChart2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Score</p>
          <p className="text-2xl font-black text-slate-900">84.2 <span className="text-sm font-medium text-slate-400">/ 100</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
          <BadgeCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pass Rate (%)</p>
          <p className="text-2xl font-black text-slate-900">92.4%</p>
        </div>
      </div>
    </div>
  );
}