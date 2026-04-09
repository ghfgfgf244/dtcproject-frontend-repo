"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileQuestion, Plus, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { courseService } from "@/services/courseService";
import { mockExamService } from "@/services/mockExamService";
import { questionService } from "@/services/questionService";
import { ExamQuestion, MockExamDetailInfo, QuestionBankItem, QuestionFormData } from "@/types/mock-exam-detail";
import QuestionCard from "../QuestionCard";
import MockExamQuestionModal from "@/components/manager/Modals/MockExamQuestionModal";
import AddQuestionFromBankModal from "@/components/manager/Modals/AddQuestionFromBankModal";
import ConfirmModal from "@/components/ui/confirm-modal";

interface Props {
  examId: string;
}

const ITEMS_PER_PAGE = 5;

export default function MockExamDetailClientView({ examId }: Props) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [info, setInfo] = useState<MockExamDetailInfo | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [bankQuestions, setBankQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("Tat ca");
  const [currentPage, setCurrentPage] = useState(1);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null);
  const [questionToRemove, setQuestionToRemove] = useState<number | null>(null);

  const ensureToken = async () => {
    const token = await getToken({ skipCache: true });
    setAuthToken(token);
  };

  const fetchData = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      await ensureToken();
      const [examDetail, courses, questionBank] = await Promise.all([
        mockExamService.getDetail(examId),
        courseService.getAllAdminCourses(),
        questionService.getAll(),
      ]);

      const courseMap = new Map(courses.map((course) => [course.id, course.courseName]));
      const mapped = mockExamService.mapExamDetail(examDetail, courseMap.get(examDetail.courseId) || "Chua gan khoa hoc");

      setInfo(mapped.info);
      setQuestions(mapped.questions);
      setBankQuestions(questionBank);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the tai chi tiet de thi thu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId, isLoaded, isSignedIn]);

  const filteredQuestions = useMemo(() => {
    if (filterCategory === "Tat ca") return questions;
    return questions.filter((question) => question.category === filterCategory);
  }, [filterCategory, questions]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE));
  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const syncExamQuestions = async (updatedQuestions: ExamQuestion[]) => {
    await ensureToken();
    await mockExamService.updateQuestions(
      examId,
      updatedQuestions.map((question, index) => ({
        questionId: question.id,
        order: index + 1,
      }))
    );
  };

  const handleAddQuestionsFromBank = async (selectedQuestions: QuestionBankItem[]) => {
    const updated = [
      ...questions,
      ...selectedQuestions
        .filter((question) => !questions.some((current) => current.id === question.id))
        .map((question, index) => ({ ...question, order: questions.length + index + 1 })),
    ];

    try {
      await syncExamQuestions(updated);
      setQuestions(updated);
      toast.success("Da them cau hoi vao de thi thu");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the them cau hoi vao de thi");
    }
  };

  const handleCreateQuestion = async (data: QuestionFormData) => {
    try {
      await ensureToken();
      const createdQuestion = await questionService.create(data);
      const updated = [...questions, { ...createdQuestion, order: questions.length + 1 }];
      await syncExamQuestions(updated);
      setQuestions(updated);
      setBankQuestions((prev) => [...prev, createdQuestion]);
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      toast.success("Da tao va them cau hoi vao de thi");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the tao cau hoi");
    }
  };

  const handleUpdateQuestion = async (data: QuestionFormData) => {
    if (!editingQuestion) return;

    try {
      await ensureToken();
      const updated = await questionService.update(editingQuestion.id, data);
      setQuestions((prev) => prev.map((question) => (question.id === updated.id ? { ...updated, order: question.order } : question)));
      setBankQuestions((prev) => prev.map((question) => (question.id === updated.id ? updated : question)));
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      toast.success("Da cap nhat cau hoi");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the cap nhat cau hoi");
    }
  };

  const handleRemoveQuestion = async () => {
    if (!questionToRemove) return;

    const updated = questions
      .filter((question) => question.id !== questionToRemove)
      .map((question, index) => ({ ...question, order: index + 1 }));

    try {
      await syncExamQuestions(updated);
      setQuestions(updated);
      setQuestionToRemove(null);
      toast.success("Da bo cau hoi khoi de thi");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the cap nhat danh sach cau hoi");
    }
  };

  if (loading || !info) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Dang tai chi tiet de thi thu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Đề thi thử số {info.title.replace("De thi thu so ", "")}</h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700">Khóa học: {info.course}</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 font-bold text-blue-700">Thời lượng: {info.durationMinutes} phút</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-700">Điểm đạt: {info.passingScore}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-700">Tổng câu hỏi: {info.totalQuestions}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/training-manager/mock-exams/question-bank"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <FileQuestion className="h-4 w-4" />
              Mở ngân hàng câu hỏi
            </Link>
            <button
              type="button"
              onClick={() => {
                setEditingQuestion(null);
                setIsQuestionModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
              Thêm câu hỏi mới
            </button>
            <button
              type="button"
              onClick={() => setIsBankModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Thêm từ ngân hàng
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-black text-slate-900">Danh sách câu hỏi trong đề</h2>
          <select
            value={filterCategory}
            onChange={(event) => {
              setFilterCategory(event.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Tat ca">Tat ca</option>
            <option value="Ly thuyet">Ly thuyet</option>
            <option value="Bien bao">Bien bao</option>
            <option value="Sa hinh">Sa hinh</option>
          </select>
        </div>

        <div className="space-y-4 px-5 py-5">
          {paginatedQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={(id) => {
                const target = questions.find((item) => item.id === id) || null;
                setEditingQuestion(target);
                setIsQuestionModalOpen(true);
              }}
              onDelete={(id) => setQuestionToRemove(id)}
            />
          ))}

          {paginatedQuestions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              Chưa có câu hỏi phù hợp trong đề thi này.
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

      <AddQuestionFromBankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        bankQuestions={bankQuestions}
        excludedQuestionIds={questions.map((question) => question.id)}
        onAddSelected={handleAddQuestionsFromBank}
      />

      <MockExamQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => {
          setIsQuestionModalOpen(false);
          setEditingQuestion(null);
        }}
        initialData={editingQuestion}
        onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
      />

      <ConfirmModal
        isOpen={questionToRemove !== null}
        title="Bo cau hoi khoi de thi"
        message="Ban co chac chan muon bo cau hoi nay khoi de thi thu khong?"
        onCancel={() => setQuestionToRemove(null)}
        onConfirm={handleRemoveQuestion}
      />
    </div>
  );
}
