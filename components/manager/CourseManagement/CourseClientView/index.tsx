// src/app/(manager)/training-manager/courses/_components/CourseClientView/index.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Filter, XCircle } from 'lucide-react';
import { CourseRecord, LicenseType, CourseStatus } from '@/types/course';
import CourseTable from '../CourseTable';
import CourseModal from '../../Modals/CourseModal';

interface Props {
  initialCourses: CourseRecord[];
}

const ITEMS_PER_PAGE = 5;

export default function CourseClientView({ initialCourses }: Props) {
  const router = useRouter();

  // States Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseFilter, setLicenseFilter] = useState<LicenseType | 'Tất cả'>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'Tất cả'>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);

  // States Quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);

  // Logic Lọc & Phân trang (Giữ nguyên)
  const filteredCourses = useMemo(() => {
    return initialCourses.filter(course => {
      const matchSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLicense = licenseFilter === 'Tất cả' || course.licenseType === licenseFilter;
      const matchStatus = statusFilter === 'Tất cả' || course.status === statusFilter;
      return matchSearch && matchLicense && matchStatus;
    });
  }, [initialCourses, searchTerm, licenseFilter, statusFilter]);

  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (type: 'license' | 'status', value: string) => {
    if (type === 'license') setLicenseFilter(value as LicenseType | 'Tất cả');
    if (type === 'status') setStatusFilter(value as CourseStatus | 'Tất cả');
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm(''); setLicenseFilter('Tất cả'); setStatusFilter('Tất cả'); setCurrentPage(1);
  };

  const isFiltering = searchTerm !== '' || licenseFilter !== 'Tất cả' || statusFilter !== 'Tất cả';

  // Handler Mở Modal
  const handleCreateCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: CourseRecord) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý Khóa học</h1>
          <p className="text-slate-500 text-sm mt-1">Cấu hình và theo dõi các chương trình đào tạo của trung tâm.</p>
        </div>
        <button 
          onClick={handleCreateCourse} // <-- NỐI NÚT CREATE
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" /> Thêm Khóa học
        </button>
      </div>

      {/* Cụm Filters (Giữ nguyên code filter của bạn) */}
      {/* ... */}

      <CourseTable 
        courses={paginatedCourses}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        onView={(course) => router.push(`/training-manager/courses/${course.id}`)}
        onEdit={handleEditCourse} // <-- NỐI NÚT EDIT TRÊN BẢNG
        onDelete={(course) => console.log('Delete', course.id)}
      />

      {/* RENDER MODAL */}
      <CourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingCourse} 
        onSubmit={(data) => {
          console.log("Saving Course:", data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}