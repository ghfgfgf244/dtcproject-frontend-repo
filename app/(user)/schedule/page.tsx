"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/schedule.module.css";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const sessions = {
  morning: [
    {
      title: "Traffic Laws & Regulations",
      time: "08:00 - 10:00",
      teacher: "Nguyen Van A",
      room: "Room 101",
      attendance: "present",
    },
    {
      title: "Basic Maneuvering",
      time: "09:00 - 11:30",
      teacher: "Tran Thi B",
      room: "Training Field A",
      attendance: "absent",
    },
  ],
  afternoon: [
    {
      tag: "Advanced",
      title: "Highway Defensive Driving",
      time: "13:30 - 15:30",
      teacher: "Le Van C",
      room: "Simulator Lab",
      attendance: "present",
    },
    {
      tag: "B2 Theory",
      title: "Engine & Maintenance Basics",
      time: "15:00 - 17:00",
      teacher: "Nguyen Van A",
      room: "Room 102",
      highlight: true,
      badge: "Current",
      attendance: "present",
    },
  ],
  evening: [
    {
      tag: "C Theory",
      title: "Night Driving Safety",
      time: "18:00 - 20:00",
      teacher: "Pham Minh D",
      room: "Room 101",
      muted: true,
      attendance: "absent",
    },
  ],
};

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
  const startText = start.toLocaleDateString("en-US", opts);
  const endText = end.toLocaleDateString("en-US", opts);
  return `${startText} - ${endText}`;
}

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      return {
        day: dayLabels[date.getDay()],
        date,
        isToday: new Date().toDateString() === date.toDateString(),
      };
    });
  }, [weekStart]);

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="schedule" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Lịch học</h1>
            <p className={styles.subtitle}>
              Quản lý lịch học hàng tuần và theo dõi buổi học.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.todayButton}
              onClick={() => setWeekStart(startOfWeek(new Date()))}
            >
              Today
            </button>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => setWeekStart(addDays(weekStart, -7))}
            >
              ◀
            </button>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => setWeekStart(addDays(weekStart, 7))}
            >
              ▶
            </button>
          </div>
        </header>

        <div className={styles.monthRow}>
          <div className={styles.month}>{formatRange(weekStart)}</div>
          <div className={styles.weekRow}>
            {weekDays.map((item) => (
              <div
                key={item.date.toISOString()}
                className={`${styles.weekDay} ${
                  item.isToday ? styles.weekDayActive : ""
                }`}
              >
                <span>{item.day}</span>
                <strong>{item.date.getDate()}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Morning</div>
          <div className={styles.cardGrid}>
            {sessions.morning.map((item) => (
              <article key={item.title} className={styles.card}>
                <div className={styles.attendanceRow}>
                  <span
                    className={`${styles.attendanceBadge} ${
                      item.attendance === "present"
                        ? styles.attendancePresent
                        : styles.attendanceAbsent
                    }`}
                  >
                    {item.attendance === "present" ? "Có mặt" : "Vắng"}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <div className={styles.meta}>
                  <span>{item.time}</span>
                  <span>{item.teacher}</span>
                  <span>{item.room}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Afternoon</div>
          <div className={styles.cardGrid}>
            {sessions.afternoon.map((item) => (
              <article
                key={item.title}
                className={`${styles.card} ${
                  item.highlight ? styles.cardHighlight : ""
                }`}
              >
                <div className={styles.cardHeader}>
                  {item.tag ? <span className={styles.tag}>{item.tag}</span> : null}
                  {item.badge ? (
                    <span className={styles.badge}>{item.badge}</span>
                  ) : null}
                </div>
                <div className={styles.attendanceRow}>
                  <span
                    className={`${styles.attendanceBadge} ${
                      item.attendance === "present"
                        ? styles.attendancePresent
                        : styles.attendanceAbsent
                    }`}
                  >
                    {item.attendance === "present" ? "Có mặt" : "Vắng"}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <div className={styles.meta}>
                  <span>{item.time}</span>
                  <span>{item.teacher}</span>
                  <span>{item.room}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Evening</div>
          <div className={styles.cardGrid}>
            {sessions.evening.map((item) => (
              <article
                key={item.title}
                className={`${styles.card} ${
                  item.muted ? styles.cardMuted : ""
                }`}
              >
                {item.tag ? <span className={styles.tagMuted}>{item.tag}</span> : null}
                <div className={styles.attendanceRow}>
                  <span
                    className={`${styles.attendanceBadge} ${
                      item.attendance === "present"
                        ? styles.attendancePresent
                        : styles.attendanceAbsent
                    }`}
                  >
                    {item.attendance === "present" ? "Có mặt" : "Vắng"}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <div className={styles.meta}>
                  <span>{item.time}</span>
                  <span>{item.teacher}</span>
                  <span>{item.room}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
