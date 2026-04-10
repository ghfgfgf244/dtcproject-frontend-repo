"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/schedule.module.css";
import { setAuthToken } from "@/lib/api";
import api from "@/lib/api";
import { scheduleService, ClassSchedule } from "@/services/scheduleService";
import ScheduleSlot from "@/components/schedule/ScheduleSlot";
import NoCourseRegistered from "@/components/course/NoCourseRegistered";

const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, offset: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + offset);
  return d;
}

function formatRange(start: Date) {
  const end = addDays(start, 6);
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  const startText = start.toLocaleDateString("vi-VN", opts);
  const endText = end.toLocaleDateString("vi-VN", opts);
  return `${startText} - ${endText}`;
}

export default function SchedulePage() {
  const { isLoaded, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allSchedules, setAllSchedules] = useState<ClassSchedule[]>([]);
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded) return;
      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);

        // 1. Check registration first
        const regResponse = await api.get("/CourseRegistration/me");
        const registrations = regResponse.data.data || [];
        const activeReg = registrations.find((r: any) => r.status === 2 || r.status === "Approved");
        
        if (activeReg) {
          setRegistration(activeReg);
          // 2. Only fetch schedules if user has an active course
          const data = await scheduleService.getMySchedules();
          setAllSchedules(data);
        } else {
          setRegistration(null);
        }
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoaded]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      return {
        day: dayLabels[date.getDay()],
        date,
        isToday: new Date().toDateString() === date.toDateString(),
        isSelected: selectedDate.toDateString() === date.toDateString(),
      };
    });
  }, [weekStart, selectedDate]);

  const dailySchedules = useMemo(() => {
    return allSchedules.filter(s => {
      const sDate = new Date(s.startTime).toDateString();
      return sDate === selectedDate.toDateString();
    });
  }, [allSchedules, selectedDate]);

  const groupedSessions = useMemo(() => {
    const sessions = {
      morning: [] as ClassSchedule[],
      afternoon: [] as ClassSchedule[],
      evening: [] as ClassSchedule[]
    };

    dailySchedules.forEach(s => {
      const startHour = new Date(s.startTime).getHours();
      
      if (startHour >= 8 && startHour < 12) {
        sessions.morning.push(s);
      } else if (startHour >= 13 && startHour < 17) {
        sessions.afternoon.push(s);
      } else if (startHour >= 18 && startHour < 22) {
        sessions.evening.push(s);
      }
    });

    return sessions;
  }, [dailySchedules]);

  const handleWeekChange = (offset: number) => {
    const newStart = addDays(weekStart, offset);
    setWeekStart(newStart);
    setSelectedDate(newStart); 
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
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6c7a96' }}>
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
            <button type="button" className={styles.addButton} onClick={() => handleWeekChange(-7)}>
              <ChevronLeft />
            </button>
            <button type="button" className={styles.addButton} onClick={() => handleWeekChange(7)}>
              <ChevronRight />
            </button>
          </div>
        </header>

        {!registration ? (
          <NoCourseRegistered 
            title="Bạn chưa tham gia khóa học nào"
            description="Lịch học sẽ được hiển thị sau khi bạn đăng ký và tham gia vào một khóa đào tạo chính thức."
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
                    style={{ cursor: 'pointer' }}
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
                  groupedSessions.morning.map((s) => (
                    <ScheduleSlot
                      key={s.id}
                      title={s.className}
                      startTime={s.startTime}
                      endTime={s.endTime}
                      teacher={s.instructorName}
                      location={s.location}
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
                  groupedSessions.afternoon.map((s) => (
                    <ScheduleSlot
                      key={s.id}
                      title={s.className}
                      startTime={s.startTime}
                      endTime={s.endTime}
                      teacher={s.instructorName}
                      location={s.location}
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
                  groupedSessions.evening.map((s) => (
                    <ScheduleSlot
                      key={s.id}
                      title={s.className}
                      startTime={s.startTime}
                      endTime={s.endTime}
                      teacher={s.instructorName}
                      location={s.location}
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
