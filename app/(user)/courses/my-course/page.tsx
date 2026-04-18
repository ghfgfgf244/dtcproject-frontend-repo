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

function buildCourseDescription(registration: RegistrationRecord): string {
  if (registration.notes?.trim()) {
    return registration.notes.trim();
  }

  if (registration.licenseType) {
    return `Khóa học hiện đang được ghi nhận cho hạng bằng ${registration.licenseType}. Hệ thống sẽ cập nhật chi tiết lộ trình học, lớp học và lịch học ngay khi hoàn tất xếp kỳ hoặc xếp lớp.`;
  }

  return "Thông tin chi tiết về lộ trình lý thuyết và thực hành sẽ được cập nhật khi trung tâm hoàn tất xếp lớp.";
}

function buildCenterLabel(registration: RegistrationRecord): string {
  return (
    registration.assignedTermName ||
    registration.suggestedTermName ||
    registration.termName ||
    "Trung tâm / kỳ học sẽ được cập nhật"
  );
}

function buildStartDate(registration: RegistrationRecord): string | undefined {
  if (!registration.suggestedTermStartDate) {
    return undefined;
  }

  return new Date(registration.suggestedTermStartDate).toLocaleDateString("vi-VN");
}

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
                description={buildCourseDescription(registration)}
                centerName={buildCenterLabel(registration)}
                startDate={buildStartDate(registration)}
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
