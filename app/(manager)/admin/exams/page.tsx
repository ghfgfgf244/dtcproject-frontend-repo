"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/admin-exams.module.css";

type ExamType = "Lý thuyết" | "Mô phỏng" | "Thực hành" | "Đường trường";
type ExamStatus = "Chưa mở" | "Mở đăng ký" | "Mở thi" | "Kết thúc";

type ExamItem = {
  id: number;
  name: string;
  course: string;
  type: ExamType;
  status: ExamStatus;
  registrationStart: string;
  registrationEnd: string;
  examStart: string;
  examEnd: string;
};

const initialExams: ExamItem[] = [
  {
    id: 1,
    name: "Kỳ thi giữa khóa",
    course: "B2 Driving Course",
    type: "Lý thuyết",
    status: "Mở đăng ký",
    registrationStart: "2026-03-20",
    registrationEnd: "2026-03-25",
    examStart: "2026-03-28",
    examEnd: "2026-03-28",
  },
  {
    id: 2,
    name: "Kỳ thi mô phỏng",
    course: "B2 Driving Course",
    type: "Mô phỏng",
    status: "Mở thi",
    registrationStart: "2026-03-21",
    registrationEnd: "2026-03-26",
    examStart: "2026-03-29",
    examEnd: "2026-03-29",
  },
];

export default function AdminExamsPage() {
  const [exams, setExams] = useState<ExamItem[]>(initialExams);
  const [detailExam, setDetailExam] = useState<ExamItem | null>(null);

  const approveExam = (id: number) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  };

  const rejectExam = (id: number) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  };

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="admin-exams" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <div>
            <h1>Quản lý kỳ thi</h1>
            <p>Duyệt và theo dõi các kỳ thi trong học kỳ.</p>
          </div>
        </header>

        <div className={styles.card}>
          <div className={`${styles.row} ${styles.head}`}>
            <span>Tên kỳ thi</span>
            <span>Khóa học</span>
            <span>Kỳ thi</span>
            <span>Thời hạn đăng ký</span>
            <span>Thời gian thi</span>
            <span>Trạng thái</span>
            <span>Tùy chọn</span>
          </div>

          {exams.map((exam) => (
            <div
              key={exam.id}
              className={styles.row}
              role="button"
              tabIndex={0}
              onClick={() => setDetailExam(exam)}
            >
              <strong>{exam.name}</strong>
              <span className={styles.course}>{exam.course}</span>
              <span className={styles.type}>{exam.type}</span>
              <span className={styles.range}>
                {exam.registrationStart} → {exam.registrationEnd}
              </span>
              <span className={styles.range}>
                {exam.examStart} → {exam.examEnd}
              </span>
              <span className={styles.status}>{exam.status}</span>
              <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.approveBtn}
                  onClick={() => approveExam(exam.id)}
                >
                  Duyệt
                </button>
                <button
                  className={styles.rejectBtn}
                  onClick={() => rejectExam(exam.id)}
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {detailExam && (
        <div className={styles.modalOverlay} onClick={() => setDetailExam(null)}>
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className={styles.infoIcon}>i</span>
                <h3>Chi tiết kỳ thi</h3>
              </div>
              <button onClick={() => setDetailExam(null)}>✕</button>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.fieldBlock}>
                <span>Tên kỳ thi</span>
                <div className={styles.valuePill}>{detailExam.name}</div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Khóa học</span>
                <div className={styles.valuePill}>{detailExam.course}</div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Kỳ thi</span>
                <div className={styles.valuePill}>{detailExam.type}</div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Trạng thái</span>
                <div className={styles.valuePill}>{detailExam.status}</div>
              </div>
              <div className={styles.fieldBlockFull}>
                <span>Thời hạn đăng ký</span>
                <div className={styles.valuePill}>
                  📅 {detailExam.registrationStart} → {detailExam.registrationEnd}
                </div>
              </div>
              <div className={styles.fieldBlockFull}>
                <span>Thời gian thi</span>
                <div className={styles.valuePill}>
                  📅 {detailExam.examStart} → {detailExam.examEnd}
                </div>
              </div>
            </div>

            <div className={styles.notice}>
              ⭐ Vui lòng kiểm tra thời gian thi và trạng thái trước khi duyệt.
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.approveBtn}
                onClick={() => {
                  approveExam(detailExam.id);
                  setDetailExam(null);
                }}
              >
                Duyệt
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => {
                  rejectExam(detailExam.id);
                  setDetailExam(null);
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
