"use client";

import Image from "next/image";
import { Camera, GraduationCap, Lock } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/profile.module.css";
import { useState } from "react";
import PostModal from "@/components/ui/post-modal";

export default function ProfilePage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      time: "2 giờ trước",
      content: "Hôm nay mình hoàn thành bài sa hình số 8, cảm giác rất tốt!",
    },
    {
      id: 2,
      time: "Hôm qua",
      content: "Chia sẻ một vài mẹo căn côn khi đề-pa dốc.",
    },
  ]);
  const [editingPost, setEditingPost] = useState<null | {
    id: number;
    content: string;
  }>(null);

  const handleUpdate = (content: string) => {
    if (!editingPost) return;
    setPosts((prev) =>
      prev.map((post) =>
        post.id === editingPost.id ? { ...post, content } : post
      )
    );
    setEditingPost(null);
  };

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="profile" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings.</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarWrap}>
                  <Image
                    src="/instructor-1.jpg"
                    alt="Alex Johnson"
                    width={84}
                    height={84}
                    className={styles.avatar}
                  />
                  <button
                    type="button"
                    className={styles.cameraBtn}
                    aria-label="Change photo"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h2>Alex Johnson</h2>
                  <span className={styles.email}>alex.j@example.com</span>
                </div>
                <button type="button" className={styles.editBtn}>
                  Edit Profile
                </button>
              </div>

              <div className={styles.profileGrid}>
                <div>
                  <span className={styles.label}>Phone Number</span>
                  <strong>0901234567</strong>
                </div>
                <div>
                  <span className={styles.label}>Date of Birth</span>
                  <strong>15/05/2000</strong>
                </div>
                <div>
                  <span className={styles.label}>Gender</span>
                  <strong>Male</strong>
                </div>
                <div>
                  <span className={styles.label}>Address</span>
                  <strong>123 Hoan Kiem, Hanoi</strong>
                </div>
              </div>
            </div>

            <div className={styles.accountCard}>
              <div className={styles.cardTitle}>
                <span className={styles.icon}>
                  <Lock size={16} />
                </span>
                <h3>Account Information</h3>
              </div>

              <div className={styles.accountGrid}>
                <div className={styles.infoBox}>
                  <span className={styles.label}>Username</span>
                  <strong>alex_johnson</strong>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.label}>Registered Email</span>
                  <strong>alex.j@example.com</strong>
                </div>
              </div>

              <button type="button" className={styles.passwordBtn}>
                Change Password
              </button>
            </div>

            <div className={styles.myPosts}>
              <div className={styles.myPostsHeader}>
                <h3>Bài đăng của tôi</h3>
              </div>
              <div className={styles.myPostsList}>
                {posts.map((post) => (
                  <div key={post.id} className={styles.myPostCard}>
                    <div className={styles.myPostTop}>
                      <div>
                        <strong>Alex Johnson</strong>
                        <span className={styles.myPostTime}>{post.time}</span>
                      </div>
                      <div className={styles.myPostActions}>
                        <button
                          onClick={() =>
                            setEditingPost({ id: post.id, content: post.content })
                          }
                        >
                          Sửa
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() =>
                            setPosts((prev) =>
                              prev.filter((item) => item.id !== post.id)
                            )
                          }
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                    <p className={styles.myPostContent}>{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className={styles.sideColumn}>
            <div className={styles.statusCard}>
              <div className={styles.cardTitle}>
                <span className={styles.icon}>
                  <GraduationCap size={16} />
                </span>
                <h3>Academic Status</h3>
              </div>

              <div className={styles.statusRow}>
                <span className={styles.label}>Status</span>
                <span className={styles.activeBadge}>Active</span>
              </div>

              <div className={styles.statusItem}>
                <span className={styles.label}>Student ID</span>
                <strong>DM-2026-88</strong>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.label}>Enrolled Course</span>
                <strong>B2 Driving Course</strong>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.label}>Assigned Class</span>
                <strong>B2-2026-03</strong>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.label}>Enrollment Date</span>
                <strong>10/01/2026</strong>
              </div>

              <div className={styles.progressBlock}>
                <span className={styles.label}>Quick Progress</span>
                <div className={styles.progressItem}>
                  <span>Theory Lessons</span>
                  <span>100%</span>
                </div>
                <div className={styles.progressTrack}>
                  <span className={styles.progressFill} style={{ width: "100%" }} />
                </div>
                <div className={styles.progressItem}>
                  <span>Practical Driving</span>
                  <span>45%</span>
                </div>
                <div className={styles.progressTrack}>
                  <span className={styles.progressFill} style={{ width: "45%" }} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <PostModal
        open={Boolean(editingPost)}
        title="Chỉnh sửa bài viết"
        submitLabel="CẬP NHẬT"
        initialContent={editingPost?.content}
        onClose={() => setEditingPost(null)}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
