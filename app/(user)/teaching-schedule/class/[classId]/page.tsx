"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Loader2, Search, GraduationCap, Save, X, CheckCircle2, XCircle,
  Clock, MapPin, Navigation,
} from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/student-directory.module.css";
import { classService, Class, ClassStudent } from "@/services/classService";
import { drivingService } from "@/services/drivingService";
import { attendanceService, AttendanceRecord } from "@/services/attendanceService";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function StudentDirectoryPage() {
  const { classId } = useParams() as { classId: string };
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId") ?? undefined;

  const router = useRouter();
  const { getToken } = useAuth();

  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [allMyClasses, setAllMyClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState<Record<string, boolean>>({});

  const [query, setQuery] = useState("");
  const [openRow, setOpenRow] = useState<string | null>(null);

  // Staging area for distance addition
  const [addingKm, setAddingKm] = useState<Record<string, { morning: number; evening: number }>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  // ===== FETCH DATA =====
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);

        const [classData, studentData, teachingClasses] = await Promise.all([
          classService.getClassDetail(classId),
          classService.getClassStudents(classId),
          classService.getTeachingClasses(),
        ]);

        setCurrentClass(classData);
        setStudents(studentData);
        setAllMyClasses(teachingClasses);

        // Load attendance for the specific schedule if provided
        if (scheduleId) {
          const att = await attendanceService.getBySchedule(scheduleId);
          setAttendance(att);
        }
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải dữ liệu lớp học.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [classId, scheduleId, getToken]);

  // Helper: get attendance status for a student
  const getAttendanceStatus = useCallback(
    (studentId: string): boolean | null => {
      const record = attendance.find((a) => a.studentId === studentId);
      return record ? record.isPresent : null;
    },
    [attendance]
  );

  // Toggle attendance for a student
  const handleToggleAttendance = async (studentId: string) => {
    if (!scheduleId) {
      toast.error("Không xác định được tiết học. Hãy vào từ trang lịch dạy.");
      return;
    }

    const current = getAttendanceStatus(studentId);
    const newStatus = current === null ? true : !current; // default first click = present

    setSavingAttendance((prev) => ({ ...prev, [studentId]: true }));
    try {
      await attendanceService.mark(scheduleId, studentId, newStatus);

      // Update local state
      setAttendance((prev) => {
        const existing = prev.find((a) => a.studentId === studentId);
        if (existing) {
          return prev.map((a) =>
            a.studentId === studentId ? { ...a, isPresent: newStatus } : a
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            classScheduleId: scheduleId,
            studentId,
            studentName: students.find((s) => s.id === studentId)?.fullName ?? "",
            isPresent: newStatus,
            checkedAt: new Date().toISOString(),
          },
        ];
      });

      toast.success(newStatus ? "Đã đánh dấu có mặt ✅" : "Đã đánh dấu vắng mặt ❌");
    } catch {
      toast.error("Không thể lưu điểm danh. Vui lòng thử lại.");
    } finally {
      setSavingAttendance((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((student) =>
      `${student.fullName} ${student.email} ${student.id}`.toLowerCase().includes(q)
    );
  }, [query, students]);

  const handleSaveDistance = async (studentId: string, recordId?: string) => {
    if (!recordId) {
      toast.error("Không tìm thấy bản ghi quãng đường của học viên này.");
      return;
    }

    const km = addingKm[studentId] || { morning: 0, evening: 0 };
    if (km.morning === 0 && km.evening === 0) return;

    try {
      setIsSaving((prev) => ({ ...prev, [studentId]: true }));
      await drivingService.recordActualDistance(recordId, km.morning, km.evening);

      const updatedStudents = await classService.getClassStudents(classId);
      setStudents(updatedStudents);
      setAddingKm((prev) => ({ ...prev, [studentId]: { morning: 0, evening: 0 } }));
      toast.success("Đã ghi nhận quãng đường thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu quãng đường.");
    } finally {
      setIsSaving((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const isPractical = currentClass?.classType === "Practice";

  // Attendance summary
  const presentCount = attendance.filter((a) => a.isPresent).length;
  const absentCount = attendance.filter((a) => !a.isPresent).length;
  const notMarkedCount = students.length - attendance.length;

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
                Lớp {currentClass?.className}
                {isPractical ? " · Thực hành" : " · Lý thuyết"}
                {scheduleId && " · Điểm danh theo tiết học"}
              </p>
            </div>
          </div>

          {/* Attendance summary chips */}
          {scheduleId && (
            <div className={styles.attendanceSummary}>
              <span className={styles.presentChip}>✅ Có mặt: {presentCount}</span>
              <span className={styles.absentChip}>❌ Vắng: {absentCount}</span>
              <span className={styles.pendingChip}>⏳ Chưa điểm danh: {notMarkedCount}</span>
            </div>
          )}
        </header>

        <div className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.classControl}>
              <span className={styles.classLabel}>Chuyển lớp học</span>
              <select
                className={styles.classSelect}
                value={classId}
                onChange={(e) =>
                  router.push(
                    `/teaching-schedule/class/${e.target.value}${scheduleId ? `?scheduleId=${scheduleId}` : ""}`
                  )
                }
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
              <span className={styles.typeBadge}>
                {isPractical ? "Lớp Thực hành" : "Lớp Lý thuyết"}
              </span>
              {!scheduleId && (
                <span className={styles.noScheduleWarning}>
                  ⚠️ Vào từ lịch dạy để điểm danh theo tiết
                </span>
              )}
            </div>

            <div className={styles.searchBox}>
              <Search size={16} color="#8b98b2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm học viên..."
              />
            </div>
          </div>

          <div className={styles.table}>
            <div className={`${styles.row} ${styles.head}`}>
              <span>STT</span>
              <span>HV</span>
              <span>Họ và Tên</span>
              <span>Email</span>
              {scheduleId && <span>Điểm danh</span>}
              <span>Trạng thái</span>
              <span>Chi tiết</span>
            </div>

            {filtered.map((student, index) => {
              const isOpen = openRow === student.id;
              const staging = addingKm[student.id] || { morning: 0, evening: 0 };
              const attStatus = getAttendanceStatus(student.id);
              const isSavingAtt = savingAttendance[student.id];

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

                    {/* ── Attendance Toggle ── */}
                    {scheduleId && (
                      <span>
                        <button
                          className={`${styles.attendanceToggle} ${
                            attStatus === true
                              ? styles.togglePresent
                              : attStatus === false
                              ? styles.toggleAbsent
                              : styles.togglePending
                          }`}
                          onClick={() => handleToggleAttendance(student.id)}
                          disabled={isSavingAtt}
                          title={
                            attStatus === null
                              ? "Chưa điểm danh – click để đánh dấu có mặt"
                              : attStatus
                              ? "Có mặt – click để đổi sang vắng"
                              : "Vắng – click để đổi sang có mặt"
                          }
                        >
                          {isSavingAtt ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : attStatus === true ? (
                            <><CheckCircle2 size={14} /> Có mặt</>
                          ) : attStatus === false ? (
                            <><XCircle size={14} /> Vắng</>
                          ) : (
                            <><Clock size={14} /> Chưa điểm</>
                          )}
                        </button>
                      </span>
                    )}

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

                  {isOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.detailGrid}>
                        <div className={styles.infoSection}>
                          <h3>Thông tin liên hệ</h3>
                          <p>Số điện thoại: {student.phone || "N/A"}</p>
                          <p>Email: {student.email}</p>
                        </div>

                        {isPractical && (
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
                                    width: `${
                                      (student.morningDistanceKm /
                                        (student.maxMorningDistanceKm || 1)) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                              <div className={styles.accumulateInput}>
                                <span>Cộng thêm:</span>
                                <input
                                  type="number"
                                  value={staging.morning}
                                  onChange={(e) =>
                                    setAddingKm((prev) => ({
                                      ...prev,
                                      [student.id]: {
                                        ...staging,
                                        morning: parseFloat(e.target.value) || 0,
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
                                    width: `${
                                      (student.eveningDistanceKm /
                                        (student.maxEveningDistanceKm || 1)) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                              <div className={styles.accumulateInput}>
                                <span>Cộng thêm:</span>
                                <input
                                  type="number"
                                  value={staging.evening}
                                  onChange={(e) =>
                                    setAddingKm((prev) => ({
                                      ...prev,
                                      [student.id]: {
                                        ...staging,
                                        evening: parseFloat(e.target.value) || 0,
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
                                onClick={() =>
                                  handleSaveDistance(student.id, student.distanceRecordId)
                                }
                                disabled={
                                  isSaving[student.id] ||
                                  (staging.morning === 0 && staging.evening === 0)
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
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
