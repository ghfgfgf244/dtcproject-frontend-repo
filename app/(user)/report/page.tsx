import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/score-report.module.css";

const breakdown = [
  { label: "Điểm chuyên cần", score: "12/15", value: 80 },
  { label: "Thi lý thuyết", score: "29/30", value: 96.67 },
  { label: "Thi mô phỏng", score: "35/50", value: 70 },
  { label: "Thi thực hành", score: "85/100", value: 85 },
];

const exams = [
  {
    name: "Bài kiểm tra đầu vào lý thuyết",
    date: "01/10/2023",
    score: "28/30",
    status: "Đạt",
  },
  {
    name: "Kiểm tra thao tác cơ bản",
    date: "15/10/2023",
    score: "9/10",
    status: "Đạt",
  },
  {
    name: "Thi mô phỏng giữa kỳ",
    date: "05/11/2023",
    score: "40/50",
    status: "Đạt",
  },
  {
    name: "Thi thử thực hành cuối kỳ",
    date: "12/12/2023",
    score: "85/100",
    status: "Đạt",
  },
];

export default function ScoreReportPage() {
  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="report" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <div>
            <h1>Báo cáo kết quả học tập</h1>
            <p>Tổng quan kết quả học tập trong học kỳ hiện tại</p>
          </div>
          <button type="button" className={styles.termButton}>
            Học kỳ Thu 2023
          </button>
        </header>

        <div className={styles.summaryGrid}>
          <div className={styles.overallCard}>
            <div className={styles.cardTitle}>Điểm tổng kết</div>
            <div className={styles.overallRing}>
              <div className={styles.overallInner}>
                <strong>8.2</strong>
                <span>Trên thang 10</span>
              </div>
            </div>
            <div className={styles.badge}>Top 15% của lớp</div>
          </div>

          <div className={styles.breakdownCard}>
            <div className={styles.cardTitle}>Chi tiết kết quả</div>
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
            <h2>Lịch sử bài thi</h2>
            <button type="button" className={styles.downloadButton}>
              Tải báo cáo PDF
            </button>
          </div>

          <div className={styles.historyTable}>
            <div className={`${styles.historyRow} ${styles.historyHead}`}>
              <span>Tên bài thi</span>
              <span>Ngày thi</span>
              <span>Điểm số</span>
              <span>Trạng thái</span>
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
