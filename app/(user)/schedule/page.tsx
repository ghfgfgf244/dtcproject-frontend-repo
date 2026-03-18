import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/schedule.module.css";

const weekDays = [
  { day: "Mon", date: "23" },
  { day: "Tue", date: "24" },
  { day: "Wed", date: "25", active: true },
  { day: "Thu", date: "26" },
  { day: "Fri", date: "27" },
  { day: "Sat", date: "28" },
  { day: "Sun", date: "29" },
];

const sessions = {
  morning: [
    {
      title: "Traffic Laws & Regulations",
      time: "08:00 - 10:00",
      teacher: "Nguyen Van A",
      room: "Room 101",
      attendance: "present",
    },
    {
      title: "Basic Maneuvering",
      time: "09:00 - 11:30",
      teacher: "Tran Thi B",
      room: "Training Field A",
      attendance: "absent",
    },
  ],
  afternoon: [
    {
      tag: "Advanced",
      title: "Highway Defensive Driving",
      time: "13:30 - 15:30",
      teacher: "Le Van C",
      room: "Simulator Lab",
      attendance: "present",
    },
    {
      tag: "B2 Theory",
      title: "Engine & Maintenance Basics",
      time: "15:00 - 17:00",
      teacher: "Nguyen Van A",
      room: "Room 102",
      highlight: true,
      badge: "Current",
      attendance: "present",
    },
  ],
  evening: [
    {
      tag: "C Theory",
      title: "Night Driving Safety",
      time: "18:00 - 20:00",
      teacher: "Pham Minh D",
      room: "Room 101",
      muted: true,
      attendance: "absent",
    },
  ],
};

export default function SchedulePage() {
  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="schedule" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <div>
            <div className={styles.month}>October 2023</div>
            <div className={styles.weekRow}>
              {weekDays.map((item) => (
                <div
                  key={`${item.day}-${item.date}`}
                  className={`${styles.weekDay} ${
                    item.active ? styles.weekDayActive : ""
                  }`}
                >
                  <span>{item.day}</span>
                  <strong>{item.date}</strong>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Morning</div>
          <div className={styles.cardGrid}>
            {sessions.morning.map((item) => (
              <article key={item.title} className={styles.card}>
                <div className={styles.attendanceRow}>
                  <span
                    className={`${styles.attendanceBadge} ${
                      item.attendance === "present"
                        ? styles.attendancePresent
                        : styles.attendanceAbsent
                    }`}
                  >
                    {item.attendance === "present" ? "Có mặt" : "Vắng"}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <div className={styles.meta}>
                  <span>{item.time}</span>
                  <span>{item.teacher}</span>
                  <span>{item.room}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Afternoon</div>
          <div className={styles.cardGrid}>
            {sessions.afternoon.map((item) => (
              <article
                key={item.title}
                className={`${styles.card} ${
                  item.highlight ? styles.cardHighlight : ""
                }`}
              >
                <div className={styles.cardHeader}>
                  {item.tag ? <span className={styles.tag}>{item.tag}</span> : null}
                  {item.badge ? (
                    <span className={styles.badge}>{item.badge}</span>
                  ) : null}
                </div>
                <div className={styles.attendanceRow}>
                  <span
                    className={`${styles.attendanceBadge} ${
                      item.attendance === "present"
                        ? styles.attendancePresent
                        : styles.attendanceAbsent
                    }`}
                  >
                    {item.attendance === "present" ? "Có mặt" : "Vắng"}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <div className={styles.meta}>
                  <span>{item.time}</span>
                  <span>{item.teacher}</span>
                  <span>{item.room}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Evening</div>
          <div className={styles.cardGrid}>
            {sessions.evening.map((item) => (
              <article
                key={item.title}
                className={`${styles.card} ${
                  item.muted ? styles.cardMuted : ""
                }`}
              >
                {item.tag ? <span className={styles.tagMuted}>{item.tag}</span> : null}
                <div className={styles.attendanceRow}>
                  <span
                    className={`${styles.attendanceBadge} ${
                      item.attendance === "present"
                        ? styles.attendancePresent
                        : styles.attendanceAbsent
                    }`}
                  >
                    {item.attendance === "present" ? "Có mặt" : "Vắng"}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <div className={styles.meta}>
                  <span>{item.time}</span>
                  <span>{item.teacher}</span>
                  <span>{item.room}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
