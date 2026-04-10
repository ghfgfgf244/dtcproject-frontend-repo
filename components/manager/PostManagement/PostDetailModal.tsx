"use client";

import { Blog } from "@/services/blogService";
import styles from "@/styles/feed.module.css";
import { X, User, Calendar, Tag } from "lucide-react";

type PostDetailModalProps = {
  open: boolean;
  post: Blog | null;
  onClose: () => void;
};

export default function PostDetailModal({
  open,
  post,
  onClose,
}: PostDetailModalProps) {
  if (!open || !post) return null;

  return (
    <div className={styles.postOverlay} onClick={onClose}>
      <div
        className={`${styles.postModal} !max-w-3xl !w-[90vw] !max-h-[85vh] overflow-hidden flex flex-col`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
            {post.title}
          </h3>
          <button 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500" 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Header Info */}
          <div className="mb-8 flex flex-wrap gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <User size={16} />
              </div>
              <span className="font-semibold text-slate-700">{post.authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} />
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium whitespace-nowrap">
                {post.categoryName || "Chưa phân loại"}
              </span>
            </div>
          </div>

          {/* Hero Image */}
          {post.avatar && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <img 
                src={post.avatar} 
                alt={post.title} 
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-slate max-w-none text-slate-800 leading-relaxed
                     prose-headings:font-bold prose-headings:text-slate-900
                     prose-img:rounded-xl prose-a:text-blue-600"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
