// src/components/manager/LearningResource/ResourceModal/index.tsx
"use client";

import React, { useState } from 'react';
import { X, ChevronDown, Link as LinkIcon, CloudUpload } from 'lucide-react';
import { LearningResource, ResourceType } from '@/types/learning-resource';

export interface ResourceFormData {
  title: string;
  type: ResourceType;
  courseName: string;
  url: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: LearningResource | null;
  onSubmit: (data: ResourceFormData) => void;
}

export default function ResourceModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  // --- FORM STATES ---
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('Video');
  const [courseName, setCourseName] = useState('');
  const [url, setUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

  // --- SYNC STATE (Tránh lỗi set-state-in-effect) ---
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<LearningResource | null>(null);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    
    if (isOpen) {
      if (initialData) {
        // Chế độ Edit
        setTitle(initialData.title);
        setType(initialData.type);
        setCourseName(initialData.courseName);
        setUrl(initialData.url);
        setUploadMode('url');
      } else {
        // Chế độ Create
        setTitle('');
        setType('Video');
        setCourseName('');
        setUrl('');
        setUploadMode('url');
      }
    }
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      type,
      courseName,
      // Giả lập lưu URL nếu chọn 'file' mà chưa có backend
      url: uploadMode === 'file' ? 'assets/uploaded-file...' : url 
    });
  };

  const today = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              {initialData ? 'Cập nhật Tài nguyên' : 'Thêm mới Tài nguyên'}
            </h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Resource Management Portal</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-8 space-y-6">
            
            {/* Course Selection */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Khóa học liên kết</label>
              <div className="relative">
                <select 
                  required value={courseName} onChange={(e) => setCourseName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none appearance-none transition-all cursor-pointer"
                >
                  <option value="" disabled>-- Chọn khóa học --</option>
                  <option value="B2 - Lái xe hạng nhẹ">B2 - Lái xe hạng nhẹ</option>
                  <option value="C - Lái xe tải">C - Lái xe tải</option>
                  <option value="Luật giao thông ĐB">Luật giao thông ĐB</option>
                  <option value="Biển báo cơ bản">Biển báo cơ bản</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tiêu đề tài nguyên</label>
              <input 
                required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tên tài nguyên học tập..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
              />
            </div>

            {/* Type & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Loại tài nguyên</label>
                <div className="relative">
                  <select 
                    required value={type} onChange={(e) => setType(e.target.value as ResourceType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none appearance-none transition-all cursor-pointer"
                  >
                    <option value="Video">Video (MP4, YouTube)</option>
                    <option value="PDF">PDF Document</option>
                    <option value="Document">Word / Text Document</option>
                    <option value="Image">Hình ảnh</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ngày tải lên (Auto)</label>
                <input 
                  disabled type="text" value={initialData ? initialData.uploadDate : today}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-400 italic cursor-not-allowed" 
                />
              </div>
            </div>

            {/* URL / File Upload Area */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Đường dẫn / Tệp tin</label>
              
              <div className="flex items-center gap-2 mb-2 bg-slate-100 p-1 rounded-lg w-fit border border-slate-200">
                <button 
                  type="button" onClick={() => setUploadMode('url')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${uploadMode === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Dán URL
                </button>
                <button 
                  type="button" onClick={() => setUploadMode('file')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${uploadMode === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Tải tệp lên
                </button>
              </div>

              {uploadMode === 'url' ? (
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    required={uploadMode === 'url'} type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/resource/file.pdf" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50/50 group hover:border-blue-400 transition-colors cursor-pointer">
                  <CloudUpload className="text-slate-400 group-hover:text-blue-500 transition-colors w-10 h-10 mb-3" />
                  <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700">Kéo và thả tệp vào đây hoặc Bấm để chọn</p>
                  <p className="text-xs text-slate-400 mt-1">Hỗ trợ PDF, MP4, DOCX (Tối đa 50MB)</p>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-xl">
            <button 
              type="button" onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors active:scale-95"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-8 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all font-black text-sm uppercase tracking-wider"
            >
              Lưu tài nguyên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}