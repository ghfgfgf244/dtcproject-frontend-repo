// src/app/(manager)/training-manager/documents/_components/DocumentStats/index.tsx
import React from 'react';
import styles from './stats.module.css';
import { BadgeCheck, Clock, CalendarDays } from 'lucide-react';

interface Props {
  stats: {
    verified: number;
    pending: number;
    expiring: number;
  }
}

export default function DocumentStats({ stats }: Props) {
  return (
    <div className={styles.statsGrid}>
      
      {/* Verified Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <BadgeCheck className="w-6 h-6" />
          </span>
        </div>
        <p className="text-slate-500 text-sm font-medium">Verified Documents</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          {stats.verified < 10 ? `0${stats.verified}` : stats.verified}
        </h3>
      </div>

      {/* Pending Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </span>
        </div>
        <p className="text-slate-500 text-sm font-medium">Pending Review</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          {stats.pending < 10 ? `0${stats.pending}` : stats.pending}
        </h3>
      </div>

      {/* Expiring Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <CalendarDays className="w-6 h-6" />
          </span>
        </div>
        <p className="text-slate-500 text-sm font-medium">Expiring Soon</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          {stats.expiring < 10 ? `0${stats.expiring}` : stats.expiring}
        </h3>
      </div>

    </div>
  );
}