import styles from "@/styles/mycourse.module.css";

export default function AttendanceHistory() {
  return (
    <div className={styles.card}>

      <h3>Lịch Sử Điểm Danh</h3>

      <div className={styles.attendanceItem}>
        20 Aug 2023 <span className={styles.present}>Có mặt</span>
      </div>

      <div className={styles.attendanceItem}>
        18 Aug 2023 <span className={styles.present}>Có mặt</span>
      </div>

      <div className={styles.attendanceItem}>
        15 Aug 2023 <span className={styles.absent}>Vắng mặt</span>
      </div>

    </div>
  );
}