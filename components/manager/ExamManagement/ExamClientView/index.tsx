// src/app/(manager)/training-manager/exams/_components/ExamClientView/index.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, ClipboardCheck } from "lucide-react";
import { ExamBatch, Exam } from "@/types/exam";
import { EXAM_TABS } from "@/constants/exam-data";
import Link from "next/link";

import ExamBatchTable from "../ExamBatchTable";
import ExamCardList from "../ExamCardList";
import BatchStats from "../BatchStats";
import ExamBatchModal from "../../Modals/ExamBatchModal";
import ExamModal from "../../Modals/ExamModal";
import ConfirmModal from "@/components/ui/confirm-modal";

interface Props {
  initialBatches: ExamBatch[];
  initialExams: Exam[];
}

export default function ExamClientView({
  initialBatches,
  initialExams,
}: Props) {
  const [batches, setBatches] = useState<ExamBatch[]>(initialBatches);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  // 1. State quản lý UI cơ bản
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    initialBatches[0]?.id || "",
  );
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 2. State quản lý Modal Đợt thi (Batch)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ExamBatch | null>(null);

  // 3. State quản lý Modal Bài thi (Exam)
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // 4. State quản lý Modal Xóa (Delete Confirm)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<ExamBatch | null>(null);

  // 5. State quản lý Modal Xóa Bài thi (Delete Confirm)
  const [isExamConfirmModalOpen, setIsExamConfirmModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  // --- HANDLERS CHO ĐỢT THI (BATCH) ---
  const handleCreateBatch = () => {
    setEditingBatch(null);
    setIsBatchModalOpen(true);
  };

  const handleEditBatch = (batch: ExamBatch) => {
    setEditingBatch(batch);
    setIsBatchModalOpen(true);
  };

  // --- HANDLERS CHO BÀI THI (EXAM) ---
  const handleCreateExam = () => {
    setEditingExam(null);
    setIsExamModalOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setIsExamModalOpen(true);
  };

  // --- HANDLER CHO XÓA ĐỢT THI ---
  const handleDeleteClickBatch = (batch: ExamBatch) => {
    setBatchToDelete(batch);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDeleteBatch = () => {
    if (batchToDelete) {
      console.log("Đang gọi API xóa đợt thi:", batchToDelete.id);

      // Fake logic xóa UI: Lọc bỏ đợt thi vừa xóa khỏi danh sách
      // setBatches(prev => prev.filter(b => b.id !== batchToDelete.id));

      // Nếu đợt thi bị xóa đang được select, thì clear selection
      if (selectedBatchId === batchToDelete.id) {
        setSelectedBatchId("");
      }
    }
    setIsConfirmModalOpen(false);
    setBatchToDelete(null);
  };

  const handleCancelDeleteBatch = () => {
    setIsConfirmModalOpen(false);
    setBatchToDelete(null);
  };

  const handleDeleteExamClick = (exam: Exam) => {
  setExamToDelete(exam);
  setIsExamConfirmModalOpen(true);
};

const handleConfirmDeleteExam = () => {
  if (examToDelete) {
    console.log('Đang gọi API xóa bài thi:', examToDelete.id);
    
    // Cập nhật State: Lọc bỏ bài thi vừa xóa khỏi mảng
    setExams(prev => prev.filter(ex => ex.id !== examToDelete.id));
  }
  
  // Đóng modal và clear state
  setIsExamConfirmModalOpen(false);
  setExamToDelete(null);
};

const handleCancelDeleteExam = () => {
  setIsExamConfirmModalOpen(false);
  setExamToDelete(null);
};
  // =========================================================
  // LOGIC SUBMIT: ĐỢT THI (EXAM BATCH)
  // =========================================================
  const handleBatchSubmit = (data: Partial<ExamBatch>) => {
    if (data.id) {
      // 1. Logic Cập nhật (Edit)
      setBatches((prev) =>
        prev.map((batch) =>
          batch.id === data.id ? ({ ...batch, ...data } as ExamBatch) : batch,
        ),
      );
      console.log("Đã cập nhật Đợt thi:", data.id);
    } else {
      // 2. Logic Tạo mới (Create)
      const newBatch: ExamBatch = {
        ...data,
        id: `BATCH-${Math.floor(Math.random() * 10000)}`, // Fake ID
      } as ExamBatch;

      // Đẩy đợt thi mới lên đầu danh sách
      setBatches((prev) => [newBatch, ...prev]);
      console.log("Đã tạo mới Đợt thi:", newBatch.id);
    }

    // Đóng modal và dọn dẹp
    setIsBatchModalOpen(false);
    setEditingBatch(null);
  };

  // =========================================================
  // LOGIC SUBMIT: BÀI THI (EXAM)
  // =========================================================
  const handleExamSubmit = (data: Partial<Exam>) => {
    if (data.id) {
      // 1. Logic Cập nhật (Edit)
      setExams((prev) =>
        prev.map((exam) =>
          exam.id === data.id ? ({ ...exam, ...data } as Exam) : exam,
        ),
      );
      console.log("Đã cập nhật Bài thi:", data.id);
    } else {
      // 2. Logic Tạo mới (Create)
      const newExam: Exam = {
        ...data,
        id: `EXAM-${Math.floor(Math.random() * 10000)}`, // Fake ID
      } as Exam;

      // Thêm bài thi mới vào danh sách
      setExams((prev) => [...prev, newExam]);
      console.log("Đã tạo mới Bài thi:", newExam.id);
    }

    // Đóng modal và dọn dẹp
    setIsExamModalOpen(false);
    setEditingExam(null);
  };

  const handleCancelBatch = () => {
    setIsBatchModalOpen(false);
    setEditingBatch(null);
  };

  const handleCancelExam = () => {
    setIsExamModalOpen(false);
    setEditingExam(null);
  };

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredBatches = useMemo(() => {
    return initialBatches.filter((batch) => {
      const matchTab =
        activeTab === "all" ||
        (activeTab === "active" && batch.status === "ACTIVE") ||
        (activeTab === "upcoming" && batch.status === "UPCOMING") ||
        (activeTab === "completed" && batch.status === "COMPLETED");

      const query = searchQuery.toLowerCase();
      const matchSearch =
        batch.batchName.toLowerCase().includes(query) ||
        batch.courseId.toLowerCase().includes(query);

      return matchTab && matchSearch;
    });
  }, [initialBatches, activeTab, searchQuery]);

  const isSelectedBatchVisible = filteredBatches.some(
    (b) => b.id === selectedBatchId,
  );
  const currentBatchId = isSelectedBatchVisible
    ? selectedBatchId
    : filteredBatches[0]?.id;

  const selectedBatch = initialBatches.find((b) => b.id === currentBatchId);
  const currentExams = initialExams.filter(
    (ex) => ex.examBatchId === currentBatchId,
  );

  return (
    <>
      <div className="flex flex-col space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm kỳ thi, đợt thi hoặc khóa học..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            {/* Nút điều hướng sang trang Duyệt đăng ký */}
            <Link 
              href="/training-manager/registrations"
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95 w-full sm:w-auto whitespace-nowrap"
            >
              <ClipboardCheck className="w-4 h-4 text-blue-600" /> Duyệt đăng ký
            </Link>

            {/* Nút Tạo đợt thi mới */}
            <button
              onClick={handleCreateBatch}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95 w-full sm:w-auto whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Tạo đợt thi mới
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto">
          {EXAM_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 border-b-2 text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bảng Đợt Thi */}
        <ExamBatchTable
          batches={filteredBatches}
          selectedId={currentBatchId || ""}
          onSelect={setSelectedBatchId}
          onEditClick={handleEditBatch}
          onDeleteClick={handleDeleteClickBatch}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Danh sách Bài Thi */}
            <ExamCardList
              batchName={selectedBatch?.batchName}
              exams={currentExams}
              onAddClick={handleCreateExam}
              onEditClick={handleEditExam}
              onDeleteClick={handleDeleteExamClick}
            />
          </div>

          <div className="lg:col-span-1">
            <BatchStats
              batchName={selectedBatch?.batchName}
              examCount={currentExams.length}
            />
          </div>
        </div>
      </div>

      {/* --- RENDER MODALS --- */}
      <ExamBatchModal
        isOpen={isBatchModalOpen}
        onClose={handleCancelBatch}
        initialData={editingBatch}
        onSubmit={handleBatchSubmit} // <-- GẮN VÀO ĐÂY
      />

      <ExamModal
        isOpen={isExamModalOpen}
        onClose={handleCancelExam}
        batchContext={{
          id: currentBatchId || "",
          name: selectedBatch?.batchName || "",
        }}
        initialData={editingExam}
        onSubmit={handleExamSubmit}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Xác nhận xóa đợt thi"
        message={`Bạn có chắc chắn muốn xóa đợt thi "${batchToDelete?.batchName}" không? Toàn bộ dữ liệu phòng thi và danh sách thí sinh thuộc đợt này sẽ bị xóa vĩnh viễn.`}
        onCancel={handleCancelDeleteBatch}
        onConfirm={handleConfirmDeleteBatch}
      />

      <ConfirmModal
        isOpen={isExamConfirmModalOpen}
        title="Xác nhận xóa kỳ thi"
        message={`Bạn có chắc chắn muốn xóa kỳ thi "${examToDelete?.examName}" không? Dữ liệu liên quan sẽ bị xóa vĩnh viễn.`}
        onCancel={handleCancelDeleteExam}
        onConfirm={handleConfirmDeleteExam}
      />
    </>
  );
}
