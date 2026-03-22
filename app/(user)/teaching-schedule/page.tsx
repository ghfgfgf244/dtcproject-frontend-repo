"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/teaching-schedule.module.css";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ===== TYPE ===== */
type Session = {
  time: string;
  classId?: string;
  room: string;
  muted?: boolean;
};

type SessionValue = Session | "closed" | null;

/* ===== DATA ===== */
const schedule: {
  morning: Record<number, SessionValue>;
  afternoon: Record<number, SessionValue>;
} = {
  morning: {
    19: { time: "08:00 - 10:00", classId: "B2-2026-03", room: "Room 102" },
    20: null,
    21: { time: "09:00 - 11:30", classId: "B2-2026-03", room: "Room 102" },
    22: { time: "08:00 - 10:00", classId: "B2-2026-03", room: "Room 105" },
    23: { time: "09:00 - 11:00", classId: "B2-2026-03", room: "Exam Center" },
    24: "closed",
    25: "closed",
  },
  afternoon: {
    19: { time: "14:00 - 15:30", classId: "B2-2026-03", room: "Vehicle A2" },
    20: { time: "13:00 - 15:00", classId: "B2-2026-03", room: "Room 104" },
    21: { time: "14:00 - 16:00", classId: "B2-2026-03", room: "Track B" },
    22: { time: "Administrative", room: "Administrative", muted: true },
    23: { time: "14:00 - 17:00", classId: "B2-2026-03", room: "Area 4" },
    24: "closed",
    25: "closed",
  },
};

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
  return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
}

/* ===== COMPONENT ===== */
export default function TeachingSchedulePage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

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

  const renderSession = (session: SessionValue) => {
    if (session === "closed") {
      return <div className={styles.closed}>Closed</div>;
    }

    if (!session) {
      return <div className={styles.noSession}>No Sessions</div>;
    }

    return (
      <div className={`${styles.sessionCard} ${session.muted ? styles.muted : ""}`}>
        <div className={styles.sessionTime}>{session.time}</div>

        <div className={styles.sessionTitle}>
          {session.classId ? (
            <Link href={`/teaching-schedule/class/${session.classId}`}>
              Class {session.classId}
            </Link>
          ) : (
            "Administrative"
          )}
        </div>

        <div className={styles.tagRow}>
          <span className={styles.tag}>{session.room}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="teaching-schedule" />

      <section className={shellStyles.content}>
        <div className={styles.content}>
          <header className={styles.header}>
            <div>
              <h1>Teaching Schedule</h1>
              <p>Manage your weekly driving sessions and classroom lectures.</p>
            </div>

            <div className={styles.rangeControl}>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => setWeekStart(addDays(weekStart, -7))}
              >
                ◀
              </button>

              <span>{formatRange(weekStart)}</span>

              <button
                type="button"
                className={styles.navButton}
                onClick={() => setWeekStart(addDays(weekStart, 7))}
              >
                ▶
              </button>
            </div>
          </header>

          <div className={styles.weekGrid}>
            {weekDays.map((day) => {
              const key = day.date.getDate();
              const morning = schedule.morning[key];
              const afternoon = schedule.afternoon[key];

              return (
                <div
                  key={day.date.toISOString()}
                  className={`${styles.dayColumn} ${day.isToday ? styles.focus : ""}`}
                >
                  <div className={styles.dayHeader}>
                    <span>{day.day}</span>
                    <strong>{key}</strong>
                    {day.isToday && <span className={styles.today}>Today</span>}
                  </div>

                  <div className={styles.sessionBlock}>
                    <div className={styles.sessionLabel}>Morning</div>
                    {renderSession(morning)}
                  </div>

                  <div className={styles.sessionBlock}>
                    <div className={styles.sessionLabel}>Afternoon</div>
                    {renderSession(afternoon)}
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