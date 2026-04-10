"use client";

import { useState, useEffect, useMemo } from "react";
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import CreatePost from "@/components/ui/create-post";
import PostList from "@/components/ui/post-list";
import PostCompactList from "@/components/manager/PostManagement/PostCompactList";
import PostFilterPanel from "@/components/manager/PostManagement/PostFilterPanel";
import PostDetailModal from "@/components/manager/PostManagement/PostDetailModal";
import PostModal, { BlogEditorValues } from "@/components/ui/post-modal";
import { Plus } from "lucide-react";
import { blogService, Blog } from "@/services/blogService";
import { categoryService, Category } from "@/services/categoryService";
import toast from "react-hot-toast";
import feedStyles from "@/styles/feed.module.css";
import shellStyles from "@/styles/user-shell.module.css";

import { useAuth, useUser } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";

export default function AdmissionPostsPage() {
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  
  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/enrollment-manager/dashboard' },
    { label: 'Bài đăng Tuyển sinh', href: '/enrollment-manager/posts' }
  ];

  const [posts, setPosts] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Detail Modal state
  const [selectedPost, setSelectedPost] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!authLoaded || !isSignedIn) return;

      setLoading(true);
      try {
        const token = await getToken();
        setAuthToken(token);

        const [blogs, cats] = await Promise.all([
          blogService.getAll(false),
          categoryService.getAll()
        ]);
        setPosts(blogs);
        setCategories(cats);
      } catch (error) {
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey, authLoaded, isSignedIn]);

  // Filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = !categoryFilter || 
        post.categoryName === categoryFilter;
      
      let matchDate = true;
      if (startDate && endDate) {
        const postDate = new Date(post.updatedAt || post.createdAt);
        matchDate = postDate >= new Date(startDate) && postDate <= new Date(endDate);
      } else if (startDate) {
        matchDate = new Date(post.updatedAt || post.createdAt) >= new Date(startDate);
      } else if (endDate) {
        matchDate = new Date(post.updatedAt || post.createdAt) <= new Date(endDate);
      }

      return matchSearch && matchCategory && matchDate;
    });
  }, [posts, searchTerm, categoryFilter, startDate, endDate]);

  const handleToggleStatus = async (postId: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      
      await blogService.togglePublish(postId, currentStatus);
      toast.success(currentStatus ? "Đã ẩn bài viết" : "Đã hiển thị bài viết");
      setRefreshKey(k => k + 1);
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleViewDetail = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsModalOpen(true);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setCategoryFilter("");
  };

  const handleCreatePost = async (values: BlogEditorValues) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      await blogService.create(values);

      toast.success("Đăng bài thành công!");
      setIsCreateModalOpen(false);
      setRefreshKey(k => k + 1);
    } catch {
      toast.error("Đăng bài thất bại. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={shellStyles.page}>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Quản lý Bài đăng
              </h2>
              <p className="text-slate-500 font-medium mt-2 text-lg">
                Giám sát và kiểm duyệt dòng thời gian tuyển sinh
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Tạo bài viết mới
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Feed (Social-style) */}
            <div className="lg:col-span-8 space-y-6">
              <div className={`${feedStyles.feedContainer} !p-0 !max-w-none`}>
                <CreatePost onPostCreated={() => setRefreshKey(k => k + 1)} />
                
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">
                      Dòng thời gian ({filteredPosts.length})
                    </h3>
                  </div>
                  
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-500 font-medium mt-4">Đang chuẩn bị dữ liệu...</p>
                    </div>
                  ) : (
                    <PostList initialPosts={filteredPosts} refreshKey={refreshKey} />
                  )}
                </div>
              </div>
            </div>

            {/* Right: Sticky & Scrollable Sidebar */}
            <div className="lg:col-span-4 sticky top-8 max-h-[calc(100vh-6rem)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-8">
              <PostFilterPanel
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                onReset={handleResetFilters}
                categories={categories}
              />

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-shrink-0">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    Quản lý nhanh
                  </h3>
                </div>
                <div className="p-4">
                  <PostCompactList
                    posts={filteredPosts}
                    onToggleStatus={handleToggleStatus}
                    onViewDetail={handleViewDetail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        open={isModalOpen}
        post={selectedPost}
        onClose={() => setIsModalOpen(false)}
      />

      {/* New Post Creation Modal */}
      <PostModal
        open={isCreateModalOpen}
        title="Tạo bài viết tuyển sinh mới"
        submitLabel={isSubmitting ? "Đang đăng..." : "ĐĂNG BÀI"}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
