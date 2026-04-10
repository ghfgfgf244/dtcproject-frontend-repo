"use client";

import { useState, useEffect } from "react";
import { Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { Blog } from "@/services/blogService";

interface PostCompactListProps {
  posts: Blog[];
  onToggleStatus?: (postId: string, currentStatus: boolean) => void;
  onViewDetail?: (postId: string) => void;
}

export default function PostCompactList({ 
  posts, 
  onToggleStatus,
  onViewDetail 
}: PostCompactListProps) {
  const [localPosts, setLocalPosts] = useState(posts);

  // Đồng bộ hóa khi props thay đổi (ví dụ khi có filter từ cha)
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const handleToggle = (postId: string, currentStatus: boolean) => {
    // Cập nhật UI ngay lập tức
    setLocalPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, status: !currentStatus }
          : post
      )
    );
    
    // Gọi callback để xử lý API
    onToggleStatus?.(postId, currentStatus);
  };

  if (localPosts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-sm font-medium">Không tìm thấy bài viết nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {localPosts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-1">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleToggle(post.id, post.status)}
                className={`p-2 rounded-lg transition-colors ${
                  post.status
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                }`}
                title={post.status ? "Đang hiển thị" : "Đã ẩn"}
              >
                {post.status ? (
                  <ToggleRight className="w-5 h-5" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
              </button>
              
              <button
                onClick={() => onViewDetail?.(post.id)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                title="Xem chi tiết"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
