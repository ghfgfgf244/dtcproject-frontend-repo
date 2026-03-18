import Link from "next/link";
import styles from "@/styles/course-card.module.css";

interface Course {
  courseId: number;
  name: string;
  description: string;
  price: number;
  center: {
    name: string;
    address: string;
  };
}

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.media}>{course.name}</div>

      <div className={styles.body}>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.price}>
          {course.price.toLocaleString()} VND
        </div>

        <div className={styles.center}>
          <p>{course.center.name}</p>
          <p>{course.center.address}</p>
        </div>

        <Link href={`/courses/${course.courseId}`} className={styles.cta}>
          Xem Chi Tiet
        </Link>
      </div>
    </div>
  );
}
