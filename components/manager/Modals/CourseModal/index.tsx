"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, ShieldCheck, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { setAuthToken } from '@/lib/api';
import { CourseRecord } from '@/types/course';
import { centerService, Center } from '@/services/centerService';

export interface CourseSubmitData {
  id?: string;
  centerId: string;
  name: string;
  licenseType: string;
  price: string | number;
  description: string;
  status: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: CourseRecord | null;
  onSubmit: (data: CourseSubmitData) => void;
}

export default function CourseModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  const { getToken } = useAuth();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [formData, setFormData] = useState({
    centerId: '',
    name: '',
    licenseType: '',
    price: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    async function fetchCenters() {
      if (isOpen) {
        setLoadingCenters(true);
        try {
          const token = await getToken();
          setAuthToken(token);
          const data = await centerService.getAllCenters();
          setCenters(data);
        } catch (error) {
          console.error("Failed to fetch centers", error);
        } finally {
          setLoadingCenters(false);
        }
      }
    }
    fetchCenters();
  }, [isOpen, getToken]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        centerId: '', // Ideally we should have centerId in CourseRecord or fetch it
        name: initialData.name,
        licenseType: initialData.licenseType,
        price: initialData.price.toString(),
        description: initialData.description,
        isActive: initialData.status === 'Hoạt động'
      });
    } else {
      setFormData({
        centerId: '',
        name: '',
        licenseType: '',
        price: '',
        description: '',
        isActive: true
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData?.id || undefined, // Giữ ID nếu là Edit
      status: formData.isActive ? 'Hoạt động' : 'Ngừng hoạt động'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      {/* Modal Content */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-transparent flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {initialData ? 'Cập nhật Khóa học' : 'Thêm Khóa học mới'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Thiết lập thông tin chi tiết cho chương trình đào tạo.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body (Form) */}
        <form id="courseForm" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          
          {/* Cơ sở đào tạo */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Cơ sở đào tạo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none appearance-none font-medium text-slate-700 disabled:opacity-50" 
                required
                value={formData.centerId}
                onChange={(e) => setFormData({...formData, centerId: e.target.value})}
                disabled={loadingCenters}
              >
                <option value="" disabled>{loadingCenters ? 'Đang tải...' : 'Chọn cơ sở đào tạo'}</option>
                {centers.map(center => (
                   <option key={center.id} value={center.id}>{center.centerName}</option>
                ))}
              </select>
              {loadingCenters ? (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
              ) : (
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              )}
            </div>
          </div>

          {/* Tên khóa học */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Tên khóa học <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              required
              placeholder="VD: Khóa đào tạo Lái xe B2 Tiêu chuẩn" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hạng bằng */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Hạng bằng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none appearance-none font-medium text-slate-700" 
                  required
                  value={formData.licenseType}
                  onChange={(e) => setFormData({...formData, licenseType: e.target.value})}
                >
                  <option value="" disabled>Chọn hạng bằng</option>
                  <option value="A1">A1 - Mô tô</option>
                  <option value="B1">B1 - Số tự động</option>
                  <option value="B2">B2 - Số sàn</option>
                  <option value="C">C - Xe tải</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Học phí */}
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
                  placeholder="0" 
                  className="w-full pl-4 pr-16 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none font-medium text-slate-900" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">VNĐ</span>
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Mô tả</label>
            <textarea 
              rows={3}
              placeholder="Cung cấp thông tin chi tiết về giáo trình, thời lượng..." 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          {/* Trạng thái hoạt động (Toggle) */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm font-bold text-slate-800">Trạng thái Hoạt động</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Bật tùy chọn này để hiển thị khóa học với học viên</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row gap-3 justify-end rounded-b-xl">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            form="courseForm"
            className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" /> Lưu Khóa học
          </button>
        </div>
      </div>
    </div>
  );
}