import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/attendance-report.module.css";

const sessions = [
  {
    date: "Oct 24, 2023",
    title: "Practice: Night Driving",
    subtitle: "Instructor: Sarah Miller",
    time: "19:00 - 20:30",
    status: "Pending",
    action: "View Notes",
  },
  {
    date: "Oct 22, 2023",
    title: "Practice: Basic Maneuvering",
    subtitle: "Instructor: James Wilson",
    time: "14:00 - 15:30",
    status: "Present",
    action: "View Notes",
  },
  {
    date: "Oct 20, 2023",
    title: "Theory: Traffic Laws",
    subtitle: "Classroom 402",
    time: "09:00 - 11:00",
    status: "Absent",
    action: "Justify",
  },
  {
    date: "Oct 18, 2023",
    title: "Practice: City Parking",
    subtitle: "Instructor: James Wilson",
    time: "14:00 - 15:30",
    status: "Present",
    action: "View Notes",
  },
  {
    date: "Oct 15, 2023",
    title: "Theory: Vehicle Maintenance",
    subtitle: "Classroom 402",
    time: "10:00 - 12:00",
    status: "Present",
    action: "View Notes",
  },
];

export default function AttendanceReportPage() {
  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="attendance" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1>Attendance Report</h1>
          <p>
            Detailed overview of your driving course participation and progress.
          </p>
        </header>

        <div className={styles.summaryCard}>
          <div className={styles.rateBlock}>
            <div className={styles.rateRing}>
              <div className={styles.rateInner}>
                <strong>80%</strong>
                <span>Rate</span>
              </div>
            </div>
          </div>

          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span>Total Sessions</span>
              <strong>20</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Present</span>
              <strong className={styles.present}>16</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Absent</span>
              <strong className={styles.absent}>4</strong>
            </div>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Session History</h2>
            <div className={styles.tableActions}>
              <button type="button" className={styles.iconButton}>
                Filter
              </button>
              <button type="button" className={styles.exportButton}>
                Export
              </button>
            </div>
          </div>

          <div className={styles.table}>
            <div className={`${styles.row} ${styles.head}`}>
              <span>Date</span>
              <span>Lesson Name</span>
              <span>Time</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {sessions.map((item) => (
              <div key={item.date} className={styles.row}>
                <span className={styles.date}>{item.date}</span>
                <span className={styles.lesson}>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
                <span className={styles.time}>{item.time}</span>
                <span
                  className={`${styles.status} ${
                    item.status === "Present"
                      ? styles.statusPresent
                      : item.status === "Absent"
                        ? styles.statusAbsent
                        : styles.statusPending
                  }`}
                >
                  {item.status}
                </span>
                <span className={styles.action}>{item.action}</span>
              </div>
            ))}
          </div>

          <div className={styles.tableFooter}>
            <span>Showing 5 of 20 sessions</span>
            <div className={styles.pagination}>
              <button type="button" className={styles.pageButton}>
                <span aria-hidden>←</span>
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
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
