"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/theory-practice.module.css";
import { setAuthToken } from "@/lib/api";
import { mockExamService } from "@/services/mockExamService";
import { courseService } from "@/services/courseService";
import {
  EXAM_LEVEL_LABEL_BY_VALUE,
  EXAM_LEVEL_OPTIONS,
  EXAM_LEVEL_VALUE_BY_LABEL,
} from "@/constants/exam-levels";

type CourseLite = {
  id: string;
  courseName: string;
  licenseType: number;
};

type SampleExamLite = {
  id: string;
  courseId: string;
  examNo: number;
  level: number;
  durationMinutes: number;
  passingScore: number;
  totalQuestions: number;
  isActive: boolean;
};

export default function TheoryPracticePage() {
  const router = useRouter();
  const { isLoaded, getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("TRUNG TÂM ĐÀO TẠO DTC");
  const [courseInput, setCourseInput] = useState("TỰ LUYỆN LÝ THUYẾT");
  const [license, setLicense] = useState("");
  const [candidateNo, setCandidateNo] = useState("");
  const [examChoice, setExamChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const [courses, setCourses] = useState<CourseLite[]>([]);
  const [allExams, setAllExams] = useState<SampleExamLite[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded) return;

      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);

        const [courseData, examData] = await Promise.all([
          courseService.getAvailableCourses(),
          mockExamService.getAll(),
        ]);

        setCourses(
          (courseData || []).map((course) => ({
            id: course.id,
            courseName: course.courseName,
            licenseType: Number(course.licenseType),
          })),
        );
        setAllExams((examData || []).filter((exam) => exam.isActive));
      } catch (error) {
        console.error("Failed to load sample exams:", error);
        setCourses([]);
        setAllExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken, isLoaded]);

  const selectedLicenseValue = license ? EXAM_LEVEL_VALUE_BY_LABEL[license] : undefined;

  const availableExams = useMemo(() => {
    if (!selectedLicenseValue) return [];

    return allExams
      .filter((exam) => Number(exam.level) === selectedLicenseValue)
      .sort((left, right) => left.examNo - right.examNo)
      .map((exam) => {
        const course = courses.find((item) => item.id === exam.courseId);
        return {
          ...exam,
          courseName: course?.courseName || `Đề thi số ${exam.examNo}`,
        };
      });
  }, [allExams, courses, selectedLicenseValue]);

  const selectedExam = useMemo(
    () => availableExams.find((exam) => exam.id === examChoice) ?? null,
    [availableExams, examChoice],
  );

  const canCheck = Boolean(license && examChoice);

  const info = useMemo(() => {
    if (!checked || !selectedExam) {
      return {
        licenseType: "-",
        name: "-",
        birth: "-",
        id: "-",
        address: "-",
      };
    }

    return {
      licenseType: license,
      name: "Học viên DTC",
      birth: "Đang cập nhật",
      id: candidateNo.trim() || userId || "Tự động tạo",
      address: "Thông tin chỉ để làm quen giao diện thi",
    };
  }, [candidateNo, checked, license, selectedExam, userId]);

  const handleCheck = () => {
    if (!canCheck) return;
    setChecked(true);
  };

  const handleStart = () => {
    if (!checked || !selectedExam) return;

    const params = new URLSearchParams({
      examId: selectedExam.id,
      license,
      examNo: String(selectedExam.examNo),
      title: selectedExam.courseName,
    });

    router.push(`/courses/my-course/theory-practice/exam?${params.toString()}`);
  };

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="courses" />

      <section className={shellStyles.content}>
        <header className={styles.pageHeader}>
          <h1>Lý thuyết lái xe</h1>
          <p>
            Chọn hạng GPLX và đề thi để vào làm bài. Các thông tin còn lại chỉ dùng để
            bạn làm quen với màn hình sát hạch.
          </p>
        </header>

        <div className={styles.panel}>
          <div className={styles.bannerTop}>
            PHẦN MỀM TỰ LUYỆN SÁT HẠCH LÝ THUYẾT MỚI NHẤT 2026
          </div>
          <div className={styles.bannerMain}>TỰ LUYỆN SÁT HẠCH LÝ THUYẾT</div>

          <div className={styles.formArea}>
            <div className={styles.formGrid}>
              <label className={styles.label}>Đơn vị:</label>
              <select
                className={styles.control}
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
              >
                <option value="TRUNG TÂM ĐÀO TẠO DTC">TRUNG TÂM ĐÀO TẠO DTC</option>
                <option value="TRUNG TÂM SÁT HẠCH LÁI XE KHU VỰC 1">
                  TRUNG TÂM SÁT HẠCH LÁI XE KHU VỰC 1
                </option>
                <option value="TRUNG TÂM SÁT HẠCH LÁI XE KHU VỰC 2">
                  TRUNG TÂM SÁT HẠCH LÁI XE KHU VỰC 2
                </option>
              </select>
              <button
                type="button"
                className={styles.checkBtn}
                disabled={!canCheck || loading}
                onClick={handleCheck}
              >
                Kiểm tra thông tin thí sinh
              </button>

              <label className={styles.label}>Khóa:</label>
              <select
                className={styles.control}
                value={courseInput}
                onChange={(event) => setCourseInput(event.target.value)}
              >
                <option value="TỰ LUYỆN LÝ THUYẾT">TỰ LUYỆN LÝ THUYẾT</option>
                <option value="ĐỀ THI TỔNG HỢP">ĐỀ THI TỔNG HỢP</option>
              </select>
              <div />

              <label className={styles.label}>Số báo danh:</label>
              <input
                className={styles.control}
                placeholder="Nhập để làm quen giao diện"
                value={candidateNo}
                onChange={(event) => setCandidateNo(event.target.value)}
              />
              <div />

              <label className={styles.label}>Hạng GPLX:</label>
              <select
                className={styles.control}
                value={license}
                onChange={(event) => {
                  setLicense(event.target.value);
                  setExamChoice("");
                  setChecked(false);
                }}
              >
                <option value="">Chọn hạng GPLX</option>
                {EXAM_LEVEL_OPTIONS.map((item) => (
                  <option key={item.value} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>

              <div className={styles.inlineField}>
                <span>Lựa chọn đề:</span>
                <select
                  className={styles.control}
                  value={examChoice}
                  onChange={(event) => {
                    setExamChoice(event.target.value);
                    setChecked(false);
                  }}
                  disabled={!license || loading}
                >
                  <option value="">
                    {loading ? "Đang tải đề..." : "Chọn đề thi thử"}
                  </option>
                  {availableExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      Đề {exam.examNo} · {exam.totalQuestions} câu · {exam.durationMinutes} phút
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.infoGrid}>
              <div className={styles.photoBox} />
              <div className={styles.infoDetails}>
                <div className={styles.infoRow}>
                  <span>Loại GPLX:</span>
                  <strong>{info.licenseType}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Họ tên:</span>
                  <div className={styles.infoInput}>
                    <span>{info.name}</span>
                    <span className={styles.editIcon}>✎</span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span>Ngày sinh:</span>
                  <strong>{info.birth}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Số CMT/CCCD:</span>
                  <strong>{info.id}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Địa chỉ:</span>
                  <strong>{info.address}</strong>
                </div>
                {selectedExam && (
                  <>
                    <div className={styles.infoRow}>
                      <span>Đề đã chọn:</span>
                      <strong>Đề {selectedExam.examNo}</strong>
                    </div>
                    <div className={styles.infoRow}>
                      <span>Thời gian:</span>
                      <strong>{selectedExam.durationMinutes} phút</strong>
                    </div>
                    <div className={styles.infoRow}>
                      <span>Điểm đạt:</span>
                      <strong>{selectedExam.passingScore}/100</strong>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.startBtn}
                disabled={!checked || !selectedExam}
                onClick={handleStart}
              >
                » Bắt đầu thi
              </button>
            </div>

            <p className={styles.note}>
              * Học viên chỉ cần chọn hạng GPLX và đề thi. Sau khi nộp bài, hệ thống mới
              hiển thị câu đúng, câu sai và mẹo giải thích từng câu để bạn review lại.
            </p>

            {license && !loading && availableExams.length === 0 && (
              <p className={styles.note}>
                * Hiện chưa có đề thi thử hoạt động cho hạng {license}. Vui lòng chọn hạng
                khác hoặc quay lại sau.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
