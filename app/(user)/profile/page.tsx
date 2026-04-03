"use client";

import Image from "next/image";
import { Camera, GraduationCap, Lock, Loader2 } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/profile.module.css";
import { useState, useEffect } from "react";
import PostModal from "@/components/ui/post-modal";
import EditProfileModal from "@/components/ui/edit-profile-modal";
import { useUser, useAuth } from "@clerk/nextjs";
import { userService, UserProfile, UpdateProfileRequest } from "@/services/userService";
import { blogService, Blog } from "@/services/blogService";
import { registrationService } from "@/services/registrationService";
import { RegistrationResponse } from "@/types/registration";
import { setAuthToken } from "@/lib/api";

export default function ProfilePage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingPost, setEditingPost] = useState<null | Blog>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!isClerkLoaded || !clerkUser) return;
      
      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);

        // 1. Fetch backend profile
        const userProfile = await userService.getMe();
        
        if (userProfile) {
          setProfile(userProfile);
          
          const roles = userProfile.roles || [];
          if (userProfile.roleName) roles.push(userProfile.roleName);
          
          const isStudent = roles.includes("Student") || roles.includes("6");
          const isManager = roles.some(r => ["Admin", "TrainingManager", "EnrollmentManager", "1", "2", "4"].includes(r));
          const isCollaborator = roles.includes("Collaborator") || roles.includes("5");
          const canPost = isManager || isCollaborator;

          // 2. Fetch data based on roles
          const promises: Promise<any>[] = [];
          
          if (canPost) {
            promises.push(blogService.getByUserId(userProfile.id));
          } else {
            promises.push(Promise.resolve([]));
          }

          if (isStudent) {
            promises.push(registrationService.getMyRegistrations());
          } else {
            promises.push(Promise.resolve([]));
          }

          const [userPosts, userRegs] = await Promise.all(promises);
          setPosts(userPosts || []);
          setRegistrations(userRegs || []);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isClerkLoaded, clerkUser]);

  const handleUpdatePost = async (content: string) => {
    if (!editingPost) return;
    try {
      const token = await getToken();
      setAuthToken(token);
      const updated = await blogService.update(editingPost.id, { content });
      if (updated) {
        setPosts((prev) =>
          prev.map((post) => (post.id === editingPost.id ? updated : post))
        );
      }
      setEditingPost(null);
    } catch (error) {
      alert("Không thể cập nhật bài viết.");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      const token = await getToken();
      setAuthToken(token);
      await blogService.delete(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      alert("Không thể xóa bài viết.");
    }
  };

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

  // Role Logic
  const getRoles = () => {
    const roles = [...(profile?.roles || [])];
    if (profile?.roleName && !roles.includes(profile.roleName)) {
      roles.push(profile.roleName);
    }
    return roles;
  };

  const userRoles = getRoles();
  const isStudent = userRoles.includes("Student") || userRoles.includes("6");
  const isManager = userRoles.some(r => ["Admin", "TrainingManager", "EnrollmentManager", "1", "2", "4"].includes(r));
  const isCollaborator = userRoles.includes("Collaborator") || userRoles.includes("5");
  const canPost = isManager || isCollaborator;

  // Active registration for students
  const activeReg = registrations.find(r => r.status === 'Approved') || registrations[0];

  if (loading || !isClerkLoaded) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="profile" />
        <div className={shellStyles.loadingContainer}>
           <Loader2 className="animate-spin" size={48} />
           <p>Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="profile" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1>Hồ sơ của tôi</h1>
          <p>Quản lý thông tin cá nhân và cài đặt tài khoản của bạn.</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarWrap}>
                  <Image
                    src={profile?.avatarUrl || clerkUser?.imageUrl || "/instructor-1.jpg"}
                    alt={profile?.fullName || clerkUser?.fullName || "User"}
                    width={84}
                    height={84}
                    className={styles.avatar}
                  />
                  <button
                    type="button"
                    className={styles.cameraBtn}
                    aria-label="Thay đổi ảnh đại diện"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h2>{profile?.fullName || clerkUser?.fullName}</h2>
                  <span className={styles.email}>{profile?.email || clerkUser?.primaryEmailAddress?.emailAddress}</span>
                  <div className={styles.roleBadges}>
                    {userRoles.map(role => (
                        <span key={role} className={styles.roleBadge}>{role}</span>
                    ))}
                  </div>
                </div>
                <button 
                   type="button" 
                   className={styles.editBtn}
                    onClick={() => setIsEditProfileOpen(true)}
                >
                  Chỉnh sửa hồ sơ
                </button>
              </div>

              <div className={styles.profileGrid}>
                <div>
                  <span className={styles.label}>Số điện thoại</span>
                  <strong>{profile?.phone || "Chưa cập nhật"}</strong>
                </div>
                
                {/* Enrich from Clerk if available */}
                {(clerkUser as any)?.birthday && (
                    <div>
                        <span className={styles.label}>Ngày sinh</span>
                        <strong>{new Date((clerkUser as any).birthday).toLocaleDateString('vi-VN')}</strong>
                    </div>
                )}

                {(clerkUser as any)?.gender && (
                    <div>
                        <span className={styles.label}>Giới tính</span>
                        <strong>{(clerkUser as any).gender === 'male' ? 'Nam' : (clerkUser as any).gender === 'female' ? 'Nữ' : 'Khác'}</strong>
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
                  <strong>{clerkUser?.username || clerkUser?.primaryEmailAddress?.emailAddress.split('@')[0]}</strong>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.label}>Email đăng ký</span>
                  <strong>{profile?.email || clerkUser?.primaryEmailAddress?.emailAddress}</strong>
                </div>
              </div>

              {/* Password managed by Clerk, so we don't need a custom button here unless it links to Clerk Profile */}
              {/* <button type="button" className={styles.passwordBtn}>Thay đổi mật khẩu</button> */}
            </div>

            {canPost && (
                <div className={styles.myPosts}>
                <div className={styles.myPostsHeader}>
                    <h3>Bài đăng của tôi ({posts.length})</h3>
                </div>
                <div className={styles.myPostsList}>
                    {posts.length === 0 ? (
                    <p className={styles.noData}>Bạn chưa có bài đăng nào.</p>
                    ) : (
                    posts.map((post) => (
                        <div key={post.id} className={styles.myPostCard}>
                        <div className={styles.myPostTop}>
                            <div>
                            <strong>{profile?.fullName}</strong>
                            <span className={styles.myPostTime}>
                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                            </div>
                            <div className={styles.myPostActions}>
                            <button onClick={() => setEditingPost(post)}>Sửa</button>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeletePost(post.id)}
                            >
                                Xóa
                            </button>
                            </div>
                        </div>
                        <p className={styles.myPostContent}>{post.summary || post.content.substring(0, 150) + '...'}</p>
                        </div>
                    ))
                    )}
                </div>
                </div>
            )}
          </div>

          <aside className={styles.sideColumn}>
            {isStudent && (
                <div className={styles.statusCard}>
                <div className={styles.cardTitle}>
                    <span className={styles.icon}>
                    <GraduationCap size={16} />
                    </span>
                    <h3>Trạng thái học tập</h3>
                </div>

                <div className={styles.statusRow}>
                    <span className={styles.label}>Trạng thái</span>
                    <span className={activeReg ? styles.activeBadge : styles.inactiveBadge}>
                    {activeReg?.status || "Chưa đăng ký"}
                    </span>
                </div>

                <div className={styles.statusItem}>
                    <span className={styles.label}>Mã học viên</span>
                    <strong>{profile?.id.substring(0, 8).toUpperCase() || "N/A"}</strong>
                </div>
                <div className={styles.statusItem}>
                    <span className={styles.label}>Khóa học</span>
                    <strong>{activeReg ? "Đã tham gia" : "Chưa có khóa học"}</strong>
                </div>
                <div className={styles.statusItem}>
                    <span className={styles.label}>Ngày đăng ký</span>
                    <strong>{activeReg ? new Date(activeReg.registrationDate).toLocaleDateString('vi-VN') : "--/--/----"}</strong>
                </div>

                {activeReg && (
                    <div className={styles.progressBlock}>
                    <span className={styles.label}>Tiến độ nhanh</span>
                    <div className={styles.progressItem}>
                        <span>Lý thuyết</span>
                        <span>0%</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <span className={styles.progressFill} style={{ width: "0%" }} />
                    </div>
                    <div className={styles.progressItem}>
                        <span>Thực hành</span>
                        <span>0%</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <span className={styles.progressFill} style={{ width: "0%" }} />
                    </div>
                    </div>
                )}
                </div>
            )}
          </aside>
        </div>
      </section>

      <PostModal
        open={Boolean(editingPost)}
        title="Chỉnh sửa bài viết"
        submitLabel="CẬP NHẬT"
        initialContent={editingPost?.content}
        onClose={() => setEditingPost(null)}
        onSubmit={handleUpdatePost}
      />

      <EditProfileModal
        open={isEditProfileOpen}
        profile={profile}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
}
