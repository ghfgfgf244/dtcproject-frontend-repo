"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/teaching-schedule.module.css";
import { scheduleService, ClassSchedule } from "@/services/scheduleService";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";

const dayLabels = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

/* ===== UTIL ===== */
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
  return `${start.toLocaleDateString("vi-VN", opts)} - ${end.toLocaleDateString("vi-VN", opts)}`;
}

export default function TeachingSchedulePage() {
  const { getToken } = useAuth();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [rawSchedules, setRawSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== FETCH DATA =====
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);
        const data = await scheduleService.getTeachingSchedule();
        setRawSchedules(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [getToken]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        day: dayLabels[date.getDay()],
        date,
        isToday: new Date().toDateString() === date.toDateString(),
      };
    });
  }, [weekStart]);

  // Organize schedules by date and time of day
  const organizedSchedules = useMemo(() => {
    const map: Record<string, { morning: ClassSchedule[]; afternoon: ClassSchedule[]; evening: ClassSchedule[] }> = {};
    
    rawSchedules.forEach(s => {
      const dateKey = new Date(s.startTime).toDateString();
      if (!map[dateKey]) {
        map[dateKey] = { morning: [], afternoon: [], evening: [] };
      }
      
      const hour = new Date(s.startTime).getHours();
      if (hour < 12) map[dateKey].morning.push(s);
      else if (hour < 18) map[dateKey].afternoon.push(s);
      else map[dateKey].evening.push(s);
    });
    
    return map;
  }, [rawSchedules]);

  const renderSlots = (slots: ClassSchedule[]) => {
    if (!slots.length) {
      return <div className={styles.noSession}>Không có tiết dạy</div>;
    }

    return slots.map(slot => (
      <Link
        key={slot.id}
        href={`/teaching-schedule/class/${slot.classId}?scheduleId=${slot.id}`}
        className={styles.sessionCard}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div className={styles.sessionTime}>
          {new Date(slot.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - 
          {new Date(slot.endTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className={styles.sessionTitle}>
          {slot.className}
        </div>

        <div className={styles.tagRow}>
          <span className={styles.tag}>{slot.location || slot.addressName}</span>
        </div>
      </Link>
    ));
  };

  if (loading) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="teaching-schedule" />
        <div className={shellStyles.loadingContainer}>
          <Loader2 className="animate-spin" size={40} />
          <p>Đang tải lịch dạy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="teaching-schedule" />

      <section className={shellStyles.content}>
        <div className={styles.content}>
          <header className={styles.header}>
            <div>
              <h1>Lịch dạy của tôi</h1>
              <p>Quản lý các buổi thực hành và bài giảng lý thuyết trong tuần.</p>
            </div>

            <div className={styles.rangeControl}>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => setWeekStart(addDays(weekStart, -7))}
              >
                <ChevronLeft size={20} />
              </button>

              <div className={styles.rangeInfo}>
                <CalendarIcon size={18} />
                <span>{formatRange(weekStart)}</span>
              </div>

              <button
                type="button"
                className={styles.navButton}
                onClick={() => setWeekStart(addDays(weekStart, 7))}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </header>

          <div className={styles.weekGrid}>
            {weekDays.map((day) => {
              const dateKey = day.date.toDateString();
              const dayData = organizedSchedules[dateKey] || { morning: [], afternoon: [], evening: [] };

              return (
                <div
                  key={day.date.toISOString()}
                  className={`${styles.dayColumn} ${day.isToday ? styles.focus : ""}`}
                >
                  <div className={styles.dayHeader}>
                    <span>{day.day}</span>
                    <strong>{day.date.getDate()}</strong>
                    {day.isToday && <span className={styles.today}>Hôm nay</span>}
                  </div>

                  <div className={styles.sessionBlock}>
                    <div className={styles.sessionLabel}>Sáng</div>
                    {renderSlots(dayData.morning)}
                  </div>

                  <div className={styles.sessionBlock}>
                    <div className={styles.sessionLabel}>Chiều</div>
                    {renderSlots(dayData.afternoon)}
                  </div>

                  <div className={styles.sessionBlock}>
                    <div className={styles.sessionLabel}>Tối</div>
                    {renderSlots(dayData.evening)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}