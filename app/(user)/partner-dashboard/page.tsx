"use client";

import { useEffect, useState } from "react";
import { Copy, UserPlus, Wallet, PiggyBank, Loader2, Check, Plus } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/partner-dashboard.module.css";
import { useUser, useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { userService, UserProfile } from "@/services/userService";
import { collaboratorService, ReferralCodeResponse, Commission } from "@/services/collaboratorService";

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

        // 1. Fetch profile first to check roles
        const userProfile = await userService.getMe();
        setProfile(userProfile);

        if (userProfile?.roleName !== "Collaborator") {
          setLoading(false);
          return;
        }

        // 2. Only fetch collaborator data if role matches
        const [myToken, myComms] = await Promise.all([
          collaboratorService.getMyReferralCode(),
          collaboratorService.getMyCommissions()
        ]);

        setTokenData(myToken);
        setCommissions(myComms || []);
      } catch (error: any) {
        console.error("Error fetching partner data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isClerkLoaded, clerkUser, getToken]);

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

  // Unauthorized state
  if (profile && profile.roleName !== "Collaborator") {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="partner" />
        <div className={shellStyles.content}>
           <div style={{ 
             maxWidth: "600px", 
             margin: "100px auto", 
             textAlign: "center", 
             padding: "40px",
             backgroundColor: "white",
             borderRadius: "20px",
             boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
           }}>
             <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛡️</div>
             <h2 style={{ fontSize: "24px", color: "#1e293b", marginBottom: "16px" }}>Quyền truy cập hạn chế</h2>
             <p style={{ color: "#64748b", marginBottom: "30px", lineHeight: "1.6" }}>
                Trang này chỉ dành riêng cho **Cộng tác viên**. Tài khoản hiện tại của bạn ({profile.roleName}) không có quyền truy cập dữ liệu này.
             </p>
             <button 
                onClick={() => window.location.href = "/"}
                style={{ 
                  backgroundColor: "#0ea5e9", 
                  color: "white", 
                  padding: "12px 30px", 
                  borderRadius: "10px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer"
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
      
      // Generate a random 8-character alphanumeric code
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let randomCode = "";
      for (let i = 0; i < 8; i++) {
        randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const token = await getToken();
      setAuthToken(token);
      await collaboratorService.generateReferralCode(randomCode);
      
      // Refresh token data
      const newToken = await collaboratorService.getMyReferralCode();
      setTokenData(newToken);
      alert(`Mã giới thiệu "${randomCode}" đã được tạo thành công!`);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi tạo mã giới thiệu.";
      alert(msg);
    } finally {
      setGenerating(false);
    }
  };

  // Aggregation Logic
  const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0);
  
  // "Term" commission logic (for now using current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const termCommission = commissions
    .filter(c => {
      const d = new Date(c.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, c) => sum + c.amount, 0);

  // Growth calc (mock delta for UI richness unless we have historical data)
  const codeUsers = tokenData?.usedCount || 0;

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

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="partner" />

      <section className={shellStyles.content}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div>
              <h1>Partner Dashboard</h1>
              <p>
                Chào buổi sáng, {profile?.fullName || clerkUser?.fullName}. Đây là hiệu suất giới thiệu của bạn.
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
                      {copied ? "Đã copy" : "Copy"}
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
                      fontWeight: "600"
                    }}
                  >
                    <Plus size={16} />
                    {generating ? "Đang tạo..." : "Tạo mã giới thiệu"}
                  </button>
                )}
              </div>
            </div>
          </header>

          <section className={styles.metricsGrid}>
            <article className={styles.metricCard}>
              <div className={styles.iconCircle}>
                <UserPlus size={18} />
              </div>
              <span className={styles.metricLabel}>Lượt sử dụng mã</span>
              <div className={styles.metricValue}>{codeUsers}</div>
              <span className={styles.metricDelta}>Tổng số lượt thành công</span>
              <div className={styles.metricFoot} />
            </article>

            <article className={styles.metricCard}>
              <div className={styles.iconCircle}>
                <Wallet size={18} />
              </div>
              <span className={styles.metricLabel}>Tổng hoa hồng</span>
              <div className={styles.metricValue}>{totalCommission.toLocaleString()}</div>
              <span className={styles.metricSub}>VND</span>
              <span className={styles.metricHint}>Thu nhập trọn đời</span>
              <div className={styles.metricFootSoft} />
            </article>

            <article className={styles.metricCard}>
              <div className={`${styles.iconCircle} ${styles.iconOrange}`}>
                <PiggyBank size={18} />
              </div>
              <span className={styles.metricLabel}>Hoa hồng tháng này</span>
              <div className={styles.metricValue}>{termCommission.toLocaleString()}</div>
              <span className={styles.metricSub}>VND</span>
              <span className={styles.metricHint}>Dự kiến thanh toán vào 15 hàng tháng</span>
              <div className={styles.metricFootWarm} />
            </article>
          </section>

          <section className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <h2>Lịch sử hoa hồng gần đây</h2>
                <p>Theo dõi các khoản thu nhập từ việc giới thiệu học viên.</p>
              </div>
            </div>

            <div className={styles.activityList}>
              {commissions.length === 0 ? (
                <p className={styles.emptyText}>Chưa có dữ liệu hoa hồng.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "10px" }}>
                  {commissions.slice(0, 5).map((comm) => (
                    <div key={comm.id} style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      padding: "12px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #f1f5f9"
                    }}>
                      <div>
                        <div style={{ fontWeight: "600", color: "#334155" }}>+{comm.amount.toLocaleString()} VND</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(comm.createdAt).toLocaleDateString("vi-VN")}</div>
                      </div>
                      <span style={{ 
                        fontSize: "11px", 
                        padding: "4px 10px", 
                        borderRadius: "20px", 
                        backgroundColor: comm.status === "Paid" ? "#dcfce7" : "#fef9c3",
                        color: comm.status === "Paid" ? "#166534" : "#854d0e",
                        fontWeight: "600"
                      }}>
                        {comm.status === "Paid" ? "Đã trả" : "Chờ xử lý"}
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
