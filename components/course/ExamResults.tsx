import styles from "@/styles/mycourse.module.css";

interface ExamResultItem {
  examType: string;
  score: number;
  totalScore: number;
}

interface ExamResultsProps {
  results: ExamResultItem[];
}

export default function ExamResults({ results }: ExamResultsProps) {
  const getScore = (type: string) => {
    const res = results.find(r => r.examType === type);
    if (!res) return "Chưa có điểm";
    return `${res.score} / ${res.totalScore}`;
  };

  return (
    <div className={styles.card}>
      <h3>Kết quả sát hạch</h3>

      <div className={styles.examPass}>
        KẾT QUẢ LÝ THUYẾT
        <span>{getScore('Theory')}</span>
      </div>

      <div className={styles.examPass}>
        KẾT QUẢ MÔ PHỎNG
        <span>{getScore('Simulation')}</span>
      </div>

      <div className={styles.examPass}>
        KẾT QUẢ THỰC HÀNH
        <span>{getScore('Practice')}</span>
      </div>

      <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
        * Hiển thị điểm số cao nhất đạt được trong mỗi hạng mục.
      </p>
    </div>
  );
}
