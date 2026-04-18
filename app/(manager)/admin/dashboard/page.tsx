"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import AiAlertList from "@/components/manager/Shared/AiAlertList";
import AiInsightCard from "@/components/manager/Shared/AiInsightCard";
import { dashboardAiService } from "@/services/dashboardAiService";
import { dashboardService } from "@/services/dashboardService";
import { DashboardInsightResponse } from "@/types/ai";
import {
  AdminOperationalDashboardDto,
  DashboardCenterPerformanceDto,
  DashboardUpcomingExamDto,
  MonthlyMetricDto,
} from "@/types/dashboard";
import { setAuthToken } from "@/lib/api";

const CENTER_PAGE_SIZE = 5;
const EXAM_PAGE_SIZE = 5;

function formatMonth(item: MonthlyMetricDto) {
  return `${String(item.month).padStart(2, "0")}/${item.year}`;
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function AdminMetricCard({
  title,
  value,
  note,
  tone,
}: {
  title: string;
  value: string;
  note?: string | null;
  tone: string;
}) {
  const toneClass =
    tone === "warning"
      ? "border-amber-100 bg-amber-50"
      : tone === "success"
        ? "border-emerald-100 bg-emerald-50"
        : tone === "info"
          ? "border-cyan-100 bg-cyan-50"
          : "border-slate-200 bg-white";

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${toneClass}`}>
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {note || "Theo dõi realtime từ dữ liệu hệ thống."}
      </p>
    </div>
  );
}

function SectionPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Hiển thị <span className="font-bold text-slate-900">{startItem}-{endItem}</span> trên{" "}
        <span className="font-bold text-slate-900">{totalItems}</span> mục
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Trước
        </button>
        <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
          {currentPage}/{totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
}

function CenterPerformanceCard({ center }: { center: DashboardCenterPerformanceDto }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-slate-900">{center.centerName}</p>
          <p className="mt-1 text-sm text-slate-500">
            {center.totalCourses.toLocaleString("vi-VN")} khóa học •{" "}
            {center.activeTerms.toLocaleString("vi-VN")} kỳ hoạt động
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
          {center.revenue.toLocaleString("vi-VN")} đ
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white px-3 py-3 text-sm text-slate-600">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Đăng ký</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {center.totalRegistrations.toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="rounded-2xl bg-white px-3 py-3 text-sm text-slate-600">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Đã duyệt</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {center.approvedRegistrations.toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="rounded-2xl bg-white px-3 py-3 text-sm text-slate-600">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lớp đang chạy</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {center.activeClasses.toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
}

function PendingExamCard({ batch }: { batch: DashboardUpcomingExamDto }) {
  const fillRate =
    batch.maxCandidates > 0
      ? Math.round((batch.currentCandidates / batch.maxCandidates) * 100)
      : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-slate-900">{batch.batchName}</p>
          <p className="mt-1 text-sm text-slate-500">
            {new Date(batch.examDate).toLocaleDateString("vi-VN")} • {batch.status}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-700 shadow-sm">
          {fillRate}% lấp đầy
        </span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(fillRate, 100)}%` }} />
      </div>
      <p className="mt-2 text-sm text-slate-500">
        {batch.currentCandidates.toLocaleString("vi-VN")}/
        {batch.maxCandidates.toLocaleString("vi-VN")} ứng viên
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [dashboard, setDashboard] = useState<AdminOperationalDashboardDto | null>(null);
  const [insight, setInsight] = useState<DashboardInsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [centerPage, setCenterPage] = useState(1);
  const [examPage, setExamPage] = useState(1);

  const fetchData = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      setAuthToken(token);

      const dashboardData = await dashboardService.getAdminDashboard();
      setDashboard(dashboardData);

      try {
        const insightData = await dashboardAiService.getAdminSummary();
        setInsight(insightData);
      } catch (aiError) {
        console.error("Failed to fetch admin AI summary:", aiError);
        setInsight(null);
      }
    } catch (fetchError: any) {
      setError(
        fetchError?.response?.data?.errors?.[0] ||
          fetchError?.message ||
          "Không tải được dashboard admin.",
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const maxTrendValue = useMemo(() => {
    if (!dashboard?.revenueTrend?.length) {
      return 1;
    }

    return Math.max(...dashboard.revenueTrend.map((item) => Number(item.value) || 0), 1);
  }, [dashboard]);

  const centerPerformance = dashboard?.centerPerformance || [];
  const pendingExamApprovals = dashboard?.pendingExamApprovals || [];

  const centerTotalPages = Math.max(1, Math.ceil(centerPerformance.length / CENTER_PAGE_SIZE));
  const examTotalPages = Math.max(1, Math.ceil(pendingExamApprovals.length / EXAM_PAGE_SIZE));

  useEffect(() => {
    if (centerPage > centerTotalPages) {
      setCenterPage(centerTotalPages);
    }
  }, [centerPage, centerTotalPages]);

  useEffect(() => {
    if (examPage > examTotalPages) {
      setExamPage(examTotalPages);
    }
  }, [examPage, examTotalPages]);

  const paginatedCenters = useMemo(
    () => paginate(centerPerformance, centerPage, CENTER_PAGE_SIZE),
    [centerPerformance, centerPage],
  );

  const paginatedPendingExams = useMemo(
    () => paginate(pendingExamApprovals, examPage, EXAM_PAGE_SIZE),
    [pendingExamApprovals, examPage],
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-blue-600">
            Admin Command Center
          </p>
          <h1 className="text-3xl font-black text-slate-900">Dashboard điều hành toàn hệ thống</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600">
            Tập trung các tín hiệu hệ trọng nhất: tăng trưởng, hiệu suất trung tâm, doanh thu,
            backlog phê duyệt và đợt thi chờ admin.
          </p>
        </section>

        {error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <AiInsightCard title="Tóm tắt AI cho quản trị hệ thống" insight={insight} loading={loading} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(dashboard?.kpis ||
            Array.from({ length: 4 }).map((_, index) => ({
              title: `KPI ${index + 1}`,
              value: "--",
              note: "Đang tải dữ liệu...",
              tone: "default",
            }))).map((kpi) => (
            <AdminMetricCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              note={kpi.note}
              tone={kpi.tone}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">Doanh thu 6 tháng gần nhất</h2>
              <p className="mt-1 text-sm text-slate-500">
                Phản ánh tốc độ tăng trưởng tuyển sinh đã được chốt duyệt.
              </p>
            </div>

            <div className="grid h-72 grid-cols-6 items-end gap-3">
              {(dashboard?.revenueTrend || []).map((item) => {
                const currentValue = Number(item.value) || 0;
                const height = `${Math.max((currentValue / maxTrendValue) * 100, currentValue > 0 ? 12 : 4)}%`;

                return (
                  <div key={`${item.year}-${item.month}`} className="flex h-full flex-col justify-end gap-3">
                    <div className="rounded-3xl bg-slate-100 p-3 text-center text-xs font-bold text-slate-500">
                      {(currentValue / 1_000_000).toLocaleString("vi-VN", {
                        maximumFractionDigits: 1,
                      })}
                      M
                    </div>
                    <div className="rounded-t-[28px] bg-gradient-to-t from-blue-700 to-indigo-400" style={{ height }} />
                    <p className="text-center text-xs font-semibold text-slate-500">{formatMonth(item)}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <AiAlertList title="Cảnh báo điều hành" items={insight?.alerts} tone="amber" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-900">Hiệu suất trung tâm</h2>
              <p className="mt-1 text-sm text-slate-500">
                So sánh trung tâm theo doanh thu, lớp đang chạy và lượng đăng ký.
              </p>
            </div>

            <div className="space-y-4">
              {paginatedCenters.length ? (
                paginatedCenters.map((center) => (
                  <CenterPerformanceCard key={center.centerId} center={center} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                  Chưa có dữ liệu trung tâm.
                </div>
              )}
            </div>

            {centerPerformance.length > 0 ? (
              <SectionPagination
                currentPage={centerPage}
                totalPages={centerTotalPages}
                totalItems={centerPerformance.length}
                pageSize={CENTER_PAGE_SIZE}
                onPageChange={setCenterPage}
              />
            ) : null}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-900">Đợt thi cần admin duyệt</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ưu tiên xử lý sớm các đợt thi gần ngày để tránh ảnh hưởng vận hành.
              </p>
            </div>

            <div className="space-y-4">
              {paginatedPendingExams.length ? (
                paginatedPendingExams.map((batch) => (
                  <PendingExamCard key={batch.id} batch={batch} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                  Không có đợt thi nào đang chờ admin phê duyệt.
                </div>
              )}
            </div>

            {pendingExamApprovals.length > 0 ? (
              <SectionPagination
                currentPage={examPage}
                totalPages={examTotalPages}
                totalItems={pendingExamApprovals.length}
                pageSize={EXAM_PAGE_SIZE}
                onPageChange={setExamPage}
              />
            ) : null}
          </section>
        </div>

        <AiAlertList title="Điểm nhấn hôm nay" items={insight?.highlights} tone="blue" />
      </div>
    </div>
  );
}
