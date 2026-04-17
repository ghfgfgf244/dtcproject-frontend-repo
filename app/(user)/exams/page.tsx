"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/schedule.module.css";
import { setAuthToken } from "@/lib/api";
import { examService, ExamResponse } from "@/services/examService";
import NoCourseRegistered from "@/components/course/NoCourseRegistered";
import ExamSlot from "@/components/exam/ExamSlot";
import PendingCourseRegistrationNotice from "@/components/course/PendingCourseRegistrationNotice";
import { registrationService } from "@/services/registrationService";
import { RegistrationRecord } from "@/types/registration";

export default function ExamSchedulePage() {
  const { isLoaded, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [registration, setRegistration] = useState<RegistrationRecord | null>(null);
  const [pendingRegistration, setPendingRegistration] =
    useState<RegistrationRecord | null>(null);

  const fetchData = useCallback(async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const token = await getToken();
      setAuthToken(token);

      const registrations = await registrationService.getMyCourseRegistrations();
      const activeReg = registrations.find((item) => item.status === "Approved") ?? null;
      const waitingReg = registrations.find((item) => item.status === "Pending") ?? null;

      if (activeReg) {
        setRegistration(activeReg);
        setPendingRegistration(null);
        const examData = await examService.getMyExams();
        setExams(examData);
      } else {
        setRegistration(null);
        setPendingRegistration(waitingReg);
        setExams([]);
      }
    } catch (error) {
      console.error("Failed to fetch exam data:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="exams" />
        <section className={shellStyles.content}>
          <div style={{ textAlign: "center", padding: "4rem", color: "#6c7a96" }}>
            Đang tải dữ liệu...
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="exams" />

      <section className={`${shellStyles.content} ${styles.fadeEntry}`}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Lịch thi</h1>
            <p className={styles.subtitle}>
              Theo dõi lịch thi sắp tới và các kỳ kiểm tra, sát hạch của bạn.
            </p>
          </div>
        </header>

        {!registration && pendingRegistration ? (
          <PendingCourseRegistrationNotice
            registration={pendingRegistration}
            onCancelled={fetchData}
          />
        ) : !registration ? (
          <NoCourseRegistered
            title="Bạn chưa tham gia khóa học nào"
            description="Lịch thi sẽ hiển thị sau khi bạn được duyệt và tham gia một khóa học chính thức."
          />
        ) : (
          <div className={styles.section} style={{ marginTop: "2rem" }}>
            <div className={styles.sectionTitle}>Tất cả lịch thi của bạn</div>

            {exams.length > 0 ? (
              <div className={styles.cardGrid}>
                {exams.map((exam) => (
                  <ExamSlot
                    key={exam.id}
                    title={exam.examName}
                    examDate={exam.examDate}
                    durationMinutes={exam.durationMinutes}
                    location={exam.addressName}
                    type={exam.examType}
                    licenseType={exam.licenseType?.toString()}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyGroup}>
                Hiện tại chưa có lịch thi nào được sắp xếp cho bạn.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
