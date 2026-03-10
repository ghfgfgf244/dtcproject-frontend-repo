import styles from "@/styles/mycourse.module.css";

export default function LearningRoadmap() {
  return (
    <div className={styles.card}>

      <div className={styles.roadmapHeader}>
        <h3>Learning Roadmap</h3>
        <span>70% Complete</span>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressFill} style={{width:"70%"}}></div>
      </div>

      <div className={styles.roadmapItem}>
        ✔ Basic driving skills
      </div>

      <div className={styles.roadmapItem}>
        ✔ Parking practice
      </div>

      <div className={styles.roadmapItemActive}>
        City driving
      </div>

    </div>
  );
}