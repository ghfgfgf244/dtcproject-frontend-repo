"use client";

import { useState } from "react";
import Avatar from "../ui/avatar";
import { Card } from "../ui/card";
import styles from "@/styles/feed.module.css";
import PostModal from "@/components/ui/post-modal";

type Post = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
};

export default function PostCard({
  post,
  onDelete,
  onEdit,
}: {
  post: Post;
  onDelete: () => void;
  onEdit: (content: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <Card className={styles.card}>
      <div className={styles.postHeader}>
        <div className={styles.postHeaderMain}>
          <Avatar src={post.avatar} />

          <div>
            <div className={styles.author}>{post.author}</div>
            <div className={styles.time}>{post.time}</div>
          </div>
        </div>

        <div className={styles.inlineActions}>
          <button
            className={styles.editInline}
            onClick={() => setEditing(true)}
          >
            Sửa
          </button>
          <button className={styles.deleteInline} onClick={onDelete}>
            Xóa
          </button>
        </div>
      </div>

      <div className={styles.content}>{post.content}</div>

      {post.image && <img src={post.image} className={styles.postImage} />}

      <div className={styles.actions}>
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>↗ Share</button>
      </div>

      <PostModal
        open={editing}
        title="Chỉnh sửa bài viết"
        submitLabel="CẬP NHẬT"
        initialContent={post.content}
        onClose={() => setEditing(false)}
        onSubmit={(content) => {
          onEdit(content);
          setEditing(false);
        }}
      />
    </Card>
  );
}
