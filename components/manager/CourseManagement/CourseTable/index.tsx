// src/app/(manager)/training-manager/courses/_components/CourseTable/index.tsx
import React from 'react';
import { Edit, Trash2, MoreVertical, Car, Bike, Truck, CarFront, ChevronLeft, ChevronRight, Eye } from 'lucide-react'; // Thêm icon Eye
import { CourseRecord, LicenseType } from '@/types/course';

interface Props {
  courses: CourseRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onView: (course: CourseRecord) => void; // Thêm prop onView
  onEdit: (course: CourseRecord) => void;
  onDelete: (course: CourseRecord) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function CourseTable({ courses, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onView, onEdit, onDelete }: Props) {
  
  const getLicenseIcon = (type: LicenseType) => {
    switch (type) {
      case 'A1': return <Bike className="w-5 h-5" />;
      case 'B1': return <CarFront className="w-5 h-5" />;
      case 'B': return <Car className="w-5 h-5" />;
      case 'C': return <Truck className="w-5 h-5" />;
    }
  };

  const getLicenseStyle = (type: LicenseType) => {
    switch (type) {
      case 'A1': return 'bg-indigo-100 text-indigo-700';
      case 'B1': return 'bg-sky-100 text-sky-700';
      case 'B2': return 'bg-blue-100 text-blue-700';
      case 'C': return 'bg-slate-100 text-slate-700';
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  if (courses.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center">
        <p className="text-slate-500">Không tìm thấy khóa học nào phù hợp với bộ lọc.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên Khóa học</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hạng bằng</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Học phí</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      {getLicenseIcon(course.licenseType)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{course.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{course.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getLicenseStyle(course.licenseType)}`}>
                    Hạng {course.licenseType}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">
                  {formatCurrency(course.price)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${course.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className={`text-sm font-medium ${course.status === 'Hoạt động' ? 'text-slate-600' : 'text-slate-400'}`}>
                      {course.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* BỔ SUNG NÚT XEM CHI TIẾT VÀO ĐÂY */}
                    <button onClick={() => onView(course)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50" title="Xem chi tiết">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(course)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(course)} className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <p className="text-sm text-slate-500">Hiển thị <span className="font-bold">{startIndex}-{endIndex}</span> trong <span className="font-bold">{totalItems}</span> khóa học</p>
        <div className="flex gap-2">
          <button 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Trước
          </button>
          <button 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            Sau <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}