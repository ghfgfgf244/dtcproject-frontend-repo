"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { InstructorFormData } from "@/types/instructor";
import styles from "@/components/manager/Modals/modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InstructorFormData | null;
  onSubmit: (data: InstructorFormData) => void | Promise<void>;
}

const DEFAULT_FORM_DATA: InstructorFormData = {
  email: "",
  fullName: "",
  phone: "",
  isActive: true,
};

export default function InstructorModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  const [formData, setFormData] = useState<InstructorFormData>(DEFAULT_FORM_DATA);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ?? DEFAULT_FORM_DATA);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={`${styles.modalContainer} ${styles.modalMaxLg}`}>
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              {initialData?.id ? "Cập nhật giảng viên" : "Thêm giảng viên mới"}
            </h2>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Tạo tài khoản nội bộ bằng email và số điện thoại
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Họ và tên</label>
              <input
                required
                type="text"
                className="w-full bg-slate-100 border-none text-sm font-medium rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Email</label>
                <input
                  required
                  type="email"
                  disabled={Boolean(initialData?.id)}
                  className="w-full bg-slate-100 border-none text-sm font-medium rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-60"
                  placeholder="giangvien@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Số điện thoại</label>
                <input
                  required
                  type="tel"
                  className="w-full bg-slate-100 border-none text-sm font-medium rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="09xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div>
                <p className="text-sm font-bold text-slate-800">Trạng thái hoạt động</p>
                <p className="text-xs text-slate-500">Tài khoản tạo trước vẫn sẽ nhận đúng role giáo viên khi đăng nhập lần đầu.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>

          <div className="pt-8 mt-8 flex justify-end items-center gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all rounded-lg">
              Hủy bỏ
            </button>
            <button type="submit" className="px-8 py-2.5 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg active:scale-95 transition-all">
              {initialData?.id ? "Lưu giảng viên" : "Tạo giảng viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
