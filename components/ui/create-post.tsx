"use client";

import { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import styles from "@/styles/feed.module.css";
import PostModal from "@/components/ui/post-modal";
import { blogService } from "@/services/blogService";
import { setAuthToken } from "@/lib/api";
import toast from "react-hot-toast";

// Roles that can create blog posts
const CREATOR_ROLES = ["Admin", "TrainingManager", "Collaborator", "EnrollmentManager"];

export default function CreatePost({ onPostCreated }: { onPostCreated?: () => void }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user role from Clerk public metadata
  const userRole = (user?.publicMetadata?.role as string) ?? "";
  const canCreate = CREATOR_ROLES.includes(userRole);

  if (!canCreate) return null;

  const handleSubmit = async (content: string, image?: string) => {
    if (!content || content === "<p><br></p>") {
      toast.error("Vui lòng nhập nội dung bài viết!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      const title = `Bài viết của ${user?.fullName ?? "Cộng tác viên"}`;
      await blogService.create(content, title, image);

      toast.success("Đăng bài thành công!");
      setOpen(false);
      onPostCreated?.();
    } catch {
      toast.error("Đăng bài thất bại. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.createPost}>
        <div className={styles.createPostInner}>
          <div className={styles.createAvatar}>
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="avatar" className={styles.createAvatarImg} />
              : <span>{(user?.fullName?.[0] ?? "U").toUpperCase()}</span>
            }
          </div>
          <button
            className={styles.createPostTrigger}
            onClick={() => setOpen(true)}
          >
            {user?.fullName ? `${user.fullName} ơi, bạn đang nghĩ gì vậy?` : "Bạn đang nghĩ gì vậy?"}
          </button>
        </div>
        <div className={styles.createActions}>
          <button className={styles.createActionBtn} onClick={() => setOpen(true)}>
            📷 Ảnh/Video
          </button>
          <button className={styles.postButton} onClick={() => setOpen(true)}>
            ✏️ Viết bài
          </button>
        </div>
      </div>

      <PostModal
        open={open}
        title="Tạo bài viết mới"
        submitLabel={isSubmitting ? "Đang đăng..." : "ĐĂNG BÀI"}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
