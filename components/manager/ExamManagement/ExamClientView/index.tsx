// src/app/(manager)/training-manager/exams/_components/ExamClientView/index.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Plus, ClipboardCheck, Loader2 } from "lucide-react";
import { ExamBatch, Exam, ExamBatchStatus } from "@/types/exam";
import { EXAM_TABS } from "@/constants/exam-data";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { examService } from "@/services/examService";

import ExamBatchTable from "../ExamBatchTable";
import ExamCardList from "../ExamCardList";
import BatchStats from "../BatchStats";
import ExamBatchModal from "../../Modals/ExamBatchModal";
import ExamModal from "../../Modals/ExamModal";
import ConfirmModal from "@/components/ui/confirm-modal";

export default function ExamClientView() {
  const { getToken } = useAuth();
  
  // 1. State quản lý dữ liệu
  const [batches, setBatches] = useState<ExamBatch[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. State quản lý UI cơ bản
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLicenseType, setSelectedLicenseType] = useState<string>("all");

  // 3. State quản lý Modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ExamBatch | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<ExamBatch | null>(null);
  const [isExamConfirmModalOpen, setIsExamConfirmModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      setAuthToken(token);
      
      const [fetchedBatches, fetchedExams] = await Promise.all([
        examService.getAllExamBatches(),
        examService.getAllExams()
      ]);
      
      setBatches(fetchedBatches);
      setExams(fetchedExams);
      
      if (fetchedBatches.length > 0 && !selectedBatchId) {
        setSelectedBatchId(fetchedBatches[0].id);
      }
    } catch (err: any) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu đợt thi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [getToken, selectedBatchId]);

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleCreateBatch = () => {
    setEditingBatch(null);
    setIsBatchModalOpen(true);
  };

  const handleEditBatch = (batch: ExamBatch) => {
    setEditingBatch(batch);
    setIsBatchModalOpen(true);
  };

  const handleCreateExam = () => {
    setEditingExam(null);
    setIsExamModalOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setIsExamModalOpen(true);
  };

  const handleDeleteClickBatch = (batch: ExamBatch) => {
    setBatchToDelete(batch);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDeleteBatch = async () => {
    if (!batchToDelete) return;
    try {
      const token = await getToken();
      setAuthToken(token);
      await examService.deleteExamBatch(batchToDelete.id);
      
      setBatches(prev => prev.filter(b => b.id !== batchToDelete.id));
      if (selectedBatchId === batchToDelete.id) {
        setSelectedBatchId("");
      }
    } catch (err) {
      alert("Lỗi khi xóa đợt thi");
    } finally {
      setIsConfirmModalOpen(false);
      setBatchToDelete(null);
    }
  };

  const handleDeleteExamClick = (exam: Exam) => {
    setExamToDelete(exam);
    setIsExamConfirmModalOpen(true);
  };

  const handleConfirmDeleteExam = async () => {
    if (!examToDelete) return;
    try {
      const token = await getToken();
      setAuthToken(token);
      await examService.deleteExam(examToDelete.id);
      setExams(prev => prev.filter(ex => ex.id !== examToDelete.id));
    } catch (err) {
      alert("Lỗi khi xóa bài thi");
    } finally {
      setIsExamConfirmModalOpen(false);
      examToDelete && setExamToDelete(null);
    }
  };

  const handleBatchSubmit = async (data: Partial<ExamBatch>) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      
      if (data.id) {
        const updated = await examService.updateExamBatch(data.id, data);
        setBatches(prev => prev.map(b => b.id === updated.id ? updated : b));
      } else {
        const created = await examService.createExamBatch(data);
        setBatches(prev => [created, ...prev]);
        setSelectedBatchId(created.id);
      }
      setIsBatchModalOpen(false);
    } catch (err) {
      alert("Lỗi khi lưu đợt thi");
    }
  };

  const handleExamSubmit = async (data: Partial<Exam>) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      
      // Ensure score defaults and courseId
      const submissionData = {
        ...data,
        totalScore: data.totalScore || 100,
        passScore: data.passScore || 40
      };

      console.log("POST /api/Exam Payload:", submissionData);

      if (data.id) {
        const updated = await examService.updateExam(data.id, submissionData);
        setExams(prev => prev.map(e => e.id === updated.id ? updated : e));
      } else {
        const created = await examService.createExam(submissionData);
        setExams(prev => [...prev, created]);
      }
      setIsExamModalOpen(false);
    } catch (err: any) {
      console.error("Exam submit error:", err);
      const backendError = err.response?.data?.message || err.response?.data?.errors?.join(', ') || "Lỗi không xác định";
      alert(`Lỗi khi lưu bài thi: ${backendError}`);
    }
  };

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchTab = activeTab === "all" || batch.status === activeTab;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        batch.batchName.toLowerCase().includes(query);

      return matchTab && matchSearch;
    });
  }, [batches, activeTab, searchQuery]);

  const currentBatchId = filteredBatches.some(b => b.id === selectedBatchId)
    ? selectedBatchId
    : filteredBatches[0]?.id || "";

  const selectedBatch = batches.find((b) => b.id === currentBatchId);
  const currentExams = exams
    .filter((ex) => ex.examBatchId === currentBatchId)
    .filter((ex) => selectedLicenseType === "all" || ex.licenseType === selectedLicenseType);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Đang tải dữ liệu kỳ thi...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

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
            <Link 
              href="/training-manager/registrations"
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95 w-full sm:w-auto whitespace-nowrap"
            >
              <ClipboardCheck className="w-4 h-4 text-blue-600" /> Duyệt đăng ký
            </Link>

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
          selectedId={currentBatchId}
          onSelect={setSelectedBatchId}
          onEditClick={handleEditBatch}
          onDeleteClick={handleDeleteClickBatch}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExamCardList
              batchName={selectedBatch?.batchName}
              exams={currentExams}
              onAddClick={handleCreateExam}
              onEditClick={handleEditExam}
              onDeleteClick={handleDeleteExamClick}
              selectedLicenseType={selectedLicenseType}
              onLicenseFilterChange={setSelectedLicenseType}
            />
          </div>

          <div className="lg:col-span-1">
            <BatchStats
              batchName={selectedBatch?.batchName}
              examCount={currentExams.length}
              currentCandidates={selectedBatch?.currentCandidates}
              maxCandidates={selectedBatch?.maxCandidates}
            />
          </div>
        </div>
      </div>

      {/* --- RENDER MODALS --- */}
      <ExamBatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        initialData={editingBatch}
        onSubmit={handleBatchSubmit}
      />

      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        batchContext={{
          id: currentBatchId,
          name: selectedBatch?.batchName || "",
          courseId: "", // Removing courseId from batch context as individual exams have their own courses
        }}
        initialData={editingExam}
        onSubmit={handleExamSubmit}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Xác nhận xóa đợt thi"
        message={`Bạn có chắc chắn muốn xóa đợt thi "${batchToDelete?.batchName}" không? Toàn bộ dữ liệu phòng thi và danh sách thí sinh thuộc đợt này sẽ bị xóa vĩnh viễn.`}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDeleteBatch}
      />

      <ConfirmModal
        isOpen={isExamConfirmModalOpen}
        title="Xác nhận xóa kỳ thi"
        message={`Bạn có chắc chắn muốn xóa kỳ thi "${examToDelete?.examName}" không? Dữ liệu liên quan sẽ bị xóa vĩnh viễn.`}
        onCancel={() => setIsExamConfirmModalOpen(false)}
        onConfirm={handleConfirmDeleteExam}
      />
    </>
  );
}
