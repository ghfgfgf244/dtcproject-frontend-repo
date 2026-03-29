"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/admin-courses.module.css";

type CourseItem = {
  id: number;
  name: string;
  code: string;
  description: string;
  price: string;
  startDate: string;
  endDate: string;
};

const initialCourses: CourseItem[] = [
  {
    id: 1,
    name: "B2 Driving Course",
    code: "DM-B2-2026",
    description: "Chương trình đào tạo lái xe B2 toàn diện.",
    price: "12.000.000",
    startDate: "2026-04-01",
    endDate: "2026-08-01",
  },
  {
    id: 2,
    name: "C Driving Course",
    code: "DM-C-2026",
    description: "Khóa học lái xe hạng C cho người mới.",
    price: "16.500.000",
    startDate: "2026-05-10",
    endDate: "2026-09-15",
  },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [detailCourse, setDetailCourse] = useState<CourseItem | null>(null);

  const stats = useMemo(() => {
    const total = courses.length;
    const upcoming = courses.filter(
      (c) => new Date(c.startDate) > new Date()
    ).length;
    const active = total - upcoming;
    const registered = 240;
    return { total, active, upcoming, registered };
  }, [courses]);

  const approveCourse = (id: number) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const rejectCourse = (id: number) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="admin-courses" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <div>
            <h1>Quản lý khóa học</h1>
            <p>Theo dõi và cập nhật danh sách khóa học hiện có.</p>
          </div>
        </header>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span>Số khóa học</span>
            <strong>{stats.total}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Khóa học đang mở</span>
            <strong>{stats.active}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Khóa học sắp tới</span>
            <strong>{stats.upcoming}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Số học sinh đăng ký</span>
            <strong>{stats.registered}</strong>
          </div>
        </div>

        <div className={styles.card}>
          <div className={`${styles.row} ${styles.head}`}>
            <span>STT</span>
            <span>Tên khóa</span>
            <span>Code khóa</span>
            <span>Mô tả</span>
            <span>Giá tiền</span>
            <span>Thời gian học</span>
            <span>Tùy chọn</span>
          </div>

          {courses.map((course, index) => (
            <div
              key={course.id}
              className={styles.row}
              onClick={() => setDetailCourse(course)}
              role="button"
              tabIndex={0}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{course.name}</strong>
              <span className={styles.code}>{course.code}</span>
              <span className={styles.desc}>{course.description}</span>
              <span>{course.price}</span>
              <span className={styles.range}>
                {course.startDate} → {course.endDate}
              </span>
              <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.approveBtn}
                  onClick={() => approveCourse(course.id)}
                >
                  Duyệt
                </button>
                <button
                  className={styles.rejectBtn}
                  onClick={() => rejectCourse(course.id)}
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {detailCourse && (
        <div className={styles.modalOverlay} onClick={() => setDetailCourse(null)}>
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className={styles.infoIcon}>i</span>
                <h3>Chi tiết khóa học</h3>
              </div>
              <button onClick={() => setDetailCourse(null)}>✕</button>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.fieldBlock}>
                <span>Tên khóa</span>
                <div className={styles.valuePill}>{detailCourse.name}</div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Code khóa</span>
                <div className={styles.valuePill}>{detailCourse.code}</div>
              </div>
              <div className={styles.fieldBlockFull}>
                <span>Mô tả</span>
                <div className={styles.valueBox}>{detailCourse.description}</div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Giá tiền</span>
                <div className={styles.valuePill}>💳 {detailCourse.price} VNĐ</div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Thời gian học</span>
                <div className={styles.valuePill}>
                  📅 {detailCourse.startDate} to {detailCourse.endDate}
                </div>
              </div>
            </div>

            <div className={styles.notice}>
              ⭐ This course requires immediate approval for the upcoming Q2
              semester capacity planning.
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.approveBtn}
                onClick={() => {
                  approveCourse(detailCourse.id);
                  setDetailCourse(null);
                }}
              >
                Duyệt
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => {
                  rejectCourse(detailCourse.id);
                  setDetailCourse(null);
                }}
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
