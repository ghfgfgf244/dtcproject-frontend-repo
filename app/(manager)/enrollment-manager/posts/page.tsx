"use client";

import { useState, useEffect, useCallback } from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs/index";
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
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";

const PAGE_SIZE = 10;

export default function AdmissionPostsPage() {
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const breadcrumbsItems = [
    { label: "Trang chủ", href: "/enrollment-manager/dashboard" },
    { label: "Bài đăng tuyển sinh", href: "/enrollment-manager/posts" },
  ];

  const [posts, setPosts] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedPost, setSelectedPost] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const ensureAuthToken = useCallback(async () => {
    const token = await getToken();
    setAuthToken(token);
    return token;
  }, [getToken]);

  const fetchCategories = useCallback(async () => {
    const cats = await categoryService.getAll();
    setCategories(cats);
  }, []);

  const fetchPostsPage = useCallback(
    async (page: number, reset = false) => {
      if (!authLoaded || !isSignedIn) {
        return;
      }

      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        await ensureAuthToken();

        const result = await blogService.getPaged({
          onlyPublished: false,
          pageNumber: page,
          pageSize: PAGE_SIZE,
          searchTerm,
          categoryName: categoryFilter,
          startDate,
          endDate,
        });

        setPosts((current) => (reset ? result.items : [...current, ...result.items]));
        setPageNumber(result.pageNumber);
        setTotalItems(result.totalItems);
        setHasMore(result.pageNumber < result.totalPages);
      } catch {
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [authLoaded, isSignedIn, ensureAuthToken, searchTerm, categoryFilter, startDate, endDate],
  );

  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;

    fetchCategories();
  }, [authLoaded, isSignedIn, fetchCategories]);

  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;

    setPosts([]);
    setPageNumber(1);
    setHasMore(false);
    fetchPostsPage(1, true);
  }, [
    refreshKey,
    authLoaded,
    isSignedIn,
    searchTerm,
    categoryFilter,
    startDate,
    endDate,
    fetchPostsPage,
  ]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || loading || !hasMore) {
      return;
    }

    fetchPostsPage(pageNumber + 1, false);
  }, [fetchPostsPage, hasMore, loading, loadingMore, pageNumber]);

  const handleToggleStatus = async (postId: string, currentStatus: boolean) => {
    try {
      await ensureAuthToken();
      await blogService.togglePublish(postId, currentStatus);

      setPosts((current) =>
        current.map((post) =>
          post.id === postId ? { ...post, status: !currentStatus } : post,
        ),
      );

      toast.success(currentStatus ? "Đã ẩn bài viết" : "Đã hiển thị bài viết");
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleViewDetail = (postId: string) => {
    const post = posts.find((item) => item.id === postId);
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
      await ensureAuthToken();
      await blogService.create(values);

      toast.success("Đăng bài thành công!");
      setIsCreateModalOpen(false);
      setRefreshKey((value) => value + 1);
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

        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900">
                Quản lý bài đăng
              </h2>
              <p className="mt-2 text-lg font-medium text-slate-500">
                Giám sát và kiểm duyệt dòng thời gian tuyển sinh
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              Tạo bài viết mới
            </button>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className={`${feedStyles.feedContainer} !max-w-none !p-0`}>
                <CreatePost onPostCreated={() => setRefreshKey((value) => value + 1)} />

                <div className="mt-8">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800">
                      Dòng thời gian ({totalItems})
                    </h3>
                  </div>

                  <PostList
                    initialPosts={posts}
                    loading={loading}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                    onLoadMore={handleLoadMore}
                  />
                </div>
              </div>
            </div>

            <div className="custom-scrollbar sticky top-8 flex max-h-[calc(100vh-6rem)] flex-col gap-6 overflow-y-auto pb-8 pr-2 lg:col-span-4">
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

              <div className="flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/50 p-5">
                  <h3 className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                    Quản lý nhanh
                  </h3>
                </div>
                <div className="p-4">
                  <PostCompactList
                    posts={posts}
                    onToggleStatus={handleToggleStatus}
                    onViewDetail={handleViewDetail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PostDetailModal
        open={isModalOpen}
        post={selectedPost}
        onClose={() => setIsModalOpen(false)}
      />

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
