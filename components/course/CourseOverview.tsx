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

          <h3>Course Overview</h3>

          <div className={styles.infoGrid}>

            <div>
              <span>Instructor</span>
              <p>Nguyen Van A</p>
            </div>

            <div>
              <span>Training Center</span>
              <p>Nha Trang Training Center</p>
            </div>

            <div>
              <span>Duration</span>
              <p>20 Aug 2023 - 20 Dec 2023</p>
            </div>

            <div>
              <span>Total Students</span>
              <p>24 Enrolled</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}