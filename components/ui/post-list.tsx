"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { blogService, Blog } from "@/services/blogService";
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
  refreshKey?: number;
  onlyPublished?: boolean;
  initialPosts?: Blog[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function PostList({
  refreshKey,
  onlyPublished = false,
  initialPosts,
  loading: externalLoading,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
}: PostListProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [internalPosts, setInternalPosts] = useState<Blog[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isControlled = initialPosts !== undefined;
  const sourcePosts = isControlled ? initialPosts : internalPosts;
  const loading = isControlled ? (externalLoading ?? false) : internalLoading;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    const fetchPosts = async () => {
      setInternalLoading(true);
      setError(null);
      try {
        const blogs = await blogService.getAll(onlyPublished);
        setInternalPosts(blogs);
      } catch {
        setError("Không thể tải bài viết. Vui lòng thử lại.");
      } finally {
        setInternalLoading(false);
      }
    };

    fetchPosts();
  }, [isControlled, onlyPublished, refreshKey]);

  useEffect(() => {
    if (!isControlled || !hasMore || !onLoadMore || !sentinelRef.current) {
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
  }, [hasMore, isControlled, loadingMore, onLoadMore]);

  const posts = useMemo(() => sourcePosts.map(mapBlogToPost), [sourcePosts]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>
          {isControlled
            ? "Chưa có bài viết nào phù hợp với bộ lọc hiện tại."
            : "Chưa có bài viết nào. Hãy là người đầu tiên đăng bài!"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {isControlled && (
        <div ref={sentinelRef} className="flex min-h-8 items-center justify-center py-4">
          {loadingMore ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner} />
              <p>Đang tải thêm bài viết...</p>
            </div>
          ) : hasMore ? (
            <p className="text-sm font-medium text-slate-400">
              Cuộn xuống để tải thêm bài viết
            </p>
          ) : (
            <p className="text-sm font-medium text-slate-400">Đã hiển thị hết bài viết</p>
          )}
        </div>
      )}
    </div>
  );
}
