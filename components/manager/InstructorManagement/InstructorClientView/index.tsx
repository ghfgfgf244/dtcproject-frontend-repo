// src/app/(manager)/training-manager/instructors/_components/InstructorClientView/index.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, XCircle } from 'lucide-react';
import { Instructor, LicenseType } from '@/types/instructor';
import { MOCK_INSTRUCTOR_STATS } from '@/constants/instructor-data';
import InstructorTable from '../InstructorTable';
import InstructorModal from '@/components/manager/Modals/InstructorModal';
import { InstructorFormData } from '@/types/instructor';
import InstructorHeader from '../InstructorHeader';
import InstructorStats from '../InstructorStats';

interface Props {
  initialData: Instructor[];
}

export default function InstructorClientView({ initialData }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Khởi tạo state bộ lọc bằng tiếng Việt
  const [licenseFilter, setLicenseFilter] = useState<string>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<InstructorFormData | null>(null);

  const handleCreate = () => {
    setEditingInstructor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (instructorData: Instructor) => {
    const formData: InstructorFormData = {
      id: instructorData.id,
      fullName: instructorData.name,
      email: instructorData.email,
      phone: instructorData.phone,
      isActive: instructorData.status === 'Active',
      licenses: instructorData.licenses
    };
    setEditingInstructor(formData);
    setIsModalOpen(true);
  };

  // Logic Lọc (Real-time Filter) - Đã cập nhật để map Tiếng Việt với Tiếng Anh
  const filteredInstructors = useMemo(() => {
    return initialData.filter((ins) => {
      // 1. Tìm kiếm (Tên, Email hoặc Code)
      const q = searchQuery.toLowerCase();
      const matchSearch = ins.name.toLowerCase().includes(q) || ins.email.toLowerCase().includes(q) || ins.code.toLowerCase().includes(q);
      
      // 2. Lọc Trạng thái (Map giao diện Tiếng Việt -> Data Tiếng Anh)
      const matchStatus = 
        statusFilter === 'Tất cả' || 
        (statusFilter === 'Hoạt động' && ins.status === 'Active') ||
        (statusFilter === 'Tạm nghỉ' && ins.status === 'Inactive');
      
      // 3. Lọc Hạng bằng
      const matchLicense = licenseFilter === 'Tất cả' || ins.licenses.includes(licenseFilter as LicenseType);
      
      return matchSearch && matchStatus && matchLicense;
    });
  }, [initialData, searchQuery, licenseFilter, statusFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setLicenseFilter('Tất cả');
    setStatusFilter('Tất cả');
  };

  const isFiltering = searchQuery !== '' || licenseFilter !== 'Tất cả' || statusFilter !== 'Tất cả';

  return (
    <div className="space-y-6">
      {/* Header, Title & Actions */}
      <InstructorHeader onAddClick={handleCreate} />

      {/* KPI Summary Cards */}
      <InstructorStats data={MOCK_INSTRUCTOR_STATS} />
      
      {/* Thanh Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        
        {/* Thanh tìm kiếm */}
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-600 transition-all outline-none" 
            placeholder="Tìm kiếm theo tên, email hoặc mã giảng viên..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none min-w-[160px] cursor-pointer"
            value={licenseFilter}
            onChange={(e) => setLicenseFilter(e.target.value)}
          >
            <option value="Tất cả">Hạng bằng: Tất cả</option>
            <option value="A1">Hạng A1 - Mô tô</option>
            <option value="B1">Hạng B1 - Số tự động</option>
            <option value="B2">Hạng B2 - Số sàn</option>
            <option value="C">Hạng C - Xe tải</option>
          </select>
          
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none min-w-[160px] cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Tất cả">Trạng thái: Tất cả</option>
            <option value="Hoạt động">Đang hoạt động</option>
            <option value="Tạm nghỉ">Tạm nghỉ</option>
          </select>
          
          {isFiltering ? (
            <button 
              onClick={clearFilters}
              className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-bold text-sm shrink-0"
              title="Xóa bộ lọc"
            >
              <XCircle className="w-5 h-5" />
            </button>
          ) : (
            <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center shrink-0">
              <Filter className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Component Bảng */}
      <InstructorTable 
         instructors={filteredInstructors} 
         onEditClick={handleEdit} 
      />

      {/* Gắn Modal */}
      <InstructorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        initialData={editingInstructor}
        onSubmit={(data) => {
          console.log("Submit data ready for API:", data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}