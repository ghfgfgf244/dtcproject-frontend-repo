"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/feed.module.css";
import RichTextEditor from "./rich-text-editor";
import { CldUploadWidget } from "next-cloudinary";

type PostModalProps = {
  open: boolean;
  title: string;
  submitLabel: string;
  initialContent?: string;
  onClose: () => void;
  onSubmit: (content: string, image?: string) => void;
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
  const [image, setImage] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setContent(initialContent);
      setImage(undefined);
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
            <p className={styles.profileName}>Tạo nội dung</p>
            <span className={styles.profileVisibility}>Công khai</span>
          </div>
        </div>

        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Chia sẻ kinh nghiệm lái xe của bạn..."
        />

        {image && (
          <div style={{ marginTop: 10, fontSize: "0.9rem", color: "green" }}>
            Đã tải ảnh đính kèm thành công!
          </div>
        )}

        <div className={styles.postOptions}>
          <span>Thêm vào bài viết</span>
          <div className={styles.optionIcons}>
            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={(result) => {
                if (result.event === "success") {
                  setImage((result.info as any).secure_url);
                }
              }}
            >
              {({ open }) => (
                <button title="Ảnh" onClick={() => open()}>
                  📷
                </button>
              )}
            </CldUploadWidget>
            <button title="Biểu cảm">🙂</button>
            <button title="Vị trí">📍</button>
          </div>
        </div>

        <button
          className={styles.submitPost}
          onClick={() => onSubmit(content, image)}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
