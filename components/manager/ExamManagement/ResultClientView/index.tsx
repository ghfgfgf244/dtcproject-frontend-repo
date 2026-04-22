"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Loader2,
  PencilLine,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { courseService } from "@/services/courseService";
import { examService } from "@/services/examService";
import { registrationService } from "@/services/registrationService";
import { termService } from "@/services/termService";
import { Course } from "@/types/course";
import { ExamBatch, ExamBatchScopeType } from "@/types/exam";
import {
  ExamScoreboardItem,
  ExamScoreboardResponse,
  SortDirection,
  UpsertStudentExamScoresRequest,
} from "@/types/exam-result";
import { TermRegistrationCandidate } from "@/types/registration";
import { TermRecord } from "@/types/term";

const PAGE_SIZE = 10;

const EMPTY_RESPONSE: ExamScoreboardResponse = {
  page: 1,
  pageSize: PAGE_SIZE,
  totalItems: 0,
  totalPages: 0,
  totalPassed: 0,
  averageOverallScore: 0,
  hasSimulationExam: false,
  items: [],
};

interface ScoreModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  item?: ExamScoreboardItem;
}

interface ScoreModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  candidates: TermRegistrationCandidate[];
  hasSimulationExam: boolean;
  initialItem?: ExamScoreboardItem;
  onClose: () => void;
  onSubmit: (payload: {
    studentId: string;
    theoryScore?: number | null;
    practiceScore?: number | null;
    simulationScore?: number | null;
  }) => Promise<void>;
}

interface ScoreFormState {
  studentId: string;
  theoryScore: string;
  practiceScore: string;
  simulationScore: string;
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN");
}

function formatScore(value?: number | null) {
  if (value === null || value === undefined) return "--";
  return Number(value).toFixed(1);
}

function buildInitialForm(
  mode: "create" | "edit",
  item?: ExamScoreboardItem,
): ScoreFormState {
  if (mode === "edit" && item) {
    return {
      studentId: item.studentId,
      theoryScore: item.theoryScore?.toString() ?? "",
      practiceScore: item.practiceScore?.toString() ?? "",
      simulationScore: item.simulationScore?.toString() ?? "",
    };
  }

  return {
    studentId: "",
    theoryScore: "",
    practiceScore: "",
    simulationScore: "",
  };
}

function ScoreModal({
  isOpen,
  mode,
  candidates,
  hasSimulationExam,
  initialItem,
  onClose,
  onSubmit,
}: ScoreModalProps) {
  const [form, setForm] = useState<ScoreFormState>(buildInitialForm(mode, initialItem));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setForm(buildInitialForm(mode, initialItem));
    setError("");
  }, [initialItem, isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.studentId) {
      setError("Vui lòng chọn học viên.");
      return;
    }

    if (!form.theoryScore.trim() || !form.practiceScore.trim()) {
      setError("Vui lòng nhập đủ điểm lý thuyết và thực hành.");
      return;
    }

    if (hasSimulationExam && !form.simulationScore.trim()) {
      setError("Vui lòng nhập điểm mô phỏng.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({
        studentId: form.studentId,
        theoryScore: form.theoryScore ? Number(form.theoryScore) : null,
        practiceScore: form.practiceScore ? Number(form.practiceScore) : null,
        simulationScore:
          hasSimulationExam && form.simulationScore
            ? Number(form.simulationScore)
            : null,
      });
      onClose();
    } catch (submitError: any) {
      setError(submitError?.message || "Không thể lưu điểm thi cho học viên này.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-auto my-10 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {mode === "edit" ? "Cập nhật điểm thi" : "Nhập điểm thi"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Nhập điểm theo cùng một lần lưu cho lý thuyết, thực hành
              {hasSimulationExam ? " và mô phỏng." : "."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Học viên
            </label>
            <select
              value={form.studentId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, studentId: event.target.value }))
              }
              disabled={mode === "edit"}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500"
            >
              <option value="">-- Chọn học viên --</option>
              {candidates.map((candidate) => (
                <option key={candidate.studentId} value={candidate.studentId}>
                  {candidate.studentName} - {candidate.courseName}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`grid gap-4 ${
              hasSimulationExam ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Điểm lý thuyết
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.theoryScore}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, theoryScore: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Điểm thực hành
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.practiceScore}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, practiceScore: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500"
              />
            </div>

            {hasSimulationExam ? (
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Điểm mô phỏng
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.simulationScore}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      simulationScore: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500"
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Lưu điểm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResultClientView() {
  const { getToken } = useAuth();
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [terms, setTerms] = useState<TermRecord[]>([]);
  const [batches, setBatches] = useState<ExamBatch[]>([]);
  const [scoreboard, setScoreboard] = useState<ExamScoreboardResponse>(EMPTY_RESPONSE);
  const [candidates, setCandidates] = useState<TermRegistrationCandidate[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTermId, setSelectedTermId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [importing, setImporting] = useState(false);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [modalState, setModalState] = useState<ScoreModalState>({
    isOpen: false,
    mode: "create",
  });

  const withAuth = useCallback(async () => {
    const token = await getToken();
    setAuthToken(token);
  }, [getToken]);

  const termOptions = useMemo(() => {
    return terms
      .filter((term) => !selectedCourseId || term.courseId === selectedCourseId)
      .sort(
        (left, right) =>
          new Date(right.startDate).getTime() - new Date(left.startDate).getTime(),
      );
  }, [selectedCourseId, terms]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) || null,
    [courses, selectedCourseId],
  );

  const selectedTerm = useMemo(
    () => terms.find((term) => term.id === selectedTermId) || null,
    [selectedTermId, terms],
  );

  const selectedBatch = useMemo(
    () => batches.find((batch) => batch.id === selectedBatchId) || null,
    [batches, selectedBatchId],
  );

  const fetchScoreboard = useCallback(
    async (page: number) => {
      if (!selectedCourseId || !selectedTermId || !selectedBatchId) {
        setScoreboard(EMPTY_RESPONSE);
        return;
      }

      setLoadingTable(true);

      try {
        await withAuth();
        const response = await examService.getScoreboard({
          courseId: selectedCourseId,
          termId: selectedTermId,
          examBatchId: selectedBatchId,
          search: search || undefined,
          sortDirection,
          page,
          pageSize: PAGE_SIZE,
        });
        setScoreboard(response);
      } catch (error) {
        console.error(error);
        setScoreboard(EMPTY_RESPONSE);
        setBanner({
          type: "error",
          message: "Không thể tải danh sách điểm thi theo bộ lọc đã chọn.",
        });
      } finally {
        setLoadingTable(false);
      }
    },
    [search, selectedBatchId, selectedCourseId, selectedTermId, sortDirection, withAuth],
  );

  const fetchCandidates = useCallback(async () => {
    if (!selectedTermId || !selectedBatchId) {
      setCandidates([]);
      return;
    }

    setLoadingCandidates(true);

    try {
      await withAuth();
      const response = await registrationService.getTermCandidates(
        selectedTermId,
        selectedBatchId,
      );
      setCandidates(response);
    } catch (error) {
      console.error(error);
      setCandidates([]);
      setBanner({
        type: "error",
        message: "Không thể tải danh sách học viên đủ điều kiện nhập điểm.",
      });
    } finally {
      setLoadingCandidates(false);
    }
  }, [selectedBatchId, selectedTermId, withAuth]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const bootstrap = async () => {
      setLoadingFilters(true);

      try {
        const [courseData, termData, batchData] = await Promise.all([
          courseService.getAllAdminCourses(),
          termService.getAllTerms(),
          examService.getAllExamBatches(),
        ]);

        setCourses(courseData);
        setTerms(termData);
        setBatches(batchData);

        const firstCourseId = courseData[0]?.id ?? "";
        const firstTermId =
          termData
            .filter((term) => term.courseId === firstCourseId)
            .sort(
              (left, right) =>
                new Date(right.startDate).getTime() -
                new Date(left.startDate).getTime(),
            )[0]?.id ?? "";
        const firstBatchId =
          [...batchData].sort(
            (left, right) =>
              new Date(right.examStartDate).getTime() -
              new Date(left.examStartDate).getTime(),
          )[0]?.id ?? "";

        setSelectedCourseId(firstCourseId);
        setSelectedTermId(firstTermId);
        setSelectedBatchId(firstBatchId);
      } catch (error) {
        console.error(error);
        setBanner({
          type: "error",
          message: "Không thể khởi tạo dữ liệu bộ lọc cho trang điểm thi.",
        });
      } finally {
        setLoadingFilters(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setSelectedTermId("");
      return;
    }

    if (termOptions.length === 0) {
      setSelectedTermId("");
      return;
    }

    if (!termOptions.some((term) => term.id === selectedTermId)) {
      setSelectedTermId(termOptions[0].id);
    }
  }, [selectedCourseId, selectedTermId, termOptions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedBatchId, selectedCourseId, selectedTermId, sortDirection]);

  useEffect(() => {
    fetchScoreboard(currentPage);
  }, [currentPage, fetchScoreboard]);

  const openCreateModal = async () => {
    if (!selectedCourseId || !selectedTermId || !selectedBatchId) {
      setBanner({
        type: "error",
        message: "Vui lòng chọn khóa học, kỳ học và đợt thi trước khi nhập điểm.",
      });
      return;
    }

    await fetchCandidates();
    setModalState({ isOpen: true, mode: "create" });
  };

  const openEditModal = async (item: ExamScoreboardItem) => {
    await fetchCandidates();
    setModalState({ isOpen: true, mode: "edit", item });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: "create" });
  };

  const handleSaveScores = async (payload: {
    studentId: string;
    theoryScore?: number | null;
    practiceScore?: number | null;
    simulationScore?: number | null;
  }) => {
    await withAuth();

    const request: UpsertStudentExamScoresRequest = {
      courseId: selectedCourseId,
      termId: selectedTermId,
      examBatchId: selectedBatchId,
      studentId: payload.studentId,
      theoryScore: payload.theoryScore,
      practiceScore: payload.practiceScore,
      simulationScore: payload.simulationScore,
    };

    await examService.upsertScoreboard(request);
    setBanner({
      type: "success",
      message: "Đã lưu điểm thi thành công.",
    });
    await fetchScoreboard(currentPage);
  };

  const handleDownloadTemplate = async () => {
    if (!selectedCourseId || !selectedTermId || !selectedBatchId) {
      setBanner({
        type: "error",
        message: "Vui lòng chọn khóa học, kỳ học và đợt thi trước khi tải file mẫu.",
      });
      return;
    }

    setDownloadingTemplate(true);

    try {
      await withAuth();
      const blob = await examService.downloadScoreboardTemplate({
        courseId: selectedCourseId,
        termId: selectedTermId,
        examBatchId: selectedBatchId,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mau-import-diem-thi.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setBanner({
        type: "error",
        message: "Không thể tải file mẫu nhập điểm.",
      });
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedCourseId || !selectedTermId || !selectedBatchId) {
      setBanner({
        type: "error",
        message: "Vui lòng chọn khóa học, kỳ học và đợt thi trước khi import điểm.",
      });
      event.target.value = "";
      return;
    }

    setImporting(true);

    try {
      await withAuth();
      const response = await examService.importScoreboard(file, {
        courseId: selectedCourseId,
        termId: selectedTermId,
        examBatchId: selectedBatchId,
      });

      const warningText =
        response.warnings.length > 0
          ? ` Có ${response.warnings.length} dòng cảnh báo.`
          : "";

      setBanner({
        type: "success",
        message: `Đã import ${response.importedCount} dòng điểm thi.${warningText}`,
      });
      await fetchScoreboard(currentPage);
    } catch (error: any) {
      console.error(error);
      setBanner({
        type: "error",
        message: error?.response?.data?.message || "Không thể import file điểm thi.",
      });
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  const startItem =
    scoreboard.totalItems === 0 ? 0 : (scoreboard.page - 1) * scoreboard.pageSize + 1;
  const endItem =
    scoreboard.totalItems === 0
      ? 0
      : Math.min(scoreboard.page * scoreboard.pageSize, scoreboard.totalItems);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 grid gap-4 xl:grid-cols-[repeat(4,minmax(0,1fr))_220px]">
          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Khóa học
            </label>
            <select
              value={selectedCourseId}
              onChange={(event) => setSelectedCourseId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500"
            >
              <option value="">-- Chọn khóa học --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Kỳ học
            </label>
            <select
              value={selectedTermId}
              onChange={(event) => setSelectedTermId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500"
            >
              <option value="">-- Chọn kỳ học --</option>
              {termOptions.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name} ({formatDate(term.startDate)} - {formatDate(term.endDate)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Đợt thi
            </label>
            <select
              value={selectedBatchId}
              onChange={(event) => setSelectedBatchId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500"
            >
              <option value="">-- Chọn đợt thi --</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  [{batch.scopeType === ExamBatchScopeType.National ? "Quốc gia" : "Trung tâm"}]{" "}
                  {batch.batchName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Tìm học viên
            </label>
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Nhập tên, email, số điện thoại"
                className="w-full bg-transparent px-3 py-3 text-sm font-medium text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Sắp xếp điểm
            </label>
            <select
              value={sortDirection}
              onChange={(event) => setSortDirection(event.target.value as SortDirection)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500"
            >
              <option value="desc">Điểm cao đến thấp</option>
              <option value="asc">Điểm thấp đến cao</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nhập điểm học viên
          </button>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={downloadingTemplate}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloadingTemplate ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Tải file mẫu
          </button>

          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-black text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Import điểm từ Excel
          </button>

          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>

        {selectedBatch?.scopeType === ExamBatchScopeType.National ? (
          <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-800">
            Bạn đang nhập điểm cho <strong>đợt thi quốc gia</strong>. Bạn vẫn có thể
            nhập, cập nhật và import điểm, nhưng thông tin cấu hình đợt thi và bài
            thi sẽ ở chế độ theo dõi tại trang quản lý đợt thi.
          </div>
        ) : null}

        {banner ? (
          <div
            className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${
              banner.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {banner.message}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <StatCard title="Tổng học viên" value={scoreboard.totalItems.toString()} />
        <StatCard title="Đã đạt đủ phần thi" value={scoreboard.totalPassed.toString()} />
        <StatCard
          title="Điểm trung bình"
          value={`${scoreboard.averageOverallScore.toFixed(1)}/100`}
        />
        <StatCard
          title="Loại đợt thi"
          value={scoreboard.hasSimulationExam ? "Có mô phỏng" : "Không mô phỏng"}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1380px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Học viên
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Khóa học / Kỳ học
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Đợt thi
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Lý thuyết
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Thực hành
                </th>
                {scoreboard.hasSimulationExam ? (
                  <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Mô phỏng
                  </th>
                ) : null}
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Tổng hợp
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loadingFilters || loadingTable ? (
                <tr>
                  <td
                    colSpan={scoreboard.hasSimulationExam ? 9 : 8}
                    className="px-6 py-16 text-center text-sm font-medium text-slate-500"
                  >
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải danh sách điểm thi...
                    </div>
                  </td>
                </tr>
              ) : scoreboard.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={scoreboard.hasSimulationExam ? 9 : 8}
                    className="px-6 py-16 text-center text-sm font-medium text-slate-500"
                  >
                    Chưa có dữ liệu điểm thi phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                scoreboard.items.map((item) => (
                  <tr
                    key={`${item.studentId}-${item.examBatchId}-${item.termId}`}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.studentName}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.email}</p>
                        <p className="text-xs text-slate-500">{item.phone}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{item.courseName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.licenseTypeLabel} • {item.termName}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{item.examBatchName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Đã nhập {item.completedComponents}/{item.totalComponents} phần thi
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <ScoreBadge passed={item.theoryPassed} value={item.theoryScore} />
                    </td>

                    <td className="px-6 py-4 text-center">
                      <ScoreBadge passed={item.practicePassed} value={item.practiceScore} />
                    </td>

                    {scoreboard.hasSimulationExam ? (
                      <td className="px-6 py-4 text-center">
                        <ScoreBadge
                          passed={item.simulationPassed === true}
                          value={item.simulationScore}
                        />
                      </td>
                    ) : null}

                    <td className="px-6 py-4 text-center">
                      <p className="text-lg font-black text-slate-900">
                        {item.overallScore.toFixed(1)}
                      </p>
                      <p className="text-xs text-slate-500">/100 điểm</p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                          item.isPassedAll
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.isPassedAll ? "Đạt" : "Chưa đạt"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                        >
                          <PencilLine className="h-4 w-4" />
                          Cập nhật
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <div className="text-xs font-medium text-slate-500">
            {scoreboard.totalItems === 0
              ? "Chưa có dữ liệu điểm thi"
              : `Hiển thị ${startItem}-${endItem} trên tổng số ${scoreboard.totalItems} học viên`}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white">
              {scoreboard.totalPages === 0 ? "0/0" : `${currentPage}/${scoreboard.totalPages}`}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(scoreboard.totalPages || 1, prev + 1))
              }
              disabled={scoreboard.totalPages === 0 || currentPage >= scoreboard.totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Gợi ý vận hành trang điểm thi
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Chọn đúng khóa học, kỳ học và đợt thi trước khi nhập điểm. Đối với xe
              máy hoặc khóa học không có phần mô phỏng, hệ thống sẽ tự ẩn cột mô
              phỏng. Khi import Excel, nên tải file mẫu trước để tránh sai cột.
            </p>
            {selectedCourse && selectedTerm && selectedBatch ? (
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Đang xem: {selectedCourse.courseName} • {selectedTerm.name} •{" "}
                {selectedBatch.batchName}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <ScoreModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        candidates={candidates}
        hasSimulationExam={scoreboard.hasSimulationExam}
        initialItem={modalState.item}
        onClose={closeModal}
        onSubmit={handleSaveScores}
      />

      {loadingCandidates ? (
        <div className="fixed bottom-6 right-6 z-[130] rounded-full bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-xl">
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tải danh sách học viên...
          </span>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function ScoreBadge({
  value,
  passed,
}: {
  value?: number | null;
  passed: boolean;
}) {
  const hasValue = value !== null && value !== undefined;

  return (
    <div className="inline-flex min-w-[88px] flex-col items-center rounded-2xl border border-slate-200 px-3 py-2">
      <span className="text-base font-black text-slate-900">{formatScore(value)}</span>
      <span
        className={`text-[11px] font-black ${
          !hasValue ? "text-slate-400" : passed ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {!hasValue ? "Chưa nhập" : passed ? "Đạt" : "Chưa đạt"}
      </span>
    </div>
  );
}
