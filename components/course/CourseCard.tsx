import Link from "next/link";
import styles from "@/styles/course-card.module.css";
import { Course } from "@/types/course";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const { id, courseName, description, price, centerName, centerAddress } = course;
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);

  return (
    <div className={styles.card}>
      <div className={styles.media}>{courseName}</div>

      <div className={styles.body}>
        <p className={styles.description}>{description}</p>

        <div className={styles.price}>{formattedPrice} VND</div>

        <div className={styles.center}>
          {centerName && <p className="font-semibold text-slate-800">{centerName}</p>}
          {centerAddress && <p className="text-xs text-slate-500">{centerAddress}</p>}
        </div>

        <Link href={`/courses/${id}`} className={styles.cta}>
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
