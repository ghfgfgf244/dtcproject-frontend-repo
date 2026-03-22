import React from 'react';
import styles from './header.module.css';
import { Search, Bell, Plus } from 'lucide-react';

export default function ExamHeader() {
  return (
    <header className={styles.headerWrapper}>
      {/* Cụm Tìm kiếm */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-shadow text-slate-900 placeholder:text-slate-400" 
            placeholder="Tìm kiếm kỳ thi, đợt thi hoặc học viên..." 
            type="text"
          />
        </div>
      </div>

      {/* Cụm Nút Action & Thông báo */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {/* Chấm đỏ thông báo */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-all">
          <Plus className="w-4 h-4" />
          Tạo đợt thi mới
        </button>
      </div>
    </header>
  );
}