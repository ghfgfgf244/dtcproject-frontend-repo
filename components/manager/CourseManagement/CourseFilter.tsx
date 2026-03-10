'use client';
import React from 'react';

export const CourseFilters = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-primary/10 shadow-sm flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input 
          type="text"
          placeholder="Search course name or license type..." 
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" 
        />
      </div>
      <div className="flex gap-2">
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-600 min-w-[140px]">
          <option value="">License Type</option>
          <option value="A1">A1 - Motorcycle</option>
          <option value="B1">B1 - Car Automatic</option>
          <option value="B2">B2 - Car Manual</option>
          <option value="C">C - Heavy Truck</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-600 min-w-[140px]">
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-xl">filter_list</span>
          Filters
        </button>
      </div>
    </div>
  );
};