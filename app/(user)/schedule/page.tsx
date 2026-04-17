"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/schedule.module.css";
import { setAuthToken } from "@/lib/api";
import { scheduleService, ClassSchedule } from "@/services/scheduleService";
import ScheduleSlot from "@/components/schedule/ScheduleSlot";
import NoCourseRegistered from "@/components/course/NoCourseRegistered";
import PendingCourseRegistrationNotice from "@/components/course/PendingCourseRegistrationNotice";
import { registrationService } from "@/services/registrationService";
import { RegistrationRecord } from "@/types/registration";

const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function startOfWeek(date: Date) {
  const value = new Date(date);
  const day = value.getDay();
  value.setDate(value.getDate() - day);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addDays(date: Date, offset: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + offset);
  return value;
}

function formatRange(start: Date) {
  const end = addDays(start, 6);
  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  return `${start.toLocaleDateString("vi-VN", options)} - ${end.toLocaleDateString(
    "vi-VN",
    options,
  )}`;
}

export default function SchedulePage() {
  const { isLoaded, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allSchedules, setAllSchedules] = useState<ClassSchedule[]>([]);
  const [registration, setRegistration] = useState<RegistrationRecord | null>(null);
  const [pendingRegistration, setPendingRegistration] =
    useState<RegistrationRecord | null>(null);

  const fetchData = useCallback(async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const token = await getToken();
      setAuthToken(token);

      const registrations = await registrationService.getMyCourseRegistrations();
      const activeReg = registrations.find((item) => item.status === "Approved") ?? null;
      const waitingReg = registrations.find((item) => item.status === "Pending") ?? null;

      if (activeReg) {
        setRegistration(activeReg);
        setPendingRegistration(null);
        const data = await scheduleService.getMySchedules();
        setAllSchedules(data);
      } else {
        setRegistration(null);
        setPendingRegistration(waitingReg);
        setAllSchedules([]);
      }
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(weekStart, index);
        return {
          day: dayLabels[date.getDay()],
          date,
          isToday: new Date().toDateString() === date.toDateString(),
          isSelected: selectedDate.toDateString() === date.toDateString(),
        };
      }),
    [selectedDate, weekStart],
  );

  const dailySchedules = useMemo(
    () =>
      allSchedules.filter(
        (schedule) =>
          new Date(schedule.startTime).toDateString() === selectedDate.toDateString(),
      ),
    [allSchedules, selectedDate],
  );

  const groupedSessions = useMemo(() => {
    const sessions = {
      morning: [] as ClassSchedule[],
      afternoon: [] as ClassSchedule[],
      evening: [] as ClassSchedule[],
    };

    dailySchedules.forEach((schedule) => {
      const startHour = new Date(schedule.startTime).getHours();

      if (startHour >= 8 && startHour < 12) {
        sessions.morning.push(schedule);
      } else if (startHour >= 13 && startHour < 17) {
        sessions.afternoon.push(schedule);
      } else if (startHour >= 18 && startHour < 22) {
        sessions.evening.push(schedule);
      }
    });

    return sessions;
  }, [dailySchedules]);

  const handleWeekChange = (offset: number) => {
    const nextStart = addDays(weekStart, offset);
    setWeekStart(nextStart);
    setSelectedDate(nextStart);
  };

  const handleToday = () => {
    const today = new Date();
    setWeekStart(startOfWeek(today));
    setSelectedDate(today);
  };

  if (loading) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="schedule" />
        <section className={shellStyles.content}>
          <div style={{ textAlign: "center", padding: "4rem", color: "#6c7a96" }}>
            Đang tải dữ liệu...
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="schedule" />

      <section className={`${shellStyles.content} ${styles.fadeEntry}`}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Lịch học</h1>
            <p className={styles.subtitle}>
              Theo dõi lộ trình đào tạo và các buổi học sắp tới của bạn.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button type="button" className={styles.todayButton} onClick={handleToday}>
              Hôm nay
            </button>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleWeekChange(-7)}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleWeekChange(7)}
            >
              <ChevronRight />
            </button>
          </div>
        </header>

        {!registration && pendingRegistration ? (
          <PendingCourseRegistrationNotice
            registration={pendingRegistration}
            onCancelled={fetchData}
          />
        ) : !registration ? (
          <NoCourseRegistered
            title="Bạn chưa tham gia khóa học nào"
            description="Lịch học sẽ hiển thị sau khi bạn được duyệt và tham gia một khóa học chính thức."
          />
        ) : (
          <>
            <div className={styles.monthRow}>
              <div className={styles.month}>{formatRange(weekStart)}</div>
              <div className={styles.weekRow}>
                {weekDays.map((item) => (
                  <div
                    key={item.date.toISOString()}
                    className={`${styles.weekDay} ${item.isSelected ? styles.weekDayActive : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedDate(item.date)}
                  >
                    <span>{item.day}</span>
                    <strong>{item.date.getDate()}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Buổi sáng (08:00 - 12:00)</div>
              <div className={styles.cardGrid}>
                {groupedSessions.morning.length > 0 ? (
                  groupedSessions.morning.map((schedule) => (
                    <ScheduleSlot
                      key={schedule.id}
                      title={schedule.className}
                      startTime={schedule.startTime}
                      endTime={schedule.endTime}
                      teacher={schedule.instructorName}
                      location={schedule.location}
                    />
                  ))
                ) : (
                  <div className={styles.emptyGroup}>Không có tiết học</div>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Buổi chiều (13:00 - 17:00)</div>
              <div className={styles.cardGrid}>
                {groupedSessions.afternoon.length > 0 ? (
                  groupedSessions.afternoon.map((schedule) => (
                    <ScheduleSlot
                      key={schedule.id}
                      title={schedule.className}
                      startTime={schedule.startTime}
                      endTime={schedule.endTime}
                      teacher={schedule.instructorName}
                      location={schedule.location}
                    />
                  ))
                ) : (
                  <div className={styles.emptyGroup}>Không có tiết học</div>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Buổi tối (18:00 - 21:00)</div>
              <div className={styles.cardGrid}>
                {groupedSessions.evening.length > 0 ? (
                  groupedSessions.evening.map((schedule) => (
                    <ScheduleSlot
                      key={schedule.id}
                      title={schedule.className}
                      startTime={schedule.startTime}
                      endTime={schedule.endTime}
                      teacher={schedule.instructorName}
                      location={schedule.location}
                    />
                  ))
                ) : (
                  <div className={styles.emptyGroup}>Không có tiết học</div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
