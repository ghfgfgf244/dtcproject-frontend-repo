"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Loader2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { Exam, ExamBatch, ExamBatchScopeType } from "@/types/exam";
import { EXAM_TABS } from "@/constants/exam-data";
import { examService } from "@/services/examService";
import ExamBatchTable from "../ExamBatchTable";
import ExamCardList from "../ExamCardList";
import BatchStats from "../BatchStats";
import ExamBatchModal from "../../Modals/ExamBatchModal";
import ExamModal from "../../Modals/ExamModal";
import ConfirmModal from "@/components/ui/confirm-modal";

const BATCHES_PER_PAGE = 5;
const EXAMS_PER_PAGE = 4;

export default function ExamClientView() {
  const { getToken } = useAuth();
  const nationalBatchReadOnlyMessage =
    "Đợt thi quốc gia chỉ hiển thị để theo dõi. Bạn không thể thêm, sửa hoặc xóa bài thi trong đợt này.";
  const [batches, setBatches] = useState<ExamBatch[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [activeTab, setActiveTab] = useState<string | number>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLicenseType, setSelectedLicenseType] = useState("all");
  const [batchPage, setBatchPage] = useState(1);
  const [examPage, setExamPage] = useState(1);

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ExamBatch | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<ExamBatch | null>(null);
  const [isExamConfirmModalOpen, setIsExamConfirmModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      setAuthToken(token);

      const [fetchedBatches, fetchedExams] = await Promise.all([
        examService.getAllExamBatches(),
        examService.getAllExams(),
      ]);

      setBatches(fetchedBatches);
      setExams(fetchedExams);

      if (fetchedBatches.length > 0 && !selectedBatchId) {
        setSelectedBatchId(fetchedBatches[0].id);
      }
    } catch (fetchError) {
      console.error("Failed to load exam data:", fetchError);
      setError("Không thể tải dữ liệu đợt thi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [getToken, selectedBatchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateBatch = () => {
    setEditingBatch(null);
    setIsBatchModalOpen(true);
  };

  const handleEditBatch = (batch: ExamBatch) => {
    setEditingBatch(batch);
    setIsBatchModalOpen(true);
  };

  const handleCreateExam = () => {
    const selectedBatch = batches.find((batch) => batch.id === selectedBatchId);

    if (selectedBatch?.scopeType === ExamBatchScopeType.National) {
      window.alert(nationalBatchReadOnlyMessage);
      return;
    }

    setEditingExam(null);
    setIsExamModalOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    const currentBatch = batches.find((batch) => batch.id === exam.examBatchId);

    if (currentBatch?.scopeType === ExamBatchScopeType.National) {
      window.alert(nationalBatchReadOnlyMessage);
      return;
    }

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

      setBatches((prev) => prev.filter((item) => item.id !== batchToDelete.id));
      if (selectedBatchId === batchToDelete.id) {
        setSelectedBatchId("");
      }
    } catch (deleteError) {
      console.error(deleteError);
      window.alert("Không thể xóa đợt thi đã chọn.");
    } finally {
      setIsConfirmModalOpen(false);
      setBatchToDelete(null);
    }
  };

  const handleDeleteExamClick = (exam: Exam) => {
    const currentBatch = batches.find((batch) => batch.id === exam.examBatchId);

    if (currentBatch?.scopeType === ExamBatchScopeType.National) {
      window.alert(nationalBatchReadOnlyMessage);
      return;
    }

    setExamToDelete(exam);
    setIsExamConfirmModalOpen(true);
  };

  const handleConfirmDeleteExam = async () => {
    if (!examToDelete) return;

    try {
      const token = await getToken();
      setAuthToken(token);
      await examService.deleteExam(examToDelete.id);
      setExams((prev) => prev.filter((item) => item.id !== examToDelete.id));
    } catch (deleteError) {
      console.error(deleteError);
      window.alert("Không thể xóa bài thi đã chọn.");
    } finally {
      setIsExamConfirmModalOpen(false);
      setExamToDelete(null);
    }
  };

  const handleBatchSubmit = async (data: Partial<ExamBatch>) => {
    try {
      const token = await getToken();
      setAuthToken(token);

      if (data.id) {
        const updated = await examService.updateExamBatch(data.id, data);
        setBatches((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await examService.createExamBatch(data);
        setBatches((prev) => [created, ...prev]);
        setSelectedBatchId(created.id);
      }

      setIsBatchModalOpen(false);
    } catch (submitError) {
      console.error(submitError);
      window.alert("Không thể lưu đợt thi.");
    }
  };

  const handleExamSubmit = async (data: Partial<Exam>) => {
    try {
      const token = await getToken();
      setAuthToken(token);

      if (data.id) {
        const updated = await examService.updateExam(data.id, data);
        setExams((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await examService.createExam(data);
        setExams((prev) => [...prev, created]);
      }

      setIsExamModalOpen(false);
    } catch (submitError: any) {
      console.error("Exam submit error:", submitError);
      const backendError =
        submitError.response?.data?.message ||
        submitError.response?.data?.errors?.join(", ") ||
        "Lỗi không xác định";
      window.alert(`Không thể lưu bài thi: ${backendError}`);
    }
  };

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchTab = activeTab === "all" || batch.status === activeTab;
      const query = searchQuery.toLowerCase();
      const matchSearch = batch.batchName.toLowerCase().includes(query);
      return matchTab && matchSearch;
    });
  }, [activeTab, batches, searchQuery]);

  useEffect(() => {
    setBatchPage(1);
  }, [activeTab, batches.length, searchQuery]);

  const totalBatchPages = Math.max(
    1,
    Math.ceil(filteredBatches.length / BATCHES_PER_PAGE),
  );

  const paginatedBatches = useMemo(() => {
    const start = (batchPage - 1) * BATCHES_PER_PAGE;
    return filteredBatches.slice(start, start + BATCHES_PER_PAGE);
  }, [batchPage, filteredBatches]);

  const currentBatchId = filteredBatches.some((batch) => batch.id === selectedBatchId)
    ? selectedBatchId
    : filteredBatches[0]?.id || "";

  const selectedBatch = batches.find((batch) => batch.id === currentBatchId) || null;
  const selectedBatchIsNational =
    selectedBatch?.scopeType === ExamBatchScopeType.National;

  const currentExams = exams
    .filter((exam) => exam.examBatchId === currentBatchId)
    .filter(
      (exam) =>
        selectedLicenseType === "all" ||
        String(exam.licenseType) === selectedLicenseType,
    );

  useEffect(() => {
    setExamPage(1);
  }, [currentBatchId, exams.length, selectedLicenseType]);

  const totalExamPages = Math.max(1, Math.ceil(currentExams.length / EXAMS_PER_PAGE));
  const paginatedExams = useMemo(() => {
    const start = (examPage - 1) * EXAMS_PER_PAGE;
    return currentExams.slice(start, start + EXAMS_PER_PAGE);
  }, [currentExams, examPage]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="font-medium text-slate-500">Đang tải dữ liệu kỳ thi...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-6">
        {error ? (
          <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm kỳ thi hoặc đợt thi..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex w-full shrink-0 flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/training-manager/registrations"
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 sm:w-auto"
            >
              <ClipboardCheck className="h-4 w-4 text-blue-600" />
              Duyệt đăng ký
            </Link>

            <button
              onClick={handleCreateBatch}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Tạo đợt thi mới
            </button>
          </div>
        </div>

        <div className="flex gap-8 overflow-x-auto border-b border-slate-200">
          {EXAM_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 pb-4 text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ExamBatchTable
          batches={paginatedBatches}
          selectedId={currentBatchId}
          currentPage={batchPage}
          totalPages={totalBatchPages}
          totalItems={filteredBatches.length}
          itemsPerPage={BATCHES_PER_PAGE}
          onPageChange={setBatchPage}
          onSelect={setSelectedBatchId}
          onEditClick={handleEditBatch}
          onDeleteClick={handleDeleteClickBatch}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ExamCardList
              batchName={selectedBatch?.batchName}
              exams={paginatedExams}
              currentPage={examPage}
              totalPages={totalExamPages}
              totalItems={currentExams.length}
              itemsPerPage={EXAMS_PER_PAGE}
              onPageChange={setExamPage}
              onAddClick={handleCreateExam}
              onEditClick={handleEditExam}
              onDeleteClick={handleDeleteExamClick}
              selectedLicenseType={selectedLicenseType}
              onLicenseFilterChange={setSelectedLicenseType}
              canManageExams={!selectedBatchIsNational && !!selectedBatch}
              readOnlyReason={
                selectedBatchIsNational ? nationalBatchReadOnlyMessage : undefined
              }
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
          courseId: "",
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
        title="Xác nhận xóa bài thi"
        message={`Bạn có chắc chắn muốn xóa bài thi "${examToDelete?.examName}" không? Dữ liệu liên quan sẽ bị xóa vĩnh viễn.`}
        onCancel={() => setIsExamConfirmModalOpen(false)}
        onConfirm={handleConfirmDeleteExam}
      />
    </>
  );
}
