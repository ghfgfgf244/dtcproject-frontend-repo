"use client";

import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/theory-practice.module.css";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function TheoryPracticePage() {
  const router = useRouter();
  const [unit, setUnit] = useState("");
  const [course, setCourse] = useState("");
  const [license, setLicense] = useState("");
  const [examChoice, setExamChoice] = useState("");
  const [candidateNo, setCandidateNo] = useState("");
  const [checked, setChecked] = useState(false);

  const canCheck =
    unit && course && license && examChoice && candidateNo.trim().length > 0;

  const info = useMemo(() => {
    if (!checked) {
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
      name: "Nguyễn Văn A",
      birth: "01/01/1999",
      id: "01234567",
      address: "Việt Nam",
    };
  }, [checked, license]);

  const handleCheck = () => {
    if (!canCheck) return;
    setChecked(true);
  };

  const handleStart = () => {
    if (!checked) return;
    router.push("/courses/my-course/theory-practice/exam");
  };

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="courses" />

      <section className={shellStyles.content}>
        <header className={styles.pageHeader}>
          <h1>Lý thuyết lái xe</h1>
          <p>Chọn đề thi và kiểm tra thông tin thí sinh trước khi bắt đầu.</p>
        </header>

        <div className={styles.panel}>
          <div className={styles.bannerTop}>
            PHẦN MỀM TỰ LUYỆN SÁT HẠCH LÝ THUYẾT MỚI NHẤT 2026
          </div>
          <div className={styles.bannerMain}>
            TỰ LUYỆN SÁT HẠCH LÝ THUYẾT 600 CÂU
          </div>

          <div className={styles.formArea}>
            <div className={styles.formGrid}>
              <label className={styles.label}>Đơn vị:</label>
              <select
                className={styles.control}
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
              >
                <option value="">Chọn đơn vị</option>
                <option value="TRUNG TÂM SÁT HẠCH LÁI XE HẢI PHÒNG">
                  TRUNG TÂM SÁT HẠCH LÁI XE HẢI PHÒNG
                </option>
                <option value="TRUNG TÂM SÁT HẠCH LÁI XE ĐÀ NẴNG">
                  TRUNG TÂM SÁT HẠCH LÁI XE ĐÀ NẴNG
                </option>
              </select>
              <button
                className={styles.checkBtn}
                disabled={!canCheck}
                onClick={handleCheck}
              >
                Kiểm tra thông tin thí sinh
              </button>

              <label className={styles.label}>Khóa:</label>
              <select
                className={styles.control}
                value={course}
                onChange={(event) => setCourse(event.target.value)}
              >
                <option value="">Chọn khóa</option>
                <option value="TỰ LUYỆN LÝ THUYẾT">TỰ LUYỆN LÝ THUYẾT</option>
                <option value="ĐỀ THI TỔNG HỢP">ĐỀ THI TỔNG HỢP</option>
              </select>
              <div />

              <label className={styles.label}>Số báo danh:</label>
              <input
                className={styles.control}
                placeholder="9"
                value={candidateNo}
                onChange={(event) => setCandidateNo(event.target.value)}
              />
              <div />

              <label className={styles.label}>Hạng GPLX:</label>
              <select
                className={styles.control}
                value={license}
                onChange={(event) => setLicense(event.target.value)}
              >
                <option value="">Chọn hạng GPLX</option>
                <option value="Ô tô hạng B">Ô tô hạng B</option>
                <option value="Ô tô hạng C">Ô tô hạng C</option>
              </select>
              <div className={styles.inlineField}>
                <span>Lựa chọn Đề:</span>
                <select
                  className={styles.control}
                  value={examChoice}
                  onChange={(event) => setExamChoice(event.target.value)}
                >
                  <option value="">-&gt;Ngẫu nhiên</option>
                  <option value="Đề 1">Đề 1</option>
                  <option value="Đề 2">Đề 2</option>
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
                  <span>Số CMT:</span>
                  <strong>{info.id}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Địa chỉ:</span>
                  <strong>{info.address}</strong>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.startBtn}
                disabled={!checked}
                onClick={handleStart}
              >
                » Bắt đầu thi
              </button>
            </div>

            <p className={styles.note}>
              * Lưu ý: Bạn phải nhấn vào "Kiểm tra thông tin thí sinh" mới có
              thể nhấn được nút "Bắt đầu thi".
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
