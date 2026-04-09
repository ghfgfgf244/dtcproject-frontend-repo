"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, UserSquare2, Mail, Phone, CalendarDays, Users, Trash2, Plus, MapPin, Clock3 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import AddStudentModal from "@/components/manager/Modals/AddStudentModal";
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

  const fetchData = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      const token = await getToken();
      setAuthToken(token);

      const [detail, studentData, availableData, scheduleData, instructorData, addressData] = await Promise.all([
        classService.getClassDetail(classId),
        classService.getClassStudents(classId),
        classService.getAvailableStudents(classId),
        scheduleService.getByClass(classId),
        userService.getInstructors(),
        addressService.getAll(),
      ]);

      setClassDetail(detail);
      setStudents(studentData);
      setAvailableStudents(availableData);
      setSchedules(
        [...scheduleData].sort((left, right) => new Date(left.startTime).getTime() - new Date(right.startTime).getTime())
      );
      setInstructors(instructorData);
      setAddresses(addressData);
      setSelectedInstructorId(detail?.instructorId ?? "");
    } catch {
      toast.error("Khong the tai chi tiet lop hoc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classId, isLoaded, isSignedIn]);

  const selectedInstructor = useMemo(
    () => instructors.find((instructor) => instructor.id === (selectedInstructorId || classDetail?.instructorId)),
    [instructors, selectedInstructorId, classDetail]
  );

  const availableStudentOptions: StudentOption[] = useMemo(
    () =>
      availableStudents.map((student) => ({
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone || "N/A",
        avatar: student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=e2e8f0&color=475569`,
        enrolledCourses: classDetail?.courseName ? [classDetail.courseName] : [],
      })),
    [availableStudents, classDetail]
  );

  const handleAssignTeacher = async () => {
    if (!selectedInstructorId || !classDetail) return;
    setIsAssigningTeacher(true);
    try {
      await classService.assignTeacher(classId, selectedInstructorId);
      toast.success("Da cap nhat giao vien phu trach");
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the cap nhat giao vien");
    } finally {
      setIsAssigningTeacher(false);
    }
  };

  const handleAddStudents = async (selectedStudentIds: string[]) => {
    if (!classDetail) return;

    try {
      const mergedStudentIds = Array.from(new Set([...students.map((student) => student.id), ...selectedStudentIds]));
      await classService.assignStudents(classId, mergedStudentIds);
      toast.success("Da them hoc vien vao lop");
      setIsAddStudentModalOpen(false);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the them hoc vien");
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
      toast.success("Da xoa hoc vien khoi lop");
      setStudentToDelete(null);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the xoa hoc vien");
    }
  };

  if (loading) {
    return (
      <div className="h-[320px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Dang tai chi tiet lop hoc...</span>
        </div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Khong tim thay lop hoc.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">{classDetail.className}</h2>
          <p className="text-slate-500 text-sm">
            {classDetail.courseName} / {classDetail.termName} / {classDetail.classType}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lai
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6">Thong tin lop hoc</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ky hoc</p>
                <p className="text-slate-900 font-bold text-sm">{classDetail.termName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Trang thai</p>
                <p className="text-slate-900 font-bold text-sm">{classDetail.status}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ngay bat dau</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CalendarDays className="w-4 h-4 text-slate-400" /> {formatDate(classDetail.termStartDate)}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ngay ket thuc</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CalendarDays className="w-4 h-4 text-slate-400" /> {formatDate(classDetail.termEndDate)}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Hoc vien</p>
                <p className="text-slate-900 font-bold text-sm">
                  {classDetail.currentStudents}/{classDetail.maxStudents}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Trung tam</p>
                <p className="text-slate-900 font-bold text-sm">{classDetail.centerName || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Hoc vien trong lop
                <span className="bg-slate-100 text-slate-500 text-[11px] font-bold py-1 px-3 rounded-full ml-2">
                  {students.length} tong
                </span>
              </h3>

              <button
                onClick={() => setIsAddStudentModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm shadow-blue-600/20 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" /> Them hoc vien
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoc vien</th>
                    <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lien he</th>
                    <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai tro</th>
                    <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tac</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 md:px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black bg-slate-100 text-slate-700">
                            {getInitials(student.fullName)}
                          </div>
                          <span className="font-bold text-sm text-slate-900">{student.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 text-slate-500 text-sm font-medium">
                        <div>{student.email}</div>
                        <div className="text-xs text-slate-400">{student.phone || "N/A"}</div>
                      </td>
                      <td className="px-6 md:px-8 py-4 text-slate-500 text-sm font-medium">
                        {(student.roles || []).join(", ") || "Student"}
                      </td>
                      <td className="px-6 md:px-8 py-4 text-right">
                        <button
                          onClick={() => setStudentToDelete(student)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-md"
                          title="Xoa hoc vien"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-sm text-slate-500">
                        Chua co hoc vien nao trong lop.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock3 className="w-5 h-5 text-blue-600" /> Danh sach lich hoc
              </h3>
              
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" /> Them lich hoc
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{formatDateTime(schedule.startTime)}</div>
                    <div className="text-sm text-slate-500">{formatDateTime(schedule.endTime)}</div>
                  </div>
                  <div className="text-sm text-slate-600">
                    <div className="font-semibold">{schedule.instructorName}</div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-4 h-4" />
                      {schedule.addressName}
                    </div>
                  </div>
                </div>
              ))}

              {schedules.length === 0 && <div className="p-6 text-sm text-slate-500">Chua co lich hoc nao cho lop nay.</div>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
              <UserSquare2 className="w-5 h-5 text-blue-600" /> Giao vien phu trach
            </h3>

            <div className="space-y-4">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                value={selectedInstructorId}
                onChange={(e) => setSelectedInstructorId(e.target.value)}
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
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
              >
                {isAssigningTeacher ? "Dang cap nhat..." : "Gan giao vien khac"}
              </button>
            </div>

            {selectedInstructor && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <div className="text-lg font-black text-slate-900">{selectedInstructor.fullName}</div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 font-medium truncate">{selectedInstructor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 font-medium">{selectedInstructor.phone || "N/A"}</span>
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
      />

      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        title="Xoa hoc vien khoi lop"
        message={`Ban co chac chan muon xoa "${studentToDelete?.fullName ?? ""}" khoi lop nay khong?`}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={handleRemoveStudent}
      />
    </div>
  );
}
