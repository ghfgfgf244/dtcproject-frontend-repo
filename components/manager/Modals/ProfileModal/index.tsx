"use client";

import React, { useState, useEffect } from 'react';
import { X, User, Handshake, GraduationCap, Tag, MapPin } from 'lucide-react';
import { ProfileFormData } from '@/types/profile';
import styles from '@/components/manager/Modals/modal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProfileFormData | null;
  defaultRole?: 'student' | 'collaborator'; // Để khi bấm "Thêm CTV" từ tab CTV, nó tự nhảy sang CTV
  onSubmit: (data: ProfileFormData) => void;
}

const DEFAULT_FORM_DATA: ProfileFormData = {
  role: 'student',
  fullName: '',
  phone: '',
  email: '',
  address: '',
  licenseType: 'B2',
  course: '',
  studentStatus: 'Đang học',
  referralCode: '',
  collaboratorRegion: 'TP.HCM'
};

export default function ProfileModal({ isOpen, onClose, initialData, defaultRole = 'student', onSubmit }: Props) {
  const [formData, setFormData] = useState<ProfileFormData>(DEFAULT_FORM_DATA);

  // Nạp dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(initialData);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({ ...DEFAULT_FORM_DATA, role: defaultRole });
      }
    }
  }, [isOpen, initialData, defaultRole]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={`${styles.modalContainer} ${styles.modalMax2Xl}`}>
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-white">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
              {initialData?.id ? 'Cập nhật Hồ sơ' : 'Thông tin Hồ sơ mới'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Nhập chi tiết thông tin người dùng mới hoặc cập nhật thông tin cũ.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Toggle (Chỉ hiện khi Tạo mới, Edit thì ẩn đi để tránh đổi role lung tung) */}
        {!initialData?.id && (
          <div className="px-8 pt-6">
            <div className="bg-slate-100 p-1 rounded-lg flex gap-1 w-full sm:w-max">
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-md font-bold text-sm transition-all flex items-center gap-2 justify-center ${
                  formData.role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <User className="w-4 h-4" /> Học viên
              </button>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, role: 'collaborator' })}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-md font-bold text-sm transition-all flex items-center gap-2 justify-center ${
                  formData.role === 'collaborator' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Handshake className="w-4 h-4" /> Cộng tác viên
              </button>
            </div>
          </div>
        )}

        {/* Modal Content (Form) */}
        <form id="profileForm" onSubmit={handleSubmit} className={`${styles.modalBody} px-8 py-6 space-y-6`}>
          
          {/* Section: Thông tin chung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Họ và tên <span className="text-red-500">*</span></label>
              <input 
                required
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-2.5 text-sm placeholder:text-slate-400 outline-none transition-all font-medium text-slate-900" 
                placeholder="VD: Nguyễn Văn A" 
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Số điện thoại <span className="text-red-500">*</span></label>
              <input 
                required
                type="tel"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-2.5 text-sm placeholder:text-slate-400 outline-none transition-all font-medium text-slate-900" 
                placeholder="090x xxx xxx" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email <span className="text-red-500">*</span></label>
              <input 
                required
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-2.5 text-sm placeholder:text-slate-400 outline-none transition-all font-medium text-slate-900" 
                placeholder="email@vi-du.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Địa chỉ</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-2.5 text-sm placeholder:text-slate-400 outline-none transition-all font-medium text-slate-900" 
                placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện..." 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 my-6"></div>

          {/* Section: Dành riêng cho HỌC VIÊN */}
          {formData.role === 'student' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-xs font-bold text-blue-600 flex items-center gap-2 tracking-wider">
                <GraduationCap className="w-5 h-5" /> THÔNG TIN HỌC TẬP
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hạng bằng</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                    value={formData.licenseType}
                    onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                  >
                    <option value="B1">B1 (Số tự động)</option>
                    <option value="B2">B2 (Số sàn)</option>
                    <option value="C">C (Tải)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Khóa học</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  >
                    <option value="">-- Chọn Khóa --</option>
                    <option value="K12/2023">Khóa K12/2023</option>
                    <option value="K01/2024">Khóa K01/2024</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trạng thái</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                    value={formData.studentStatus}
                    onChange={(e) => setFormData({ ...formData, studentStatus: e.target.value })}
                  >
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đang học">Đang học</option>
                    <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section: Dành riêng cho CỘNG TÁC VIÊN */}
          {formData.role === 'collaborator' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-xs font-bold text-purple-600 flex items-center gap-2 tracking-wider">
                <Tag className="w-5 h-5" /> CHI TIẾT ĐỐI TÁC
              </h4>
              <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mã giới thiệu <span className="text-red-500">*</span></label>
                  <input 
                    required={formData.role === 'collaborator'}
                    type="text"
                    className="w-full bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 px-4 py-2.5 text-sm font-bold text-purple-600 font-mono outline-none transition-all placeholder:text-slate-300 placeholder:font-sans" 
                    placeholder="VD: REF-99" 
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400 mt-1 italic">Mã định danh duy nhất dùng để tính hoa hồng.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Khu vực hoạt động
                  </label>
                  <select 
                    className="w-full bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                    value={formData.collaboratorRegion}
                    onChange={(e) => setFormData({ ...formData, collaboratorRegion: e.target.value })}
                  >
                    <option value="TP.HCM">Toàn TP.HCM</option>
                    <option value="Quận 1, TP.HCM">Quận 1, TP.HCM</option>
                    <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </form>

        {/* Modal Footer */}
        <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end items-center gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors border border-transparent hover:bg-slate-200 active:scale-95"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            form="profileForm"
            className={`px-8 py-2.5 rounded-lg text-white font-bold text-sm shadow-lg active:scale-95 transition-all duration-200 ${
              formData.role === 'student' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
            }`}
          >
            {initialData?.id ? 'Lưu cập nhật' : 'Tạo hồ sơ mới'}
          </button>
        </div>
      </div>
    </div>
  );
}