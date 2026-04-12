"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Plus, Users } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { ExamBatch } from "@/types/exam";
import { RegistrationRecord, ExamRegistrationStatus, TermRegistrationCandidate } from "@/types/registration";
import { TermRecord } from "@/types/term";
import { UserListItem, userService } from "@/services/userService";
import { examService } from "@/services/examService";
import { registrationService } from "@/services/registrationService";
import { termService } from "@/services/termService";
import RegistrationTable from "../RegistrationTable";
import ManualRegistrationModal from "../ManualRegistrationModal";
import BulkRegistrationModal from "../BulkRegistrationModal";

interface Props {
  initialData?: RegistrationRecord[];
}

const ITEMS_PER_PAGE = 10;

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "cancelled", label: "Đã hủy" },
];

// FIX: status can be either ExamRegistrationStatus (number) or CourseRegistrationStatus (string)
// Handle both variants to ensure filters work correctly
const getStatusKey = (status: ExamRegistrationStatus | string): string => {
  // Numeric enum path (ExamRegistration)
  if (typeof status === "number") {
    switch (status) {
      case ExamRegistrationStatus.Approved:  return "approved";
      case ExamRegistrationStatus.Rejected:  return "rejected";
      case ExamRegistrationStatus.Cancelled: return "cancelled";
      default:                               return "pending";
    }
  }
  // String path (CourseRegistration)
  switch (status.toLowerCase()) {
    case "approved":  return "approved";
    case "rejected":  return "rejected";
    case "cancelled": return "cancelled";
    default:          return "pending";
  }
};

// FIX: normalize status to ExamRegistrationStatus for numeric comparisons
const isStatusEqual = (
  status: ExamRegistrationStatus | string,
  target: ExamRegistrationStatus,
): boolean => {
  if (typeof status === "number") return status === target;
  return getStatusKey(status) === getStatusKey(target);
};

export default function RegistrationClientView({ initialData = [] }: Props) {
  const { getToken } = useAuth();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(initialData);
  const [batches, setBatches] = useState<ExamBatch[]>([]);
  const [terms, setTerms] = useState<TermRecord[]>([]);
  const [students, setStudents] = useState<UserListItem[]>([]);
  const [bulkCandidates, setBulkCandidates] = useState<TermRegistrationCandidate[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchFilter, setBatchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const withAuth = useCallback(async () => {
    const token = await getToken();
    setAuthToken(token);
  }, [getToken]);

  const loadRegistrations = useCallback(
    async (examBatchId: string) => {
      if (!examBatchId) {
        setRegistrations([]);
        return;
      }

      setLoadingTable(true);
      setError(null);
      try {
        await withAuth();
        const data = await registrationService.getRegistrationsByBatch(examBatchId);
        setRegistrations(data);
      } catch (loadError) {
        console.error(loadError);
        setError("Không thể tải danh sách đăng ký thi.");
      } finally {
        setLoadingTable(false);
      }
    },
    [withAuth],
  );

  useEffect(() => {
    const bootstrap = async () => {
      setLoadingPage(true);
      setError(null);
      try {
        await withAuth();
        const [batchData, termData] = await Promise.all([
          examService.getAllExamBatches(),
          termService.getAllTerms(),
        ]);

        setBatches(batchData);
        setTerms(termData);

        const defaultBatchId = batchData[0]?.id ?? "";
        setBatchFilter(defaultBatchId);

        if (defaultBatchId) {
          const registrationData = await registrationService.getRegistrationsByBatch(defaultBatchId);
          setRegistrations(registrationData);
        } else {
          setRegistrations([]);
        }
      } catch (bootstrapError) {
        console.error(bootstrapError);
        setError("Không thể khởi tạo dữ liệu đăng ký thi.");
      } finally {
        setLoadingPage(false);
      }
    };

    bootstrap();
  }, [withAuth]);

  useEffect(() => {
    if (!batchFilter) return;
    loadRegistrations(batchFilter);
  }, [batchFilter, loadRegistrations]);

  const openManualModal = async () => {
    setLoadingStudents(true);
    setError(null);
    try {
      await withAuth();
      const studentData = await userService.getStudents();
      setStudents(studentData);
      setIsManualOpen(true);
    } catch (modalError) {
      console.error(modalError);
      setError("Không thể tải danh sách học viên để đăng ký thủ công.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const openBulkModal = async () => {
    setBulkCandidates([]);
    setIsBulkOpen(true);
  };

  const handleFetchCandidates = useCallback(
    async (termId: string, examBatchId: string) => {
      if (!termId || !examBatchId) {
        setBulkCandidates([]);
        return;
      }

      setLoadingCandidates(true);
      setError(null);
      try {
        await withAuth();
        const candidates = await registrationService.getTermCandidates(termId, examBatchId);
        setBulkCandidates(candidates);
      } catch (candidateError) {
        console.error(candidateError);
        setError("Không thể tải danh sách học viên của kỳ học đã chọn.");
      } finally {
        setLoadingCandidates(false);
      }
    },
    [withAuth],
  );

  const handleManualSubmit = async (studentId: string, examBatchId: string) => {
    await withAuth();
    await registrationService.createRegistration(examBatchId, studentId, false);
    if (examBatchId === batchFilter) {
      await loadRegistrations(examBatchId);
    } else {
      setBatchFilter(examBatchId);
    }
  };

  const handleBulkSubmit = async (studentIds: string[], examBatchId: string) => {
    await withAuth();
    await registrationService.createBulk(examBatchId, studentIds, false);
    if (examBatchId === batchFilter) {
      await loadRegistrations(examBatchId);
    } else {
      setBatchFilter(examBatchId);
    }
  };

  const handleApprove = async (id: string) => {
    await withAuth();
    await registrationService.updateStatus(id, ExamRegistrationStatus.Approved);
    await loadRegistrations(batchFilter);
  };

  const handleReject = async (id: string) => {
    await withAuth();
    await registrationService.updateStatus(id, ExamRegistrationStatus.Rejected);
    await loadRegistrations(batchFilter);
  };

  const handleTogglePayment = async (record: RegistrationRecord) => {
    await withAuth();
    await registrationService.setPaymentStatus(record.id, !record.isPaid);
    await loadRegistrations(batchFilter);
  };

  const handleApproveAll = async () => {
    // FIX: use isStatusEqual() so both string and numeric status are handled correctly
    const eligibleIds = registrations
      .filter(
        (record) =>
          isStatusEqual(record.status, ExamRegistrationStatus.Pending) &&
          record.isPaid === true &&
          (record.attendanceRate ?? 0) >= 80,
      )
      .map((record) => record.id);

    if (eligibleIds.length === 0) {
      window.alert("Hiện không có học viên nào đủ điều kiện để duyệt hàng loạt.");
      return;
    }

    const confirmed = window.confirm(
      `Duyệt hàng loạt ${eligibleIds.length} học viên đã nộp lệ phí và học đủ 80% số buổi?`,
    );

    if (!confirmed) return;

    await withAuth();
    await Promise.all(
      eligibleIds.map((id) =>
        registrationService.updateStatus(id, ExamRegistrationStatus.Approved),
      ),
    );
    await loadRegistrations(batchFilter);
  };

  const filteredData = useMemo(() => {
    return registrations.filter((record) => {
      if (statusFilter === "all") return true;
      return getStatusKey(record.status) === statusFilter;
    });
  }, [registrations, statusFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [batchFilter, statusFilter]);

  // FIX: use isStatusEqual() to handle both string and numeric status
  const pendingCount = registrations.filter(
    (record) => isStatusEqual(record.status, ExamRegistrationStatus.Pending),
  ).length;
  const eligibleCount = registrations.filter(
    (record) =>
      isStatusEqual(record.status, ExamRegistrationStatus.Pending) &&
      record.isEligibleForApproval === true,
  ).length;

  if (loadingPage) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[30px] font-black tracking-tight text-slate-900">
            Quản lý đăng ký thi
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Theo dõi danh sách học viên theo từng đợt thi, xác nhận lệ phí và duyệt hồ sơ đủ điều kiện.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openManualModal}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Đăng ký thủ công
          </button>
          <button
            type="button"
            onClick={openBulkModal}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Users className="h-4 w-4" />
            Đăng ký hàng loạt
          </button>
          <button
            type="button"
            onClick={handleApproveAll}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Duyệt hàng loạt
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px_220px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Đợt thi
          </label>
          <select
            value={batchFilter}
            onChange={(event) => setBatchFilter(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500"
          >
            <option value="">-- Chọn đợt thi --</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batchName}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Trạng thái duyệt
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
            Đang chờ duyệt
          </p>
          <p className="mt-3 text-3xl font-black">{pendingCount}</p>
        </div>

        <div className="rounded-2xl bg-emerald-600 p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100">
            Đủ điều kiện
          </p>
          <p className="mt-3 text-3xl font-black">{eligibleCount}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {loadingTable ? (
        <div className="flex justify-center rounded-3xl border border-slate-200 bg-white p-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <RegistrationTable
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onApprove={handleApprove}
          onReject={handleReject}
          onTogglePayment={handleTogglePayment}
        />
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black text-slate-900">Đăng ký thủ công</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tìm đúng học viên trong cơ sở dữ liệu, chọn đợt thi và tạo hồ sơ ở trạng thái chờ duyệt.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black text-slate-900">Đăng ký hàng loạt</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Chọn một kỳ học để lấy danh sách học viên theo term, sau đó đăng ký vào cùng một đợt thi.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black text-slate-900">Duyệt hàng loạt</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Chỉ những học viên đã nộp lệ phí và có tỷ lệ tham gia từ 80% số buổi học trở lên mới được duyệt hàng loạt.
          </p>
        </div>
      </div>

      <ManualRegistrationModal
        isOpen={isManualOpen}
        batches={batches}
        students={students}
        loadingStudents={loadingStudents}
        defaultBatchId={batchFilter}
        onClose={() => setIsManualOpen(false)}
        onSubmit={handleManualSubmit}
      />

      <BulkRegistrationModal
        isOpen={isBulkOpen}
        batches={batches}
        terms={terms}
        candidates={bulkCandidates}
        loadingCandidates={loadingCandidates}
        defaultBatchId={batchFilter}
        onClose={() => setIsBulkOpen(false)}
        onSelectionChange={handleFetchCandidates}
        onSubmit={handleBulkSubmit}
      />
    </div>
  );
}
