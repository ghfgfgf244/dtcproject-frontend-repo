"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  PlusCircle,
  Search,
  Loader2,
  X,
  Info,
  GraduationCap,
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { courseService } from "@/services/courseService";
import { centerService, Center } from "@/services/centerService";
import { roadmapService } from "@/services/roadmapService";
import { Course, LearningRoadmapItem } from "@/types/course";
import toast from "react-hot-toast";

import CourseStats from "../CourseStats";
import CourseTable from "../CourseTable";
import CourseModal, { CourseSubmitData } from "../../Modals/CourseModal";
import RoadmapModal, { RoadmapSubmitData } from "../../Modals/RoadmapModal";

const PAGE_SIZE = 10;

interface DetailModalProps {
  course: Course;
  onClose: () => void;
}

function CourseDetailModal({ course, onClose }: DetailModalProps) {
  const { getToken } = useAuth();
  const [roadmaps, setRoadmaps] = useState<LearningRoadmapItem[]>([]);
  const [roadmapLoading, setRoadmapLoading] = useState(true);
  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
  const [roadmapEditTarget, setRoadmapEditTarget] = useState<LearningRoadmapItem | null>(null);

  const fetchRoadmaps = useCallback(async () => {
    setRoadmapLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data = await roadmapService.getByCourse(course.id);
      setRoadmaps(data);
    } catch {
      toast.error("Không thể tải lộ trình khóa học.");
    } finally {
      setRoadmapLoading(false);
    }
  }, [course.id, getToken]);

  useEffect(() => {
    void fetchRoadmaps();
  }, [fetchRoadmaps]);

  const handleRoadmapSave = async (data: RoadmapSubmitData) => {
    try {
      const token = await getToken();
      setAuthToken(token);

      if (data.id) {
        await roadmapService.update(data.id, data);
        toast.success("Cập nhật chặng lộ trình thành công");
      } else {
        await roadmapService.create({
          courseId: course.id,
          orderNo: data.orderNo,
          title: data.title,
          description: data.description,
        });
        toast.success("Thêm chặng lộ trình thành công");
      }

      setRoadmapModalOpen(false);
      setRoadmapEditTarget(null);
      await fetchRoadmaps();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi lưu lộ trình");
    }
  };

  const handleDeleteRoadmap = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa chặng "${title}"?`)) return;

    try {
      const token = await getToken();
      setAuthToken(token);
      await roadmapService.delete(id);
      toast.success("Xóa chặng thành công");
      await fetchRoadmaps();
    } catch {
      toast.error("Lỗi xóa chặng");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase leading-none tracking-tight">
                  Chi tiết khóa học
                </h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
                  ID: {course.id}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.3fr_0.9fr]">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Tên khóa học
                  </label>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="block text-xl font-black uppercase leading-tight tracking-tight text-slate-900">
                      {course.courseName}
                    </span>
                    <span className="mt-3 inline-flex items-center rounded-lg bg-blue-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-blue-700">
                      Hạng {course.licenseType}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <CreditCard className="h-3.5 w-3.5" />
                    Học phí niêm yết
                  </label>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <span className="text-2xl font-black text-emerald-700">
                      {course.price.toLocaleString("vi-VN")}
                      <span className="ml-1 text-xs font-bold uppercase tracking-tighter text-emerald-400">
                        VND
                      </span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Mô tả khóa học
                  </label>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm italic leading-relaxed text-slate-600">
                    "{course.description || "Chưa có mô tả chi tiết cho khóa học này."}"
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.courseName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ImageIcon className="h-10 w-10" />
                      <span className="text-xs font-semibold">Chưa có ảnh khóa học</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col justify-center rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-center">
                    <Calendar className="mx-auto mb-2 h-6 w-6 text-indigo-600" />
                    <span className="text-2xl font-black leading-none text-indigo-900">
                      {course.durationInWeeks}
                    </span>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                      Tuần đào tạo
                    </span>
                  </div>

                  <div className="flex flex-col justify-center rounded-xl border border-purple-100 bg-purple-50 p-4 text-center">
                    <Users className="mx-auto mb-2 h-6 w-6 text-purple-600" />
                    <span className="text-2xl font-black leading-none text-purple-900">
                      {course.maxStudents}
                    </span>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                      Học viên tối đa
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          course.isActive
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {course.isActive ? (
                          <ShieldCheck className="h-5 w-5" />
                        ) : (
                          <ShieldAlert className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Trạng thái
                        </span>
                        <span
                          className={`text-sm font-black uppercase ${
                            course.isActive ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {course.isActive ? "Đang hoạt động" : "Tạm dừng"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-slate-800">
                  Lộ trình đào tạo
                </label>
                <button
                  onClick={() => {
                    setRoadmapEditTarget(null);
                    setRoadmapModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <PlusCircle className="h-4 w-4" />
                  Thêm chặng
                </button>
              </div>

              {roadmapLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                </div>
              ) : roadmaps.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed p-8 text-center text-sm font-medium text-slate-400">
                  Chưa có lộ trình nào. Bấm "Thêm chặng" để tạo.
                </div>
              ) : (
                <div className="space-y-3">
                  {[...roadmaps]
                    .sort((a, b) => a.orderNo - b.orderNo)
                    .map((rm) => (
                      <div
                        key={rm.id}
                        className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-black text-blue-700">
                          {rm.orderNo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-sm font-black text-slate-800">{rm.title}</h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setRoadmapEditTarget(rm);
                                  setRoadmapModalOpen(true);
                                }}
                                className="text-xs font-bold text-blue-600 hover:underline"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteRoadmap(rm.id, rm.title)}
                                className="text-xs font-bold text-red-500 hover:underline"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600">{rm.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 justify-end border-t border-slate-100 bg-slate-50 px-8 py-5">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-black uppercase tracking-wider text-slate-600 shadow-sm transition-colors hover:bg-slate-100"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      <RoadmapModal
        isOpen={roadmapModalOpen}
        onClose={() => {
          setRoadmapModalOpen(false);
          setRoadmapEditTarget(null);
        }}
        initialData={roadmapEditTarget}
        onSubmit={handleRoadmapSave}
      />
    </>
  );
}

export default function CourseClientView() {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [centerFilter, setCenterFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailTarget, setDetailTarget] = useState<Course | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      const [coursesData, centersData] = await Promise.all([
        courseService.getAllAdminCourses(),
        centerService.getAll(),
      ]);

      setCourses(coursesData);
      setCenters(centersData);
    } catch {
      toast.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  const handleSave = async (data: CourseSubmitData) => {
    setActionLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      if (data.id) {
        await courseService.updateCourse(data.id, data);
        toast.success("Cập nhật khóa học thành công.");
      } else {
        await courseService.createCourse(data);
        toast.success("Thêm khóa học thành công.");
      }

      setModalOpen(false);
      setEditTarget(null);
      await fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lưu thất bại.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.courseName}"?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      await courseService.deactivateCourse(course.id);
      toast.success("Đã xóa khóa học.");
      await fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xóa thất bại.");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = courses.filter(
      (c) =>
        c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.licenseType.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (centerFilter) {
      if (centerFilter === "none") {
        result = result.filter((c) => !c.centerId);
      } else {
        result = result.filter((c) => c.centerId === centerFilter);
      }
    }

    return result;
  }, [courses, searchQuery, centerFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, centerFilter, courses.length]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    [filtered.length],
  );

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const stats = useMemo(
    () => ({
      total: courses.length,
      active: courses.filter((c) => c.isActive).length,
      suspended: courses.filter((c) => !c.isActive).length,
    }),
    [courses],
  );

  const handleToggleStatus = async (course: Course) => {
    setActionLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      if (course.isActive) {
        await courseService.deactivateCourse(course.id);
        toast.success("Đã tạm dừng khóa học.");
      } else {
        await courseService.updateCourse(course.id, {
          isActive: true,
          thumbnailUrl: course.thumbnailUrl,
        });
        toast.success("Đã kích hoạt khóa học.");
      }

      await fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Thao tác thất bại.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="flex flex-col justify-between gap-6 px-2 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1.5 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
          <div>
            <h2 className="text-3xl font-black uppercase leading-none tracking-tighter text-slate-900">
              Quản lý khóa đào tạo
            </h2>
            <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 opacity-80">
              Danh mục chương trình học và trạng thái vận hành
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditTarget(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
        >
          <PlusCircle className="h-5 w-5" />
          Thêm khóa học mới
        </button>
      </div>

      <CourseStats stats={stats} loading={loading} />

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-100">
        <div className="flex flex-col justify-between gap-6 border-b border-slate-100 bg-slate-50/30 p-6 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <div className="group relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Tìm theo tên khóa học hoặc hạng bằng..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm font-bold shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative min-w-[220px]">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select
                className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm font-bold text-slate-600 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={centerFilter}
                onChange={(e) => setCenterFilter(e.target.value)}
              >
                <option value="">Tất cả trung tâm</option>
                <option value="none">Chưa phân bổ</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.centerName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="whitespace-nowrap rounded-xl bg-slate-100 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
              {filtered.length} kết quả
            </div>
          </div>
        </div>

        <div className="relative">
          {actionLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}

          <CourseTable
            data={paginatedCourses}
            loading={loading}
            startIndex={(currentPage - 1) * PAGE_SIZE}
            onToggleStatus={handleToggleStatus}
            onViewDetail={(c) => setDetailTarget(c)}
            onEdit={(c) => {
              setEditTarget(c);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        </div>

        {!loading && filtered.length > PAGE_SIZE ? (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-500">
              Trang {currentPage}/{totalPages} • Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} trên {filtered.length} khóa học
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trước
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {detailTarget ? (
        <CourseDetailModal course={detailTarget} onClose={() => setDetailTarget(null)} />
      ) : null}

      <CourseModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        initialData={editTarget}
        onSubmit={handleSave}
      />
    </div>
  );
}
