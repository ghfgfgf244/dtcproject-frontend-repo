import styles from "@/styles/mycourse.module.css";

interface AttendanceItem {
  id: string;
  sessionDate?: string;
  subjectName?: string;
  isPresent: boolean;
  checkedAt: string;
}

interface AttendanceHistoryProps {
  attendances: AttendanceItem[];
}

export default function AttendanceHistory({ attendances }: AttendanceHistoryProps) {
  return (
    <div className={styles.card}>
      <h3>Lịch sử điểm danh</h3>

      {attendances.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Chưa có dữ liệu điểm danh.</p>
      ) : (
        attendances.map((item) => (
          <div key={item.id} className={styles.attendanceItem}>
            <div>
              <p style={{ fontWeight: 500 }}>{item.subjectName || "Buổi học"}</p>
              <small>{item.sessionDate ? new Date(item.sessionDate).toLocaleDateString('vi-VN') : new Date(item.checkedAt).toLocaleDateString('vi-VN')}</small>
            </div>
            <span className={item.isPresent ? styles.present : styles.absent}>
              {item.isPresent ? "Có mặt" : "Vắng mặt"}
            </span>
          </div>
        ))
      )}

      {attendances.length > 0 && (
        <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          * Hiển thị tối đa 3 buổi học gần nhất.
        </p>
      )}
    </div>
  );
}
