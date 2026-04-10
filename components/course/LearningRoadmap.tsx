import styles from "@/styles/mycourse.module.css";

export default function LearningRoadmap() {
  return (
    <div className={styles.card}>

      <div className={styles.roadmapHeader}>
        <h3>Lộ Trình Học Tập</h3>
        <span>Hoàn thành 70%</span>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressFill} style={{width:"70%"}}></div>
      </div>

      <div className={styles.roadmapItem}>
        ✔ Kỹ năng lái xe cơ bản
      </div>

      <div className={styles.roadmapItem}>
        ✔ Thực hành đỗ xe
      </div>

      <div className={styles.roadmapItemActive}>
        Lái xe trong thành phố
      </div>

    </div>
  );
}