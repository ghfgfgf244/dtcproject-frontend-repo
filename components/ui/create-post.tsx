"use client";

import styles from "@/styles/feed.module.css";

export default function CreatePost() {
  return (
    <div className={styles.createPost}>
      <textarea placeholder="Write something..."></textarea>

      <div className={styles.createActions}>
        <button>Upload Image</button>
        <button className={styles.postButton}>Post</button>
      </div>
    </div>
  );
}