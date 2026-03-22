import Link from "next/link";
import styles from "@/styles/mycourse.module.css";

export default function AttendanceHistory() {
  return (
    <div className={styles.card}>
      <h3>Attendance History</h3>

      <div className={styles.attendanceItem}>
        20 Aug 2023 <span className={styles.present}>Present</span>
      </div>

      <div className={styles.attendanceItem}>
        18 Aug 2023 <span className={styles.present}>Present</span>
      </div>

      <div className={styles.attendanceItem}>
        15 Aug 2023 <span className={styles.absent}>Absent</span>
      </div>

      <Link href="/attendance" className={styles.viewLink}>
        Xem chi tiết
      </Link>
    </div>
  );
}
