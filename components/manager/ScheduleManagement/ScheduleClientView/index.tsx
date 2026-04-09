"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, CalendarClock, Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { classService, ClassDto } from "@/services/classService";
import { scheduleService, ClassSchedule } from "@/services/scheduleService";
import { userService } from "@/services/userService";
import { addressService } from "@/services/addressService";
import { DailyInsight, ScheduleEvent, ScheduleEventType, WeeklyInsight } from "@/types/schedule";
import ScheduleCalendar from "../ScheduleCalendar";
import ScheduleWeeklyCalendar from "../ScheduleWeeklyCalendar";
import ScheduleDailyCalendar from "../ScheduleDailyCalendar";
import ScheduleModal, { ScheduleFormData } from "@/components/manager/Modals/ScheduleModal";
import ConfirmModal from "@/components/ui/confirm-modal";

type ViewMode = "MONTH" | "WEEK" | "DAY";

function formatDateKey(input: Date | string) {
  const date = typeof input === "string" ? new Date(input) : input;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
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

function mapEventType(classType?: string): ScheduleEventType {
  if (classType === "Practice") return "Practice";
  return "Theory";
}

function extractTime(dateTime: string) {
  const date = new Date(dateTime);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function mapScheduleEvent(schedule: ClassSchedule, classMap: Map<string, ClassDto>): ScheduleEvent {
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

  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [instructors, setInstructors] = useState<{ id: string; fullName: string }[]>([]);
  const [addresses, setAddresses] = useState<{ id: number; addressName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("DAY");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const ensureAuthToken = async () => {
    const token = await getToken({ skipCache: true });
    setAuthToken(token);
    return token;
  };

  const fetchData = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      await ensureAuthToken();

      const [classData, instructorData, addressData] = await Promise.all([
        classService.getAllClasses(),
        userService.getInstructors(),
        addressService.getAll(),
      ]);

      const classMap = new Map(classData.map((item) => [item.id, item]));
      const scheduleGroups = await Promise.all(classData.map((item) => scheduleService.getByClass(item.id)));
      const scheduleData = scheduleGroups.flat();

      setClasses(classData);
      setInstructors(instructorData.map((item) => ({ id: item.id, fullName: item.fullName })));
      setAddresses(addressData);
      setEvents(scheduleData.map((item) => mapScheduleEvent(item, classMap)).sort((left, right) => left.startDateTime.localeCompare(right.startDateTime)));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the tai lich hoc");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoaded, isSignedIn]);

  const editingEvent = useMemo(() => {
    if (!editingEventId) return null;
    return events.find((event) => event.id === editingEventId) || null;
  }, [editingEventId, events]);

  const currentDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);

  const currentDayEvents = useMemo(
    () => events.filter((event) => event.dateKey === currentDateKey).sort((left, right) => left.startTime.localeCompare(right.startTime)),
    [currentDateKey, events]
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
      theoryCount: currentDayEvents.filter((event) => event.eventType === "Theory").length,
      practiceCount: currentDayEvents.filter((event) => event.eventType === "Practice").length,
      simulationCount: currentDayEvents.filter((event) => event.eventType === "Simulator").length,
      totalStudents: currentDayEvents.reduce((sum, event) => sum + (event.studentCount || 0), 0),
    }),
    [currentDayEvents]
  );

  const weeklyInsights: WeeklyInsight = useMemo(
    () => ({
      completedClasses: classes.filter((item) => item.status === "Completed").length,
      totalClasses: weeklyEvents.length,
      activeClasses: classes.filter((item) => item.status === "InProgress").length,
      pendingCourses: classes.filter((item) => item.status === "Pending").length,
    }),
    [classes, weeklyEvents.length]
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
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
        await scheduleService.createBulk(formData.classId, formData.importedSchedules);
        toast.success("Da nhap lich hoc tu file Excel");
      } else if (editingEvent) {
        await scheduleService.update(editingEvent.id, {
          instructorId: formData.instructorId,
          startTime: formData.startTime,
          endTime: formData.endTime,
          addressId: formData.addressId,
        });
        toast.success("Da cap nhat lich hoc");
      } else {
        await scheduleService.create({
          classId: formData.classId,
          instructorId: formData.instructorId,
          startTime: formData.startTime,
          endTime: formData.endTime,
          addressId: formData.addressId,
        });
        toast.success("Da tao lich hoc");
      }

      setIsModalOpen(false);
      setEditingEventId(null);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the luu lich hoc");
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
      toast.success("Da xoa lich hoc");
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the xoa lich hoc");
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
          <span>Dang tai lich hoc...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="mb-2 text-[30px] font-black leading-none tracking-tight text-slate-900">
            {viewMode === "MONTH" && `Lich hoc ${formatMonthLabel(selectedDate)}`}
            {viewMode === "WEEK" && `Lich hoc tuan ${formatDayLabel(startOfWeek(selectedDate))}`}
            {viewMode === "DAY" && `Lich hoc ${formatDayLabel(selectedDate)}`}
          </h2>
          <p className="text-sm text-slate-500">
            Xem, tao va dieu phoi lich hoc cua tung lop theo du lieu that tu he thong.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Lam moi
          </button>
          <div className="rounded-lg border border-slate-200 bg-slate-200/50 p-1 shadow-sm">
            <button onClick={() => setViewMode("MONTH")} className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${viewMode === "MONTH" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Thang</button>
            <button onClick={() => setViewMode("WEEK")} className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${viewMode === "WEEK" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Tuan</button>
            <button onClick={() => setViewMode("DAY")} className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${viewMode === "DAY" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Ngay</button>
          </div>
          <button
            onClick={handleAddSlot}
            className="hidden items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 md:flex"
          >
            <CalendarPlus className="h-5 w-5" /> Them lich hoc
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600"><Users className="h-6 w-6" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tong lop</p>
              <p className="text-xl font-black text-slate-900">{classes.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-slate-100 p-3 text-slate-600"><CalendarClock className="h-6 w-6" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lich trong tuan</p>
              <p className="text-xl font-black text-slate-900">{weeklyInsights.totalClasses}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600"><ShieldCheck className="h-6 w-6" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dang hoat dong</p>
              <p className="text-xl font-black text-slate-900">{weeklyInsights.activeClasses}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-amber-50 p-3 text-amber-600"><Plus className="h-6 w-6" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cho khai giang</p>
              <p className="text-xl font-black text-slate-900">{weeklyInsights.pendingCourses}</p>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "MONTH" && <ScheduleCalendar events={events} currentDate={selectedDate} onDayClick={handleDayClick} />}

      {viewMode === "WEEK" && <ScheduleWeeklyCalendar currentDate={selectedDate} events={weeklyEvents} onDayClick={handleDayClick} />}

      {viewMode === "DAY" && (
        <>
          <ScheduleDailyCalendar date={selectedDate} events={currentDayEvents} onDateChange={setSelectedDate} onEditClick={handleEditSlot} onDeleteClick={handleDeleteSlotClick} />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600"><Users className="h-6 w-6" /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ly thuyet</p>
                <p className="text-xl font-black text-slate-900">{String(dailyInsights.theoryCount).padStart(2, "0")} buoi</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600"><Users className="h-6 w-6" /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Thuc hanh</p>
                <p className="text-xl font-black text-slate-900">{String(dailyInsights.practiceCount).padStart(2, "0")} buoi</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-amber-50 p-3 text-amber-600"><Users className="h-6 w-6" /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mo phong</p>
                <p className="text-xl font-black text-slate-900">{String(dailyInsights.simulationCount).padStart(2, "0")} buoi</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-blue-600 p-5 shadow-lg shadow-blue-600/20">
              <div className="rounded-lg bg-white/20 p-3 text-white"><Users className="h-6 w-6" /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Tong hoc vien</p>
                <p className="text-xl font-black text-white">{dailyInsights.totalStudents} nguoi</p>
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
        classes={classes.map((item) => ({ id: item.id, className: item.className }))}
        instructors={instructors}
        addresses={addresses}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xoa lich hoc"
        message="Ban co chac chan muon xoa lich hoc nay khong?"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
