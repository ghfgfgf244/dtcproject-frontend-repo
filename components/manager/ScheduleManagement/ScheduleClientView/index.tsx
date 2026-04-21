"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CalendarPlus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { classService, ClassDto } from "@/services/classService";
import { courseService } from "@/services/courseService";
import { scheduleService, ClassSchedule } from "@/services/scheduleService";
import { termService } from "@/services/termService";
import { userService } from "@/services/userService";
import { addressService } from "@/services/addressService";
import {
  DailyInsight,
  ScheduleEvent,
  ScheduleEventType,
  WeeklyInsight,
} from "@/types/schedule";
import { Course } from "@/types/course";
import { TermRecord } from "@/types/term";
import ScheduleCalendar from "../ScheduleCalendar";
import ScheduleWeeklyCalendar from "../ScheduleWeeklyCalendar";
import ScheduleDailyCalendar from "../ScheduleDailyCalendar";
import ScheduleModal, {
  ScheduleFormData,
} from "@/components/manager/Modals/ScheduleModal";
import ConfirmModal from "@/components/ui/confirm-modal";

type ViewMode = "MONTH" | "WEEK" | "DAY";

function formatDateKey(input: Date | string) {
  const date = typeof input === "string" ? new Date(input) : input;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function startOfWeek(date: Date) {
  const clone = new Date(date);
  const day = (clone.getDay() + 6) % 7;
  clone.setDate(clone.getDate() - day);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function endOfWeek(date: Date) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function parseDateOnly(value?: string) {
  if (!value) return null;
  return new Date(`${value}T00:00:00`);
}

function getNearestTerm(terms: TermRecord[]) {
  if (terms.length === 0) return null;

  const now = new Date();

  return [...terms].sort((left, right) => {
    const leftStart = parseDateOnly(left.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const leftEnd = parseDateOnly(left.endDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const rightStart = parseDateOnly(right.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const rightEnd = parseDateOnly(right.endDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;

    const leftDistance =
      now.getTime() < leftStart
        ? leftStart - now.getTime()
        : now.getTime() > leftEnd
          ? now.getTime() - leftEnd
          : 0;

    const rightDistance =
      now.getTime() < rightStart
        ? rightStart - now.getTime()
        : now.getTime() > rightEnd
          ? now.getTime() - rightEnd
          : 0;

    if (leftDistance !== rightDistance) return leftDistance - rightDistance;
    return leftStart - rightStart;
  })[0];
}

function mapEventType(classType?: string): ScheduleEventType {
  if (classType === "Practice") return "Practice";
  return "Theory";
}

function extractTime(dateTime: string) {
  const date = new Date(dateTime);
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function mapScheduleEvent(
  schedule: ClassSchedule,
  classMap: Map<string, ClassDto>,
): ScheduleEvent {
  const classInfo = classMap.get(schedule.classId);
  const startDate = new Date(schedule.startTime);

  return {
    id: schedule.id,
    classId: schedule.classId,
    className: schedule.className,
    courseId: classInfo?.courseId || schedule.classId,
    courseName: classInfo?.courseName || schedule.className,
    instructorId: schedule.instructorId,
    instructorName: schedule.instructorName,
    eventType: mapEventType(classInfo?.classType),
    startTime: extractTime(schedule.startTime),
    endTime: extractTime(schedule.endTime),
    startDateTime: schedule.startTime,
    endDateTime: schedule.endTime,
    dateKey: formatDateKey(startDate),
    addressId: schedule.addressId,
    addressName: schedule.addressName,
    location: schedule.location || schedule.addressName,
    studentCount: classInfo?.currentStudents || 0,
  };
}

export default function ScheduleClientView() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [terms, setTerms] = useState<TermRecord[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [instructors, setInstructors] = useState<
    { id: string; fullName: string }[]
  >([]);
  const [addresses, setAddresses] = useState<
    { id: number; addressName: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("DAY");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTermId, setSelectedTermId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const ensureAuthToken = async () => {
    const token = await getToken();
    setAuthToken(token ?? null);
    return token;
  };

  const resetData = () => {
    setCourses([]);
    setTerms([]);
    setClasses([]);
    setInstructors([]);
    setAddresses([]);
    setEvents([]);
    setSelectedCourseId("");
    setSelectedTermId("");
  };

  const fetchBaseData = async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setAuthToken(null);
      resetData();
      return;
    }

    const token = await ensureAuthToken();
    if (!token) {
      resetData();
      return;
    }

    const [courseResult, termResult, instructorResult, addressResult] =
      await Promise.allSettled([
        courseService.getAllAdminCourses(),
        termService.getAllTerms(),
        userService.getInstructors(),
        addressService.getAll(),
      ]);

    const courseData =
      courseResult.status === "fulfilled" ? courseResult.value : [];
    const termData = termResult.status === "fulfilled" ? termResult.value : [];
    const instructorData =
      instructorResult.status === "fulfilled" ? instructorResult.value : [];
    const addressData =
      addressResult.status === "fulfilled" ? addressResult.value : [];

    setCourses(courseData);
    setTerms(termData);
    setInstructors(
      instructorData.map((item) => ({
        id: item.id,
        fullName: item.fullName,
      })),
    );
    setAddresses(addressData);

    const nearestTerm = getNearestTerm(termData);
    if (nearestTerm) {
      setSelectedCourseId(nearestTerm.courseId);
      setSelectedTermId(nearestTerm.id);
    } else {
      setSelectedCourseId(courseData[0]?.id || "");
      setSelectedTermId("");
      setClasses([]);
      setEvents([]);
    }
  };

  const fetchTermData = async (termId: string) => {
    if (!termId) {
      setClasses([]);
      setEvents([]);
      return;
    }

    const token = await ensureAuthToken();
    if (!token) {
      setClasses([]);
      setEvents([]);
      return;
    }

    const [classData, scheduleData] = await Promise.all([
      classService.getClassesByTerm(termId),
      scheduleService.getByTerm(termId),
    ]);

    const classMap = new Map(classData.map((item) => [item.id, item]));
    const mappedEvents = scheduleData
      .map((item) => mapScheduleEvent(item, classMap))
      .sort((left, right) => left.startDateTime.localeCompare(right.startDateTime));

    setClasses(classData);
    setEvents(mappedEvents);

    if (mappedEvents.length > 0) {
      const todayKey = formatDateKey(new Date());
      const hasTodayEvents = mappedEvents.some((item) => item.dateKey === todayKey);

      if (!hasTodayEvents) {
        setSelectedDate(new Date(mappedEvents[0].startDateTime));
      }
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        await fetchBaseData();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Không thể tải dữ liệu lịch học.");
        resetData();
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    })();
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!selectedCourseId) return;

    const availableTerms = terms.filter((item) => item.courseId === selectedCourseId);
    if (availableTerms.length === 0) {
      setSelectedTermId("");
      setClasses([]);
      setEvents([]);
      return;
    }

    const hasSelectedTerm = availableTerms.some((item) => item.id === selectedTermId);
    if (!hasSelectedTerm) {
      setSelectedTermId(getNearestTerm(availableTerms)?.id || availableTerms[0].id);
    }
  }, [selectedCourseId, selectedTermId, terms]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    void (async () => {
      try {
        setLoading(true);
        await fetchTermData(selectedTermId);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Không thể tải lịch học theo kỳ.");
        setClasses([]);
        setEvents([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    })();
  }, [isLoaded, isSignedIn, selectedTermId]);

  const filteredTerms = useMemo(
    () => terms.filter((item) => item.courseId === selectedCourseId),
    [selectedCourseId, terms],
  );

  const editingEvent = useMemo(() => {
    if (!editingEventId) return null;
    return events.find((event) => event.id === editingEventId) || null;
  }, [editingEventId, events]);

  const currentDateKey = useMemo(
    () => formatDateKey(selectedDate),
    [selectedDate],
  );

  const currentDayEvents = useMemo(
    () =>
      events
        .filter((event) => event.dateKey === currentDateKey)
        .sort((left, right) => left.startTime.localeCompare(right.startTime)),
    [currentDateKey, events],
  );

  const weeklyEvents = useMemo(() => {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);

    return events.filter((event) => {
      const eventDate = new Date(event.startDateTime);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });
  }, [events, selectedDate]);

  const dailyInsights: DailyInsight = useMemo(
    () => ({
      theoryCount: currentDayEvents.filter(
        (event) => event.eventType === "Theory",
      ).length,
      practiceCount: currentDayEvents.filter(
        (event) => event.eventType === "Practice",
      ).length,
      simulationCount: currentDayEvents.filter(
        (event) => event.eventType === "Simulator",
      ).length,
      totalStudents: currentDayEvents.reduce(
        (sum, event) => sum + (event.studentCount || 0),
        0,
      ),
    }),
    [currentDayEvents],
  );

  const weeklyInsights: WeeklyInsight = useMemo(
    () => ({
      completedClasses: classes.filter((item) => item.status === "Completed")
        .length,
      totalClasses: weeklyEvents.length,
      activeClasses: classes.filter((item) => item.status === "InProgress")
        .length,
      pendingCourses: classes.filter((item) => item.status === "Pending")
        .length,
    }),
    [classes, weeklyEvents.length],
  );

  const handleRefresh = () => {
    setRefreshing(true);
    void (async () => {
      try {
        setLoading(true);
        await fetchBaseData();
        if (selectedTermId) {
          await fetchTermData(selectedTermId);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Không thể làm mới lịch học.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    })();
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode("DAY");
  };

  const handleAddSlot = () => {
    setEditingEventId(null);
    setIsModalOpen(true);
  };

  const handleEditSlot = (id: string) => {
    setEditingEventId(id);
    setIsModalOpen(true);
  };

  const handleSubmitSchedule = async (formData: ScheduleFormData) => {
    try {
      await ensureAuthToken();

      if (formData.importedSchedules && formData.importedSchedules.length > 0) {
        await scheduleService.createBulk(
          formData.classId,
          formData.importedSchedules,
        );
        toast.success("Đã nhập lịch học từ file Excel.");
      } else if (editingEvent) {
        await scheduleService.update(editingEvent.id, {
          instructorId: formData.instructorId,
          startTime: formData.startTime,
          endTime: formData.endTime,
          addressId: formData.addressId,
        });
        toast.success("Đã cập nhật lịch học.");
      } else {
        await scheduleService.create({
          classId: formData.classId,
          instructorId: formData.instructorId,
          startTime: formData.startTime,
          endTime: formData.endTime,
          addressId: formData.addressId,
        });
        toast.success("Đã tạo lịch học.");
      }

      setIsModalOpen(false);
      setEditingEventId(null);
      setLoading(true);
      await fetchTermData(selectedTermId);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể lưu lịch học.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlotClick = (id: string) => {
    setEventToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      await ensureAuthToken();
      await scheduleService.delete(eventToDelete);
      toast.success("Đã xóa lịch học.");
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      setLoading(true);
      await fetchTermData(selectedTermId);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể xóa lịch học.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex h-[320px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Đang tải lịch học...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="mb-2 text-[30px] font-black leading-none tracking-tight text-slate-900">
            {viewMode === "MONTH" && `Lịch học ${formatMonthLabel(selectedDate)}`}
            {viewMode === "WEEK" &&
              `Lịch học tuần ${formatDayLabel(startOfWeek(selectedDate))}`}
            {viewMode === "DAY" && `Lịch học ${formatDayLabel(selectedDate)}`}
          </h2>
          <p className="text-sm text-slate-500">
            Xem, tạo và điều phối lịch học của từng lớp theo dữ liệu thật từ hệ
            thống.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Làm mới
          </button>
          <div className="rounded-lg border border-slate-200 bg-slate-200/50 p-1 shadow-sm">
            <button
              onClick={() => setViewMode("MONTH")}
              className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${
                viewMode === "MONTH"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Tháng
            </button>
            <button
              onClick={() => setViewMode("WEEK")}
              className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${
                viewMode === "WEEK"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode("DAY")}
              className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${
                viewMode === "DAY"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Ngày
            </button>
          </div>
          <button
            onClick={handleAddSlot}
            className="hidden items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 md:flex"
          >
            <CalendarPlus className="h-5 w-5" />
            Thêm lịch học
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Khóa học
          </span>
          <select
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">-- Chọn khóa học --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Kỳ học
          </span>
          <select
            value={selectedTermId}
            onChange={(event) => setSelectedTermId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">-- Chọn kỳ học --</option>
            {filteredTerms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.name} ({new Date(term.startDate).toLocaleDateString("vi-VN")} -{" "}
                {new Date(term.endDate).toLocaleDateString("vi-VN")})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Tổng lớp
              </p>
              <p className="text-xl font-black text-slate-900">{classes.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Lịch trong tuần
              </p>
              <p className="text-xl font-black text-slate-900">
                {weeklyInsights.totalClasses}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Đang hoạt động
              </p>
              <p className="text-xl font-black text-slate-900">
                {weeklyInsights.activeClasses}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Chờ khai giảng
              </p>
              <p className="text-xl font-black text-slate-900">
                {weeklyInsights.pendingCourses}
              </p>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "MONTH" && (
        <ScheduleCalendar
          events={events}
          currentDate={selectedDate}
          onDayClick={handleDayClick}
        />
      )}

      {viewMode === "WEEK" && (
        <ScheduleWeeklyCalendar
          currentDate={selectedDate}
          events={weeklyEvents}
          onDayClick={handleDayClick}
        />
      )}

      {viewMode === "DAY" && (
        <>
          <ScheduleDailyCalendar
            date={selectedDate}
            events={currentDayEvents}
            onDateChange={setSelectedDate}
            onEditClick={handleEditSlot}
            onDeleteClick={handleDeleteSlotClick}
          />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Lý thuyết
                </p>
                <p className="text-xl font-black text-slate-900">
                  {String(dailyInsights.theoryCount).padStart(2, "0")} buổi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Thực hành
                </p>
                <p className="text-xl font-black text-slate-900">
                  {String(dailyInsights.practiceCount).padStart(2, "0")} buổi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Mô phỏng
                </p>
                <p className="text-xl font-black text-slate-900">
                  {String(dailyInsights.simulationCount).padStart(2, "0")} buổi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-blue-600 p-5 shadow-lg shadow-blue-600/20">
              <div className="rounded-lg bg-white/20 p-3 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Tổng học viên
                </p>
                <p className="text-xl font-black text-white">
                  {dailyInsights.totalStudents} người
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <button
        onClick={handleAddSlot}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-transform active:scale-95 md:hidden"
      >
        <Plus className="h-7 w-7" />
      </button>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEventId(null);
        }}
        initialData={editingEvent}
        onSubmit={handleSubmitSchedule}
        defaultDate={currentDateKey}
        classes={classes.map((item) => ({
          id: item.id,
          className: item.className,
        }))}
        instructors={instructors}
        addresses={addresses}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xóa lịch học"
        message="Bạn có chắc chắn muốn xóa lịch học này không?"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
