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
  Save,
  MapPin,
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

// ─── Detail Modal ─────────────────────────────────────────────────────────────

interface DetailModalProps {
  course: Course;
  onClose: () => void;
}

function CourseDetailModal({ course, onClose }: DetailModalProps) {
  const { getToken } = useAuth();
  const [roadmaps, setRoadmaps] = useState<LearningRoadmapItem[]>([]);
  const [roadmapLoading, setRoadmapLoading] = useState(true);

  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
  const [roadmapEditTarget, setRoadmapEditTarget] =
    useState<LearningRoadmapItem | null>(null);

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
  }, [getToken, course.id]);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  const handleRoadmapSave = async (data: RoadmapSubmitData) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      if (data.id) {
        await roadmapService.update(data.id, data);
        toast.success("Cập nhật chặng lộ trình thành công");
      } else {
        await roadmapService.create({ ...data, courseId: course.id } as any);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 shrink-0">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg leading-none uppercase tracking-tight">
                  Chi tiết khóa học
                </h3>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
                  ID: {course.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5 mb-2">
                    <GraduationCap className="w-3.5 h-3.5" /> Tên khóa học
                  </label>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xl font-black text-slate-900 leading-tight block uppercase">
                      {course.courseName}
                    </span>
                    <span className="inline-flex mt-3 items-center px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-wider">
                      Hạng {course.licenseType}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5 mb-2">
                    <CreditCard className="w-3.5 h-3.5" /> Học phí niêm yết
                  </label>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 group">
                    <span className="text-2xl font-black text-emerald-700">
                      {course.price.toLocaleString("vi-VN")}
                      <span className="text-xs ml-1 font-bold text-emerald-400 tracking-tighter uppercase">
                        VND
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col justify-center text-center">
                  <Calendar className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <span className="text-2xl font-black text-indigo-900 leading-none">
                    {course.durationInWeeks}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
                    Tuần đào tạo
                  </span>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex flex-col justify-center text-center">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <span className="text-2xl font-black text-purple-900 leading-none">
                    {course.maxStudents}
                  </span>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-1">
                    Học viên tối đa
                  </span>
                </div>
                <div className="col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${course.isActive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}
                    >
                      {course.isActive ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <ShieldAlert className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">
                        Trạng thái
                      </span>
                      <span
                        className={`text-sm font-black uppercase ${course.isActive ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {course.isActive ? "Đang hoạt động" : "Tạm dừng"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5 mb-2">
                <BarChart3 className="w-3.5 h-3.5" /> Mô tả khóa học
              </label>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium italic">
                "
                {course.description ||
                  "Chưa có mô tả chi tiết cho khóa học này."}
                "
              </div>
            </div>

            {/* ROADMAP SECTION */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-black uppercase text-slate-800 tracking-widest flex items-center gap-1.5">
                  Lộ trình đào tạo
                </label>
                <button
                  onClick={() => {
                    setRoadmapEditTarget(null);
                    setRoadmapModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Thêm chặng
                </button>
              </div>

              {roadmapLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                </div>
              ) : roadmaps.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm font-medium border-2 border-dashed rounded-xl">
                  Chưa có lộ trình nào. Bấm "Thêm chặng" để tạo.
                </div>
              ) : (
                <div className="space-y-3">
                  {[...roadmaps]
                    .sort((a, b) => a.orderNo - b.orderNo)
                    .map((rm) => (
                      <div
                        key={rm.id}
                        className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
                      >
                        <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0">
                          {rm.orderNo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-800 text-sm">
                              {rm.title}
                            </h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setRoadmapEditTarget(rm);
                                  setRoadmapModalOpen(true);
                                }}
                                className="text-xs text-blue-600 hover:underline font-bold"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteRoadmap(rm.id, rm.title)
                                }
                                className="text-xs text-red-500 hover:underline font-bold"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                          {/* <div className="flex gap-2 items-center mt-1 mb-2">
                          <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{rm.type}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${rm.status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {rm.status ? 'Hoạt động' : 'Tạm ẩn'}
                          </span>
                        </div> */}
                          <p className="text-xs text-slate-600">
                            {rm.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-wider shadow-sm"
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

// ─── Main View ────────────────────────────────────────────────────────────────

export default function CourseClientView() {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [centerFilter, setCenterFilter] = useState("");
  const [detailTarget, setDetailTarget] = useState<Course | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      // Load both courses and centers
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
    fetchCourses();
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
    if (!confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.courseName}"?`))
      return;

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

  const stats = useMemo(() => {
    return {
      total: courses.length,
      active: courses.filter((c) => c.isActive).length,
      suspended: courses.filter((c) => !c.isActive).length,
    };
  }, [courses]);

  const handleToggleStatus = async (course: Course) => {
    setActionLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      if (course.isActive) {
        await courseService.deactivateCourse(course.id);
        toast.success("Đã tạm dừng khóa học.");
      } else {
        await courseService.updateCourse(course.id, { isActive: true });
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none uppercase">
              Quản lý Khóa đào tạo
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5 opacity-80">
              Danh mục chương trình học & trạng thái vận hành
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Thêm khóa học mới
        </button>
      </div>

      <CourseStats stats={stats} loading={loading} />

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/30">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative max-w-md w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
              <input
                type="text"
                placeholder="Tìm theo tên khóa học hoặc hạng bằng..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative min-w-[220px]">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none text-slate-600 cursor-pointer shadow-sm"
                value={centerFilter}
                onChange={(e) => setCenterFilter(e.target.value)}
              >
                <option value="">Tất cả Trung tâm</option>
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
            <div className="px-4 py-2 bg-slate-100 rounded-xl text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
              {filtered.length} Kết quả
            </div>
          </div>
        </div>

        <div className="relative">
          {actionLoading && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}
          <CourseTable
            data={filtered}
            loading={loading}
            onToggleStatus={handleToggleStatus}
            onViewDetail={(c) => setDetailTarget(c)}
            onEdit={(c) => {
              setEditTarget(c);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {detailTarget && (
        <CourseDetailModal
          course={detailTarget}
          onClose={() => setDetailTarget(null)}
        />
      )}

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
