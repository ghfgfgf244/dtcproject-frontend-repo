'use client';

import React from 'react';
import { X, User, Mail, Phone, Calendar, CreditCard, FileText, Image as ImageIcon } from 'lucide-react';
import { RegistrationRecord } from '@/types/registration';

interface Props {
  registration: RegistrationRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationDetailModal({ registration, isOpen, onClose }: Props) {
  if (!isOpen || !registration) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${registration.avatarColor}`}>
              {registration.avatarInitials}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{registration.studentName}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">ID: {registration.studentId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Info Section */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Thông tin cá nhân
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
                      <p className="text-sm font-medium text-slate-700">{registration.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Số điện thoại</p>
                      <p className="text-sm font-medium text-slate-700">{registration.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Ngày đăng ký</p>
                      <p className="text-sm font-medium text-slate-700">{registration.registrationDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" /> Thông tin khóa học
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-500 font-medium">Khóa học:</span>
                    <span className="text-sm font-bold text-slate-900">{registration.courseName}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-500 font-medium">Hạng bằng:</span>
                    <span className="text-xs font-black px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full uppercase border border-blue-200">
                      Hạng {registration.licenseType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-700 font-bold">Tổng học phí:</span>
                    <span className="text-base font-black text-blue-600">{formatCurrency(registration.totalFee)}</span>
                  </div>
                </div>
              </div>

              {registration.notes && (
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Ghi chú
                  </h3>
                  <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-100 italic leading-relaxed">
                    "{registration.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Images Section */}
            <div className="lg:col-span-2">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> Hồ sơ hình ảnh
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Profile Photo */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">Ảnh hồ sơ</p>
                  <div className="aspect-[3/4] bg-slate-100 rounded-xl border-2 border-slate-100 overflow-hidden relative group">
                    {registration.photoUrl ? (
                      <img 
                        src={registration.photoUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-[10px] font-bold">Chưa có ảnh</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ID Cards column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">CCCD Mặt trước</p>
                    <div className="aspect-[1.6/1] bg-slate-100 rounded-xl border-2 border-slate-100 overflow-hidden relative group">
                      {registration.idFrontUrl ? (
                        <img 
                          src={registration.idFrontUrl} 
                          alt="ID Front" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <span className="text-[10px] font-bold">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">CCCD Mặt sau</p>
                    <div className="aspect-[1.6/1] bg-slate-100 rounded-xl border-2 border-slate-100 overflow-hidden relative group">
                      {registration.idBackUrl ? (
                        <img 
                          src={registration.idBackUrl} 
                          alt="ID Back" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <span className="text-[10px] font-bold">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 text-sm font-bold">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            Đóng
          </button>
          
          {registration.status === 'Pending' && (
            <div className="flex items-center gap-2">
               {/* These will be handled by the parent component's handlers, but we show them here for visual context or could pass them in */}
               {/* For simplicity now, let parent handle them in the table. If needed, can pass as props */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
