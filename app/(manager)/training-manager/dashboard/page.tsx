"use client";

import { useEffect, useMemo, useState } from "react";
import AiAlertList from "@/components/manager/Shared/AiAlertList";
import AiInsightCard from "@/components/manager/Shared/AiInsightCard";
import { dashboardAiService } from "@/services/dashboardAiService";
import { dashboardService } from "@/services/dashboardService";
import { DashboardInsightResponse } from "@/types/ai";
import { MonthlyMetricDto, TrainingOperationalDashboardDto } from "@/types/dashboard";

const PAGE_SIZE = 5;

function formatMonth(item: MonthlyMetricDto) {
  return `${String(item.month).padStart(2, "0")}/${item.year}`;
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function Pagination({
  page,
  totalItems,
  onChange,
}: {
  page: number;
  totalItems: number;
  onChange: (next: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  if (totalItems <= PAGE_SIZE) {
    return null;
  }

  return (
    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
      <p className="text-xs font-medium text-slate-500">
        Trang {page}/{totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Trước
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}

function TrainingMetricCard({
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
        {note || "Đồng bộ trực tiếp từ dữ liệu đào tạo."}
      </p>
    </div>
  );
}

export default function TrainingDashboardPage() {
  const [dashboard, setDashboard] = useState<TrainingOperationalDashboardDto | null>(null);
  const [insight, setInsight] = useState<DashboardInsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examPage, setExamPage] = useState(1);
  const [instructorPage, setInstructorPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [dashboardData, insightData] = await Promise.all([
          dashboardService.getTrainingDashboard(),
          dashboardAiService.getTrainingSummary(),
        ]);

        setDashboard(dashboardData);
        setInsight(insightData);
      } catch (fetchError: any) {
        setError(
          fetchError?.response?.data?.errors?.[0] ||
            fetchError?.message ||
            "Không tải được dashboard đào tạo.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setExamPage(1);
  }, [dashboard?.upcomingExamBatches]);

  useEffect(() => {
    setInstructorPage(1);
  }, [dashboard?.instructorLoads]);

  const maxTrendValue = useMemo(() => {
    if (!dashboard?.classOpeningTrend?.length) {
      return 1;
    }

    return Math.max(...dashboard.classOpeningTrend.map((item) => Number(item.value) || 0), 1);
  }, [dashboard]);

  const pagedExamBatches = useMemo(
    () => paginate(dashboard?.upcomingExamBatches || [], examPage, PAGE_SIZE),
    [dashboard?.upcomingExamBatches, examPage],
  );

  const pagedInstructorLoads = useMemo(
    () => paginate(dashboard?.instructorLoads || [], instructorPage, PAGE_SIZE),
    [dashboard?.instructorLoads, instructorPage],
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-blue-600">
            Trung tâm điều hành đào tạo
          </p>
          <h1 className="text-3xl font-black text-slate-900">
            Dashboard điều hành đào tạo
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600">
            Nắm nhanh tải lớp, chuyên cần, lịch thi và giảng viên để xử lý vận hành đào
            tạo trong ngày.
          </p>
        </section>

        {error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <AiInsightCard
          title="Tóm tắt AI cho bộ phận đào tạo"
          insight={insight}
          loading={loading}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(dashboard?.kpis ||
            Array.from({ length: 4 }).map((_, index) => ({
              title: `KPI ${index + 1}`,
              value: "--",
              note: "Đang tải dữ liệu...",
              tone: "default",
            }))).map((kpi) => (
            <TrainingMetricCard
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
              <h2 className="text-xl font-black text-slate-900">Xu hướng mở lớp</h2>
              <p className="mt-1 text-sm text-slate-500">
                Quan sát lượng lớp được tạo mới để chuẩn bị giảng viên và tài nguyên.
              </p>
            </div>

            <div className="grid h-72 grid-cols-6 items-end gap-3">
              {(dashboard?.classOpeningTrend || []).map((item) => {
                const currentValue = Number(item.value) || 0;
                const height = `${Math.max(
                  (currentValue / maxTrendValue) * 100,
                  currentValue > 0 ? 12 : 4,
                )}%`;

                return (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="flex h-full flex-col justify-end gap-3"
                  >
                    <div className="rounded-3xl bg-slate-100 p-3 text-center text-xs font-bold text-slate-500">
                      {currentValue.toLocaleString("vi-VN")}
                    </div>
                    <div
                      className="rounded-t-[28px] bg-gradient-to-t from-blue-600 to-cyan-400"
                      style={{ height }}
                    />
                    <p className="text-center text-xs font-semibold text-slate-500">
                      {formatMonth(item)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <AiAlertList title="Cảnh báo vận hành" items={insight?.alerts} tone="amber" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-900">Đợt thi sắp tới</h2>
              <p className="mt-1 text-sm text-slate-500">
                Theo dõi đợt thi gần ngày và mức lấp đầy ứng viên.
              </p>
            </div>

            <div className="space-y-4">
              {pagedExamBatches.length ? (
                pagedExamBatches.map((batch) => {
                  const fillRate =
                    batch.maxCandidates > 0
                      ? Math.round((batch.currentCandidates / batch.maxCandidates) * 100)
                      : 0;

                  return (
                    <div
                      key={batch.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-slate-900">{batch.batchName}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {new Date(batch.examDate).toLocaleDateString("vi-VN")} • Trạng
                            thái {batch.status}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-600 shadow-sm">
                          {fillRate}% lấp đầy
                        </span>
                      </div>

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${Math.min(fillRate, 100)}%` }}
                        />
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {batch.currentCandidates.toLocaleString("vi-VN")}/
                        {batch.maxCandidates.toLocaleString("vi-VN")} ứng viên
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                  Chưa có đợt thi sắp tới.
                </div>
              )}
            </div>

            <Pagination
              page={examPage}
              totalItems={dashboard?.upcomingExamBatches?.length || 0}
              onChange={setExamPage}
            />
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-900">Giảng viên</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ưu tiên nhìn người đang quá tải hoặc chưa được phân ca hợp lý.
              </p>
            </div>

            <div className="space-y-4">
              {pagedInstructorLoads.length ? (
                pagedInstructorLoads.map((item) => (
                  <div
                    key={item.instructorId}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-slate-900">{item.instructorName}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.assignedClasses.toLocaleString("vi-VN")} lớp •{" "}
                          {item.schedulesThisWeek.toLocaleString("vi-VN")} lịch tuần này
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.statusLabel === "Đang dạy"
                            ? "bg-blue-100 text-blue-700"
                            : item.statusLabel === "Rảnh rỗi"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.statusLabel}
                      </span>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-cyan-500"
                        style={{ width: `${Math.min(item.utilizationRate, 100)}%` }}
                      />
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Mức sử dụng: {item.utilizationRate.toLocaleString("vi-VN")}%
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                  Chưa có dữ liệu giảng viên.
                </div>
              )}
            </div>

            <Pagination
              page={instructorPage}
              totalItems={dashboard?.instructorLoads?.length || 0}
              onChange={setInstructorPage}
            />
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <AiAlertList title="Điểm nhấn hôm nay" items={insight?.highlights} tone="blue" />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-900">
                Lớp cần theo dõi chuyên cần
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Danh sách lớp có tỷ lệ hiện diện thấp trên các buổi đã điểm danh.
              </p>
            </div>

            <div className="space-y-4">
              {dashboard?.lowAttendanceClasses?.length ? (
                dashboard.lowAttendanceClasses.map((item) => (
                  <div
                    key={item.classId}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-slate-900">{item.className}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.presentCount.toLocaleString("vi-VN")}/
                          {item.totalRecords.toLocaleString("vi-VN")} lượt hiện diện
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-700 shadow-sm">
                        {item.attendanceRate.toLocaleString("vi-VN")}% chuyên cần
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                  Chưa có dữ liệu điểm danh để đánh giá chuyên cần.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
