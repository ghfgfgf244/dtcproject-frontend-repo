import styles from "@/styles/mycourse.module.css";

export default function CourseOverview() {
  return (
    <div className={styles.card}>

      <div className={styles.courseOverview}>

        <img
          src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c"
          className={styles.courseImage}
        />

        <div className={styles.courseInfo}>

          <h3>Tổng Quan Khóa Học</h3>

          <div className={styles.infoGrid}>

            <div>
              <span>Giáo Viên</span>
              <p>Nguyen Van A</p>
            </div>

            <div>
              <span>Trung Tâm Đào Tạo</span>
              <p>Nha Trang Training Center</p>
            </div>

            <div>
              <span>Thời Gian</span>
              <p>20 Aug 2023 - 20 Dec 2023</p>
            </div>

            <div>
              <span>Tổng Số Học Viên</span>
              <p>24 Đã đăng ký</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}