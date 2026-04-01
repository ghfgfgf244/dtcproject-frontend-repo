// src/components/manager/UserManagement/UserModal/index.tsx
"use client";

import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Eye, EyeOff, Save } from 'lucide-react';
import { ManagedUser, UserRole, UserStatus } from '@/types/user-management';

export interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  password?: string; // Mật khẩu có thể có hoặc không
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: ManagedUser | null;
  defaultRole: UserRole; // Tab đang đứng (STUDENT hay INSTRUCTOR)
  onSubmit: (data: UserFormData) => void;
}

export default function UserModal({ isOpen, onClose, initialData, defaultRole, onSubmit }: Props) {
  // --- FORM STATES ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [status, setStatus] = useState<UserStatus>('ACTIVE');
  const [password, setPassword] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);

  // --- SYNC STATE (Tránh lỗi cascading renders) ---
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<ManagedUser | null>(null);
  const [prevDefaultRole, setPrevDefaultRole] = useState<UserRole>('STUDENT');

  if (isOpen !== prevIsOpen || initialData !== prevInitialData || defaultRole !== prevDefaultRole) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    setPrevDefaultRole(defaultRole);
    
    if (isOpen) {
      if (initialData) {
        setFullName(initialData.fullName);
        setEmail(initialData.email);
        setPhone(initialData.phone);
        setRole(initialData.role);
        setStatus(initialData.status);
        setPassword(''); // Reset pass khi edit
      } else {
        setFullName('');
        setEmail('');
        setPhone('');
        setRole(defaultRole); // Tự động lấy Role theo tab đang đứng
        setStatus('ACTIVE');
        setPassword('');
      }
      setShowPassword(false);
    }
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ fullName, email, phone, role, status, password });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {initialData ? 'Cập nhật người dùng' : 'Thêm mới người dùng'}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
              Thông tin tài khoản hệ thống
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95">
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="px-8 py-6 space-y-5 overflow-y-auto custom-scrollbar">
            
            {/* Row 1: Name */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">Họ và tên</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium outline-none" 
                  placeholder="Nhập họ và tên đầy đủ" 
                />
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">Email</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium outline-none" 
                    placeholder="example@domain.com" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">Số điện thoại</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input 
                    required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium outline-none" 
                    placeholder="09xx xxx xxx" 
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Role & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">Vai trò</label>
                <select 
                  required value={role} onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium outline-none cursor-pointer"
                >
                  <option value="STUDENT">Học viên</option>
                  <option value="INSTRUCTOR">Giảng viên</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">Trạng thái</label>
                <div className="flex items-center h-[44px] gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" name="status" value="ACTIVE" 
                      checked={status === 'ACTIVE'} onChange={() => setStatus('ACTIVE')}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600" 
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Hoạt động</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" name="status" value="SUSPENDED" 
                      checked={status === 'SUSPENDED'} onChange={() => setStatus('SUSPENDED')}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600" 
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Tạm khóa</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Row 4: Password (Contextual) */}
            <div className="space-y-1.5 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-bold text-blue-700 uppercase tracking-wide">Mật khẩu</label>
                <span className="text-[10px] text-blue-600/70 italic font-medium">
                  {initialData ? 'Bỏ trống nếu không thay đổi' : 'Bắt buộc nếu tạo mới'}
                </span>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  required={!initialData} 
                  type={showPassword ? "text" : "password"} 
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm font-medium outline-none" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-3">
            <button 
              type="button" onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors active:scale-95"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}