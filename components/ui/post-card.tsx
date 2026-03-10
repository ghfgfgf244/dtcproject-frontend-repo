"use client";

import Avatar from "../ui/avatar";
import { Card } from "../ui/card";
import styles from "@/styles/feed.module.css";

type Post = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card className={styles.card}>
      <div className={styles.postHeader}>
        <Avatar src={post.avatar} />

        <div>
          <div className={styles.author}>{post.author}</div>
          <div className={styles.time}>{post.time}</div>
        </div>
      </div>

      <div className={styles.content}>{post.content}</div>

      {post.image && (
        <img src={post.image} className={styles.postImage} />
      )}

      <div className={styles.actions}>
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>↗ Share</button>
      </div>
    </Card>
  );
}