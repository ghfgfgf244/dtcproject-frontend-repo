import styles from "@/styles/mycourse.module.css";
import Link from "next/link";

export default function LearningMaterials() {
  return (
    <div className={styles.card}>

      <h3>Tài Liệu Học Tập</h3>

      <div className={styles.materialGrid}>

        <Link href="/courses/my-course/theory-practice" className={styles.materialCard}>
          Câu hỏi và đáp án lý thuyết
        </Link>

        <div className={styles.materialCard}>
          Bài thi mô phỏng và mẹo
        </div>

        <div className={styles.materialCard}>
          Thực hành lái xe, mẹo và kỹ năng
        </div>

      </div>

    </div>
  );
}
