"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/student-directory.module.css";

const classes = ["B2-2024-03", "B2-2024-05", "B2-2024-08"];

const students = [
  {
    id: "DM-2024-001",
    name: "Alexander Wright",
    email: "alex.wright@example.com",
    attendance: 95,
    status: "Present",
  },
  {
    id: "DM-2024-042",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    attendance: 88,
    status: "Present",
  },
  {
    id: "DM-2024-015",
    name: "Marcus Chen",
    email: "marcus.chen@example.com",
    attendance: 72,
    status: "Absent",
  },
  {
    id: "DM-2024-089",
    name: "Elena Rossi",
    email: "elena.rossi@example.com",
    attendance: 100,
    status: "Present",
  },
  {
    id: "DM-2024-112",
    name: "Jordan Brooks",
    email: "jordan.b@example.com",
    attendance: 45,
    status: "Absent",
  },
  {
    id: "DM-2024-007",
    name: "Liam O'Connor",
    email: "liam.oconnor@example.com",
    attendance: 92,
    status: "Present",
  },
];

export default function StudentDirectoryPage() {
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((student) =>
      `${student.id} ${student.name} ${student.email}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="teaching-schedule" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1>Student Directory</h1>
          <p>
            Monitor attendance, progress metrics, and academic standing for the
            current academic cycle.
          </p>
        </header>

        <div className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.classControl}>
              <span className={styles.classLabel}>Class</span>
              <select
                className={styles.classSelect}
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
              >
                {classes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <span className={styles.countBadge}>42 students</span>
            <div className={styles.searchBox}>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Quick search students..."
              />
            </div>
          </div>

          <div className={styles.table}>
            <div className={`${styles.row} ${styles.head}`}>
              <span>STT</span>
              <span>Avatar</span>
              <span>Student ID</span>
              <span>Full Name</span>
              <span>Email</span>
              <span>Attendance</span>
              <span>Status</span>
            </div>

            {filtered.map((student, index) => (
              <div key={student.id} className={styles.row}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.avatar}>{student.name[0]}</span>
                <span className={styles.studentId}>{student.id}</span>
                <span className={styles.studentName}>{student.name}</span>
                <span className={styles.email}>{student.email}</span>
                <span className={styles.attendance}>
                  <span className={styles.attendanceBar}>
                    <span
                      className={`${styles.attendanceFill} ${
                        student.attendance < 60 ? styles.attendanceLow : ""
                      }`}
                      style={{ width: `${student.attendance}%` }}
                    />
                  </span>
                  <strong>{student.attendance}%</strong>
                </span>
                <span
                  className={`${styles.statusPill} ${
                    student.status === "Present"
                      ? styles.present
                      : styles.absent
                  }`}
                >
                  {student.status}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <span>Showing 1-{filtered.length} of 42 students</span>
            <div className={styles.pagination}>
              <button type="button" className={styles.pageButton}>
                <span aria-hidden>◀</span>
              </button>
              <button type="button" className={styles.pageButtonActive}>
                1
              </button>
              <button type="button" className={styles.pageButton}>
                2
              </button>
              <button type="button" className={styles.pageButton}>
                3
              </button>
              <button type="button" className={styles.pageButton}>
                <span aria-hidden>▶</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
