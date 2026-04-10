import styles from "@/styles/schedule.module.css";
import { ExamType } from "@/services/examService";

interface ExamSlotProps {
  title: string;
  examDate: string;
  durationMinutes: number;
  location: string;
  type: ExamType;
  licenseType?: string;
}

const getTypeName = (type: ExamType) => {
  switch (type) {
    case ExamType.Theory: return "Lý thuyết";
    case ExamType.Simulation: return "Mô phỏng";
    case ExamType.Practice: return "Thực hành";
    default: return "Kỳ thi";
  }
};

export default function ExamSlot({ 
  title, 
  examDate, 
  durationMinutes, 
  location, 
  type,
  licenseType 
}: ExamSlotProps) {
  const dateObj = new Date(examDate);
  const timeStr = dateObj.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = dateObj.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.tag}>{getTypeName(type)}</span>
        {licenseType && <span className={styles.badge}>{licenseType}</span>}
      </div>
      
      <h3>{title}</h3>
      
      <div className={styles.meta}>
        <span className={styles.timeIcon}>🕒 {dateStr} lúc {timeStr} ({durationMinutes} phút)</span>
        <span className={styles.roomIcon}>📍 {location || "Sân thi trung tâm"}</span>
      </div>
    </article>
  );
}
