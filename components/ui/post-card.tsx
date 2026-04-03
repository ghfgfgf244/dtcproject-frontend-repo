"use client";

import Avatar from "../ui/avatar";
import { Card } from "../ui/card";
import styles from "@/styles/feed.module.css";
import toast from "react-hot-toast";

export type PostData = {
  id: string;
  author: string;
  avatar?: string;
  time: string;
  content: string;    // HTML content from Quill
  image?: string;     // cover photo
  title?: string;
};

export default function PostCard({ post }: { post: PostData }) {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + "/homepage");
    toast.success("Đã sao chép link vào bộ nhớ đệm!");
  };

  // Format relative time
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHr < 24) return `${diffHr} giờ trước`;
    if (diffDay < 7) return `${diffDay} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const displayTime = (timeStr: string) => {
    try { return formatTime(timeStr); } catch { return timeStr; }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.postHeader}>
        <div className={styles.postHeaderMain}>
          <Avatar src={post.avatar ?? ""} />
          <div>
            <div className={styles.author}>{post.author}</div>
            <div className={styles.time}>{displayTime(post.time)}</div>
          </div>
        </div>

        {/* Share button replaces Edit/Delete */}
        <button
          className={styles.shareBtn}
          onClick={handleShare}
          title="Chia sẻ bài viết"
        >
          ↗ Chia sẻ
        </button>
      </div>

      {/* Render rich HTML content safely */}
      <div
        className={styles.content + " " + styles.richContent}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Cover image if any */}
      {post.image && (
        <img
          src={post.image}
          alt="Ảnh bài viết"
          className={styles.postImage}
        />
      )}
    </Card>
  );
}
