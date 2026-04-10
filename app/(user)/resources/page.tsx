"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, FileText, ImageIcon, MonitorPlay, Presentation } from "lucide-react";
import { resourceLearningService } from "@/services/resourceLearningService";
import { ResourceLearningDTO } from "@/types/learning-resource";

function getTypeMeta(resourceType: number | string) {
  const normalized = String(resourceType).toLowerCase();

  if (normalized === "1" || normalized === "video") {
    return {
      label: "Video",
      icon: MonitorPlay,
      badgeClass: "bg-rose-100 text-rose-700",
    };
  }

  if (normalized === "2" || normalized === "pdf") {
    return {
      label: "PDF",
      icon: FileText,
      badgeClass: "bg-emerald-100 text-emerald-700",
    };
  }

  if (normalized === "3" || normalized === "link") {
    return {
      label: "Liên kết",
      icon: ExternalLink,
      badgeClass: "bg-blue-100 text-blue-700",
    };
  }

  if (normalized === "4" || normalized === "slide") {
    return {
      label: "Slide",
      icon: Presentation,
      badgeClass: "bg-amber-100 text-amber-700",
    };
  }

  return {
    label: "Hình ảnh",
    icon: ImageIcon,
    badgeClass: "bg-purple-100 text-purple-700",
  };
}

export default function PublicResourcesPage() {
  const [resources, setResources] = useState<ResourceLearningDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await resourceLearningService.getAll();
        setResources((data || []).filter((item) => item.isActive !== false));
      } catch (error) {
        console.error("Failed to fetch public resources:", error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const groupedByCourse = useMemo(() => {
    return resources.reduce<Record<string, ResourceLearningDTO[]>>((accumulator, item) => {
      const key = item.courseName || "Tài liệu chung";
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(item);
      return accumulator;
    }, {});
  }, [resources]);

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 via-sky-900 to-cyan-700 px-8 py-10 text-white shadow-[0_20px_60px_rgba(2,6,23,0.18)]">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
              Kho tài liệu mở
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Tài liệu học lái xe công khai
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-100/90">
              Xem nhanh video, PDF, slide và các liên kết học tập trước khi đăng ký khóa
              học. Trang này truy cập tự do, không cần đăng nhập.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/courses/my-course/theory-practice"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-sky-800 transition hover:bg-sky-50"
              >
                <BookOpen className="h-4 w-4" />
                Vào thi thử
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Xem khóa học
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
              Tổng tài liệu
            </p>
            <p className="mt-3 text-4xl font-black text-slate-900">{resources.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
              Nhóm khóa học
            </p>
            <p className="mt-3 text-4xl font-black text-slate-900">
              {Object.keys(groupedByCourse).length}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
              Truy cập
            </p>
            <p className="mt-3 text-2xl font-black text-emerald-600">Công khai</p>
            <p className="mt-2 text-sm text-slate-500">Không cần đăng nhập để xem và mở tài liệu.</p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500">
              Đang tải danh sách tài liệu...
            </div>
          ) : resources.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <h2 className="text-2xl font-black text-slate-900">Chưa có tài liệu công khai</h2>
              <p className="mt-3 text-sm text-slate-500">
                Khi trung tâm cập nhật tài liệu học tập, nội dung sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            Object.entries(groupedByCourse).map(([courseName, items]) => (
              <div
                key={courseName}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{courseName}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {items.length} tài liệu đang sẵn sàng cho học viên tham khảo.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => {
                    const meta = getTypeMeta(item.resourceType);
                    const Icon = meta.icon;

                    return (
                      <article
                        key={item.id}
                        className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${meta.badgeClass}`}>
                              {meta.label}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>

                        <h3 className="mt-5 line-clamp-2 text-lg font-black text-slate-900">
                          {item.title}
                        </h3>

                        <div className="mt-6">
                          <a
                            href={item.resourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
                          >
                            Mở tài liệu
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
