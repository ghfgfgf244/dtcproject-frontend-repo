import styles from "@/styles/mycourse.module.css";

interface DrivingMetricsProps {
  totalDistance: number;
  requiredDistance: number;
}

export default function DrivingMetrics({ totalDistance, requiredDistance }: DrivingMetricsProps) {
  const percentage = requiredDistance > 0 ? Math.min((totalDistance / requiredDistance) * 100, 100) : 0;
  
  return (
    <div className={styles.card}>
      <h3>Tiến độ lái xe (DAT)</h3>

      <div className={styles.metric}>
        <div className={styles.metricLabel}>
          <span>Quãng đường đã đi</span>
          <span>{totalDistance} / {requiredDistance} km</span>
        </div>

        <div className={styles.progress}>
          <div className={styles.progressFill} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <small style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
        * Dữ liệu được đồng bộ từ thiết bị giám sát hành trình (DAT).
      </small>
    </div>
  );
}
