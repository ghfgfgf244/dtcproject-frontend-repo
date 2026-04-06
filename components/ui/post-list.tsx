"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function PostList({ 
  refreshKey, 
  initialPosts,
  onlyPublished = false
}: { 
  refreshKey?: number, 
  initialPosts?: Blog[],
  onlyPublished?: boolean
}) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (initialPosts) {
      setPosts(initialPosts.map(mapBlogToPost));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch blogs based on the onlyPublished prop
      const blogs = await blogService.getAll(onlyPublished);
      setPosts(blogs.map(mapBlogToPost));
    } catch {
      setError("Không thể tải bài viết. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [initialPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshKey, initialPosts]);

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
        <button onClick={fetchPosts}>Thử lại</button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Chưa có bài viết nào. Hãy là người đầu tiên đăng bài! 🎉</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
