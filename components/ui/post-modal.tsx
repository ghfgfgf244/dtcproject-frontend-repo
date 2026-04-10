"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import styles from "@/styles/feed.module.css";
import RichTextEditor from "./rich-text-editor";
import { blogService, CreateBlogRequest } from "@/services/blogService";
import { categoryService, Category } from "@/services/categoryService";
import { setAuthToken } from "@/lib/api";

export type BlogEditorValues = CreateBlogRequest;

type PostModalProps = {
  open: boolean;
  title: string;
  submitLabel: string;
  initialValues?: Partial<BlogEditorValues>;
  onClose: () => void;
  onSubmit: (values: BlogEditorValues) => void | Promise<void>;
};

const DEFAULT_VALUES: BlogEditorValues = {
  title: "",
  categoryId: 1,
  summary: "",
  content: "",
  avatar: "",
  status: true,
};

export default function PostModal({
  open,
  title,
  submitLabel,
  initialValues,
  onClose,
  onSubmit,
}: PostModalProps) {
  const { getToken } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [form, setForm] = useState<BlogEditorValues>(DEFAULT_VALUES);

  useEffect(() => {
    if (!open) return;

    setForm({
      ...DEFAULT_VALUES,
      ...initialValues,
    });
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return;

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoryService.getAll();
        setCategories(data);

        if (data.length > 0) {
          setForm((prev) => ({
            ...prev,
            categoryId: initialValues?.categoryId ?? prev.categoryId ?? data[0].categoryId,
          }));
        }
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [open, initialValues?.categoryId]);

  if (!open) return null;

  const ensureAuth = async () => {
    const token = await getToken();
    setAuthToken(token);
  };

  const handleInlineImageUpload = async (file: File) => {
    await ensureAuth();
    return blogService.uploadImage(file);
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      await ensureAuth();
      const imageUrl = await blogService.uploadImage(file);
      setForm((prev) => ({ ...prev, avatar: imageUrl }));
      toast.success("Đã tải ảnh bìa lên Cloudinary");
    } catch {
      toast.error("Không thể tải ảnh bìa");
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết");
      return;
    }

    if (!form.content || form.content === "<p><br></p>") {
      toast.error("Vui lòng nhập nội dung bài viết");
      return;
    }

    await onSubmit({
      ...form,
      title: form.title.trim(),
      summary: form.summary?.trim(),
      avatar: form.avatar?.trim(),
    });
  };

  return (
    <div className={styles.postOverlay} onClick={onClose}>
      <div className={styles.postModal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Tiêu đề bài viết"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-0 focus:border-blue-500"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              value={form.categoryId}
              disabled={loadingCategories}
              onChange={(event) => setForm((prev) => ({ ...prev, categoryId: Number(event.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>

            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              <span>{form.status ? "Đăng công khai" : "Lưu bản nháp"}</span>
              <input
                type="checkbox"
                checked={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.checked }))}
              />
            </label>
          </div>

          <textarea
            value={form.summary}
            onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
            placeholder="Tóm tắt ngắn cho bài viết"
            className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
          />

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-700">Ảnh bìa bài viết</span>
              <label className="cursor-pointer rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                {uploadingCover ? "Đang tải..." : "Chọn ảnh bìa"}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
            </div>

            {form.avatar ? (
              <img src={form.avatar} alt="Ảnh bìa" className="max-h-56 w-full rounded-lg object-cover" />
            ) : (
              <p className="text-sm text-slate-400">Chưa có ảnh bìa. Bạn vẫn có thể chèn ảnh trực tiếp trong nội dung bên dưới.</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <RichTextEditor
            value={form.content}
            onChange={(content) => setForm((prev) => ({ ...prev, content }))}
            onImageUpload={handleInlineImageUpload}
            placeholder="Viết bài theo kiểu Facebook: xuống dòng, in đậm, in nghiêng, chèn ảnh trực tiếp vào giữa nội dung..."
          />
        </div>

        <div className={styles.postOptions}>
          <span>Ảnh chèn trong nội dung sẽ được tải lên Cloudinary và lưu bằng link public ổn định.</span>
        </div>

        <button className={styles.submitPost} onClick={handleSubmit}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
