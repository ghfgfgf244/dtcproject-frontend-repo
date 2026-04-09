"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, FileUp, Plus, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { questionService } from "@/services/questionService";
import { QuestionBankItem, QuestionFormData } from "@/types/mock-exam-detail";
import QuestionCard from "@/components/manager/MockExamManagement/MockExamDetail/QuestionCard";
import MockExamQuestionModal from "@/components/manager/Modals/MockExamQuestionModal";
import ConfirmModal from "@/components/ui/confirm-modal";

const ITEMS_PER_PAGE = 8;

export default function QuestionBankClientView() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Tat ca");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionBankItem | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);

  const ensureToken = async () => {
    const token = await getToken({ skipCache: true });
    setAuthToken(token);
  };

  const fetchQuestions = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      await ensureToken();
      const data = await questionService.getAll();
      setQuestions(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the tai ngan hang cau hoi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [isLoaded, isSignedIn]);

  const filteredQuestions = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesCategory = category === "Tat ca" || question.category === category;
      const matchesKeyword =
        keyword.length === 0 ||
        question.content.toLowerCase().includes(keyword) ||
        String(question.id).includes(keyword);

      return matchesCategory && matchesKeyword;
    });
  }, [category, questions, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE));
  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCreate = async (data: QuestionFormData) => {
    try {
      await ensureToken();
      const created = await questionService.create(data);
      setQuestions((prev) => [{ ...created, order: 0 }, ...prev]);
      setIsModalOpen(false);
      toast.success("Da them cau hoi moi");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the tao cau hoi");
    }
  };

  const handleUpdate = async (data: QuestionFormData) => {
    if (!editingQuestion) return;

    try {
      await ensureToken();
      const updated = await questionService.update(editingQuestion.id, data);
      setQuestions((prev) => prev.map((question) => (question.id === updated.id ? { ...updated, order: question.order } : question)));
      setEditingQuestion(null);
      setIsModalOpen(false);
      toast.success("Da cap nhat cau hoi");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the cap nhat cau hoi");
    }
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;

    try {
      await ensureToken();
      await questionService.delete(questionToDelete);
      setQuestions((prev) => prev.filter((question) => question.id !== questionToDelete));
      setQuestionToDelete(null);
      toast.success("Da xoa cau hoi");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the xoa cau hoi");
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    try {
      setImporting(true);
      await ensureToken();
      const result = await questionService.importFile(file);
      setQuestions((prev) => [...result.questions, ...prev]);
      if (result.warnings.length > 0) {
        toast.success(`Da nhap ${result.importedCount} cau hoi. Co ${result.warnings.length} canh bao trong file.`);
      } else {
        toast.success(`Da nhap ${result.importedCount} cau hoi tu file`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the nhap file cau hoi");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await ensureToken();
      await questionService.downloadTemplate();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the tai file mau");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Dang tai ngan hang cau hoi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Ngân hàng câu hỏi</h1>
            <p className="mt-2 text-sm text-slate-500">
              Quản lý câu hỏi theo nhóm Lý thuyết, Biển báo, Sa hình và nhập nhanh bằng file Excel.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/training-manager/mock-exams"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Quay lại danh sách đề
            </Link>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Tải file Excel mẫu
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
              <FileUp className="h-4 w-4" />
              {importing ? "Dang nhap file..." : "Nhap file Excel"}
              <input type="file" accept=".xlsx,.csv" className="hidden" onChange={handleImportFile} disabled={importing} />
            </label>
            <button
              type="button"
              onClick={() => {
                setEditingQuestion(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Thêm câu hỏi
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-4 border-b border-slate-100 px-5 py-4 md:grid-cols-[1fr_220px]">
          <input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tim theo ID hoac noi dung cau hoi"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Tat ca">Tat ca</option>
            <option value="Ly thuyet">Ly thuyet</option>
            <option value="Bien bao">Bien bao</option>
            <option value="Sa hinh">Sa hinh</option>
          </select>
        </div>

        <div className="space-y-4 px-5 py-5">
          {paginatedQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={{ ...question, order: (currentPage - 1) * ITEMS_PER_PAGE + index + 1 }}
              onEdit={(id) => {
                const target = questions.find((item) => item.id === id) || null;
                setEditingQuestion(target);
                setIsModalOpen(true);
              }}
              onDelete={(id) => setQuestionToDelete(id)}
            />
          ))}

          {paginatedQuestions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              Chưa có câu hỏi phù hợp.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
          <span>
            Hiển thị {filteredQuestions.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuestions.length)} trên tổng số {filteredQuestions.length} câu hỏi
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-xs font-bold text-slate-700">
              {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      <MockExamQuestionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuestion(null);
        }}
        initialData={editingQuestion}
        onSubmit={editingQuestion ? handleUpdate : handleCreate}
      />

      <ConfirmModal
        isOpen={questionToDelete !== null}
        title="Xoa cau hoi"
        message="Ban co chac chan muon xoa cau hoi nay khoi ngan hang cau hoi khong?"
        onCancel={() => setQuestionToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
