// src/app/(manager)/training-manager/_components/Modals/DocumentModal.tsx
"use client";

import React, { useState, useRef } from 'react';
import { X, CloudUpload, BadgeCheck } from 'lucide-react';
import { DocumentRecord, DocumentType } from '@/types/document';
import styles from '@/components/manager/Modals/modal.module.css';
import { DEFAULT_DOCUMENT_FORM } from '@/constants/document-data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userIdContext: string; // Truyền UserId của người đang được quản lý tài liệu vào đây
  initialData?: DocumentRecord | null;
  onSubmit: (data: DocumentRecord) => void;
}

// Hàm hỗ trợ format dung lượng File (Từ Bytes sang KB/MB)
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function DocumentModal({ isOpen, onClose, userIdContext, initialData, onSubmit }: Props) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Tạo object mặc định kèm theo userIdContext truyền từ props
  const defaultDataWithUser = {
    ...DEFAULT_DOCUMENT_FORM,
    userId: userIdContext
  };

  const [formData, setFormData] = useState<DocumentRecord>(initialData || defaultDataWithUser);

  // 3. Khai báo State phụ để theo dõi sự thay đổi của props (Thay thế cho Dependency Array của useEffect)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  // 4. Kỹ thuật "Update State During Render" (Chuẩn React 18+, không bị ESLint báo lỗi)
  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    // Cập nhật lại cờ theo dõi
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);

    // Nếu Modal đang được mở lên -> Reset lại Form
    if (isOpen) {
      setFormData(initialData || defaultDataWithUser);
    }
  }

  if (!isOpen) return null;

  // Xử lý khi user chọn file thật từ máy tính (Giả lập việc đọc Meta Data)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const nameParts = file.name.split('.');
      const ext = nameParts.length > 1 ? `.${nameParts.pop()?.toUpperCase()}` : '';
      const nameWithoutExt = nameParts.join('.');

      setFormData(prev => ({
        ...prev,
        fileName: nameWithoutExt,
        fileExtension: ext,
        fileSize: file.size,
        fileUrl: 'mock_temp_url', // Thực tế sẽ upload lên S3/Cloudinary và lấy URL về đây
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={`${styles.modalContainer} max-w-2xl`}>
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData?.id ? 'Cập nhật tài liệu' : 'Tải lên tài liệu'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Điền thông tin chi tiết cho hồ sơ đào tạo.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className="space-y-6">

            {/* Dropzone Area */}
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">File nguồn</label>

              {/* Vùng Clickable để chọn File */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
              >
                <CloudUpload className="w-10 h-10 mx-auto text-slate-300 mb-3 group-hover:text-blue-500 transition-colors" />
                <p className="text-sm font-bold text-slate-600">
                  {formData.fileName ? `${formData.fileName}${formData.fileExtension}` : (
                    <>Kéo thả hoặc <span className="text-blue-600 underline decoration-blue-600/30">nhấn để chọn file</span></>
                  )}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">PDF, PNG, JPG (Tối đa 10MB)</p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Document Type */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Loại tài liệu</label>
                <select
                  className="w-full bg-slate-100 border-none rounded-lg text-sm px-4 py-3 font-medium focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value as DocumentType })}
                >
                  <option value="ID Card">CCCD/CMND</option>
                  <option value="Driving License">Giấy phép lái xe</option>
                  <option value="Certification">Chứng chỉ</option>
                  <option value="Medical Clearance">Giấy khám sức khỏe</option>
                  <option value="Other">Khác</option>
                </select>
              </div>

              {/* File Name */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Tên tài liệu</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-100 border-none rounded-lg text-sm px-4 py-3 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Ví dụ: Giay_KSK_2024"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                />
              </div>

              {/* Technical Meta (Read-only) */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Thông tin file</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-100 px-4 py-3 rounded-lg text-[12px] font-bold text-slate-600 flex justify-between">
                    <span className="text-slate-400 font-normal">Kích thước</span>
                    {formatBytes(formData.fileSize)}
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-100 px-4 py-3 rounded-lg text-[12px] font-bold text-slate-600 flex justify-between">
                    <span className="text-slate-400 font-normal">Định dạng</span>
                    {formData.fileExtension || '--'}
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Trạng thái xác thực</label>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-4 py-3 rounded-lg h-[46px]">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className={`w-5 h-5 ${formData.isVerified ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span className="text-[12px] font-bold text-slate-700">Đánh dấu đã xác thực</span>
                  </div>

                  {/* Custom Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 -mx-8 -mb-8 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-200">
              Hủy bỏ
            </button>
            <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white text-sm font-black rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
              Lưu tài liệu
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}