"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, UserPlus, Wallet, PiggyBank, Loader2, Check, Plus } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/partner-dashboard.module.css";
import { useUser, useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { userService, UserProfile } from "@/services/userService";
import { collaboratorService, Commission, ReferralCodeResponse } from "@/services/collaboratorService";

export default function PartnerDashboardPage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { getToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tokenData, setTokenData] = useState<ReferralCodeResponse | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!isClerkLoaded || !clerkUser) return;

      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);

        const userProfile = await userService.getMe();
        setProfile(userProfile);

        if (userProfile?.roleName !== "Collaborator") {
          setLoading(false);
          return;
        }

        const [myToken, myCommissions] = await Promise.all([
          collaboratorService.getMyReferralCode(),
          collaboratorService.getMyCommissions(),
        ]);

        setTokenData(myToken);
        setCommissions(myCommissions || []);
      } catch (error) {
        console.error("Error fetching partner data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isClerkLoaded, clerkUser, getToken]);

  const pendingCommissions = useMemo(
    () => commissions.filter((commission) => commission.status === "Pending"),
    [commissions],
  );
  const paidCommissions = useMemo(
    () => commissions.filter((commission) => commission.status === "Paid"),
    [commissions],
  );

  const totalCommission = commissions.reduce((sum, commission) => sum + commission.amount, 0);
  const currentCycleCommission = pendingCommissions.reduce(
    (sum, commission) => sum + commission.amount,
    0,
  );
  const paidCommissionTotal = paidCommissions.reduce((sum, commission) => sum + commission.amount, 0);
  const currentCycleUsage = tokenData?.usedCount || 0;

  if (loading || !isClerkLoaded) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="partner" />
        <div className={shellStyles.loadingContainer}>
          <Loader2 className="animate-spin" size={48} />
          <p>Đang chuẩn bị dữ liệu cộng tác viên...</p>
        </div>
      </div>
    );
  }

  if (profile && profile.roleName !== "Collaborator") {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="partner" />
        <div className={shellStyles.content}>
          <div
            style={{
              maxWidth: "600px",
              margin: "100px auto",
              textAlign: "center",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "20px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛡️</div>
            <h2 style={{ fontSize: "24px", color: "#1e293b", marginBottom: "16px" }}>Quyền truy cập hạn chế</h2>
            <p style={{ color: "#64748b", marginBottom: "30px", lineHeight: "1.6" }}>
              Trang này chỉ dành riêng cho cộng tác viên. Tài khoản hiện tại của bạn ({profile.roleName})
              không có quyền truy cập dữ liệu này.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                backgroundColor: "#0ea5e9",
                color: "white",
                padding: "12px 30px",
                borderRadius: "10px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    if (tokenData?.code) {
      navigator.clipboard.writeText(tokenData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateCode = async () => {
    try {
      setGenerating(true);

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let randomCode = "";
      for (let index = 0; index < 8; index += 1) {
        randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const token = await getToken();
      setAuthToken(token);
      await collaboratorService.generateReferralCode(randomCode);

      const newToken = await collaboratorService.getMyReferralCode();
      setTokenData(newToken);
      window.alert(`Mã giới thiệu "${randomCode}" đã được tạo thành công.`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể tạo mã giới thiệu.";
      window.alert(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="partner" />

      <section className={shellStyles.content}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div>
              <h1>Bảng điều khiển cộng tác viên</h1>
              <p>
                Chào {profile?.fullName || clerkUser?.fullName}. Đây là tình hình sử dụng mã giới thiệu
                và hoa hồng hiện tại của bạn.
              </p>
            </div>

            <div className={styles.referralCard}>
              <span className={styles.refLabel}>Mã giới thiệu của bạn</span>
              <div className={styles.refRow}>
                {tokenData ? (
                  <>
                    <strong>{tokenData.code}</strong>
                    <button type="button" className={styles.copyButton} onClick={handleCopy}>
                      {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      {copied ? "Đã sao chép" : "Sao chép"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.generateButton}
                    onClick={handleGenerateCode}
                    disabled={generating}
                    style={{
                      backgroundColor: "#0ea5e9",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    <Plus size={16} />
                    {generating ? "Đang tạo..." : "Tạo mã giới thiệu"}
                  </button>
                )}
              </div>
              <p className={styles.refLabel} style={{ marginTop: 10 }}>
                Hoa hồng: 5% mỗi khóa học. Học viên được giảm 5% học phí khi dùng mã của bạn.
              </p>
            </div>
          </header>

          <section className={styles.metricsGrid}>
            <article className={styles.metricCard}>
              <div className={styles.iconCircle}>
                <UserPlus size={18} />
              </div>
              <span className={styles.metricLabel}>Lượt dùng mã trong chu kỳ hiện tại</span>
              <div className={styles.metricValue}>{currentCycleUsage}</div>
              <span className={styles.metricDelta}>
                Sau khi trung tâm thanh toán, bộ đếm sẽ trở về 0 và bắt đầu chu kỳ mới.
              </span>
              <div className={styles.metricFoot} />
            </article>

            <article className={styles.metricCard}>
              <div className={styles.iconCircle}>
                <Wallet size={18} />
              </div>
              <span className={styles.metricLabel}>Hoa hồng chờ thanh toán</span>
              <div className={styles.metricValue}>{currentCycleCommission.toLocaleString("vi-VN")}</div>
              <span className={styles.metricSub}>VND</span>
              <span className={styles.metricHint}>Tính từ các lượt dùng mã chưa được đối soát</span>
              <div className={styles.metricFootSoft} />
            </article>

            <article className={styles.metricCard}>
              <div className={`${styles.iconCircle} ${styles.iconOrange}`}>
                <PiggyBank size={18} />
              </div>
              <span className={styles.metricLabel}>Đã thanh toán</span>
              <div className={styles.metricValue}>{paidCommissionTotal.toLocaleString("vi-VN")}</div>
              <span className={styles.metricSub}>VND</span>
              <span className={styles.metricHint}>Tổng hoa hồng đã nhận</span>
              <div className={styles.metricFootWarm} />
            </article>

            <article className={styles.metricCard}>
              <div className={styles.iconCircle}>
                <Wallet size={18} />
              </div>
              <span className={styles.metricLabel}>Tổng hoa hồng tích lũy</span>
              <div className={styles.metricValue}>{totalCommission.toLocaleString("vi-VN")}</div>
              <span className={styles.metricSub}>VND</span>
              <span className={styles.metricHint}>Bao gồm cả đã thanh toán và đang chờ</span>
              <div className={styles.metricFoot} />
            </article>
          </section>

          <section className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <h2>Lịch sử hoa hồng gần đây</h2>
                <p>Theo dõi các khoản hoa hồng phát sinh từ từng lượt học viên dùng mã.</p>
              </div>
            </div>

            <div className={styles.activityList}>
              {commissions.length === 0 ? (
                <p className={styles.emptyText}>Chưa có dữ liệu hoa hồng.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "10px" }}>
                  {commissions.slice(0, 8).map((commission) => (
                    <div
                      key={commission.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "14px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: "#334155" }}>
                          +{commission.amount.toLocaleString("vi-VN")} VND
                        </div>
                        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                          {commission.studentName || "Học viên"} - {commission.courseName || "Khóa học"}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                          Mã: {commission.referralCode || "-"} | Ngày ghi nhận:{" "}
                          {new Date(commission.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: 11,
                          padding: "6px 10px",
                          borderRadius: "20px",
                          backgroundColor:
                            commission.status === "Paid" ? "#dcfce7" : "#fef3c7",
                          color: commission.status === "Paid" ? "#166534" : "#92400e",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {commission.status === "Paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
