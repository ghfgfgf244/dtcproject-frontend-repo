"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/feed.module.css"; // Reusing modal styles for consistency
import { UserProfile, UpdateProfileRequest } from "@/services/userService";

type EditProfileModalProps = {
  open: boolean;
  profile: UserProfile | null;
  onClose: () => void;
  onSubmit: (data: UpdateProfileRequest) => Promise<void>;
};

export default function EditProfileModal({
  open,
  profile,
  onClose,
  onSubmit,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && profile) {
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
    }
  }, [open, profile]);

  if (!open) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSubmit({ fullName, phone });
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.postOverlay} onClick={onClose}>
      <div
        className={styles.postModal}
        style={{ maxWidth: "450px" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>Chỉnh sửa hồ sơ</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên của bạn"
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
              Số điện thoại
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>
          
          <p style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>
            * Các thông tin khác như Email sẽ được đồng bộ từ tài khoản Clerk.
          </p>
        </div>

        <button
          className={styles.submitPost}
          disabled={loading}
          onClick={handleSave}
          style={{ 
            marginTop: "10px",
            backgroundColor: loading ? "#cbd5e1" : "#0ea5e9"
          }}
        >
          {loading ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
        </button>
      </div>
    </div>
  );
}
