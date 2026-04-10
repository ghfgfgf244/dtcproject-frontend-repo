import styles from "@/styles/mycourse.module.css";

interface AttendanceItem {
  scheduleId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  lessonName?: string;
  instructorName?: string;
  status?: "Present" | "Absent" | "Pending";
}

interface AttendanceHistoryProps {
  attendances: AttendanceItem[];
}

function getSessionLabel(startTime?: string) {
  if (!startTime) return "Buổi học";

  const hour = Number.parseInt(startTime.slice(0, 2), 10);
  if (Number.isNaN(hour)) return "Buổi học";
  if (hour < 12) return "Buổi sáng";
  if (hour < 18) return "Buổi chiều";
  return "Buổi tối";
}

function getStatusLabel(status?: AttendanceItem["status"]) {
  switch (status) {
    case "Present":
      return "Có mặt";
    case "Absent":
      return "Vắng mặt";
    default:
      return "Chờ điểm danh";
  }
}

function getStatusClass(status?: AttendanceItem["status"]) {
  switch (status) {
    case "Present":
      return styles.present;
    case "Absent":
      return styles.absent;
    default:
      return styles.pending;
  }
}

export default function AttendanceHistory({ attendances }: AttendanceHistoryProps) {
  return (
    <div className={styles.card}>
      <h3>Lịch sử điểm danh</h3>

      {attendances.length === 0 ? (
        <p className={styles.helperText}>Chưa có dữ liệu điểm danh.</p>
      ) : (
        attendances.map((item, index) => {
          const key = [
            item.scheduleId ?? "schedule",
            item.date ?? "date",
            item.startTime ?? "start",
            item.endTime ?? "end",
            index,
          ].join("-");

          return (
            <div key={key} className={styles.attendanceItem}>
              <div>
                <p className={styles.attendanceTitle}>
                  {item.lessonName || "Buổi học"} · {getSessionLabel(item.startTime)}
                </p>
                <small className={styles.attendanceMeta}>
                  {item.date ? new Date(item.date).toLocaleDateString("vi-VN") : "Chưa xác định ngày"}
                  {item.startTime && item.endTime ? ` · ${item.startTime} - ${item.endTime}` : ""}
                  {item.instructorName ? ` · ${item.instructorName}` : ""}
                </small>
              </div>
              <span className={getStatusClass(item.status)}>{getStatusLabel(item.status)}</span>
            </div>
          );
        })
      )}

      {attendances.length > 0 && (
        <p className={styles.helperText}>* Hiển thị tối đa 3 buổi học gần nhất.</p>
      )}
    </div>
  );
}
