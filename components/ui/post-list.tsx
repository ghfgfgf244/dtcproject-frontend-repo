"use client";

import { useEffect, useMemo, useRef } from "react";
import { Blog } from "@/services/blogService";
import PostCard, { PostData } from "./post-card";
import styles from "@/styles/feed.module.css";

function mapBlogToPost(blog: Blog): PostData {
  return {
    id: blog.id,
    author: blog.authorName || "Tác giả",
    avatar: blog.authorAvatar,
    time: blog.createdAt,
    content: blog.content,
    image: blog.avatar,
    title: blog.title,
  };
}

interface PostListProps {
  initialPosts?: Blog[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function PostList({
  initialPosts = [],
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
}: PostListProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const posts = useMemo(() => initialPosts.map(mapBlogToPost), [initialPosts]);

  useEffect(() => {
    if (!hasMore || !onLoadMore || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !loadingMore) {
          onLoadMore();
        }
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Chưa có bài viết nào phù hợp với bộ lọc hiện tại.</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <div ref={sentinelRef} className="flex min-h-8 items-center justify-center py-4">
        {loadingMore ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
            <p>Đang tải thêm bài viết...</p>
          </div>
        ) : hasMore ? (
          <p className="text-sm font-medium text-slate-400">Cuộn xuống để tải thêm bài viết</p>
        ) : (
          <p className="text-sm font-medium text-slate-400">Đã hiển thị hết bài viết</p>
        )}
      </div>
    </div>
  );
}
