import styles from "@/styles/mycourse.module.css";

export default function DrivingMetrics() {
  return (
    <div className={styles.card}>

      <h3>Chỉ Số Lái Xe</h3>

      <div className={styles.metric}>
        <div className={styles.metricLabel}>
          <span>Lái Xe Ban Ngày</span>
          <span>180 / 300 km</span>
        </div>

        <div className={styles.progress}>
          <div className={styles.progressFill} style={{width:"60%"}}></div>
        </div>
      </div>

      <div className={styles.metric}>
        <div className={styles.metricLabel}>
          <span>Lái Xe Ban Đêm</span>
          <span>30 / 50 km</span>
        </div>

        <div className={styles.progress}>
          <div className={styles.progressFill} style={{width:"60%"}}></div>
        </div>
      </div>

    </div>
  );
}