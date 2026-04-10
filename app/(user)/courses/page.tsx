// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\app\(user)\courses\page.tsx

import { courseService } from "@/services/courseService";
import CourseGrid from "@/components/course/CourseGrid";
import styles from "@/styles/courses-guest.module.css";

// This is a Server Component by default in Next.js 13+ App Router
export default async function CoursesPage() {
  const courses = await courseService.getAvailableCourses();

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
          <CourseGrid courses={courses} />
        ) : (
          <div className="text-center py-20 text-slate-500">
            Hiện tại chưa có khóa học nào khả dụng. Vui lòng quay lại sau!
          </div>
        )}
      </div>
    </div>
  );
}
