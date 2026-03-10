import React from 'react';
import { ClassDetailData } from '@/types/class';

interface ClassSidePanelProps {
  data: ClassDetailData;
}

export const ClassSidePanel = ({ data }: ClassSidePanelProps) => {
  return (
    <div className="space-y-6">
      {/* Instructor Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Assigned Instructor
        </h3>
        
        {data.instructor ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full p-1 border-2 border-primary/20 mb-4 bg-slate-100 flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">{data.instructor.fullName}</h4>
            <p className="text-sm text-slate-500 mb-4">Driving Instructor</p>
            <div className="w-full flex justify-center gap-3">
              <button className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300">Message</button>
              <button className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300">View Bio</button>
            </div>
            
            <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                <span className="text-slate-600 dark:text-slate-400">{data.instructor.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg">call</span>
                <span className="text-slate-600 dark:text-slate-400">{data.instructor.phone || 'N/A'}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center italic">No instructor assigned yet.</p>
        )}
      </div>

      {/* Class Progress Stats */}
      <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-xl text-white shadow-lg shadow-primary/20">
        <h3 className="font-bold mb-4 opacity-90">Class Progress</h3>
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>Current Status</span>
            <span>{data.progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className={`bg-white h-full rounded-full`} style={{ width: `${data.progressPercent}%` }}></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-[10px] uppercase font-bold opacity-70">Avg Grade</p>
            <p className="text-lg font-bold">88.5%</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-[10px] uppercase font-bold opacity-70">Attendance</p>
            <p className="text-lg font-bold">92%</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">location_on</span>
          Training Location
        </h3>
        <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg mb-3 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
            <span className="material-symbols-outlined text-primary text-4xl opacity-50">directions_car</span>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{data.location}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Main Campus Driving Range</p>
      </div>
    </div>
  );
};