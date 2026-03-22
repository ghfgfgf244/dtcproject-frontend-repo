"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, CalendarClock, ShieldCheck, Download, LibraryBig, TrendingUp } from 'lucide-react';
import { ClassRecord } from '@/types/class';
import { ClassFormData } from '@/types/class'; // Cập nhật import type

import ClassTable from '../ClassTable';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import ClassModal from '@/components/manager/Modals/ClassModal' // 1. IMPORT MODAL VÀO ĐÂY

interface Props {
  initialClasses: ClassRecord[];
}

const ITEMS_PER_PAGE = 5;

export default function ClassClientView({ initialClasses }: Props) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  
  // States quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRecord | null>(null);

  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/training-manager/dashboard' },
    { label: 'Lớp học & Lịch trình', href: '/training-manager/classes' }
  ];

  // Logic Phân trang
  const totalItems = initialClasses.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClasses = initialClasses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 2. HÀM CHUYỂN ĐỔI DATA (Từ Bảng -> Form)
  // Khi bấm Edit, ta lấy dữ liệu từ dòng đó để fill vào Form
  const getInitialFormData = (cls: ClassRecord | null): ClassFormData | null => {
    if (!cls) return null; // Nếu Create (cls = null) thì trả về null để Modal dùng Form trống
    
    // Nếu Edit, mapping dữ liệu tương ứng (thực tế bạn sẽ fetch API chi tiết bằng cls.id ở đây)
    return {
      id: cls.id,
      name: cls.name,
      termId: 't1', // Mock data
      maxStudents: cls.studentCount > 0 ? cls.studentCount + 10 : 30, // Mock sức chứa
      status: 'Đang học', 
      sessions: [] // Mặc định chưa có lịch
    };
  };

  // 3. HÀM XỬ LÝ LƯU (SUBMIT)
  const handleSubmit = (formData: ClassFormData) => {
    if (formData.id) {
      console.log('Đang gọi API Cập nhật lớp:', formData.id, formData);
      // alert('Cập nhật thành công!');
    } else {
      console.log('Đang gọi API Tạo lớp mới:', formData);
      // alert('Tạo mới thành công!');
    }
    
    // Tắt modal sau khi lưu xong
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Page Title & Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="mb-2">
            <Breadcrumbs items={breadcrumbsItems} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Quản lý Lớp học</h2>
          <p className="text-slate-500 mt-1">Theo dõi và vận hành tất cả các lớp đào tạo đang mở.</p>
        </div>
        <button 
          onClick={() => { setEditingClass(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Tạo lớp học mới
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-600/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Tổng số lớp học</p>
              <h3 className="text-3xl font-bold mt-1">24</h3>
            </div>
            <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-md">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-blue-100 mt-4 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +3 so với tháng trước
          </p>
        </div>
        
        {/* Stat 2 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Chờ khai giảng</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">8</h3>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600">
              <CalendarClock className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full w-2/3"></div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Tỷ lệ tốt nghiệp</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">92%</h3>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-emerald-500 mt-4 flex items-center gap-1 font-bold uppercase tracking-wider">
            Vượt chỉ tiêu
          </p>
        </div>
      </div>

      {/* Table Component */}
      <ClassTable 
        classes={paginatedClasses}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        onView={(cls: ClassRecord) => router.push(`/training-manager/classes/${cls.id}`)}
        onEdit={(cls: ClassRecord) => { setEditingClass(cls); setIsModalOpen(true); }}
        onDelete={(cls: ClassRecord) => console.log('Xóa lớp', cls.id)}
      />

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden p-6 rounded-2xl bg-white border border-slate-200 group transition-all hover:border-blue-300 shadow-sm cursor-pointer">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors"></div>
          <div className="flex gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900">Xuất báo cáo lớp học</h4>
              <p className="text-sm text-slate-500 mt-1">Xuất file PDF hoặc CSV toàn bộ danh sách, điểm danh và kết quả thi của học viên.</p>
              <button className="mt-4 text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Tải xuống ngay <span className="text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden p-6 rounded-2xl bg-white border border-slate-200 group transition-all hover:border-blue-300 shadow-sm cursor-pointer">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors"></div>
          <div className="flex gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <LibraryBig className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900">Thư viện giáo trình</h4>
              <p className="text-sm text-slate-500 mt-1">Duyệt và gắn tài liệu, biểu đồ thực hành từ kho lưu trữ trung tâm vào các lớp học.</p>
              <button className="mt-4 text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Truy cập kho <span className="text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. GỌI MODAL Ở ĐÂY */}
      <ClassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={getInitialFormData(editingClass)} 
        onSubmit={handleSubmit}
      />

    </div>
  );
}