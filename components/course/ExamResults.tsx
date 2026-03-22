import Link from "next/link";
import styles from "@/styles/mycourse.module.css";

export default function ExamResults() {
  return (
    <div className={styles.card}>
      <h3>Exam Results</h3>

      <div className={styles.examPass}>
        THEORY EXAM
        <span>27 / 30</span>
      </div>

      <div className={styles.examPass}>
        SIMULATION EXAM
        <span>35 / 50</span>
      </div>

      <div className={styles.examPass}>
        PRACTICAL EXAM
        <span>90 / 100</span>
      </div>

      <Link href="/report" className={styles.viewLink}>
        Xem chi tiết
      </Link>
    </div>
  );
}
