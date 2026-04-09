"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/ui/sidebar";
import { setAuthToken } from "@/lib/api";
import { ClassSchedule, scheduleService } from "@/services/scheduleService";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/teaching-schedule.module.css";

const dayLabels = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

type ScheduleBuckets = {
  morning: ClassSchedule[];
  afternoon: ClassSchedule[];
  evening: ClassSchedule[];
};

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  next.setDate(next.getDate() - day);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, offset: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

function getLocalDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatRange(start: Date) {
  const end = addDays(start, 6);
  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  return `${start.toLocaleDateString("vi-VN", options)} - ${end.toLocaleDateString("vi-VN", options)}`;
}

export default function TeachingSchedulePage() {
  const { getToken } = useAuth();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [rawSchedules, setRawSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        setAuthToken(token ?? null);
        const data = await scheduleService.getTeachingSchedule();
        setRawSchedules(data);
      } catch {
        setError("Không thể tải lịch dạy. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [getToken]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(weekStart, index);
        return {
          label: dayLabels[date.getDay()],
          date,
          dateKey: getLocalDateKey(date),
          isToday: getLocalDateKey(new Date()) === getLocalDateKey(date),
        };
      }),
    [weekStart]
  );

  const organizedSchedules = useMemo(() => {
    const weekKeys = new Set(weekDays.map((day) => day.dateKey));
    const grouped: Record<string, ScheduleBuckets> = {};

    rawSchedules
      .filter((schedule) => weekKeys.has(getLocalDateKey(schedule.startTime)))
      .sort((left, right) => new Date(left.startTime).getTime() - new Date(right.startTime).getTime())
      .forEach((schedule) => {
        const dateKey = getLocalDateKey(schedule.startTime);
        grouped[dateKey] ??= { morning: [], afternoon: [], evening: [] };

        const hour = new Date(schedule.startTime).getHours();
        if (hour < 12) {
          grouped[dateKey].morning.push(schedule);
        } else if (hour < 18) {
          grouped[dateKey].afternoon.push(schedule);
        } else {
          grouped[dateKey].evening.push(schedule);
        }
      });

    return grouped;
  }, [rawSchedules, weekDays]);

  const renderSlots = (slots: ClassSchedule[]) => {
    if (!slots.length) {
      return <div className={styles.noSession}>Không có tiết dạy</div>;
    }

    return slots.map((slot) => (
      <Link
        key={slot.id}
        href={`/teaching-schedule/class/${slot.classId}?scheduleId=${slot.id}`}
        className={styles.sessionCard}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div className={styles.sessionTime}>
          {new Date(slot.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          {" - "}
          {new Date(slot.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </div>

        <div className={styles.sessionTitle}>{slot.className}</div>

        <div className={styles.tagRow}>
          <span className={styles.tag}>{slot.addressName || slot.location || "Chưa cập nhật địa điểm"}</span>
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
              <p>Quản lý các buổi dạy lý thuyết và thực hành theo từng ngày trong tuần.</p>
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

          {error ? <div className={styles.noSession}>{error}</div> : null}

          <div className={styles.weekGrid}>
            {weekDays.map((day) => {
              const dayData = organizedSchedules[day.dateKey] ?? {
                morning: [],
                afternoon: [],
                evening: [],
              };

              return (
                <div
                  key={day.dateKey}
                  className={`${styles.dayColumn} ${day.isToday ? styles.focus : ""}`}
                >
                  <div className={styles.dayHeader}>
                    <span>{day.label}</span>
                    <strong>{day.date.getDate()}</strong>
                    {day.isToday ? <span className={styles.today}>Hôm nay</span> : null}
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
