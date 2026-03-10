'use client';
import React from 'react';

export const EnrollmentChart = () => {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-lg">Enrollment Trends</h4>
        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-0 text-slate-600 dark:text-slate-300">
          <option>Last 6 Months</option>
          <option>Year to Date</option>
        </select>
      </div>
      <div className="h-64 flex flex-col gap-4">
        <div className="flex-1 w-full relative">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
            <path d="M0,130 C50,120 80,140 120,80 C160,20 200,60 250,40 C300,20 350,70 400,50 L400,150 L0,150 Z" fill="rgba(37, 140, 244, 0.1)"></path>
            <path d="M0,130 C50,120 80,140 120,80 C160,20 200,60 250,40 C300,20 350,70 400,50" fill="none" stroke="#258cf4" strokeLinecap="round" strokeWidth="3"></path>
          </svg>
        </div>
        <div className="flex justify-between text-xs text-slate-400 font-medium px-2">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
      </div>
    </div>
  );
};