// src/app/(manager)/training-manager/instructors/_components/Modals/InstructorModal.tsx
"use client";

import React, { useState } from 'react'; // XÓA useEffect
import { X, Camera } from 'lucide-react';
import { InstructorFormData, LicenseType } from '@/types/instructor';
import styles from '@/components/manager/Modals/modal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InstructorFormData | null;
  onSubmit: (data: InstructorFormData) => void;
}

const AVAILABLE_LICENSES: LicenseType[] = ['B1', 'B2', 'C', 'D', 'E'];

// Object mặc định
const DEFAULT_FORM_DATA: InstructorFormData = {
  email: '',
  fullName: '',
  phone: '',
  isActive: true,
  licenses: []
};

export default function InstructorModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  // 1. Khởi tạo State với initialData hoặc DEFAULT_FORM_DATA
  const [formData, setFormData] = useState<InstructorFormData>(initialData || DEFAULT_FORM_DATA);

  // 2. Các State để theo dõi sự thay đổi của Props
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  // 3. Cập nhật State trong quá trình render (Derive state)
  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    
    // Nếu modal được mở, ta nạp data mới vào
    if (isOpen) {
      setFormData(initialData || DEFAULT_FORM_DATA);
    }
  }

  if (!isOpen) return null;

  const toggleLicense = (lic: LicenseType) => {
    setFormData(prev => {
      const isSelected = prev.licenses.includes(lic);
      const newLicenses = isSelected 
        ? prev.licenses.filter(l => l !== lic) 
        : [...prev.licenses, lic];
      return { ...prev, licenses: newLicenses };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend chỉ gửi array ['B1', 'B2']. Backend sẽ tự map vào bảng Documents.
    onSubmit(formData);
  };

  return (
    <div className={styles.overlay}>
       {/* PHẦN UI BÊN DƯỚI GIỮ NGUYÊN HOÀN TOÀN, CHỈ VIỆT HÓA TEXT */}
       <div className={styles.backdrop} onClick={onClose} />
      
      <div className={`${styles.modalContainer} ${styles.modalMax2Xl}`}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              {initialData?.id ? 'Cập nhật Giảng viên' : 'Thêm Giảng viên mới'}
            </h2>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Cấu hình hồ sơ chuyên môn và chứng chỉ</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Avatar (Map to Documents: DocumentType = Avatar) */}
            <div className="md:col-span-4 flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all">
                <Camera className="text-slate-300 group-hover:text-blue-600 w-8 h-8" />
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase">Tải ảnh lên</span>
              </div>
              <p className="text-[10px] text-slate-400 text-center px-2 font-medium">JPG, PNG (Tối đa 2MB)</p>
            </div>

            {/* Khớp với bảng Users */}
            <div className="md:col-span-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Họ và tên</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-100 border-none text-sm font-medium rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" 
                  placeholder="VD: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Địa chỉ Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-slate-100 border-none text-sm font-medium rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" 
                    placeholder="giangvien@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Số điện thoại</label>
                  <input 
                    type="tel" 
                    className="w-full bg-slate-100 border-none text-sm font-medium rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" 
                    placeholder="09xx xxx xxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Licenses (Map to Documents: DocumentType = License_XX) & Status */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 mt-6 border-t border-slate-100">
            <div className="md:col-span-8 space-y-3">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Hạng Giấy phép Lái xe</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LICENSES.map(lic => {
                  const isChecked = formData.licenses.includes(lic);
                  return (
                    <label 
                      key={lic} 
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors border ${
                        isChecked ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer" 
                        checked={isChecked}
                        onChange={() => toggleLicense(lic)}
                      />
                      <span className="text-xs font-black">{lic}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-4 space-y-3">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Trạng thái</label>
              <div className="flex items-center gap-3 py-1">
                <span className={`text-xs font-medium ${!formData.isActive ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>Tạm nghỉ</span>
                
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                
                <span className={`text-xs font-medium ${formData.isActive ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>Hoạt động</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 mt-8 flex justify-end items-center gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all rounded-lg">
              Hủy bỏ
            </button>
            <button type="submit" className="px-8 py-2.5 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg active:scale-95 transition-all">
              {initialData?.id ? 'Lưu Giảng viên' : 'Thêm Giảng viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}