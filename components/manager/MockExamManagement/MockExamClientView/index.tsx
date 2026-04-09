"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, FileQuestion, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { courseService } from "@/services/courseService";
import { mockExamService } from "@/services/mockExamService";
import { questionService } from "@/services/questionService";
import { MockExamRecord, MockExamStats } from "@/types/mock-exam";
import MockExamModal from "@/components/manager/Modals/MockExamModal";
import ConfirmModal from "@/components/ui/confirm-modal";

const ITEMS_PER_PAGE = 10;

export default function MockExamClientView() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);
  const [exams, setExams] = useState<MockExamRecord[]>([]);
  const [stats, setStats] = useState<MockExamStats>({
    totalExams: 0,
    activeExams: 0,
    totalQuestions: 0,
    theoryQuestions: 0,
    signQuestions: 0,
    simulationQuestions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<MockExamRecord | null>(null);

  const ensureToken = async () => {
    const token = await getToken({ skipCache: true });
    setAuthToken(token);
  };

  const fetchData = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      await ensureToken();
      const [courseData, examData, questionData] = await Promise.all([
        courseService.getAllAdminCourses(),
        mockExamService.getAll(),
        questionService.getAll(),
      ]);

      const courseMap = new Map(courseData.map((course) => [course.id, course]));
      const mappedExams = examData.map((exam) => {
        const course = courseMap.get(exam.courseId);
        return mockExamService.mapExam(exam, course?.courseName || "Chua gan khoa hoc", course?.licenseType || "");
      });

      setCourses(courseData);
      setExams(mappedExams);
      setStats({
        totalExams: mappedExams.length,
        activeExams: mappedExams.filter((exam) => exam.isActive).length,
        totalQuestions: questionData.length,
        theoryQuestions: questionData.filter((question) => question.category === "Ly thuyet").length,
        signQuestions: questionData.filter((question) => question.category === "Bien bao").length,
        simulationQuestions: questionData.filter((question) => question.category === "Sa hinh").length,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the tai danh sach de thi thu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoaded, isSignedIn]);

  const filteredExams = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) return exams;

    return exams.filter((exam) =>
      exam.courseName.toLowerCase().includes(keyword) ||
      exam.licenseType.toLowerCase().includes(keyword) ||
      String(exam.examNo).includes(keyword)
    );
  }, [exams, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredExams.length / ITEMS_PER_PAGE));
  const paginatedExams = filteredExams.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCreateExam = async (data: any) => {
    try {
      await ensureToken();
      await mockExamService.create(data);
      toast.success("Da tao de thi thu moi");
      setIsModalOpen(false);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the tao de thi thu");
    }
  };

  const handleDelete = async () => {
    if (!examToDelete) return;

    try {
      await ensureToken();
      await mockExamService.delete(examToDelete.id);
      toast.success("Da xoa de thi thu");
      setIsDeleteModalOpen(false);
      setExamToDelete(null);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the xoa de thi thu");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Dang tai de thi thu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Quản lý đề thi thử</h1>
          <p className="mt-2 text-sm text-slate-500">
            Tạo đề thi thử, quản lý câu hỏi theo từng đề và mở nhanh trang ngân hàng câu hỏi để bổ sung nội dung.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/training-manager/mock-exams/question-bank"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <FileQuestion className="h-4 w-4" />
            Ngân hàng câu hỏi
          </Link>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Tạo đề mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tong de thi thu</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{stats.totalExams}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">De dang hoat dong</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{stats.activeExams}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tong cau hoi</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{stats.totalQuestions}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Ly thuyet / Bien bao / Sa hinh</p>
          <p className="mt-3 text-lg font-black text-slate-900">
            {stats.theoryQuestions} / {stats.signQuestions} / {stats.simulationQuestions}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tim theo khoa hoc, hang bang hoac so de"
            className="w-full max-w-md rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Lam moi
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-bold text-slate-500">Đề</th>
                <th className="px-5 py-3 text-left font-bold text-slate-500">Khóa học</th>
                <th className="px-5 py-3 text-left font-bold text-slate-500">Thời lượng</th>
                <th className="px-5 py-3 text-left font-bold text-slate-500">Điểm đạt</th>
                <th className="px-5 py-3 text-left font-bold text-slate-500">Số câu hỏi</th>
                <th className="px-5 py-3 text-right font-bold text-slate-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">Đề số {exam.examNo}</div>
                    <div className="text-xs text-slate-400">Tạo ngày {new Date(exam.createdAt).toLocaleDateString("vi-VN")}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{exam.courseName}</div>
                    <div className="text-xs text-slate-500">Hạng {exam.licenseType || "Chua ro"}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{exam.durationMinutes} phút</td>
                  <td className="px-5 py-4 text-slate-700">{exam.passingScore}</td>
                  <td className="px-5 py-4 text-slate-700">{exam.totalQuestions}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/training-manager/mock-exams/${exam.id}`)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <BookOpen className="h-4 w-4" />
                        Xem chi tiết
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setExamToDelete(exam);
                          setIsDeleteModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedExams.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                    Chưa có đề thi thử phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
          <span>
            Hiển thị {filteredExams.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredExams.length)} trên tổng số {filteredExams.length} đề
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

      <MockExamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} courses={courses} onSubmit={handleCreateExam} />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xoa de thi thu"
        message={`Ban co chac chan muon xoa de thi thu so ${examToDelete?.examNo || ""} khong?`}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setExamToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
