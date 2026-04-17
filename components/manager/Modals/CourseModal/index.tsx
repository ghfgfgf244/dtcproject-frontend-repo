"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  ShieldCheck,
  ChevronDown,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { Course } from "@/types/course";
import { centerService, Center } from "@/services/centerService";
import { fileUploadService } from "@/services/fileUploadService";
import { EXAM_LEVEL_OPTIONS, EXAM_LEVEL_VALUE_BY_LABEL } from "@/constants/exam-levels";
import toast from "react-hot-toast";

export interface CourseSubmitData {
  id?: string;
  centerId: string;
  courseName: string;
  licenseType: number;
  price: number;
  description: string;
  durationInWeeks: number;
  maxStudents: number;
  isActive: boolean;
  thumbnailUrl?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: Course | null;
  onSubmit: (data: CourseSubmitData) => void | Promise<void>;
}

const DEFAULT_FORM: CourseSubmitData = {
  centerId: "",
  courseName: "",
  licenseType: 1,
  price: 0,
  description: "",
  durationInWeeks: 12,
  maxStudents: 30,
  isActive: true,
  thumbnailUrl: "",
};

export default function CourseModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  const { getToken } = useAuth();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<CourseSubmitData>(DEFAULT_FORM);

  useEffect(() => {
    async function fetchCenters() {
      if (!isOpen) return;

      setLoadingCenters(true);
      try {
        const token = await getToken();
        setAuthToken(token);
        setCenters(await centerService.getAll());
      } catch (error) {
        console.error("Failed to fetch centers", error);
      } finally {
        setLoadingCenters(false);
      }
    }

    void fetchCenters();
  }, [isOpen, getToken]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        id: initialData.id,
        centerId: initialData.centerId || "",
        courseName: initialData.courseName,
        licenseType: EXAM_LEVEL_VALUE_BY_LABEL[initialData.licenseType] || 1,
        price: initialData.price,
        description: initialData.description,
        durationInWeeks: initialData.durationInWeeks,
        maxStudents: initialData.maxStudents,
        isActive: initialData.isActive,
        thumbnailUrl: initialData.thumbnailUrl || "",
      });
      return;
    }

    setFormData(DEFAULT_FORM);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleUploadImage = async (file?: File | null) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      const imageUrl = await fileUploadService.uploadPublic(file, {
        folder: "courses",
        resourceType: "image",
      });

      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: imageUrl,
      }));

      toast.success("Đã tải ảnh khóa học lên Cloudinary.");
    } catch (error) {
      console.error("Failed to upload course image", error);
      toast.error("Không thể tải ảnh khóa học lên.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      id: initialData?.id || undefined,
      thumbnailUrl: formData.thumbnailUrl?.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 to-transparent p-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {initialData ? "Cập nhật khóa học" : "Thêm khóa học mới"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Thiết lập thông tin chi tiết cho chương trình đào tạo.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form
          id="courseForm"
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="custom-scrollbar max-h-[70vh] space-y-5 overflow-y-auto p-6"
        >
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Cơ sở đào tạo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50"
                required
                value={formData.centerId}
                onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
                disabled={loadingCenters}
              >
                <option value="" disabled>
                  {loadingCenters ? "Đang tải..." : "Chọn cơ sở đào tạo"}
                </option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.centerName}
                  </option>
                ))}
              </select>
              {loadingCenters ? (
                <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
              ) : (
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Tên khóa học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Khóa đào tạo lái xe hạng B"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Hạng bằng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  required
                  value={formData.licenseType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      licenseType: parseInt(e.target.value, 10),
                    })
                  }
                >
                  {EXAM_LEVEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      Hạng {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Học phí (VNĐ) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="100000"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-16 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  VNĐ
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Thời lượng (tuần) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                value={formData.durationInWeeks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationInWeeks: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Học viên tối đa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                value={formData.maxStudents}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxStudents: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Mô tả</label>
            <textarea
              rows={3}
              placeholder="Cung cấp thông tin chi tiết về giáo trình, thời lượng..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Ảnh khóa học</label>
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white sm:w-48">
                  {formData.thumbnailUrl ? (
                    <img
                      src={formData.thumbnailUrl}
                      alt="Ảnh khóa học"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs font-semibold">Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                    {uploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploadingImage ? "Đang tải ảnh..." : "Tải ảnh từ máy"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        void handleUploadImage(e.target.files?.[0]);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Hoặc dán URL ảnh công khai..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    value={formData.thumbnailUrl || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        thumbnailUrl: e.target.value,
                      })
                    }
                  />

                  <p className="text-xs text-slate-500">
                    Ảnh sẽ được lưu bằng link public ổn định để hiển thị ở danh sách và chi tiết
                    khóa học.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm font-bold text-slate-800">Trạng thái hoạt động</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  Bật tùy chọn này để hiển thị khóa học với học viên.
                </p>
              </div>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
            </label>
          </div>
        </form>

        <div className="flex flex-col-reverse justify-end gap-3 rounded-b-xl border-t border-slate-100 bg-slate-50 p-6 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-6 py-2.5 font-bold text-slate-500 transition-colors hover:bg-slate-200"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="courseForm"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
          >
            <Save className="h-5 w-5" /> Lưu khóa học
          </button>
        </div>
      </div>
    </div>
  );
}
