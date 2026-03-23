import { mockCourses } from "@/lib/mockCourses";
import CourseGrid from "@/components/course/CourseGrid";
import styles from "@/styles/courses-guest.module.css";

export default function CoursesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Khóa học lại xe</h1>
          <p>
            Đăng ký tham gia các trung tâm đào tạo đáng tin cậy và xây dựng sự tự tin lái xe thực tế cho mọi hành trình.
          </p>
        </div>
      </section>

      <div className={styles.listWrap}>
        <CourseGrid courses={mockCourses} />
      </div>
    </div>
  );
}
