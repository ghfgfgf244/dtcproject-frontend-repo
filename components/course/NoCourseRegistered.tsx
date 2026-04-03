import Link from "next/link";
import styles from "@/styles/mycourse.module.css";

interface NoCourseRegisteredProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  icon?: string;
}

export default function NoCourseRegistered({
  title = "Bạn chưa đăng ký khóa học nào",
  description = "Hãy đăng ký một khóa học để bắt đầu hành trình chinh phục bằng lái xe ngay hôm nay!",
  buttonText = "Khám phá các khóa học",
  buttonLink = "/courses",
  icon = "📚"
}: NoCourseRegisteredProps) {
  return (
    <div className={styles.noDataBox}>
      <div className={styles.noDataIcon}>{icon}</div>
      <h2 className={styles.noDataTitle}>{title}</h2>
      <p className={styles.noDataDesc}>{description}</p>
      <Link href={buttonLink} className={styles.noDataButton}>
        {buttonText}
      </Link>
    </div>
  );
}
