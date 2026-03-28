// src/app/(manager)/training-manager/mock-exams/_components/MockExamClientView/index.tsx
"use client";

import React, { useState } from "react"; // Đã xóa import useMemo
import { Search, Plus, Filter, Download, Sparkles } from "lucide-react";
import { MockExamRecord, MockExamStats } from "@/types/mock-exam";

import MockExamStatsCards from "../MockExamStats";
import MockExamTable from "../MockExamTable";
import MockExamModal from "../../Modals/MockExamModal";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/confirm-modal";

interface Props {
  initialData: MockExamRecord[];
  statsData: MockExamStats;
}

const ITEMS_PER_PAGE = 10;

export default function MockExamClientView({ initialData, statsData }: Props) {
  const router = useRouter();
  const [exams, setExams] = useState<MockExamRecord[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<MockExamRecord | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<{id: string, code: string} | null>(null);

  // --- LOGIC LỌC (SEARCH) ---
  // Đã gỡ bỏ useMemo, để React Compiler tự động tối ưu
  const query = searchQuery.toLowerCase();
  const filteredExams =
    query === ""
      ? exams
      : exams.filter(
          (exam) =>
            exam.examId.toLowerCase().includes(query) ||
            exam.courseCode.toLowerCase().includes(query),
        );

  // --- LOGIC PHÂN TRANG ---
  const totalItems = filteredExams.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // HANDLER MỞ MODAL
  const handleCreateNew = () => {
    setEditingExam(null);
    setIsModalOpen(true);
  };

  // --- HANDLERS ĐIỀU HƯỚNG ---
  const handleViewDetails = (id: string) => {
    // Navigate sang trang chi tiết (vd: /training-manager/mock-exams/me-1)
    router.push(`/training-manager/mock-exams/${id}`);
  };

  // HANDLER SUBMIT (Tạo mới hoặc Cập nhật)
  const handleSubmitExam = (data: Partial<MockExamRecord>) => {
    if (data.id) {
      // Logic Cập nhật
      setExams((prev) =>
        prev.map((ex) =>
          ex.id === data.id ? ({ ...ex, ...data } as MockExamRecord) : ex,
        ),
      );
      console.log("Đã cập nhật:", data);
    } else {
      // Logic Tạo mới
      const newExam: MockExamRecord = {
        ...data,
        id: `ME-${Math.floor(Math.random() * 10000)}`, // Fake UUID
        examId: `#EX-${data.courseCode?.split("-")[0]}-${data.examNumber?.toString().padStart(2, "0")}`,
        createdAt: "Created just now",
      } as MockExamRecord;

      setExams((prev) => [newExam, ...prev]); // Đẩy lên đầu danh sách
      console.log("Đã tạo mới:", newExam);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: string, code: string) => {
    setExamToDelete({ id, code });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (examToDelete) {
      setExams(prev => prev.filter(ex => ex.id !== examToDelete.id));
      
      // Fix lỗi kẹt trang nếu xóa item cuối
      const newTotal = filteredExams.length - 1;
      if (newTotal > 0 && Math.ceil(newTotal / ITEMS_PER_PAGE) < currentPage) {
        setCurrentPage(prev => prev - 1);
      }
    }
    setIsDeleteModalOpen(false);
    setExamToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Toolbar) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm ID bộ đề hoặc mã khóa học..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }} // Reset về trang 1 khi gõ tìm kiếm
          />
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" /> Tạo bộ đề mới
        </button>
      </div>

      {/* Stats Bento Grid */}
      <MockExamStatsCards data={statsData} />

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header & Actions */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Danh sách Sample Exams
          </h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">
              <Filter className="w-4 h-4" /> Lọc
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">
              <Download className="w-4 h-4" /> Xuất dữ liệu
            </button>
          </div>
        </div>

        {/* The Table */}
        <MockExamTable
          data={paginatedExams}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onViewDetails={handleViewDetails} // Nối Navigation vào đây
          onDeleteClick={handleDeleteClick} // Nối sự kiện Xóa vào đây
        />
      </div>

      {/* AI Helper Banner */}
      <div className="mt-8 p-6 lg:p-8 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative gap-6">
        <div className="relative z-10 text-center md:text-left">
          <h3 className="text-xl font-black tracking-tight mb-2">
            Cần tối ưu ngân hàng đề thi?
          </h3>
          <p className="text-slate-400 text-sm max-w-lg">
            Sử dụng công cụ AI Generator để tự động tạo các bộ đề thi thử dựa
            trên tỉ lệ độ khó mong muốn cho từng hạng xe mà không cần chọn tay
            từng câu.
          </p>
        </div>
        <button className="relative z-10 px-6 py-3 bg-white text-slate-900 text-sm font-bold rounded-xl shadow-lg hover:shadow-white/20 transition-all flex items-center gap-2 active:scale-95 shrink-0">
          <Sparkles className="w-5 h-5 text-blue-600" /> Thử ngay AI Exam
        </button>
        {/* Decorative Background */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none bg-gradient-to-l from-blue-600 to-transparent"></div>
      </div>
      <MockExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingExam}
        onSubmit={handleSubmitExam}
      />
      
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa bộ đề thi thử"
        message={`Bạn có chắc chắn muốn xóa bộ đề "${examToDelete?.code}" không? Toàn bộ danh sách câu hỏi bên trong cũng sẽ bị xóa vĩnh viễn.`}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
