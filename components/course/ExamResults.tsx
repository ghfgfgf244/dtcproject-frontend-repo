import styles from "@/styles/mycourse.module.css";

export default function ExamResults() {
  return (
    <div className={styles.card}>

      <h3>Kết Quả Thi</h3>

      <div className={styles.examPass}>
        THI LÝ THUYẾT
        <span>27 / 30</span>
      </div>

      <div className={styles.examPass}>
        THI MÔ PHỎNG
        <span>35 / 50</span>
      </div>

      <div className={styles.examPass}>
        THI THỰC HÀNH
        <span>90 / 100</span>
      </div>

    </div>
  );
}