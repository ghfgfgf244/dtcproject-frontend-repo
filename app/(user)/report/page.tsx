import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/score-report.module.css";

const breakdown = [
  { label: "Attendance", score: "12/15", value: 80 },

  { label: "Theory Exam", score: "29/30", value: 96.67 },
  { label: "Simulation Exam", score: "35/50", value: 70 },
  { label: "Practical Exam", score: "85/100", value: 85 },
];

const exams = [
  {
    name: "Theory Entrance Test",
    date: "Oct 01, 2023",
    score: "28/30",
    status: "Pass",
  },
  {
    name: "Basic Maneuvering Quiz",
    date: "Oct 15, 2023",
    score: "9/10",
    status: "Pass",
  },
  {
    name: "Midterm Simulation",
    date: "Nov 05, 2023",
    score: "40/50",
    status: "Pass",
  },
  {
    name: "Final Practical Mock",
    date: "Dec 12, 2023",
    score: "85/100",
    status: "Pass",
  },
];

export default function ScoreReportPage() {
  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="report" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <div>
            <h1>Score Report</h1>
            <p>Academic performance overview for the current semester</p>
          </div>
          <button type="button" className={styles.termButton}>
            Fall Semester 2023
          </button>
        </header>

        <div className={styles.summaryGrid}>
          <div className={styles.overallCard}>
            <div className={styles.cardTitle}>Overall Grade</div>
            <div className={styles.overallRing}>
              <div className={styles.overallInner}>
                <strong>8.2</strong>
                <span>Out of 10</span>
              </div>
            </div>
            <div className={styles.badge}>Top 15% of Class</div>
          </div>

          <div className={styles.breakdownCard}>
            <div className={styles.cardTitle}>Performance Breakdown</div>
            <div className={styles.breakdownList}>
              {breakdown.map((item) => (
                <div key={item.label} className={styles.breakdownItem}>
                  <div className={styles.breakdownRow}>
                    <div>
                      <span className={styles.breakdownLabel}>{item.label}</span>
                    </div>
                    <span className={styles.breakdownScore}>{item.score}</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <span
                      className={styles.progressFill}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.historyCard}>
          <div className={styles.historyHeader}>
            <h2>Exam History</h2>
            <button type="button" className={styles.downloadButton}>
              Download PDF Report
            </button>
          </div>

          <div className={styles.historyTable}>
            <div className={`${styles.historyRow} ${styles.historyHead}`}>
              <span>Exam Name</span>
              <span>Date</span>
              <span>Score</span>
              <span>Status</span>
            </div>

            {exams.map((item) => (
              <div key={item.name} className={styles.historyRow}>
                <span className={styles.examName}>{item.name}</span>
                <span>{item.date}</span>
                <span className={styles.examScore}>{item.score}</span>
                <span className={styles.pass}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
