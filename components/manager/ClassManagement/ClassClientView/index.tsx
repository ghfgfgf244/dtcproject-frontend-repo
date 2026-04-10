"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, RefreshCw, Users, CalendarClock, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import ConfirmModal from "@/components/ui/confirm-modal";
import ClassTable from "@/components/manager/ClassManagement/ClassTable";
import ClassModal from "@/components/manager/Modals/ClassModal";
import AutoAssignModal from "@/components/manager/Modals/AutoAssignModal";
import { classService, ClassDto } from "@/services/classService";
import { scheduleService } from "@/services/scheduleService";
import { termService } from "@/services/termService";
import { userService } from "@/services/userService";
import { addressService } from "@/services/addressService";
import { ClassFormData, ClassRecord, ClassType } from "@/types/class";
import { TermRecord } from "@/types/term";
import { UserListItem } from "@/services/userService";
import { AddressOption } from "@/services/addressService";

const ITEMS_PER_PAGE = 8;

const classTypeMap: Record<ClassType, 1 | 2> = {
  Theory: 1,
  Practice: 2,
};

function mapTheme(classType: string): ClassRecord["theme"] {
  return classType === "Practice" ? "emerald" : "blue";
}

function formatDate(date?: string) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("vi-VN");
}

function mapClassRecord(dto: ClassDto): ClassRecord {
  return {
    id: dto.id,
    code: dto.classType === "Practice" ? "TH" : "LT",
    name: dto.className,
    courseName: dto.courseName || "Chưa rõ khóa học",
    termName: dto.termName || "Chưa rõ kỳ học",
    classType: dto.classType,
    status: dto.status,
    currentStudents: dto.currentStudents,
    maxStudents: dto.maxStudents,
    instructorName: dto.instructorName || "Chưa phân công",
    startDate: formatDate(dto.termStartDate),
    endDate: formatDate(dto.termEndDate),
    theme: mapTheme(dto.classType),
  };
}

function mapToFormData(dto: ClassDto): ClassFormData {
  return {
    id: dto.id,
    className: dto.className,
    termId: dto.termId,
    instructorId: dto.instructorId,
    classType: dto.classType,
    maxStudents: dto.maxStudents,
    schedules: [],
  };
}

export default function ClassClientView() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [rawClasses, setRawClasses] = useState<ClassDto[]>([]);
  const [terms, setTerms] = useState<TermRecord[]>([]);
  const [instructors, setInstructors] = useState<UserListItem[]>([]);
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoAssignModalOpen, setIsAutoAssignModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassRecord | null>(null);

  const breadcrumbsItems = [
    { label: "Trang chủ", href: "/training-manager/dashboard" },
    { label: "Lớp học", href: "/training-manager/classes" },
  ];

  const ensureAuthToken = async () => {
    const token = await getToken({ skipCache: true });
    setAuthToken(token);
    return token;
  };

  const fetchData = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      await ensureAuthToken();

      const [classData, termData, instructorData, addressData] = await Promise.all([
        classService.getAllClasses(),
        termService.getAllTerms(),
        userService.getInstructors(),
        addressService.getAll(),
      ]);

      setRawClasses(classData);
      setClasses(classData.map(mapClassRecord));
      setTerms(termData);
      setInstructors(instructorData);
      setAddresses(addressData);
    } catch (error) {
      toast.error("Không thể tải dữ liệu lớp học");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoaded, isSignedIn]);

  const totalItems = classes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginatedClasses = useMemo(
    () => classes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [classes, currentPage]
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSubmitClass = async (data: ClassFormData) => {
    await ensureAuthToken();

    const payload = {
      termId: data.termId,
      instructorId: data.instructorId,
      className: data.className,
      maxStudents: data.maxStudents,
      classType: classTypeMap[data.classType],
    } as const;

    if (data.id) {
      await classService.updateClass(data.id, payload);
      await classService.assignTeacher(data.id, data.instructorId);
      toast.success("Đã cập nhật lớp học");
    } else {
      const created = await classService.createClass(payload);
      if (data.schedules.length > 0) {
        await scheduleService.createBulk(
          created.id,
          data.schedules.map((schedule) => ({
            instructorId: schedule.instructorId,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            addressId: schedule.addressId,
          }))
        );
      }
      toast.success("Đã tạo lớp học");
    }

    setIsModalOpen(false);
    setEditingClass(null);
    await fetchData();
  };

  const handleRunAutoAssign = async (payload: { termId: string; classType: ClassType }) => {
    await ensureAuthToken();
    const response = await classService.autoAssign({
      termId: payload.termId,
      classType: classTypeMap[payload.classType],
    });
    toast.success(response.message || "Đã xếp lớp tự động");
    setIsAutoAssignModalOpen(false);
    await fetchData();
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;
    await ensureAuthToken();
    await classService.deleteClass(classToDelete.id);
    toast.success("Đã xóa lớp học");
    setClassToDelete(null);
    await fetchData();
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Đang tải danh sách lớp học...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="mb-2">
            <Breadcrumbs items={breadcrumbsItems} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Quản lý lớp học</h2>
          <p className="text-slate-500 mt-1">Danh sách lớp học được xếp theo term và khóa học.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} /> Làm mới
          </button>
          <button
            onClick={() => {
              setEditingClass(null);
              setIsModalOpen(true);
            }}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Thêm lớp thủ công
          </button>
          <button
            onClick={() => setIsAutoAssignModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Xếp lớp tự động
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-600/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Tổng số lớp học</p>
              <h3 className="text-3xl font-bold mt-1">{classes.length}</h3>
            </div>
            <div className="bg-white/20 p-2.5 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Chờ khai giảng</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">
                {classes.filter((item) => item.status === "Pending").length}
              </h3>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600">
              <CalendarClock className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Đang hoạt động</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">
                {classes.filter((item) => item.status === "InProgress").length}
              </h3>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <ClassTable
        classes={paginatedClasses}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        onView={(cls) => router.push(`/training-manager/classes/${cls.id}`)}
        onEdit={(cls) => {
          const found = rawClasses.find((item) => item.id === cls.id) || null;
          setEditingClass(found);
          setIsModalOpen(true);
        }}
        onDelete={(cls) => setClassToDelete(cls)}
      />

      <ClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClass(null);
        }}
        initialData={editingClass ? mapToFormData(editingClass) : null}
        terms={terms}
        instructors={instructors}
        addresses={addresses}
        onSubmit={handleSubmitClass}
      />

      <AutoAssignModal
        isOpen={isAutoAssignModalOpen}
        onClose={() => setIsAutoAssignModalOpen(false)}
        terms={terms}
        onConfirm={handleRunAutoAssign}
      />

      <ConfirmModal
        isOpen={Boolean(classToDelete)}
        onCancel={() => setClassToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa lớp học"
        message={`Bạn có chắc muốn xóa lớp "${classToDelete?.name ?? ""}"?`}
      />
    </div>
  );
}
