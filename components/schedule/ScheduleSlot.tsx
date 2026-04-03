import styles from "@/styles/schedule.module.css";

interface ScheduleSlotProps {
  title: string;
  startTime: string;
  endTime: string;
  teacher: string;
  location: string;
  highlight?: boolean;
}

export default function ScheduleSlot({
  title,
  startTime,
  endTime,
  teacher,
  location,
  highlight = false
}: ScheduleSlotProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <article className={`${styles.card} ${highlight ? styles.cardHighlight : ""}`}>
      <div className={styles.cardHeader}>
         <span className={styles.tag}>Buổi học</span>
      </div>
      <h3>{title}</h3>
      <div className={styles.meta}>
        <span className={styles.timeIcon}>🕒 {formatTime(startTime)} - {formatTime(endTime)}</span>
        <span className={styles.teacherIcon}>👨‍🏫 {teacher}</span>
        <span className={styles.roomIcon}>📍 {location}</span>
      </div>
    </article>
  );
}
