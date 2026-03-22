// src/app/(manager)/training-manager/classes/[id]/_components/ClassSidebar/index.tsx
import React from 'react';
import { UserSquare2, Mail, Phone, MapPin } from 'lucide-react';
import { ClassDetailRecord } from '@/types/class-detail';

export default function ClassSidebar({ data }: { data: ClassDetailRecord }) {
  return (
    <div className="space-y-6">
      
      {/* 1. Instructor Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
          <UserSquare2 className="w-5 h-5 text-blue-600" /> Giảng viên phụ trách
        </h3>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-slate-100 mb-4 bg-slate-50">
            {/* Nếu dự án bạn cài Next/Image thì thay thẻ img này */}
            <img 
              src={data.instructor.avatarUrl} 
              alt={data.instructor.name} 
              className="w-full h-full object-cover rounded-full" 
            />
          </div>
          <h4 className="text-lg font-black text-slate-900">{data.instructor.name}</h4>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{data.instructor.role}</p>
          
          <div className="w-full mt-6">
            <button className="w-full px-4 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
              Xem Hồ sơ Giảng viên
            </button>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-600 font-medium truncate">{data.instructor.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-600 font-medium">{data.instructor.phone}</span>
          </div>
        </div>
      </div>

      {/* 2. Location Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
          <MapPin className="w-5 h-5 text-blue-600" /> Địa điểm Đào tạo
        </h3>
        
        <div className="h-32 bg-slate-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-slate-200">
          <MapPin className="text-slate-300 w-12 h-12" strokeWidth={1.5} />
        </div>
        
        <p className="text-sm font-bold text-slate-900">{data.location.room}</p>
        <p className="text-xs text-slate-500 mt-1 font-medium">{data.location.building}</p>
      </div>

    </div>
  );
}