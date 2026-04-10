"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, CloudUpload, Link as LinkIcon, Loader2, X } from "lucide-react";
import { LearningResource, ResourceType } from "@/types/learning-resource";
import { fileUploadService } from "@/services/fileUploadService";
import { toast } from "react-hot-toast";

export interface ResourceFormData {
  title: string;
  type: ResourceType;
  courseId: string;
  url: string;
}

interface CourseOption {
  id: string;
  courseName: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: LearningResource | null;
  onSubmit: (data: ResourceFormData) => Promise<void> | void;
  courses: CourseOption[];
}

const RESOURCE_UPLOAD_TYPE: Record<ResourceType, "image" | "video" | "raw"> = {
  Video: "video",
  Pdf: "raw",
  Link: "raw",
  Slide: "raw",
  Image: "image",
};

export default function ResourceModal({ isOpen, onClose, initialData, onSubmit, courses }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ResourceType>("Video");
  const [courseId, setCourseId] = useState("");
  const [url, setUrl] = useState("");
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setTitle(initialData.title);
      setType(initialData.type);
      setCourseId(initialData.courseId);
      setUrl(initialData.url);
      setUploadMode("url");
    } else {
      setTitle("");
      setType("Video");
      setCourseId("");
      setUrl("");
      setUploadMode("url");
    }

    setSelectedFile(null);
    setSubmitting(false);
  }, [initialData, isOpen]);

  const today = useMemo(() => new Date().toLocaleDateString("vi-VN"), []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      let finalUrl = url.trim();
      if (uploadMode === "file") {
        if (!selectedFile) {
          toast.error("Vui lòng chọn tệp tài nguyên từ máy tính.");
          return;
        }

        finalUrl = await fileUploadService.uploadPublic(selectedFile, {
          folder: "learning_resources",
          resourceType: RESOURCE_UPLOAD_TYPE[type],
        });
      }

      if (!finalUrl) {
        toast.error("Vui lòng nhập hoặc tải lên tệp tài nguyên.");
        return;
      }

      await onSubmit({
        title: title.trim(),
        type,
        courseId,
        url: finalUrl,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-xl items-center justify-center py-4">
        <div className="relative flex max-h-[calc(100vh-48px)] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="shrink-0 border-b border-slate-100 bg-slate-50/50 px-8 py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  {initialData ? "Cập nhật tài nguyên" : "Thêm mới tài nguyên"}
                </h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-blue-600">Quản lý tài nguyên học tập</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-8">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Khóa học liên kết</label>
                <div className="relative">
                  <select
                    required
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="" disabled>
                      -- Chọn khóa học --
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Tiêu đề tài nguyên</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tên tài nguyên học tập..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Loại tài nguyên</label>
                  <div className="relative">
                    <select
                      required
                      value={type}
                      onChange={(e) => setType(e.target.value as ResourceType)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Video">Video</option>
                      <option value="Pdf">PDF</option>
                      <option value="Link">Liên kết</option>
                      <option value="Slide">Slide</option>
                      <option value="Image">Hình ảnh</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Ngày tải lên</label>
                  <input
                    disabled
                    type="text"
                    value={initialData ? initialData.uploadDate : today}
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium italic text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Đường dẫn / tệp tin</label>

                <div className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${uploadMode === "url" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Dán URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${uploadMode === "file" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Tải tệp lên
                  </button>
                </div>

                {uploadMode === "url" ? (
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      required={uploadMode === "url"}
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/resource/file.pdf"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                ) : (
                  <label className="block cursor-pointer rounded-xl border-2 border-dashed border-blue-300 bg-slate-50 p-8 text-center transition-colors hover:bg-blue-50/50">
                    <CloudUpload className="mx-auto mb-3 h-10 w-10 text-blue-500" />
                    <p className="text-sm font-bold text-blue-700">Kéo thả tệp vào đây hoặc bấm để chọn</p>
                    <p className="mt-1 text-xs text-slate-400">Hỗ trợ PDF, MP4, DOCX, PPTX, JPG, PNG</p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.mp4,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    {selectedFile && (
                      <p className="mt-3 text-xs font-semibold text-slate-600">Đã chọn: {selectedFile.name}</p>
                    )}
                  </label>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-8 py-5">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 active:scale-95"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Đang lưu..." : "Lưu tài nguyên"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
