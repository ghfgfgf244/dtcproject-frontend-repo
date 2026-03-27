"use client";

import { useState } from "react";
import styles from "@/styles/feed.module.css";
import PostModal from "@/components/ui/post-modal";

export default function CreatePost() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.createPost}>
        <textarea placeholder="Write something..."></textarea>

        <div className={styles.createActions}>
          <button>Upload Image</button>
          <button className={styles.postButton} onClick={() => setOpen(true)}>
            Post
          </button>
        </div>
      </div>

      <PostModal
        open={open}
        title="Tạo bài viết mới"
        submitLabel="ĐĂNG BÀI"
        onClose={() => setOpen(false)}
        onSubmit={() => setOpen(false)}
      />
    </>
  );
}
