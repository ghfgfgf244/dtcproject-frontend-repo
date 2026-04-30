"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link2,
  Quote,
} from "lucide-react";
import { PostFormData } from "@/types/post";
import styles from "@/components/manager/Modals/modal.module.css";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PostFormData | null;
  onSubmit: (data: PostFormData) => void;
}

const DEFAULT_FORM_DATA: PostFormData = {
  title: "",
  category: "",
  summary: "",
  content: "",
  isPublished: true,
};

export default function PostModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  const [formData, setFormData] = useState<PostFormData>(DEFAULT_FORM_DATA);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData(DEFAULT_FORM_DATA);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    setFormData({ ...formData, content: e.currentTarget.innerHTML });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={`${styles.modalContainer} max-w-4xl`}>
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {initialData?.id ? "Cập nhật bài đăng" : "Thêm mới bài đăng"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Vui lòng điền đầy đủ thông tin để xuất bản nội dung bài đăng mới.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form id="postForm" onSubmit={handleSubmit} className={`${styles.modalBody} px-8 py-6 space-y-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">
                Tiêu đề bài đăng <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
                placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all appearance-none cursor-pointer outline-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option disabled value="">
                  Chọn danh mục bài đăng
                </option>
                <option value="Hạng B1">Tuyển sinh hạng B1</option>
                <option value="Hạng B2">Tuyển sinh hạng B2</option>
                <option value="Hạng C">Tuyển sinh hạng C</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">
                Trạng thái xuất bản
              </label>
              <div className="flex items-center gap-3 py-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className={`text-sm font-bold ${formData.isPublished ? "text-blue-600" : "text-slate-500"}`}>
                  {formData.isPublished ? "Công khai ngay" : "Lưu làm bản nháp"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">
              Tóm tắt nội dung
            </label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none resize-none"
              placeholder="Viết một đoạn tóm tắt ngắn để thu hút người đọc..."
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">
              Nội dung bài viết <span className="text-red-500">*</span>
            </label>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-600 transition-all">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex gap-1 overflow-x-auto">
                <button type="button" className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Italic className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Underline className="w-4 h-4" /></button>
                <div className="w-[1px] h-6 bg-slate-300 mx-2 self-center"></div>
                <button type="button" className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><List className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><ListOrdered className="w-4 h-4" /></button>
                <div className="w-[1px] h-6 bg-slate-300 mx-2 self-center"></div>
                <button type="button" className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Link2 className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Quote className="w-4 h-4" /></button>
              </div>

              <div
                className="min-h-[250px] p-6 text-sm text-slate-700 focus:outline-none"
                contentEditable={true}
                onBlur={handleContentChange}
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(formData.content || "Bắt đầu viết nội dung bài viết chuyên nghiệp tại đây..."),
                }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 italic">* Trình soạn thảo văn bản hỗ trợ kéo thả hình ảnh.</p>
          </div>
        </form>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-bold text-sm hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="postForm"
            className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-black text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {initialData?.id ? "Cập nhật" : "Lưu bài đăng"}
          </button>
        </div>
      </div>
    </div>
  );
}
