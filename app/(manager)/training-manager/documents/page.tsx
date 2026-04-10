"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Lock, Loader2 } from "lucide-react";
import styles from "@/styles/profile.module.css";
import EditProfileModal from "@/components/ui/edit-profile-modal";
import { useUser, useAuth } from "@clerk/nextjs";
import { userService, UserProfile, UpdateProfileRequest } from "@/services/userService";
import { setAuthToken } from "@/lib/api";
import { MOCK_DOCUMENTS } from "@/constants/document-data";
import DocumentClientView from "@/components/manager/ManagerDocuments/DocumentClientView";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";

export default function DocumentManagementPage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { getToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const breadcrumbsItems = [
    { label: "Trang chủ", href: "/training-manager/dashboard" },
    { label: "Hồ sơ của tôi", href: "/training-manager/documents" },
  ];

  useEffect(() => {
    async function fetchData() {
      if (!isClerkLoaded || !clerkUser) return;
      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);
        const userProfile = await userService.getMe();
        if (userProfile) {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isClerkLoaded, clerkUser, getToken]);

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const updated = await userService.updateMe(data);
      if (updated) {
        setProfile(updated);
        alert("Cập nhật hồ sơ thành công!");
      }
    } catch (error) {
      console.error("Update profile error", error);
      alert("Lỗi khi cập nhật hồ sơ!");
      throw error;
    }
  };

  const getRoles = () => {
    const roles = [...(profile?.roles || [])];
    if (profile?.roleName && !roles.includes(profile.roleName)) {
      roles.push(profile.roleName);
    }
    return roles;
  };

  const userRoles = getRoles();

  if (loading || !isClerkLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[500px]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-slate-500">Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <Breadcrumbs items={breadcrumbsItems} />
          <header className={`${styles.header} mt-4`}>
            <h1>Hồ sơ của tôi</h1>
            <p>Quản lý thông tin cá nhân và tài liệu của bạn.</p>
          </header>
        </div>

        <div className={styles.layout}>
          <div className={`${styles.mainColumn} w-full`} style={{ flex: "1 1 100%" }}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarWrap}>
                  <Image
                    src={profile?.avatarUrl || clerkUser?.imageUrl || "/instructor-1.jpg"}
                    alt={profile?.fullName || clerkUser?.fullName || "User"}
                    width={92}
                    height={92}
                    className={styles.avatar}
                  />
                  <button type="button" className={styles.cameraBtn} aria-label="Thay đổi ảnh đại diện">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile?.fullName || clerkUser?.fullName}</h2>
                  <span className={styles.email}>{profile?.email || clerkUser?.primaryEmailAddress?.emailAddress}</span>
                  <div className={styles.roleBadges}>
                    {userRoles.map((role) => (
                      <span key={role} className={styles.roleBadge}>
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <button type="button" className={styles.editBtn} onClick={() => setIsEditProfileOpen(true)}>
                  Chỉnh sửa hồ sơ
                </button>
              </div>

              <div className={styles.profileGrid}>
                <div>
                  <span className={styles.label}>Số điện thoại</span>
                  <strong>{profile?.phone || "Chưa cập nhật"}</strong>
                </div>

                {(clerkUser as any)?.birthday && (
                  <div>
                    <span className={styles.label}>Ngày sinh</span>
                    <strong>{new Date((clerkUser as any).birthday).toLocaleDateString("vi-VN")}</strong>
                  </div>
                )}

                {(clerkUser as any)?.gender && (
                  <div>
                    <span className={styles.label}>Giới tính</span>
                    <strong>
                      {(clerkUser as any).gender === "male"
                        ? "Nam"
                        : (clerkUser as any).gender === "female"
                          ? "Nữ"
                          : "Khác"}
                    </strong>
                  </div>
                )}

                <div>
                  <span className={styles.label}>Địa chỉ</span>
                  <strong>Việt Nam</strong>
                </div>
              </div>
            </div>

            <div className={styles.accountCard}>
              <div className={styles.cardTitle}>
                <span className={styles.icon}>
                  <Lock size={16} />
                </span>
                <h3>Thông tin tài khoản</h3>
              </div>

              <div className={styles.accountGrid}>
                <div className={styles.infoBox}>
                  <span className={styles.label}>Tên đăng nhập</span>
                  <strong>{clerkUser?.username || clerkUser?.primaryEmailAddress?.emailAddress.split("@")[0]}</strong>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.label}>Email đăng ký</span>
                  <strong>{profile?.email || clerkUser?.primaryEmailAddress?.emailAddress}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Document Management Section */}
        {/* <div className="mt-12 pt-12 border-t border-slate-200">
           <h3 className="text-xl font-bold text-slate-900 mb-6">Tài liệu & Hồ sơ đính kèm</h3>
           <DocumentClientView initialDocs={MOCK_DOCUMENTS} hideHeader={true} />
        </div> */}
      </div>

      <EditProfileModal
        open={isEditProfileOpen}
        profile={profile}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
}
