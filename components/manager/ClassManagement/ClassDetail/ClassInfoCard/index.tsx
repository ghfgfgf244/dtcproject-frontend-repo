// src/app/(manager)/training-manager/classes/[id]/_components/ClassInfoBoard/index.tsx
import React from 'react';
import { Info, CalendarDays, CalendarCheck, Users, MoreVertical } from 'lucide-react';
import { ClassDetailRecord } from '@/types/class-detail';

export default function ClassInfoBoard({ data }: { data: ClassDetailRecord }) {
  
  const getAvatarTheme = (theme: string) => {
    switch(theme) {
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'pink': return 'bg-pink-100 text-pink-700';
      case 'amber': return 'bg-amber-100 text-amber-700';
      case 'emerald': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="col-span-1 lg:col-span-2 space-y-6">
      
      {/* 1. Class Overview Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" /> Thông tin Lớp học
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Khóa đào tạo</p>
            <p className="text-slate-900 font-bold text-sm">{data.courseName}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Trạng thái</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
              Đang hoạt động
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ngày khai giảng</p>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <CalendarDays className="w-4 h-4 text-slate-400" /> {data.startDate}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Dự kiến bế giảng</p>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <CalendarCheck className="w-4 h-4 text-slate-400" /> {data.endDate}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Enrolled Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Học viên ghi danh
            <span className="bg-slate-100 text-slate-500 text-[11px] font-bold py-1 px-3 rounded-full ml-2">
              {data.students.length} Tổng
            </span>
          </h3>
          <button className="text-blue-600 text-sm font-bold hover:underline">Thêm Học viên</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và Tên</th>
                <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Liên hệ</th>
                <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày ghi danh</th>
                <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.students.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 md:px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${getAvatarTheme(stu.theme)}`}>
                        {stu.initials}
                      </div>
                      <span className="font-bold text-sm text-slate-900">{stu.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 text-slate-500 text-sm font-medium">{stu.email}</td>
                  <td className="px-6 md:px-8 py-4 text-slate-500 text-sm font-medium">{stu.enrollDate}</td>
                  <td className="px-6 md:px-8 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors p-1">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <button className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
            Xem toàn bộ danh sách
          </button>
        </div>
      </div>

    </div>
  );
}