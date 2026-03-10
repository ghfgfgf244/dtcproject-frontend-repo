"use client";

import styles from "@/styles/mycourse.module.css";
import CourseOverview from "@/components/course/CourseOverview";
import DrivingMetrics from "@/components/course/DrivingMetrics";
import LearningRoadmap from "@/components/course/LearningRoadmap";
import LearningMaterials from "@/components/course/LearningMaterials";
import ExamResults from "@/components/course/ExamResults";
import AttendanceHistory from "@/components/course/AttendanceHistory";

export default function MyCoursePage() {
  return (
    <div className={styles.page}>
      
      <div className={styles.container}>

        <h1 className={styles.title}>My Course</h1>

        <div className={styles.grid}>

          <div className={styles.left}>
            <CourseOverview />
            <LearningRoadmap />
            <LearningMaterials />
          </div>

          <div className={styles.right}>
            <DrivingMetrics />
            <ExamResults />
            <AttendanceHistory />
          </div>

        </div>

      </div>

    </div>
  );
}