"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Download, Archive } from 'lucide-react';
import { NotificationDetailRecord } from '@/types/notification';

interface Props {
  data: NotificationDetailRecord;
}

export default function NotificationDetail({ data }: Props) {
  const router = useRouter();

  // GUARD CLAUSE: Bảo vệ component khỏi lỗi "Cannot read properties of undefined"
  // Đảm bảo nếu bị truyền data rỗng, nó sẽ không cố gắng render các thuộc tính như data.tag, data.title
  if (!data) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <p className="text-slate-400 font-medium">Đang tải dữ liệu thông báo...</p>
      </div>
    );
  }

  return (
    // Thêm animate-in fade-in slide-in-from-bottom-4 để tạo hiệu ứng trượt nhẹ từ dưới lên
    <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Nút Quay Lại */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </button>
      </div>

      {/* Container Chính */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                {data.tag}
              </span>
              <span className="text-slate-400 text-[11px] font-mono">ID: {data.id.split('-')[0]}...</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {data.title}
            </h1>
          </div>
          <div className="flex flex-col md:items-end gap-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loại thông báo</span>
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm">{data.type}</span>
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cột Trái: Nội dung (Chiếm 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nội dung chi tiết</h3>
              <div className="text-slate-700 leading-relaxed text-[15px] bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                {data.content.map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Thuộc tính Hệ thống */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mã Trung tâm</span>
                <span className="text-sm font-mono text-slate-900 truncate block">{data.centerId}</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trạng thái Xóa</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${data.isDeleted ? 'bg-red-500' : 'bg-slate-300'}`}></span>
                  <span className="text-sm font-bold text-slate-900">{data.isDeleted ? 'Đúng (True)' : 'Sai (False)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Siêu dữ liệu (Metadata & Actions) */}
          <div className="space-y-8 lg:border-l lg:border-slate-100 lg:pl-8">
            
            {/* Lịch sử Tạo */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Lịch sử bản ghi</h3>
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tạo lúc</span>
                <span className="text-sm font-bold text-slate-900">{data.createdAt}</span>
              </div>
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tạo bởi</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-black text-slate-600">{data.createdBy.initials}</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{data.createdBy.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">User: {data.createdBy.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lịch sử Cập nhật */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cập nhật lúc</span>
                <span className="text-sm font-bold text-slate-900">{data.updatedAt}</span>
              </div>
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cập nhật bởi</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-black text-slate-600">{data.updatedBy.initials}</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{data.updatedBy.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">User: {data.updatedBy.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Các Nút Hành Động */}
            <div className="pt-6 border-t border-slate-100">
              <button className="w-full py-2.5 mb-3 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Xuất dữ liệu
              </button>
              <button className="w-full py-2.5 flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Archive className="w-4 h-4" /> Lưu trữ thông báo
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer System Meta */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-slate-400 gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest">Lược đồ CSDL: V2.4.0</p>
        <div className="flex gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest">Mã hóa: AES-256</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Đồng bộ: Đang chạy</span>
        </div>
      </div>

    </div>
  );
}