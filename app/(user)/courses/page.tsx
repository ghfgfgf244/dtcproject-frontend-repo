import CourseCatalogView from "@/components/course/CourseCatalogView";
import { centerService } from "@/services/centerService";
import { courseService } from "@/services/courseService";
import styles from "@/styles/courses-guest.module.css";

export default async function CoursesPage() {
  const [courses, centers] = await Promise.all([
    courseService.getAvailableCourses(),
    centerService.getAll(),
  ]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Khóa học lái xe</h1>
          <p>
            Đăng ký tham gia các trung tâm đào tạo đáng tin cậy và xây dựng sự tự tin lái xe thực tế cho mọi hành trình.
          </p>
        </div>
      </section>

      <div className={styles.listWrap}>
        {courses.length > 0 ? (
          <CourseCatalogView courses={courses} centers={centers} />
        ) : (
          <div className={styles.emptyState}>
            Hiện tại chưa có khóa học nào khả dụng. Vui lòng quay lại sau!
          </div>
        )}
      </div>
    </div>
  );
}
