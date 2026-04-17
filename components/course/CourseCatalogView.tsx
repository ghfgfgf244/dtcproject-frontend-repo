"use client";

import { useEffect, useMemo, useState } from "react";
import CourseGrid from "./CourseGrid";
import { Course } from "@/types/course";
import { Center } from "@/services/centerService";
import { EXAM_LEVEL_OPTIONS } from "@/constants/exam-levels";
import styles from "@/styles/courses-guest.module.css";

interface Props {
  courses: Course[];
  centers: Center[];
}

const ITEMS_PER_PAGE = 8;
const ALL_CENTERS = "all-centers";
const ALL_LICENSES = "all-licenses";

export default function CourseCatalogView({ courses, centers }: Props) {
  const [selectedCenter, setSelectedCenter] = useState<string>(ALL_CENTERS);
  const [selectedLicense, setSelectedLicense] = useState<string>(ALL_LICENSES);
  const [currentPage, setCurrentPage] = useState(1);

  const availableLicenseTypes = useMemo(() => {
    const courseLicenseSet = new Set(
      courses
        .map((course) => (course.licenseType || "").trim().toUpperCase())
        .filter(Boolean),
    );

    return EXAM_LEVEL_OPTIONS.filter((option) => courseLicenseSet.has(option.label.toUpperCase())).map(
      (option) => option.label,
    );
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCenter =
        selectedCenter === ALL_CENTERS || course.centerId === selectedCenter;
      const matchesLicense =
        selectedLicense === ALL_LICENSES ||
        (course.licenseType || "").toUpperCase() === selectedLicense.toUpperCase();

      return matchesCenter && matchesLicense;
    });
  }, [courses, selectedCenter, selectedLicense]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCenter, selectedLicense]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const startItem = filteredCourses.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = filteredCourses.length === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length);

  return (
    <div className={styles.catalogSection}>
      <div className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div>
            <p className={styles.filterEyebrow}>Bộ lọc khóa học</p>
            <h2>Lọc theo trung tâm và hạng bằng</h2>
          </div>
          <p className={styles.filterSummary}>
            Hiển thị <strong>{filteredCourses.length}</strong> khóa học phù hợp
          </p>
        </div>

        <div className={styles.filterGrid}>
          <label className={styles.field}>
            <span>Trung tâm đào tạo</span>
            <select value={selectedCenter} onChange={(event) => setSelectedCenter(event.target.value)}>
              <option value={ALL_CENTERS}>Tất cả trung tâm</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.centerName}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Hạng bằng</span>
            <select value={selectedLicense} onChange={(event) => setSelectedLicense(event.target.value)}>
              <option value={ALL_LICENSES}>Tất cả hạng bằng</option>
              {availableLicenseTypes.map((license) => (
                <option key={license} value={license}>
                  {license}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <>
          <CourseGrid courses={paginatedCourses} />

          <div className={styles.paginationBar}>
            <p>
              Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong> • Hiển thị{" "}
              <strong>
                {startItem}-{endItem}
              </strong>{" "}
              trên <strong>{filteredCourses.length}</strong> khóa học
            </p>

            <div className={styles.paginationActions}>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Tiếp theo
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          Không có khóa học phù hợp với bộ lọc hiện tại. Bạn hãy thử đổi trung tâm hoặc hạng bằng để xem thêm lựa chọn.
        </div>
      )}
    </div>
  );
}
