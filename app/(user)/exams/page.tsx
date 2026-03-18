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

const examSchedule = {
  morning: [
    {
      title: "Traffic Laws Theory Test",
      time: "08:00 - 09:30",
      teacher: "Nguyen Van A",
      room: "Room 201",
    },
    {
      title: "Basic Maneuvering Exam",
      time: "10:00 - 11:30",
      teacher: "Tran Thi B",
      room: "Training Field B",
    },
  ],
  afternoon: [
    {
      tag: "Practical",
      title: "Highway Driving Assessment",
      time: "13:30 - 15:00",
      teacher: "Le Van C",
      room: "Highway Track",
    },
    {
      tag: "B2 Final",
      title: "Engine & Maintenance Written Test",
      time: "15:30 - 16:30",
      teacher: "Nguyen Van A",
      room: "Room 205",
      highlight: true,
      badge: "Upcoming",
    },
  ],
  evening: [
    {
      tag: "C Theory",
      title: "Night Driving Safety Exam",
      time: "18:00 - 19:30",
      teacher: "Pham Minh D",
      room: "Room 204",
      muted: true,
    },
  ],
};

export default function ExamSchedulePage() {
  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="exams" />

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
            {examSchedule.morning.map((item) => (
              <article key={item.title} className={styles.card}>
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
            {examSchedule.afternoon.map((item) => (
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
            {examSchedule.evening.map((item) => (
              <article
                key={item.title}
                className={`${styles.card} ${
                  item.muted ? styles.cardMuted : ""
                }`}
              >
                {item.tag ? <span className={styles.tagMuted}>{item.tag}</span> : null}
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
