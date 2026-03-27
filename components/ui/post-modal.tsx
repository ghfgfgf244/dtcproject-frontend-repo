"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/feed.module.css";

type PostModalProps = {
  open: boolean;
  title: string;
  submitLabel: string;
  initialContent?: string;
  onClose: () => void;
  onSubmit: (content: string) => void;
};

export default function PostModal({
  open,
  title,
  submitLabel,
  initialContent = "",
  onClose,
  onSubmit,
}: PostModalProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (open) {
      setContent(initialContent);
    }
  }, [open, initialContent]);

  if (!open) return null;

  return (
    <div className={styles.postOverlay} onClick={onClose}>
      <div
        className={styles.postModal}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.postProfile}>
          <div className={styles.avatar}>A</div>
          <div>
            <p className={styles.profileName}>Alex Driver</p>
            <span className={styles.profileVisibility}>Công khai</span>
          </div>
        </div>

        <textarea
          className={styles.postTextarea}
          placeholder="Chia sẻ kinh nghiệm lái xe của bạn..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />

        <div className={styles.postOptions}>
          <span>Thêm vào bài viết</span>
          <div className={styles.optionIcons}>
            <button title="Ảnh">📷</button>
            <button title="Biểu cảm">🙂</button>
            <button title="Vị trí">📍</button>
          </div>
        </div>

        <button
          className={styles.submitPost}
          onClick={() => onSubmit(content)}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
