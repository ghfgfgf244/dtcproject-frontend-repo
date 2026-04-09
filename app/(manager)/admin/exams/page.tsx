"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  CalendarRange,
  CheckCircle2,
  Clock3,
  Loader2,
  UsersRound,
  XCircle,
} from "lucide-react";
import { setAuthToken } from "@/lib/api";
import { examService } from "@/services/examService";
import { ExamBatch, ExamBatchStatus } from "@/types/exam";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/admin-exams.module.css";

const STATUS_LABELS: Record<number, string> = {
  [ExamBatchStatus.Pending]: "Chờ admin duyệt",
  [ExamBatchStatus.OpenForRegistration]: "Đã duyệt tổ chức",
  [ExamBatchStatus.ClosedForRegistration]: "Đã đóng đăng ký",
  [ExamBatchStatus.InProgress]: "Đang diễn ra",
  [ExamBatchStatus.Completed]: "Đã kết thúc",
  [ExamBatchStatus.Cancelled]: "Đã từ chối",
};

const STATUS_CLASS: Record<number, string> = {
  [ExamBatchStatus.Pending]: styles.statusPending,
  [ExamBatchStatus.OpenForRegistration]: styles.statusApproved,
  [ExamBatchStatus.ClosedForRegistration]: styles.statusNeutral,
  [ExamBatchStatus.InProgress]: styles.statusInfo,
  [ExamBatchStatus.Completed]: styles.statusDone,
  [ExamBatchStatus.Cancelled]: styles.statusRejected,
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN");
}

export default function AdminExamsPage() {
  const { getToken } = useAuth();
  const [batches, setBatches] = useState<ExamBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ExamBatch | null>(null);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data = await examService.getAllExamBatches();
      setBatches(data);
    } catch (error) {
      console.error("Failed to fetch exam batches:", error);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const stats = useMemo(() => {
    const pending = batches.filter((batch) => batch.status === ExamBatchStatus.Pending).length;
    const approved = batches.filter(
      (batch) =>
        batch.status === ExamBatchStatus.OpenForRegistration ||
        batch.status === ExamBatchStatus.ClosedForRegistration ||
        batch.status === ExamBatchStatus.InProgress ||
        batch.status === ExamBatchStatus.Completed,
    ).length;
    const totalCandidates = batches.reduce(
      (sum, batch) => sum + (batch.currentCandidates ?? 0),
      0,
    );
    const totalCapacity = batches.reduce(
      (sum, batch) => sum + (batch.maxCandidates ?? 0),
      0,
    );

    return {
      total: batches.length,
      pending,
      approved,
      totalCandidates,
      totalCapacity,
    };
  }, [batches]);

  const handleUpdateStatus = async (batch: ExamBatch, status: ExamBatchStatus) => {
    setSubmittingId(batch.id);
    try {
      const token = await getToken();
      setAuthToken(token);
      await examService.updateExamBatchStatus(batch.id, status);
      await fetchBatches();
      setSelectedBatch((current) =>
        current?.id === batch.id ? { ...current, status } : current,
      );
    } catch (error) {
      console.error("Failed to update exam batch status:", error);
      window.alert("Không thể cập nhật trạng thái đợt thi.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className={shellStyles.page}>
      <section className={shellStyles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Điều phối thi sát hạch</p>
            <h1>Duyệt đợt thi</h1>
            <p>
              Admin xác nhận có tổ chức đợt thi hay không trước khi hệ thống mở đăng
              ký cho học viên.
            </p>
          </div>
        </header>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statBlue}`}>
              <CalendarRange className="h-5 w-5" />
            </div>
            <span className={styles.statLabel}>Tổng số đợt thi</span>
            <strong className={styles.statValue}>{stats.total}</strong>
            <p className={styles.statHint}>Tổng số đợt thi đang có trong hệ thống.</p>
          </article>

          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statAmber}`}>
              <Clock3 className="h-5 w-5" />
            </div>
            <span className={styles.statLabel}>Đang chờ duyệt</span>
            <strong className={styles.statValue}>{stats.pending}</strong>
            <p className={styles.statHint}>Những đợt thi cần admin xác nhận tổ chức.</p>
          </article>

          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statGreen}`}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className={styles.statLabel}>Đã được phê duyệt</span>
            <strong className={styles.statValue}>{stats.approved}</strong>
            <p className={styles.statHint}>Bao gồm các đợt đã mở, đang diễn ra hoặc đã kết thúc.</p>
          </article>

          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statPurple}`}>
              <UsersRound className="h-5 w-5" />
            </div>
            <span className={styles.statLabel}>Ứng viên hiện tại</span>
            <strong className={styles.statValue}>
              {stats.totalCandidates}/{stats.totalCapacity}
            </strong>
            <p className={styles.statHint}>Tổng số ứng viên đã ghi nhận trên tất cả đợt thi.</p>
          </article>
        </div>

        <div className={styles.card}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Danh sách đợt thi</h2>
              <p>Nhấn vào từng dòng để xem chi tiết và quyết định phê duyệt.</p>
            </div>
            <div className={styles.tableMeta}>
              <span>{stats.pending} đợt chờ duyệt</span>
            </div>
          </div>

          <div className={`${styles.row} ${styles.head}`}>
            <span>Tên đợt thi</span>
            <span>Mở đăng ký</span>
            <span>Đóng đăng ký</span>
            <span>Ngày thi</span>
            <span>Ứng viên</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>

          {loading ? (
            <div className={styles.emptyState}>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang tải danh sách đợt thi...</span>
            </div>
          ) : batches.length === 0 ? (
            <div className={styles.emptyState}>
              <span>Hiện chưa có đợt thi nào để duyệt.</span>
            </div>
          ) : (
            <div className={styles.list}>
              {batches.map((batch) => {
                const isPending = batch.status === ExamBatchStatus.Pending;
                const isSubmitting = submittingId === batch.id;

                return (
                  <div
                    key={batch.id}
                    role="button"
                    tabIndex={0}
                    className={styles.row}
                    onClick={() => setSelectedBatch(batch)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedBatch(batch);
                      }
                    }}
                  >
                    <div className={styles.batchCell}>
                      <strong>{batch.batchName}</strong>
                      <span>Nhấn để xem chi tiết đợt thi</span>
                    </div>
                    <span className={styles.range}>{formatDate(batch.registrationStartDate)}</span>
                    <span className={styles.range}>{formatDate(batch.registrationEndDate)}</span>
                    <span className={styles.range}>{formatDate(batch.examStartDate)}</span>
                    <span className={styles.capacity}>
                      <strong>{batch.currentCandidates}</strong>
                      <span>/ {batch.maxCandidates}</span>
                    </span>
                    <span
                      className={`${styles.status} ${STATUS_CLASS[batch.status] ?? styles.statusNeutral}`}
                    >
                      {STATUS_LABELS[batch.status] ?? "Không xác định"}
                    </span>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.approveBtn}
                        disabled={!isPending || isSubmitting}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleUpdateStatus(batch, ExamBatchStatus.OpenForRegistration);
                        }}
                      >
                        {isSubmitting ? "Đang xử lý..." : "Duyệt"}
                      </button>
                      <button
                        type="button"
                        className={styles.rejectBtn}
                        disabled={!isPending || isSubmitting}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleUpdateStatus(batch, ExamBatchStatus.Cancelled);
                        }}
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedBatch && (
        <div className={styles.modalOverlay} onClick={() => setSelectedBatch(null)}>
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className={styles.infoIcon}>i</span>
                <div>
                  <h3>Chi tiết đợt thi</h3>
                  <p>Kiểm tra thời gian, sĩ số và trạng thái trước khi phê duyệt.</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedBatch(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.fieldBlock}>
                <span>Tên đợt thi</span>
                <div className={styles.valuePill}>{selectedBatch.batchName}</div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Trạng thái</span>
                <div className={styles.valuePill}>
                  {STATUS_LABELS[selectedBatch.status] ?? "Không xác định"}
                </div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Ngày mở đăng ký</span>
                <div className={styles.valuePill}>
                  {formatDate(selectedBatch.registrationStartDate)}
                </div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Ngày kết thúc đăng ký</span>
                <div className={styles.valuePill}>
                  {formatDate(selectedBatch.registrationEndDate)}
                </div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Ngày thi</span>
                <div className={styles.valuePill}>{formatDate(selectedBatch.examStartDate)}</div>
              </div>
              <div className={styles.fieldBlock}>
                <span>Số lượng ứng viên</span>
                <div className={styles.valuePill}>
                  {selectedBatch.currentCandidates}/{selectedBatch.maxCandidates} ứng viên
                </div>
              </div>
            </div>

            <div className={styles.notice}>
              Đợt thi chỉ nên được duyệt khi thời gian tổ chức phù hợp và trung tâm đủ năng
              lực tiếp nhận số lượng ứng viên hiện tại.
            </div>

            {selectedBatch.status === ExamBatchStatus.Pending && (
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.approveBtn}
                  onClick={() =>
                    handleUpdateStatus(selectedBatch, ExamBatchStatus.OpenForRegistration)
                  }
                  disabled={submittingId === selectedBatch.id}
                >
                  Duyệt tổ chức
                </button>
                <button
                  type="button"
                  className={styles.rejectBtn}
                  onClick={() =>
                    handleUpdateStatus(selectedBatch, ExamBatchStatus.Cancelled)
                  }
                  disabled={submittingId === selectedBatch.id}
                >
                  Từ chối
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
