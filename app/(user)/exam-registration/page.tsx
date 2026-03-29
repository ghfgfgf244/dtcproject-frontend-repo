"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/exam-registration.module.css";

export default function ExamRegistrationPage() {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);

  const handleReset = () => {
    setFormKey((prev) => prev + 1);
  };

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="exams" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1>Đăng ký kỳ thi</h1>
          <p>Điền thông tin để đăng ký tham gia kỳ thi.</p>
        </header>

        <div className={styles.card}>
          <div className={styles.examInfo}>
            <div>
              <span>Tên kỳ thi</span>
              <strong>Kỳ thi giữa khóa</strong>
            </div>
            <div>
              <span>Khóa học</span>
              <strong>B2 Driving Course</strong>
            </div>
            <div>
              <span>Kỳ thi</span>
              <strong>Lý thuyết</strong>
            </div>
            <div>
              <span>Thời hạn đăng ký</span>
              <strong>20/03/2026 → 25/03/2026</strong>
            </div>
            <div>
              <span>Thời gian thi</span>
              <strong>28/03/2026</strong>
            </div>
          </div>

          <form key={formKey} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Họ và tên học sinh</label>
                <input required placeholder="Nguyễn Văn A" />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" required placeholder="student@email.com" />
              </div>
              <div className={styles.field}>
                <label>Số điện thoại</label>
                <input required placeholder="0901234567" />
              </div>
              <div className={styles.field}>
                <label>CCCD</label>
                <input required placeholder="012345678901" />
              </div>
              <div className={styles.field}>
                <label>Lớp</label>
                <input required placeholder="B2-2026-03" />
              </div>
              <div className={styles.field}>
                <label>Số báo danh</label>
                <input required placeholder="09" />
              </div>
              <div className={`${styles.field} ${styles.signature}`}>
                <label>Chữ ký</label>
                <input required placeholder="Ký tên (gõ họ tên)" />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.resetBtn} onClick={handleReset}>
                Làm lại
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => router.back()}
              >
                Hủy
              </button>
              <button type="submit" className={styles.submitBtn}>
                Nộp
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
