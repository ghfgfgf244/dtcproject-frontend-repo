"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  Save,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/ui/sidebar";
import { setAuthToken } from "@/lib/api";
import { attendanceService, AttendanceRecord } from "@/services/attendanceService";
import { Class, classService, ClassStudent } from "@/services/classService";
import { drivingService } from "@/services/drivingService";
import { ClassSchedule, scheduleService } from "@/services/scheduleService";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/student-directory.module.css";

function formatScheduleLabel(schedule: ClassSchedule | null) {
  if (!schedule) return "Chưa chọn buổi học";

  const day = new Date(schedule.startTime).toLocaleDateString("vi-VN");
  const start = new Date(schedule.startTime).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(schedule.endTime).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day} · ${start} - ${end}`;
}

export default function TeachingScheduleClassPage() {
  const { classId } = useParams() as { classId: string };
  const searchParams = useSearchParams();
  const requestedScheduleId = searchParams.get("scheduleId") ?? undefined;
  const router = useRouter();
  const { getToken } = useAuth();

  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [allMyClasses, setAllMyClasses] = useState<Class[]>([]);
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);
  const [activeSchedule, setActiveSchedule] = useState<ClassSchedule | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [addingKm, setAddingKm] = useState<Record<string, { morning: number; evening: number }>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token ?? null);

        const [classData, studentData, teachingClasses, schedules] = await Promise.all([
          classService.getClassDetail(classId),
          classService.getClassStudents(classId),
          classService.getTeachingClasses(),
          scheduleService.getByClass(classId),
        ]);

        const matchedSchedule =
          requestedScheduleId != null
            ? schedules.find((schedule) => schedule.id === requestedScheduleId) ?? null
            : null;

        setCurrentClass(classData);
        setStudents(studentData);
        setAllMyClasses(teachingClasses);
        setClassSchedules(schedules);
        setActiveSchedule(matchedSchedule);

        if (requestedScheduleId && !matchedSchedule) {
          setAttendance([]);
          toast.error("Buổi học này không thuộc lớp đang mở. Hệ thống đã bỏ chọn tiết học.");
          router.replace(`/teaching-schedule/class/${classId}`);
          return;
        }

        if (matchedSchedule) {
          const records = await attendanceService.getBySchedule(matchedSchedule.id);
          setAttendance(records);
        } else {
          setAttendance([]);
        }
      } catch {
        toast.error("Không thể tải dữ liệu lớp học.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [classId, requestedScheduleId, getToken, router]);

  const getAttendanceStatus = useCallback(
    (studentId: string): boolean | null => {
      const record = attendance.find((item) => item.studentId === studentId);
      return record ? record.isPresent : null;
    },
    [attendance]
  );

  const handleToggleAttendance = async (studentId: string) => {
    if (!activeSchedule) {
      toast.error("Hãy mở trang lịch dạy và chọn đúng buổi học trước khi điểm danh.");
      return;
    }

    const current = getAttendanceStatus(studentId);
    const nextStatus = current === null ? true : !current;

    setSavingAttendance((prev) => ({ ...prev, [studentId]: true }));
    try {
      await attendanceService.mark(activeSchedule.id, studentId, nextStatus);
      setAttendance((prev) => {
        const existing = prev.find((item) => item.studentId === studentId);
        if (existing) {
          return prev.map((item) =>
            item.studentId === studentId ? { ...item, isPresent: nextStatus } : item
          );
        }

        return [
          ...prev,
          {
            id: `${activeSchedule.id}-${studentId}`,
            classScheduleId: activeSchedule.id,
            studentId,
            studentName: students.find((student) => student.id === studentId)?.fullName ?? "",
            isPresent: nextStatus,
            checkedAt: new Date().toISOString(),
          },
        ];
      });

      toast.success(nextStatus ? "Đã đánh dấu có mặt." : "Đã đánh dấu vắng mặt.");
    } catch {
      toast.error("Không thể lưu điểm danh. Vui lòng thử lại.");
    } finally {
      setSavingAttendance((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return students;

    return students.filter((student) =>
      `${student.fullName} ${student.email} ${student.id}`.toLowerCase().includes(normalizedQuery)
    );
  }, [query, students]);

  const handleSaveDistance = async (studentId: string, recordId?: string) => {
    if (!recordId) {
      toast.error("Không tìm thấy bản ghi quãng đường của học viên này.");
      return;
    }

    const stagedDistance = addingKm[studentId] || { morning: 0, evening: 0 };
    if (stagedDistance.morning === 0 && stagedDistance.evening === 0) {
      return;
    }

    try {
      setIsSaving((prev) => ({ ...prev, [studentId]: true }));
      await drivingService.recordActualDistance(recordId, stagedDistance.morning, stagedDistance.evening);

      const updatedStudents = await classService.getClassStudents(classId);
      setStudents(updatedStudents);
      setAddingKm((prev) => ({ ...prev, [studentId]: { morning: 0, evening: 0 } }));
      toast.success("Đã ghi nhận quãng đường thành công.");
    } catch {
      toast.error("Lỗi khi lưu quãng đường.");
    } finally {
      setIsSaving((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const isPractical = currentClass?.classType === "Practice";
  const presentCount = attendance.filter((record) => record.isPresent).length;
  const absentCount = attendance.filter((record) => !record.isPresent).length;
  const notMarkedCount = Math.max(students.length - attendance.length, 0);

  if (loading) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="teaching-schedule" />
        <div className={shellStyles.loadingContainer}>
          <Loader2 className="animate-spin" size={40} />
          <p>Đang tải danh sách học viên...</p>
        </div>
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="teaching-schedule" />
        <section className={shellStyles.content}>
          <div className={shellStyles.loadingContainer}>
            <p>Không tìm thấy lớp học hoặc bạn không có quyền truy cập.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="teaching-schedule" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <GraduationCap className={styles.headerIcon} />
            <div>
              <h1>Danh sách học viên</h1>
              <p>
                Lớp {currentClass.className}
                {isPractical ? " · Thực hành" : " · Lý thuyết"}
                {activeSchedule ? " · Điểm danh theo tiết học" : ""}
              </p>
              <p>{formatScheduleLabel(activeSchedule)}</p>
            </div>
          </div>

          {activeSchedule ? (
            <div className={styles.attendanceSummary}>
              <span className={styles.presentChip}>Có mặt: {presentCount}</span>
              <span className={styles.absentChip}>Vắng: {absentCount}</span>
              <span className={styles.pendingChip}>Chưa điểm danh: {notMarkedCount}</span>
            </div>
          ) : null}
        </header>

        <div className={styles.card}>
          <div className={styles.scheduleBanner}>
            <div>
              <strong>Buổi học đang chọn</strong>
              <p>
                {activeSchedule
                  ? `${formatScheduleLabel(activeSchedule)} · ${
                      activeSchedule.addressName || activeSchedule.location
                    }`
                  : "Bạn chưa chọn buổi học cụ thể. Vào trang Lịch dạy và bấm vào một tiết học để bắt đầu điểm danh."}
              </p>
            </div>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.classControl}>
              <span className={styles.classLabel}>Chuyển lớp học</span>
              <select
                className={styles.classSelect}
                value={classId}
                onChange={(event) => router.push(`/teaching-schedule/class/${event.target.value}`)}
              >
                {allMyClasses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.className} ({item.classType === "Practice" ? "Thực hành" : "Lý thuyết"})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.countBadge}>{students.length} học viên</span>
              <span className={styles.typeBadge} data-type={currentClass.classType}>
                {isPractical ? "Lớp thực hành" : "Lớp lý thuyết"}
              </span>
              <span className={styles.countBadge}>{classSchedules.length} buổi học trong lớp</span>
              {!activeSchedule ? (
                <span className={styles.noScheduleWarning}>
                  Hãy chọn một tiết học từ trang Lịch dạy để điểm danh.
                </span>
              ) : null}
            </div>

            <div className={styles.searchBox}>
              <Search size={16} color="#8b98b2" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm kiếm học viên..."
              />
            </div>
          </div>

          <div className={styles.table}>
            <div className={`${styles.row} ${styles.head}`}>
              <span>STT</span>
              <span>HV</span>
              <span>Họ và tên</span>
              <span>Email</span>
              {activeSchedule ? <span>Điểm danh</span> : null}
              <span>Trạng thái</span>
              <span>Chi tiết</span>
            </div>

            {filteredStudents.map((student, index) => {
              const isOpen = openRow === student.id;
              const stagedDistance = addingKm[student.id] || { morning: 0, evening: 0 };
              const attendanceStatus = getAttendanceStatus(student.id);
              const isSavingThisAttendance = savingAttendance[student.id];

              return (
                <div key={student.id} className={styles.rowGroup}>
                  <div className={styles.row}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.avatar}>
                      {student.avatarUrl ? (
                        <img src={student.avatarUrl} alt="" className={styles.avatarImg} />
                      ) : (
                        student.fullName[0]
                      )}
                    </span>
                    <span className={styles.studentName}>{student.fullName}</span>
                    <span className={styles.email}>{student.email}</span>

                    {activeSchedule ? (
                      <span>
                        <button
                          className={`${styles.attendanceToggle} ${
                            attendanceStatus === true
                              ? styles.togglePresent
                              : attendanceStatus === false
                                ? styles.toggleAbsent
                                : styles.togglePending
                          }`}
                          onClick={() => handleToggleAttendance(student.id)}
                          disabled={isSavingThisAttendance}
                          title={
                            attendanceStatus === null
                              ? "Chưa điểm danh - bấm để đánh dấu có mặt"
                              : attendanceStatus
                                ? "Đang là có mặt - bấm để chuyển sang vắng"
                                : "Đang là vắng - bấm để chuyển sang có mặt"
                          }
                        >
                          {isSavingThisAttendance ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : attendanceStatus === true ? (
                            <>
                              <CheckCircle2 size={14} /> Có mặt
                            </>
                          ) : attendanceStatus === false ? (
                            <>
                              <XCircle size={14} /> Vắng
                            </>
                          ) : (
                            <>
                              <Clock size={14} /> Chưa điểm
                            </>
                          )}
                        </button>
                      </span>
                    ) : null}

                    <span
                      className={`${styles.statusPill} ${student.isActive ? styles.present : styles.absent}`}
                    >
                      {student.isActive ? "Hoạt động" : "Tạm khóa"}
                    </span>

                    <button
                      type="button"
                      className={styles.expandBtn}
                      onClick={() => setOpenRow((prev) => (prev === student.id ? null : student.id))}
                    >
                      {isOpen ? "▾" : "▸"}
                    </button>
                  </div>

                  {isOpen ? (
                    <div className={styles.dropdown}>
                      <div className={styles.detailGrid}>
                        <div className={styles.infoSection}>
                          <h3>Thông tin liên hệ</h3>
                          <p>Số điện thoại: {student.phone || "N/A"}</p>
                          <p>Email: {student.email}</p>
                        </div>

                        {isPractical ? (
                          <div className={styles.progressSection}>
                            <h3>Tiến độ quãng đường</h3>

                            <div className={styles.kmRow}>
                              <div className={styles.kmLabel}>
                                <strong>Buổi sáng:</strong> {student.morningDistanceKm}/
                                {student.maxMorningDistanceKm} km
                              </div>
                              <div className={styles.progressTrack}>
                                <div
                                  className={styles.progressFill}
                                  style={{
                                    width: `${(
                                      (student.morningDistanceKm / (student.maxMorningDistanceKm || 1)) *
                                      100
                                    ).toFixed(1)}%`,
                                  }}
                                />
                              </div>
                              <div className={styles.accumulateInput}>
                                <span>Cộng thêm:</span>
                                <input
                                  type="number"
                                  value={stagedDistance.morning}
                                  onChange={(event) =>
                                    setAddingKm((prev) => ({
                                      ...prev,
                                      [student.id]: {
                                        ...stagedDistance,
                                        morning: parseFloat(event.target.value) || 0,
                                      },
                                    }))
                                  }
                                />
                                <span>km</span>
                              </div>
                            </div>

                            <div className={styles.kmRow}>
                              <div className={styles.kmLabel}>
                                <strong>Buổi tối:</strong> {student.eveningDistanceKm}/
                                {student.maxEveningDistanceKm} km
                              </div>
                              <div className={styles.progressTrack}>
                                <div
                                  className={styles.progressFill}
                                  style={{
                                    width: `${(
                                      (student.eveningDistanceKm / (student.maxEveningDistanceKm || 1)) *
                                      100
                                    ).toFixed(1)}%`,
                                  }}
                                />
                              </div>
                              <div className={styles.accumulateInput}>
                                <span>Cộng thêm:</span>
                                <input
                                  type="number"
                                  value={stagedDistance.evening}
                                  onChange={(event) =>
                                    setAddingKm((prev) => ({
                                      ...prev,
                                      [student.id]: {
                                        ...stagedDistance,
                                        evening: parseFloat(event.target.value) || 0,
                                      },
                                    }))
                                  }
                                />
                                <span>km</span>
                              </div>
                            </div>

                            <div className={styles.kmFooter}>
                              <button
                                className={styles.cancelBtn}
                                onClick={() =>
                                  setAddingKm((prev) => ({
                                    ...prev,
                                    [student.id]: { morning: 0, evening: 0 },
                                  }))
                                }
                                disabled={isSaving[student.id]}
                              >
                                <X size={14} /> Hủy nhập
                              </button>
                              <button
                                className={styles.saveBtn}
                                onClick={() => handleSaveDistance(student.id, student.distanceRecordId)}
                                disabled={
                                  isSaving[student.id] ||
                                  (stagedDistance.morning === 0 && stagedDistance.evening === 0)
                                }
                              >
                                {isSaving[student.id] ? (
                                  <Loader2 className="animate-spin" size={14} />
                                ) : (
                                  <Save size={14} />
                                )}
                                Lưu quãng đường
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
