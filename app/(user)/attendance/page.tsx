"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/attendance-report.module.css";
import { setAuthToken } from "@/lib/api";
import api from "@/lib/api";
import {
  attendanceService,
  StudentAttendanceReport,
} from "@/services/attendanceService";
import NoCourseRegistered from "@/components/course/NoCourseRegistered";

export default function AttendanceReportPage() {
  const { isLoaded, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<StudentAttendanceReport | null>(null);
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded) return;

      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);

        const regResponse = await api.get("/CourseRegistration/me");
        const registrations = regResponse.data.data || [];
        const activeReg = registrations.find(
          (item: any) => item.status === 2 || item.status === "Approved",
        );

        if (activeReg) {
          setRegistration(activeReg);
          const data = await attendanceService.getMyAttendanceReport();
          setReport(data);
        } else {
          setRegistration(null);
          setReport(null);
        }
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken, isLoaded]);

  if (loading) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="attendance" />
        <section className={shellStyles.content}>
          <div style={{ textAlign: "center", padding: "4rem", color: "#6c7a96" }}>
            Đang tải dữ liệu...
          </div>
        </section>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Present":
        return "Có mặt";
      case "Absent":
        return "Vắng mặt";
      default:
        return "Chưa điểm danh";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Present":
        return styles.statusPresent;
      case "Absent":
        return styles.statusAbsent;
      default:
        return styles.statusPending;
    }
  };

  const rate = report?.summary?.attendanceRate || 0;

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="attendance" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1>Báo cáo điểm danh</h1>
          <p>
            Theo dõi tỷ lệ chuyên cần và lịch sử tham gia các buổi học của bạn.
          </p>
        </header>

        {!registration ? (
          <NoCourseRegistered
            title="Bạn chưa tham gia khóa học nào"
            description="Báo cáo điểm danh sẽ hiển thị sau khi bạn được duyệt và tham gia một khóa học chính thức."
          />
        ) : (
          <>
            <div className={styles.summaryCard}>
              <div className={styles.rateBlock}>
                <div
                  className={styles.rateRing}
                  style={{
                    background: `conic-gradient(#1ca7ec 0 ${rate}%, #e9eff7 ${rate}% 100%)`,
                  }}
                >
                  <div className={styles.rateInner}>
                    <strong>{rate}%</strong>
                    <span>Tỷ lệ</span>
                  </div>
                </div>
              </div>

              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span>Tổng số buổi học</span>
                  <strong>{report?.summary?.totalSessions || 0}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Số buổi có mặt</span>
                  <strong className={styles.present}>
                    {report?.summary?.presentCount || 0}
                  </strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Số buổi vắng</span>
                  <strong className={styles.absent}>
                    {report?.summary?.absentCount || 0}
                  </strong>
                </div>
              </div>
            </div>

            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2>Lịch sử buổi học</h2>
              </div>

              <div className={styles.table}>
                <div className={`${styles.row} ${styles.head}`}>
                  <span>Ngày học</span>
                  <span>Tên bài học / Giáo viên</span>
                  <span>Thời gian</span>
                  <span>Trạng thái</span>
                </div>

                {report?.sessions && report.sessions.length > 0 ? (
                  report.sessions.map((item) => (
                    <div key={item.scheduleId} className={styles.row}>
                      <span className={styles.date}>
                        {new Date(item.date).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      <span className={styles.lesson}>
                        <strong>{item.lessonName}</strong>
                        <small>GV: {item.instructorName}</small>
                      </span>
                      <span className={styles.time}>
                        {item.startTime} - {item.endTime}
                      </span>
                      <span className={`${styles.status} ${getStatusClass(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    className={styles.emptyGroup}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      gridColumn: "span 4",
                      color: "#8b98b2",
                    }}
                  >
                    Chưa có lịch sử học tập nào để hiển thị.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
