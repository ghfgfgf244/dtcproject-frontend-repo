// src/app/(manager)/training-manager/courses/[id]/_components/CourseDetailClientView/index.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft, Edit3, FileText, Banknote, ShieldCheck, IdCard } from 'lucide-react';
import CourseModal from '@/components/manager/Modals/CourseModal';
import { LicenseType, CourseStatus } from '@/types/course';

interface CourseDetail {
  id: string;
  name: string;
  status: string;
  licenseType: string;
  longDescription: string;
  duration: string;
  inclusions: string;
  price: number;
}

interface Props {
  course: CourseDetail;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export default function CourseDetailClientView({ course }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ép kiểu dữ liệu chuẩn để truyền vào Modal
  const mapToFormRecord = (detail: CourseDetail) => {
    return {
      id: detail.id,
      name: detail.name,
      description: detail.duration, 
      licenseType: detail.licenseType as LicenseType,
      price: detail.price,
      status: detail.status as CourseStatus
    };
  };

  return (
    <div className="p-6 md:p-8 flex-1 overflow-y-auto">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
        <button onClick={() => router.push('/training-manager/dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
        <ChevronRight className="w-4 h-4" />
        <button onClick={() => router.push('/training-manager/courses')} className="hover:text-blue-600 transition-colors">Khóa học</button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-bold">{course.name}</span>
      </nav>

      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{course.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase ${
              course.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
            }`}>
              {course.status}
            </span>
          </div>
          <p className="text-slate-500 flex items-center gap-2 font-medium">
            <IdCard className="w-4 h-4" /> Hạng bằng: {course.licenseType}
          </p>
        </div>
        
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => router.push('/training-manager/courses')}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Edit3 className="w-4 h-4" /> Chỉnh sửa
          </button>
        </div>
      </div>

      {/* PHẦN NỘI DUNG CHI TIẾT ĐÃ ĐƯỢC KHÔI PHỤC */}
      <div className="max-w-5xl space-y-8">
        
        {/* Course Overview Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Tổng quan Khóa học
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Mô tả chi tiết</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                {course.longDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Thời lượng</h4>
                <p className="text-slate-900 font-bold text-lg">{course.duration}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Bao gồm</h4>
                <p className="text-slate-900 font-bold text-lg">{course.inclusions}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Details Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-blue-600" /> Chi tiết Học phí
          </h3>
          
          <div className="bg-blue-50/50 rounded-xl p-6 md:p-8 border border-blue-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-slate-600 font-bold mb-1">Tổng học phí trọn gói</p>
                <p className="text-4xl font-black text-blue-600 tracking-tight">
                  {formatCurrency(course.price)} <span className="text-xl font-bold">VNĐ</span>
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs text-slate-500 mb-2 font-medium italic">*Đã bao gồm lệ phí thi và phí hành chính</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-sm">
                  <ShieldCheck className="w-4 h-4" /> Đã xác thực giá
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* GỌI MODAL CHỈNH SỬA Ở ĐÂY */}
      <CourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={mapToFormRecord(course)} 
        onSubmit={(data) => {
          console.log("Cập nhật Khóa học từ trang chi tiết:", data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}