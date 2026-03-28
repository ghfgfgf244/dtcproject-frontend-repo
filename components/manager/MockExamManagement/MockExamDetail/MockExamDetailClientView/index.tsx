// src/app/(manager)/training-manager/mock-exams/[id]/_components/MockExamDetailClientView/index.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { MockExamDetailInfo, ExamQuestion, QuestionBankItem } from '@/types/mock-exam-detail';

import ExamHeaderInfo from '../ExamHeaderInfo';
import QuestionCard from '../QuestionCard';
import MockExamFooter from '../MockExamFooter'; // <-- Bổ sung import
import ConfirmModal from '@/components/ui/confirm-modal';
import MockExamQuestionModal from '@/components/manager/Modals/MockExamQuestionModal';
import AddQuestionFromBankModal from '@/components/manager/Modals/AddQuestionFromBankModal';
import { MOCK_BANK } from '@/constants/mock-exam-detail-data';

interface Props {
  info: MockExamDetailInfo;
  initialQuestions: ExamQuestion[];
}

const ITEMS_PER_PAGE = 5; // Số lượng câu hỏi trên 1 trang

export default function MockExamDetailClientView({ info, initialQuestions }: Props) {
  const [questions, setQuestions] = useState<ExamQuestion[]>(initialQuestions);
  const [isAddFromBankOpen, setIsAddFromBankOpen] = useState(false);

  const [filterCategory, setFilterCategory] = useState<string>('Tất cả câu hỏi');
  
  // STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null);

  const handleAddQuestionsFromBank = (selected: QuestionBankItem[]) => {
    // Tránh trùng lặp ID nếu cần và gán lại số thứ tự (Order)
    const currentMaxOrder = questions.length > 0 
      ? Math.max(...questions.map(q => q.order)) 
      : 0;

    const formattedNewQuestions: ExamQuestion[] = selected.map((q, index) => ({
      ...q,
      order: currentMaxOrder + index + 1
    }));

    setQuestions(prev => [...prev, ...formattedNewQuestions]);
    alert(`Đã thêm thành công ${selected.length} câu hỏi vào bộ đề!`);
  };

  const handleDeleteQuestionClick = (id: string) => {
    setQuestionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditQuestionClick = (id: string) => {
    // Tìm câu hỏi đang được chọn để ném vào Modal
    const targetQ = questions.find(q => q.id === id);
    if (targetQ) {
      setEditingQuestion(targetQ);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateQuestionSubmit = (updatedQuestion: ExamQuestion) => {
    // Cập nhật lại mảng questions
    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    setIsEditModalOpen(false);
    setEditingQuestion(null);
  };

  // Xác nhận xóa
  const handleConfirmDelete = () => {
    if (questionToDelete) {
      setQuestions(prev => prev.filter(q => q.id !== questionToDelete));
      
      // Fix lỗi kẹt phân trang nếu xóa câu hỏi cuối cùng của trang hiện tại
      const newTotal = filteredQuestions.length - 1;
      if (newTotal > 0 && Math.ceil(newTotal / ITEMS_PER_PAGE) < currentPage) {
        setCurrentPage(prev => prev - 1);
      }
    }
    
    // Đóng modal và clear state
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  // Hủy xóa
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  // Logic Lọc (Gắn thêm việc reset trang về 1 khi đổi bộ lọc)
  const filteredQuestions = filterCategory === 'Tất cả câu hỏi' 
    ? questions 
    : questions.filter(q => q.category === filterCategory);

  // Logic Phân trang
  const totalItems = filteredQuestions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Logic Lưu
  const handleSaveExam = () => {
    alert("Đã lưu cấu trúc bộ đề thi thử thành công!");
  };

  return (
    <div className="relative pb-20">
      
      {/* 1. Header Info */}
      <ExamHeaderInfo 
      onAddClick={() => setIsAddFromBankOpen(true)} info={info} />

      {/* 2. Content Area */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Danh sách câu hỏi</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">Lọc theo:</span>
            <select 
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }} // Reset page khi lọc
              className="bg-white border-slate-200 rounded-lg text-sm font-medium py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
            >
              <option value="Tất cả câu hỏi">Tất cả câu hỏi</option>
              <option value="Lý thuyết">Câu hỏi lý thuyết</option>
              <option value="Biển báo">Câu hỏi biển báo</option>
              <option value="Sa hình">Câu hỏi sa hình</option>
            </select>
          </div>
        </div>

        {/* Danh sách Thẻ câu hỏi (Dùng mảng đã phân trang) */}
        <div className="space-y-4">
          {paginatedQuestions.map((q) => (
            <QuestionCard 
              key={q.id} 
              question={q} 
              onEdit={handleEditQuestionClick}
              onDelete={handleDeleteQuestionClick} 
            />
          ))}
          {filteredQuestions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
              <p className="text-slate-500 font-medium text-sm">Không có câu hỏi nào trong danh mục này.</p>
            </div>
          )}
        </div>
        
        {/* 3. TÍCH HỢP FOOTER VÀO ĐÂY */}
        {filteredQuestions.length > 0 && (
          <MockExamFooter 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            onSave={handleSaveExam}
          />
        )}

      </div>
      
      <AddQuestionFromBankModal 
        isOpen={isAddFromBankOpen}
        onClose={() => setIsAddFromBankOpen(false)}
        bankQuestions={MOCK_BANK}
        onAddSelected={handleAddQuestionsFromBank}
      />
      
      <MockExamQuestionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={editingQuestion}
        onSubmit={handleUpdateQuestionSubmit}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa câu hỏi"
        message="Bạn có chắc chắn muốn xóa câu hỏi này khỏi bộ đề thi thử không? (Hành động này chỉ cập nhật trên bản nháp cho đến khi bạn bấm Lưu)."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}