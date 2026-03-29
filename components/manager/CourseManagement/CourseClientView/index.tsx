"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Filter, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { setAuthToken } from '@/lib/api';
import { CourseRecord, LicenseType, CourseStatus, Course } from '@/types/course';
import CourseTable from '../CourseTable';
import CourseModal, { CourseSubmitData } from '../../Modals/CourseModal';
import { courseService } from '@/services/courseService';

export default function CourseClientView() {
  const router = useRouter();
  const { getToken } = useAuth();

  // States for API Data
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseFilter, setLicenseFilter] = useState<LicenseType | 'Tất cả'>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'Tất cả'>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);

  // States Quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);

  // Mapping function
  const mapCourseToRecord = (course: Course): CourseRecord => ({
    id: course.id,
    name: course.courseName,
    description: course.description,
    licenseType: course.licenseType as LicenseType,
    price: course.price,
    status: course.isActive ? 'Hoạt động' : 'Ngừng hoạt động'
  });

  // Fetch data
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data = await courseService.getAllAdminCourses();
      setCourses(data.map(mapCourseToRecord));
    } catch (err) {
      setError("Không thể tải danh sách khóa học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Logic Lọc & Phân trang
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLicense = licenseFilter === 'Tất cả' || course.licenseType === licenseFilter;
      const matchStatus = statusFilter === 'Tất cả' || course.status === statusFilter;
      return matchSearch && matchLicense && matchStatus;
    });
  }, [courses, searchTerm, licenseFilter, statusFilter]);

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

  // Handler CRUD
  const handleCreateCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: CourseRecord) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Bạn có chắc chắn muốn ngừng hoạt động khóa học này?")) {
      try {
        const token = await getToken();
        setAuthToken(token);
        await courseService.deactivateCourse(courseId);
        await fetchCourses(); // Refresh
      } catch (err) {
        alert("Lỗi khi ngừng hoạt động khóa học.");
      }
    }
  };

  const handleSubmit = async (data: CourseSubmitData) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      
      const licenseMapping: Record<string, number> = { 'A1': 1, 'B1': 3, 'B2': 4, 'C': 6 };
      
      const payload = {
        centerId: data.centerId,
        courseName: data.name,
        licenseType: licenseMapping[data.licenseType] || 1,
        durationInWeeks: 12, // Default or add to modal
        maxStudents: 30, // Default or add to modal
        description: data.description,
        price: Number(data.price),
        isActive: data.status === 'Hoạt động'
      };

      if (data.id) {
        await courseService.updateCourse(data.id, {
          courseName: payload.courseName,
          description: payload.description,
          price: payload.price,
          isActive: payload.isActive
        });
      } else {
        await courseService.createCourse(payload);
      }
      
      setIsModalOpen(false);
      await fetchCourses();
    } catch (err) {
      alert("Lỗi khi lưu khóa học.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý Khóa học</h1>
          <p className="text-slate-500 text-sm mt-1">Cấu hình và theo dõi các chương trình đào tạo của trung tâm.</p>
        </div>
        <button 
          onClick={handleCreateCourse}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" /> Thêm Khóa học
        </button>
      </div>

      {/* Cụm Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm theo tên khóa học..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select 
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none"
            value={licenseFilter}
            onChange={(e) => handleFilterChange('license', e.target.value)}
          >
            <option value="Tất cả">Tất cả hạng bằng</option>
            <option value="A1">Hạng A1</option>
            <option value="B1">Hạng B1</option>
            <option value="B2">Hạng B2</option>
            <option value="C">Hạng C</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select 
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none"
            value={statusFilter}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Ngừng hoạt động">Ngừng hoạt động</option>
          </select>
        </div>

        <div className="md:col-span-1 flex items-center justify-end">
          <button 
            onClick={clearFilters}
            className={`p-2 rounded-lg transition-colors ${searchTerm !== '' || licenseFilter !== 'Tất cả' || statusFilter !== 'Tất cả' ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-slate-300'}`}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <CourseTable 
        courses={paginatedCourses}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        onView={(course) => router.push(`/training-manager/courses/${course.id}`)}
        onEdit={handleEditCourse}
        onDelete={(course) => handleDeleteCourse(course.id)}
      />

      {/* RENDER MODAL */}
      <CourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingCourse} 
        onSubmit={handleSubmit}
      />
    </div>
  );
}

const ITEMS_PER_PAGE = 5;
