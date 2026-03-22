import React from 'react';
import { Download, Plus } from 'lucide-react';

interface Props {
  onAddClick: () => void;
  onExportClick?: () => void; // Optional cho chức năng Export sau này
}

export default function InstructorHeader({ onAddClick, onExportClick }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="text-[1.875rem] font-black tracking-tight text-slate-900 leading-none mb-2">
          Quản lý Giảng viên
        </h2>
        <p className="text-slate-500 font-medium">
          Quản lý và điều phối đội ngũ giảng viên đào tạo lái xe của trung tâm.
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onExportClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all active:scale-95 text-sm"
        >
          <Download className="w-4 h-4" /> Xuất danh sách
        </button>
        
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" /> Thêm Giảng viên mới
        </button>
      </div>
    </div>
  );
}