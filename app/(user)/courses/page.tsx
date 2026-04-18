import CourseCatalogView from "@/components/course/CourseCatalogView";
import styles from "@/styles/courses-guest.module.css";
import type { Center } from "@/services/centerService";
import type { Course } from "@/types/course";

interface ApiResponse<T> {
  data?: T;
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066/api").replace(/\/+$/, "");

async function fetchJson<T>(path: string): Promise<T> {
  try {
    const normalizedPath = path.replace(/^\/+/, "");
    const response = await fetch(new URL(`${normalizedPath}`, `${API_BASE_URL}/`), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return [] as T;
    }

    const payload = (await response.json()) as ApiResponse<T>;
    return (payload.data ?? []) as T;
  } catch {
    return [] as T;
  }
}

export default async function CoursesPage() {
  const [courses, centers] = await Promise.all([
    fetchJson<Course[]>("/Course/available"),
    fetchJson<Center[]>("/Center"),
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
