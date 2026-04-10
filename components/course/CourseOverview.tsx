import styles from "@/styles/mycourse.module.css";

interface CourseOverviewProps {
  courseName: string;
  description: string;
  centerName: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
}

export default function CourseOverview({
  courseName,
  description,
  centerName,
  startDate,
  endDate,
  imageUrl = "https://images.unsplash.com/photo-1511919884226-fd3cad34687c"
}: CourseOverviewProps) {
  return (
    <div className={styles.card}>
      <div className={styles.courseOverview}>
        <img
          src={imageUrl}
          className={styles.courseImage}
          alt={courseName}
        />

        <div className={styles.courseInfo}>
          <h3>Tổng quan khóa học</h3>
          <p className={styles.courseDesc}>
            {description}
          </p>

          <div className={styles.infoGrid}>
            <div>
              <span>Tên khóa học</span>
              <p>{courseName}</p>
            </div>

            <div>
              <span>Trung tâm đào tạo</span>
              <p>{centerName}</p>
            </div>

            <div>
              <span>Thời gian học</span>
              <p>{startDate && endDate ? `${startDate} - ${endDate}` : "Chưa xác định"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
