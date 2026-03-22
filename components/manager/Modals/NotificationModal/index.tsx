"use client";

import React, { useState } from 'react';
import { X, Send, Save, BellRing } from 'lucide-react';
import { NotificationRecord, NotificationCategory } from '@/types/notification';
import styles from '@/components/manager/Modals/modal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: NotificationRecord | null;
  onSubmit: (data: Partial<NotificationRecord>) => void;
}

// Map danh mục tiếng Anh sang tiếng Việt để hiển thị trên UI
const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  Enrollment: 'Tuyển sinh',
  Schedule: 'Lịch trình & Lịch học',
  Exams: 'Thi cử & Điểm số',
  System: 'Thông báo Hệ thống',
  Document: 'Tài liệu & Chứng chỉ'
};

const CATEGORIES: NotificationCategory[] = ['Enrollment', 'Schedule', 'Exams', 'System', 'Document'];

export default function NotificationModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  // 1. Khởi tạo State Form
  const [formData, setFormData] = useState<Partial<NotificationRecord>>({
    title: '',
    message: '',
    category: 'System',
    actionText: ''
  });

  // 2. Kỹ thuật đồng bộ State khi Props thay đổi (Chuẩn React 18+)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    
    if (isOpen) {
      if (initialData) {
        setFormData(initialData); // Chế độ Chỉnh sửa
      } else {
        // Chế độ Tạo mới
        setFormData({ title: '', message: '', category: 'System', actionText: '' });
      }
    }
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ở mode Tạo mới, tự động gắn trạng thái 'unread' (Chưa đọc)
    const submitData: Partial<NotificationRecord> = initialData 
      ? formData 
      : { ...formData, status: 'unread' as const };
    onSubmit(submitData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={`${styles.modalContainer} max-w-2xl animate-in fade-in zoom-in-95 duration-200`}>
        
        {/* Header Modal */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {initialData?.id ? 'Chỉnh sửa thông báo' : 'Soạn thông báo mới'}
              </h2>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-0.5">
                Phát sóng toàn hệ thống
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung Form */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Danh mục (Category) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-3 font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all cursor-pointer"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as NotificationCategory})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
              </div>

              {/* Tên nút hành động (Call to action) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  Tên nút hành động 
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded">Tùy chọn</span>
                </label>
                <input 
                  type="text" 
                  placeholder="VD: Xem chi tiết, Đăng ký ngay..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-3 font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all" 
                  value={formData.actionText || ''}
                  onChange={(e) => setFormData({...formData, actionText: e.target.value})}
                />
              </div>
            </div>

            {/* Tiêu đề thông báo */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest">
                Tiêu đề thông báo <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="VD: Lịch bảo trì hệ thống máy chủ cuối tuần này" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-3 font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Nội dung chi tiết */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest">
                Nội dung chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={5} 
                placeholder="Nhập nội dung đầy đủ của thông báo tại đây..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-3 font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all resize-none" 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

          </div>

          {/* Footer Modal */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 -mx-8 -mb-8 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-200">
              Hủy bỏ
            </button>
            <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white text-sm font-black rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2">
              {initialData?.id ? (
                <><Save className="w-4 h-4" /> Lưu thay đổi</>
              ) : (
                <><Send className="w-4 h-4" /> Gửi thông báo</>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}