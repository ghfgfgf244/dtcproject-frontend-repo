"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/mycourse.module.css";
import CourseOverview from "@/components/course/CourseOverview";
import DrivingMetrics from "@/components/course/DrivingMetrics";
import LearningMaterials from "@/components/course/LearningMaterials";
import ExamResults from "@/components/course/ExamResults";
import AttendanceHistory from "@/components/course/AttendanceHistory";
import NoCourseRegistered from "@/components/course/NoCourseRegistered";
import PendingCourseRegistrationNotice from "@/components/course/PendingCourseRegistrationNotice";
import { setAuthToken } from "@/lib/api";
import { drivingService } from "@/services/drivingService";
import { examService } from "@/services/examService";
import { registrationService } from "@/services/registrationService";
import { RegistrationRecord } from "@/types/registration";
import {
  attendanceService,
  AttendanceSession,
} from "@/services/attendanceService";

export default function MyCoursePage() {
  const { isLoaded, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState<RegistrationRecord | null>(null);
  const [pendingRegistration, setPendingRegistration] = useState<RegistrationRecord | null>(null);
  const [drivingMetrics, setDrivingMetrics] = useState({ total: 0, required: 800 });
  const [examResults, setExamResults] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<AttendanceSession[]>([]);

  const fetchData = useCallback(async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const token = await getToken();
      setAuthToken(token);

      const registrations = await registrationService.getMyCourseRegistrations();
      const activeReg = registrations.find((item) => item.status === "Approved") ?? null;
      const waitingReg = registrations.find((item) => item.status === "Pending") ?? null;

      if (!activeReg) {
        setRegistration(null);
        setPendingRegistration(waitingReg);
        setExamResults([]);
        setAttendances([]);
        setDrivingMetrics({ total: 0, required: 800 });
        return;
      }

      setRegistration(activeReg);
      setPendingRegistration(null);

      const [distRecords, results, attendanceData] = await Promise.all([
        drivingService.getMyDistances(),
        examService.getMyExamResults(),
        attendanceService.getMyAttendanceReport(),
      ]);

      const totalDist = distRecords.reduce(
        (sum: number, rec: any) => sum + (rec.actualDistance || 0),
        0,
      );
      const requiredDist =
        distRecords.length > 0 ? distRecords[0].requiredDistance : 800;

      setDrivingMetrics({ total: totalDist, required: requiredDist });
      setExamResults(results);
      setAttendances((attendanceData.sessions || []).slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
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
        <Sidebar activeKey="courses" />
        <section className={shellStyles.content}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <p>Đang tải dữ liệu khóa học...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="courses" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1>Khóa học của tôi</h1>
          <p>
            Theo dõi tiến trình học tập, kết quả sát hạch và lịch sử điểm danh của
            bạn.
          </p>
        </header>

        {!registration && pendingRegistration ? (
          <PendingCourseRegistrationNotice
            registration={pendingRegistration}
            onCancelled={fetchData}
          />
        ) : !registration ? (
          <NoCourseRegistered />
        ) : (
          <div className={styles.grid}>
            <div className={styles.left}>
              <CourseOverview
                courseName={registration.courseName || "Khóa học lái xe"}
                description={
                  registration.courseDescription ||
                  "Thời gian đào tạo bao gồm lý thuyết và thực hành."
                }
                centerName={registration.centerName || "Trung tâm đào tạo DTC"}
                startDate={
                  registration.startDate
                    ? new Date(registration.startDate).toLocaleDateString("vi-VN")
                    : undefined
                }
                endDate={
                  registration.endDate
                    ? new Date(registration.endDate).toLocaleDateString("vi-VN")
                    : undefined
                }
              />
              <DrivingMetrics
                totalDistance={drivingMetrics.total}
                requiredDistance={drivingMetrics.required}
              />
            </div>

            <div className={styles.right}>
              <LearningMaterials />
              <ExamResults results={examResults} />
              <AttendanceHistory attendances={attendances} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
