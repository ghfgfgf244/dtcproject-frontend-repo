"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Search,
  UsersRound,
} from "lucide-react";
import { setAuthToken } from "@/lib/api";
import { examService } from "@/services/examService";
import {
  ExamBatch,
  ExamBatchPagedResponse,
  ExamBatchScopeType,
  ExamBatchStatus,
} from "@/types/exam";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/admin-exams.module.css";

const PAGE_SIZE = 8;

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
  const [pagination, setPagination] = useState<ExamBatchPagedResponse>({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    pendingItems: 0,
    approvedItems: 0,
    totalCandidates: 0,
    totalCapacity: 0,
    items: [],
  });
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ExamBatch | null>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ExamBatchStatus>("all");
  const [scopeFilter, setScopeFilter] = useState<"all" | ExamBatchScopeType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      const data = await examService.getExamBatchesPaged({
        pageNumber: currentPage,
        pageSize: PAGE_SIZE,
        keyword,
        status: statusFilter === "all" ? undefined : statusFilter,
        scopeType: scopeFilter === "all" ? undefined : scopeFilter,
      });

      setPagination(data);
      setBatches(data.items);
      setSelectedBatch((current) =>
        current ? data.items.find((item) => item.id === current.id) ?? null : null,
      );
    } catch (error) {
      console.error("Failed to fetch exam batches:", error);
      setBatches([]);
      setPagination({
        pageNumber: currentPage,
        pageSize: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
        pendingItems: 0,
        approvedItems: 0,
        totalCandidates: 0,
        totalCapacity: 0,
        items: [],
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, getToken, keyword, scopeFilter, statusFilter]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const stats = useMemo(
    () => ({
      total: pagination.totalItems,
      pending: pagination.pendingItems,
      approved: pagination.approvedItems,
      totalCandidates: pagination.totalCandidates,
      totalCapacity: pagination.totalCapacity,
    }),
    [pagination],
  );

  const handleApplyFilter = () => {
    setCurrentPage(1);
    setKeyword(keywordInput.trim());
  };

  const handleResetFilter = () => {
    setKeywordInput("");
    setKeyword("");
    setStatusFilter("all");
    setScopeFilter("all");
    setCurrentPage(1);
  };

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
              Admin xác nhận có tổ chức đợt thi hay không trước khi hệ thống mở đăng ký
              cho học viên.
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
            <p className={styles.statHint}>Tổng số đợt thi phù hợp với bộ lọc hiện tại.</p>
          </article>

          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statAmber}`}>
              <Clock3 className="h-5 w-5" />
            </div>
            <span className={styles.statLabel}>Đang chờ duyệt</span>
            <strong className={styles.statValue}>{stats.pending}</strong>
            <p className={styles.statHint}>Các đợt thi đang chờ admin xác nhận tổ chức.</p>
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
            <p className={styles.statHint}>Tổng số ứng viên đã ghi nhận trên các đợt thi đang lọc.</p>
          </article>
        </div>

        <div className={styles.card}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Danh sách đợt thi</h2>
              <p>Nhấn vào từng dòng để xem chi tiết, duyệt hoặc từ chối đợt thi.</p>
            </div>
            <div className={styles.tableMeta}>
              <span>{stats.pending} đợt chờ duyệt</span>
            </div>
          </div>

          <div className={styles.filterBar}>
            <label className={styles.searchBox}>
              <Search className="h-4 w-4" />
              <input
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleApplyFilter();
                  }
                }}
                placeholder="Tìm theo tên đợt thi hoặc trung tâm..."
              />
            </label>

            <select
              className={styles.select}
              value={statusFilter}
              onChange={(event) => {
                const value = event.target.value;
                setStatusFilter(value === "all" ? "all" : Number(value) as ExamBatchStatus);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={ExamBatchStatus.Pending}>Chờ admin duyệt</option>
              <option value={ExamBatchStatus.OpenForRegistration}>Đã duyệt tổ chức</option>
              <option value={ExamBatchStatus.ClosedForRegistration}>Đã đóng đăng ký</option>
              <option value={ExamBatchStatus.InProgress}>Đang diễn ra</option>
              <option value={ExamBatchStatus.Completed}>Đã kết thúc</option>
              <option value={ExamBatchStatus.Cancelled}>Đã từ chối</option>
            </select>

            <select
              className={styles.select}
              value={scopeFilter}
              onChange={(event) => {
                const value = event.target.value;
                setScopeFilter(value === "all" ? "all" : Number(value) as ExamBatchScopeType);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả phạm vi</option>
              <option value={ExamBatchScopeType.Center}>Trung tâm</option>
              <option value={ExamBatchScopeType.National}>Quốc gia</option>
            </select>

            <div className={styles.filterActions}>
              <button type="button" className={styles.secondaryBtn} onClick={handleResetFilter}>
                Xóa lọc
              </button>
              <button type="button" className={styles.primaryBtn} onClick={handleApplyFilter}>
                Áp dụng
              </button>
            </div>
          </div>

          <div className={`${styles.row} ${styles.head}`}>
            <span>Tên đợt thi</span>
            <span>Phạm vi</span>
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
              <span>Không có đợt thi nào phù hợp với bộ lọc hiện tại.</span>
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
                      <span>{batch.centerName || "Kỳ thi quốc gia"}</span>
                    </div>
                    <span className={styles.range}>
                      {batch.scopeType === ExamBatchScopeType.National ? "Quốc gia" : "Trung tâm"}
                    </span>
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

          <div className={styles.paginationBar}>
            <p className={styles.paginationInfo}>
              Hiển thị{" "}
              {pagination.totalItems === 0 ? 0 : (pagination.pageNumber - 1) * pagination.pageSize + 1}
              {" - "}
              {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalItems)} /{" "}
              {pagination.totalItems} đợt thi
            </p>

            <div className={styles.paginationActions}>
              <button
                type="button"
                className={styles.pageButton}
                disabled={pagination.pageNumber <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className={styles.pageIndicator}>
                {pagination.pageNumber}/{Math.max(1, pagination.totalPages)}
              </span>
              <button
                type="button"
                className={styles.pageButton}
                disabled={pagination.pageNumber >= pagination.totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
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
                <span>Phạm vi</span>
                <div className={styles.valuePill}>
                  {selectedBatch.scopeType === ExamBatchScopeType.National
                    ? "Quốc gia"
                    : selectedBatch.centerName || "Trung tâm"}
                </div>
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
              Đợt thi chỉ nên được duyệt khi thời gian tổ chức phù hợp và đơn vị tổ chức đủ
              năng lực tiếp nhận số lượng ứng viên hiện tại.
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
