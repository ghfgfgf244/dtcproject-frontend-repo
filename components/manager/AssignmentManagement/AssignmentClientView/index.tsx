// src/app/(manager)/training-manager/assignments/_components/AssignmentClientView/index.tsx
"use client";

import React, { useState } from 'react';
import { CheckCircle2, Lightbulb, CalendarClock } from 'lucide-react';
import { PendingClass, InstructorOption } from '@/types/assignment';
import { MOCK_ASSIGNMENT_STATS } from '@/constants/assignment-data';

import AssignmentStats from '../AssignmentStats';
import AssignmentTable from '../AssignmentTable';

interface Props {
  initialClasses: PendingClass[];
  instructors: InstructorOption[];
}

const ITEMS_PER_PAGE = 5;

export default function AssignmentClientView({ initialClasses, instructors }: Props) {
  // Sử dụng state để lưu danh sách lớp nhằm update UI (Optimistic Update) khi chọn GV
  const [classes, setClasses] = useState<PendingClass[]>(initialClasses);
  const [currentPage, setCurrentPage] = useState(1);

  // Logic gán giảng viên
  const handleAssignInstructor = (classId: string, instructorId: string) => {
    setClasses(prev => prev.map(cls => {
      if (cls.id === classId) {
        return { 
          ...cls, 
          assignedInstructorId: instructorId,
          status: 'Đã phân công' // Tự động cập nhật trạng thái khi có GV mới
        };
      }
      return cls;
    }));
  };

  const handleConfirmAll = () => {
    alert("Đã lưu cấu hình điều phối giảng viên thành công!");
  };

  const totalItems = classes.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedClasses = classes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Điều phối Giảng viên</h2>
          <p className="text-slate-500 text-sm mt-2">Quản lý và chỉ định nhân sự cho các lớp thực hành & lý thuyết đang chờ.</p>
        </div>
        <button 
          onClick={handleConfirmAll}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
        >
          <CheckCircle2 className="w-5 h-5" />
          Xác nhận điều phối
        </button>
      </div>

      {/* Stats */}
      <AssignmentStats data={MOCK_ASSIGNMENT_STATS} />

      {/* Main Table */}
      <AssignmentTable 
        classes={paginatedClasses}
        instructors={instructors}
        onAssignInstructor={handleAssignInstructor}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      {/* Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Gợi ý tự động</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Hệ thống đã phân tích hạng bằng và lịch trình để lọc ra các giảng viên phù hợp nhất. Ưu tiên chọn các giảng viên có ký hiệu <span className="text-emerald-600 font-bold">⭐</span>.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Kiểm tra xung đột</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Hệ thống sẽ tự động thông báo nếu giảng viên được chọn có lịch dạy thực hành/lý thuyết trùng với lớp học khác trong cùng khung giờ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}