import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/mycourse.module.css";
import CourseOverview from "@/components/course/CourseOverview";
import DrivingMetrics from "@/components/course/DrivingMetrics";
import LearningMaterials from "@/components/course/LearningMaterials";
import ExamResults from "@/components/course/ExamResults";
import AttendanceHistory from "@/components/course/AttendanceHistory";

export default function MyCoursePage() {
  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="courses" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1>Khóa học của tôi</h1>
          <p>Theo dõi tiến trình học, tài liệu và lịch sử điểm danh.</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.left}>
            <CourseOverview />
            <DrivingMetrics />
          </div>

          <div className={styles.right}>
            <LearningMaterials />
            <ExamResults />
            <AttendanceHistory />
          </div>
        </div>
      </section>
    </div>
  );
}
