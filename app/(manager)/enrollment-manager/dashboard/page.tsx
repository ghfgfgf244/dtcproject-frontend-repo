"use client";

import { useEffect, useMemo, useState } from "react";
import AiAlertList from "@/components/manager/Shared/AiAlertList";
import AiInsightCard from "@/components/manager/Shared/AiInsightCard";
import { dashboardAiService } from "@/services/dashboardAiService";
import { dashboardService } from "@/services/dashboardService";
import { DashboardInsightResponse } from "@/types/ai";
import { EnrollmentOperationalDashboardDto, MonthlyMetricDto } from "@/types/dashboard";

function formatMonthLabel(item: MonthlyMetricDto) {
  return `${String(item.month).padStart(2, "0")}/${item.year}`;
}

function EnrollmentMetricCard({
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
      <p className="mt-2 text-sm leading-6 text-slate-600">{note || "Theo dõi realtime từ dữ liệu đăng ký."}</p>
    </div>
  );
}

export default function EnrollmentDashboardPage() {
  const [dashboard, setDashboard] = useState<EnrollmentOperationalDashboardDto | null>(null);
  const [insight, setInsight] = useState<DashboardInsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [dashboardData, insightData] = await Promise.all([
          dashboardService.getEnrollmentDashboard(),
          dashboardAiService.getEnrollmentSummary(),
        ]);

        setDashboard(dashboardData);
        setInsight(insightData);
      } catch (fetchError: any) {
        setError(fetchError?.response?.data?.errors?.[0] || fetchError?.message || "Không tải được dashboard tuyển sinh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxTrendValue = useMemo(() => {
    if (!dashboard?.registrationTrend?.length) {
      return 1;
    }

    return Math.max(...dashboard.registrationTrend.map((item) => Number(item.value) || 0), 1);
  }, [dashboard]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-blue-600">Enrollment Command Center</p>
          <h1 className="text-3xl font-black text-slate-900">Dashboard điều hành tuyển sinh</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600">
            Theo dõi backlog hồ sơ, khóa học hút đăng ký, hiệu suất cộng tác viên và tình trạng nội dung tuyển sinh trên một màn hình.
          </p>
        </section>

        {error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>
        ) : null}

        <AiInsightCard title="Tóm tắt AI cho bộ phận tuyển sinh" insight={insight} loading={loading} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(dashboard?.kpis || Array.from({ length: 4 }).map((_, index) => ({
            title: `KPI ${index + 1}`,
            value: "--",
            note: "Đang tải dữ liệu...",
            tone: "default",
          }))).map((kpi) => (
            <EnrollmentMetricCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              note={kpi.note}
              tone={kpi.tone}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Xu hướng đăng ký 6 tháng gần nhất</h2>
                <p className="mt-1 text-sm text-slate-500">Dùng để nhìn nhanh mùa tuyển sinh đang tăng hay chậm lại.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                {dashboard?.totalRegistrations?.toLocaleString("vi-VN") || "0"} hồ sơ
              </div>
            </div>

            <div className="grid h-72 grid-cols-6 items-end gap-3">
              {(dashboard?.registrationTrend || []).map((item) => {
                const currentValue = Number(item.value) || 0;
                const height = `${Math.max((currentValue / maxTrendValue) * 100, currentValue > 0 ? 12 : 4)}%`;

                return (
                  <div key={`${item.year}-${item.month}`} className="flex h-full flex-col justify-end gap-3">
                    <div className="rounded-3xl bg-slate-100 p-3 text-center text-xs font-bold text-slate-500">
                      {currentValue.toLocaleString("vi-VN")}
                    </div>
                    <div className="rounded-t-[28px] bg-gradient-to-t from-blue-600 to-sky-400" style={{ height }} />
                    <p className="text-center text-xs font-semibold text-slate-500">{formatMonthLabel(item)}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <AiAlertList title="Cảnh báo ưu tiên" items={insight?.alerts} tone="amber" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Khóa học hút đăng ký</h2>
                <p className="mt-1 text-sm text-slate-500">Ưu tiên xem khóa nào nên tăng ngân sách tư vấn hoặc mở thêm kỳ học.</p>
              </div>
            </div>

            <div className="space-y-4">
              {dashboard?.topCourses?.length ? (
                dashboard.topCourses.map((course) => (
                  <div key={course.courseId} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-black text-slate-900">{course.courseName}</p>
                        <p className="mt-1 text-sm text-slate-500">Hạng bằng: {course.licenseType || "Chưa rõ"}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-600 shadow-sm">
                        {course.totalRegistrations.toLocaleString("vi-VN")} hồ sơ
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                      <div className="rounded-2xl bg-white px-3 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Chờ duyệt</p>
                        <p className="mt-1 text-lg font-black text-slate-900">{course.pendingRegistrations.toLocaleString("vi-VN")}</p>
                      </div>
                      <div className="rounded-2xl bg-white px-3 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Đã duyệt</p>
                        <p className="mt-1 text-lg font-black text-slate-900">{course.approvedRegistrations.toLocaleString("vi-VN")}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                  Chưa có dữ liệu khóa học để hiển thị.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Xếp hạng cộng tác viên</h2>
                <p className="mt-1 text-sm text-slate-500">Dựa trên lượt giới thiệu và hoa hồng đang phát sinh.</p>
              </div>
            </div>

            <div className="space-y-4">
              {dashboard?.topCollaborators?.length ? (
                dashboard.topCollaborators.map((item, index) => (
                  <div key={item.collaboratorId} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{item.collaboratorName}</p>
                        <p className="text-sm text-slate-500">
                          {item.referralCode ? `Mã ${item.referralCode}` : "Chưa có mã"} • {item.referralRegistrations.toLocaleString("vi-VN")} lượt giới thiệu
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-bold text-emerald-600">{item.paidCommission.toLocaleString("vi-VN")} đ</p>
                      <p className="text-slate-500">Chờ trả: {item.pendingCommission.toLocaleString("vi-VN")} đ</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                  Chưa có dữ liệu cộng tác viên.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <AiAlertList title="Điểm nhấn hôm nay" items={insight?.highlights} tone="blue" />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-900">Bài đăng tuyển sinh mới nhất</h2>
              <p className="mt-1 text-sm text-slate-500">Kiểm tra nhanh bài nào đang công khai và bài nào còn là bản nháp.</p>
            </div>

            <div className="space-y-4">
              {dashboard?.recentPosts?.length ? (
                dashboard.recentPosts.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-slate-900">{post.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {post.categoryName || "Chưa phân loại"} • {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          post.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {post.isPublished ? "Đang công khai" : "Bản nháp"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                  Chưa có bài đăng để hiển thị.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
