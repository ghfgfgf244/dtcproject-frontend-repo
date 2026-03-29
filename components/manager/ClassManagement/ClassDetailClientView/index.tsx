"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { ClassDetailRecord } from '@/types/class-detail';
import ClassInfoBoard from '../ClassDetail/ClassInfoBoard';
import ClassSidebar from '../ClassDetail/ClassSidebar';
import AddStudentModal from '../../Modals/AddStudentModal';
import { MOCK_STUDENT_OPTIONS } from '@/constants/class-detail-data';
import ConfirmModal from '@/components/ui/confirm-modal';
import { ClassFormData, ClassStatus } from '@/types/class';
import ClassModal from '../../Modals/ClassModal';

// Lưu ý: Cập nhật lại đường dẫn import cho đúng với cấu trúc thư mục của bạn

interface Props {
  initialData: ClassDetailRecord;
}

export default function ClassDetailClientView({ initialData }: Props) {
  const router = useRouter();
  
  // Đưa data vào state để sau này có thể update UI ngay lập tức (VD: sau khi thêm học viên)
  const [classData, setClassData] = useState<ClassDetailRecord>(initialData);

  // State chuẩn bị cho Modal thêm học viên (Từ bài trước)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{id: string, name: string} | null>(null);

  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);

// Mở modal
  const handleOpenAddStudentModal = () => {
    setIsAddStudentModalOpen(true);
  };

  // Nhận dữ liệu submit từ Modal
  const handleAddStudents = (selectedStudentIds: string[]) => {
    console.log("Thêm các học viên vào lớp:", selectedStudentIds);
    // TODO: Gọi API thêm học viên ở đây.
    
    // Đóng modal sau khi submit thành công
    setIsAddStudentModalOpen(false);
  };

  const handleDeleteStudentClick = (studentId: string, studentName: string) => {
    setStudentToDelete({ id: studentId, name: studentName });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      console.log('Đang gọi API xóa học viên khỏi lớp:', studentToDelete.id);
      
      // Update UI (Optimistic Update)
      setClassData(prev => ({
        ...prev,
        students: prev.students.filter(stu => stu.id !== studentToDelete.id)
      }));
    }
    
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };
  
const handleOpenEditClass = () => {
    setIsEditClassModalOpen(true);
  };

  // 3. HANDLER: Nhận dữ liệu từ ClassModal và cập nhật
  const handleUpdateClass = (updatedData: ClassFormData) => {
    console.log("Dữ liệu cập nhật lớp:", updatedData);
    
    // Optimistic Update UI (Giả lập cập nhật)
    setClassData(prev => ({
      ...prev,
      name: updatedData.name,
      // Vì ClassDetailRecord và ClassFormData có cấu trúc hơi khác nhau,
      // trong thực tế bạn sẽ cần map thêm các trường nếu cần hiển thị.
      // Ví dụ: Update lại maxStudents nếu giao diện detail có hiển thị.
    }));

    setIsEditClassModalOpen(false);
  };

  // 4. CHUYỂN ĐỔI DATA: Từ Detail (View) sang FormData (Modal)
  const getEditingData = (): ClassFormData => {
    return {
      id: classData.id,
      name: classData.name,
      // Giả định termId và status, thực tế API detail sẽ trả về đầy đủ
      termId: 't1', 
      maxStudents: 30, 
      status: 'Đang học' as ClassStatus, 
      sessions: [] // Nếu chi tiết lớp có mảng sessions thì truyền vào đây
    };
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">{classData.name}</h2>
          <p className="text-slate-500 text-sm">Tổng quan chi tiết và danh sách học viên ghi danh của lớp hiện tại.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <button 
            onClick={handleOpenEditClass}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
          >
            <Edit3 className="w-4 h-4" /> Chỉnh sửa Lớp
          </button>
        </div>
      </div>

      {/* Main Layout: 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột Trái (Chiếm 2 phần) */}
        <ClassInfoBoard 
          data={classData} 
          onAddStudentClick={handleOpenAddStudentModal}
          onDeleteStudentClick={handleDeleteStudentClick} // TRUYỀN HÀM XÓA VÀO
        />
        
        {/* Cột Phải (Chiếm 1 phần) */}
        <ClassSidebar data={classData} />
      </div>

      <AddStudentModal 
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        availableStudents={MOCK_STUDENT_OPTIONS}
        onSubmit={handleAddStudents}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa học viên khỏi lớp"
        message={`Bạn có chắc chắn muốn xóa học viên "${studentToDelete?.name}" khỏi lớp học này không?`}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      
      <ClassModal
        isOpen={isEditClassModalOpen}
        onClose={() => setIsEditClassModalOpen(false)}
        initialData={getEditingData()} // Truyền dữ liệu hiện tại vào Modal
        onSubmit={handleUpdateClass}
      />
    </div>
  );
}