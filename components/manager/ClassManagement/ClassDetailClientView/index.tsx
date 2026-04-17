"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  UserSquare2,
  Mail,
  Phone,
  CalendarDays,
  Users,
  Trash2,
  Plus,
  MapPin,
  Clock3,
  ArrowRightLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import AddStudentModal from "@/components/manager/Modals/AddStudentModal";
import TransferStudentModal from "@/components/manager/Modals/TransferStudentModal";
import ConfirmModal from "@/components/ui/confirm-modal";
import { classService, ClassDto, ClassStudent } from "@/services/classService";
import { scheduleService, ClassSchedule } from "@/services/scheduleService";
import { userService, UserListItem } from "@/services/userService";
import { addressService, AddressOption } from "@/services/addressService";
import { StudentOption } from "@/types/class-detail";
import ScheduleModal, { ScheduleFormData } from "@/components/manager/Modals/ScheduleModal";

interface Props {
  classId: string;
}

function formatDate(date?: string) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("vi-VN");
}

function formatDateTime(date?: string) {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("vi-VN");
}

function getClassTypeLabel(classType?: string) {
  if (classType === "Theory") return "Lý thuyết";
  if (classType === "Practice") return "Thực hành";
  return classType || "N/A";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ClassDetailClientView({ classId }: Props) {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [classDetail, setClassDetail] = useState<ClassDto | null>(null);
  const [allClasses, setAllClasses] = useState<ClassDto[]>([]);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [availableStudents, setAvailableStudents] = useState<ClassStudent[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [instructors, setInstructors] = useState<UserListItem[]>([]);
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<ClassStudent | null>(null);
  const [studentToTransfer, setStudentToTransfer] = useState<ClassStudent | null>(null);

  const fetchData = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      const token = await getToken();
      setAuthToken(token);

      const [detail, classData, studentData, availableData, scheduleData, instructorData, addressData] =
        await Promise.all([
          classService.getClassDetail(classId),
          classService.getAllClasses(),
          classService.getClassStudents(classId),
          classService.getAvailableStudents(classId),
          scheduleService.getByClass(classId),
          userService.getInstructors(),
          addressService.getAll(),
        ]);

      setClassDetail(detail);
      setAllClasses(classData);
      setStudents(studentData);
      setAvailableStudents(availableData);
      setSchedules(
        [...scheduleData].sort((left, right) => new Date(left.startTime).getTime() - new Date(right.startTime).getTime()),
      );
      setInstructors(instructorData);
      setAddresses(addressData);
      setSelectedInstructorId(detail?.instructorId ?? "");
    } catch {
      toast.error("Không thể tải chi tiết lớp học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classId, isLoaded, isSignedIn]);

  const selectedInstructor = useMemo(
    () => instructors.find((instructor) => instructor.id === (selectedInstructorId || classDetail?.instructorId)),
    [instructors, selectedInstructorId, classDetail],
  );

  const availableStudentOptions: StudentOption[] = useMemo(
    () =>
      availableStudents.map((student) => ({
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone || "N/A",
        avatar:
          student.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=e2e8f0&color=475569`,
        enrolledCourses: classDetail?.courseName ? [classDetail.courseName] : [],
      })),
    [availableStudents, classDetail],
  );

  const transferTargetClasses = useMemo(() => {
    if (!classDetail) return [];

    return allClasses.filter(
      (item) =>
        item.id !== classDetail.id &&
        item.termId === classDetail.termId &&
        item.courseId === classDetail.courseId &&
        item.classType === classDetail.classType &&
        item.status !== "Cancelled" &&
        item.status !== "Completed",
    );
  }, [allClasses, classDetail]);

  const handleAssignTeacher = async () => {
    if (!selectedInstructorId || !classDetail) return;
    setIsAssigningTeacher(true);
    try {
      await classService.assignTeacher(classId, selectedInstructorId);
      toast.success("Đã cập nhật giáo viên phụ trách");
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể cập nhật giáo viên");
    } finally {
      setIsAssigningTeacher(false);
    }
  };

  const handleAddStudents = async (selectedStudentIds: string[]) => {
    if (!classDetail) return;

    try {
      const mergedStudentIds = Array.from(new Set([...students.map((student) => student.id), ...selectedStudentIds]));
      await classService.assignStudents(classId, mergedStudentIds);
      toast.success("Đã thêm học viên vào lớp");
      setIsAddStudentModalOpen(false);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể thêm học viên");
    }
  };

  const handleSaveSchedule = async (data: ScheduleFormData) => {
    try {
      await scheduleService.createBulk(classId, [
        {
          instructorId: data.instructorId,
          startTime: data.startTime,
          endTime: data.endTime,
          addressId: data.addressId,
        },
      ]);
      toast.success("Đã thêm lịch học mới");
      setIsScheduleModalOpen(false);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể lưu lịch học");
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToDelete) return;

    try {
      await classService.removeStudent(classId, studentToDelete.id);
      toast.success("Đã xóa học viên khỏi lớp");
      setStudentToDelete(null);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể xóa học viên");
    }
  };

  const handleTransferStudent = async (targetClassId: string) => {
    if (!studentToTransfer) return;

    try {
      await classService.transferStudent(classId, studentToTransfer.id, { targetClassId });
      toast.success("Đã chuyển học viên sang lớp mới");
      setStudentToTransfer(null);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể chuyển học viên");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[320px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Đang tải chi tiết lớp học...</span>
        </div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Không tìm thấy lớp học.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900">{classDetail.className}</h2>
          <p className="text-sm text-slate-500">
            {classDetail.courseName} / {classDetail.termName} / {getClassTypeLabel(classDetail.classType)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h3 className="mb-6 text-lg font-black text-slate-900">Thông tin lớp học</h3>
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Kỳ học</p>
                <p className="text-sm font-bold text-slate-900">{classDetail.termName}</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</p>
                <p className="text-sm font-bold text-slate-900">{classDetail.status}</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ngày bắt đầu</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <CalendarDays className="h-4 w-4 text-slate-400" /> {formatDate(classDetail.termStartDate)}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ngày kết thúc</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <CalendarDays className="h-4 w-4 text-slate-400" /> {formatDate(classDetail.termEndDate)}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Học viên</p>
                <p className="text-sm font-bold text-slate-900">
                  {classDetail.currentStudents}/{classDetail.maxStudents}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trung tâm</p>
                <p className="text-sm font-bold text-slate-900">{classDetail.centerName || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:p-8">
              <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
                <Users className="h-5 w-5 text-blue-600" /> Học viên trong lớp
                <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
                  {students.length} tổng
                </span>
              </h3>

              <button
                onClick={() => setIsAddStudentModalOpen(true)}
                disabled={availableStudents.length === 0}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                title={
                  availableStudents.length === 0
                    ? `Không còn học viên phù hợp cho lớp ${getClassTypeLabel(classDetail.classType).toLowerCase()}`
                    : "Thêm học viên"
                }
              >
                <Plus className="h-4 w-4" /> Thêm học viên
              </button>
            </div>

            <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-sm text-slate-600 md:px-8">
              Hệ thống chỉ hiển thị học viên chưa có lớp {getClassTypeLabel(classDetail.classType).toLowerCase()} trong cùng kỳ học.
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 md:px-8">
                      Học viên
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 md:px-8">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 md:px-8">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.id} className="group transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 md:px-8">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                            {getInitials(student.fullName)}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{student.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 md:px-8">
                        <div>{student.email}</div>
                        <div className="text-xs text-slate-400">{student.phone || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 text-right md:px-8">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setStudentToTransfer(student)}
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            title="Chuyển lớp"
                          >
                            <ArrowRightLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setStudentToDelete(student)}
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Xóa học viên"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-sm text-slate-500">
                        Chưa có học viên nào trong lớp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:p-8">
              <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
                <Clock3 className="h-5 w-5 text-blue-600" /> Danh sách lịch học
              </h3>

              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Thêm lịch học
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{formatDateTime(schedule.startTime)}</div>
                    <div className="text-sm text-slate-500">{formatDateTime(schedule.endTime)}</div>
                  </div>
                  <div className="text-sm text-slate-600">
                    <div className="font-semibold">{schedule.instructorName}</div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {schedule.addressName}
                    </div>
                  </div>
                </div>
              ))}

              {schedules.length === 0 && <div className="p-6 text-sm text-slate-500">Chưa có lịch học nào cho lớp này.</div>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-900">
              <UserSquare2 className="h-5 w-5 text-blue-600" /> Giáo viên phụ trách
            </h3>

            <div className="space-y-4">
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                value={selectedInstructorId}
                onChange={(event) => setSelectedInstructorId(event.target.value)}
              >
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.fullName}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssignTeacher}
                disabled={!selectedInstructorId || isAssigningTeacher}
                className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isAssigningTeacher ? "Đang cập nhật..." : "Gán giáo viên khác"}
              </button>
            </div>

            {selectedInstructor && (
              <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                <div className="text-lg font-black text-slate-900">{selectedInstructor.fullName}</div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate font-medium text-slate-600">{selectedInstructor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="font-medium text-slate-600">{selectedInstructor.phone || "N/A"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        availableStudents={availableStudentOptions}
        classTypeLabel={getClassTypeLabel(classDetail.classType)}
        courseName={classDetail.courseName}
        termName={classDetail.termName}
        onSubmit={handleAddStudents}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        initialData={null}
        onSubmit={handleSaveSchedule}
        instructors={instructors}
        addresses={addresses}
        fixedClassId={classId}
        fixedInstructorId={classDetail.instructorId}
      />

      <TransferStudentModal
        isOpen={Boolean(studentToTransfer)}
        student={studentToTransfer}
        targetClasses={transferTargetClasses}
        currentClassName={classDetail.className}
        classTypeLabel={getClassTypeLabel(classDetail.classType)}
        onClose={() => setStudentToTransfer(null)}
        onSubmit={handleTransferStudent}
      />

      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        title="Xóa học viên khỏi lớp"
        message={`Bạn có chắc chắn muốn xóa "${studentToDelete?.fullName ?? ""}" khỏi lớp này không?`}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={handleRemoveStudent}
      />
    </div>
  );
}
