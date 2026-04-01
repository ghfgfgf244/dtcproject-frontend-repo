// src/app/(manager)/enrollment-manager/posts/_components/PostClientView/index.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Download, Plus, Calendar, RefreshCw } from "lucide-react";
import { PostFormData, PostRecord } from "@/types/post";
import { MOCK_POST_KPIS } from "@/constants/post-data";

import PostStats from "../PostStats";
import PostTable from "../PostTable";
import PostModal from "../../Modals/PostModal";
import ConfirmModal from "@/components/ui/confirm-modal"; // Đảm bảo đường dẫn này đúng trong dự án của bạn

interface Props {
  initialPosts: PostRecord[];
}

const ITEMS_PER_PAGE = 5;

export default function PostClientView({ initialPosts }: Props) {
  // 1. Quản lý dữ liệu chính (để cập nhật UI real-time)
  const [posts, setPosts] = useState<PostRecord[]>(initialPosts);

  // 2. States cho Filter & Pagination
  const [categoryFilter, setCategoryFilter] = useState("Tất cả hạng");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 3. States cho Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostFormData | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostRecord | null>(null);

  // 4. Logic Lọc (Real-time Filter)
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchCategory = categoryFilter === 'Tất cả hạng' || post.category === categoryFilter;
      const matchStatus = statusFilter === 'Tất cả trạng thái' || post.status === statusFilter;
      
      let matchDate = true;
      if (startDate && endDate) {
        matchDate = post.publishedDate >= startDate && post.publishedDate <= endDate;
      } else if (startDate) {
        matchDate = post.publishedDate >= startDate;
      } else if (endDate) {
        matchDate = post.publishedDate <= endDate;
      }

      return matchCategory && matchStatus && matchDate;
    });
  }, [posts, categoryFilter, statusFilter, startDate, endDate]);

  // 5. Logic Phân trang
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // --- HANDLERS ---

  const resetFilters = () => {
    setCategoryFilter('Tất cả hạng');
    setStatusFilter('Tất cả trạng thái');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleOpenDelete = (post: PostRecord) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      // Logic xóa cục bộ để UI cập nhật ngay lập tức
      setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
      
      // TODO: Gọi API delete thực tế tại đây
      console.log("Deleted post successfully:", postToDelete.id);
      
      // Đóng modal và reset state tạm
      setIsDeleteModalOpen(false);
      setPostToDelete(null);

      // Nếu trang hiện tại không còn item nào sau khi xóa, quay lại trang trước
      if (paginatedPosts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Quản lý Bài đăng Tuyển sinh
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Theo dõi hiệu suất và cập nhật thông tin tuyển sinh định kỳ.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </button>
          <button
            onClick={() => {
              setEditingPost(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Bài đăng mới
          </button>
        </div>
      </div>

      <PostStats data={MOCK_POST_KPIS} />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hạng bằng</label>
              <select
                className="text-sm font-medium border-none bg-white rounded-lg px-4 py-2 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 w-40 cursor-pointer outline-none"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="Tất cả hạng">Tất cả hạng</option>
                <option value="Hạng B1">Hạng B1</option>
                <option value="Hạng B2">Hạng B2</option>
                <option value="Hạng C">Hạng C</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Trạng thái</label>
              <select
                className="text-sm font-medium border-none bg-white rounded-lg px-4 py-2 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 w-40 cursor-pointer outline-none"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="Tất cả trạng thái">Tất cả trạng thái</option>
                <option value="Đang hiển thị">Đang hiển thị</option>
                <option value="Bản nháp">Bản nháp</option>
                <option value="Đã ẩn">Đã ẩn</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Khoảng thời gian đăng</label>
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  className="px-3 py-2.5 text-sm font-medium border-none bg-white rounded-lg ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-slate-600"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="date" 
                  className="px-3 py-2.5 text-sm font-medium border-none bg-white rounded-lg ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-slate-600"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <button
              onClick={resetFilters}
              className="p-2 bg-white ring-1 ring-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              title="Làm mới bộ lọc"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <PostTable
          data={paginatedPosts}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onView={(post) => console.log("View post", post.id)}
          onEdit={(post) => {
            setEditingPost({
              id: post.id,
              title: post.title,
              category: post.category,
              summary: "", 
              content: "", 
              isPublished: post.status === "Đang hiển thị",
            });
            setIsModalOpen(true);
          }}
          onDelete={handleOpenDelete} // Sử dụng handler mới để mở ConfirmModal
        />
      </div>

      {/* --- MODALS --- */}
      
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingPost}
        onSubmit={(data) => {
          console.log("Dữ liệu Submit Bài Đăng:", data);
          // TODO: Logic Create/Update API
          setIsModalOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa bài đăng"
        message={`Bạn có chắc chắn muốn xóa bài viết "${postToDelete?.title}"? Hành động này sẽ gỡ bỏ bài viết khỏi hệ thống và không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setPostToDelete(null);
        }}
      />
    </div>
  );
}