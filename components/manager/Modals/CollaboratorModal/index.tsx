// components/manager/Modals/CollaboratorModal/index.tsx
"use client";

import React, { useState } from 'react';
import { X, QrCode, User, Mail, Phone, Save } from 'lucide-react';
import { Collaborator } from '@/types/collaborator';

export interface CollabFormData {
  fullName: string;
  email: string;
  phone: string;
  referralCode: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: Collaborator | null;
  onSubmit: (data: CollabFormData) => void;
}

export default function CollaboratorModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  // --- STATES ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isActive, setIsActive] = useState(true);

  // --- FIX LỖI ESLINT: ĐỒNG BỘ STATE NGAY TRONG RENDER ---
  // Sử dụng một state tạm thời để theo dõi sự thay đổi của Props
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<Collaborator | null>(null);

  // Kỹ thuật đồng bộ hóa state của React (thay thế cho useEffect)
  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);

    if (isOpen) {
      if (initialData) {
        setFullName(initialData.fullName);
        setEmail(initialData.email);
        setPhone(initialData.phone);
        setReferralCode(initialData.referralCode);
        setIsActive(initialData.status === 'ACTIVE');
      } else {
        setFullName('');
        setEmail('');
        setPhone('');
        setReferralCode(`REF-${new Date().getFullYear()}-`);
        setIsActive(true);
      }
    }
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      fullName,
      email,
      phone,
      referralCode,
      status: isActive ? 'ACTIVE' : 'INACTIVE'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Cập nhật Cộng tác viên' : 'Thêm mới Cộng tác viên'}
            </h3>
            <p className="text-slate-500 text-xs mt-1 font-medium">Nhập thông tin chi tiết cho tài khoản cộng tác viên.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-4 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Họ và tên</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Số điện thoại</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Mã giới thiệu</label>
              <div className="relative group">
                <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                <input required type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm font-mono font-medium" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-700">Trạng thái hoạt động</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-tight">Tài khoản có quyền truy cập hệ thống</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isActive} onChange={() => setIsActive(!isActive)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100 mt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
              Hủy
            </button>
            <button type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" /> Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}