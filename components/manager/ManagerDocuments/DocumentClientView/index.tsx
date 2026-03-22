"use client";

import React, { useState } from 'react';
import { Search, Filter, UploadCloud, XCircle } from 'lucide-react';
import { DocumentRecord, DocumentType } from '@/types/document';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';

import DocumentTable from '../DocumentTable';

interface Props {
  initialDocs: DocumentRecord[];
}

export default function DocumentClientView({ initialDocs }: Props) {
  // STATES BỘ LỌC
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'Tất cả'>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | 'Đã duyệt' | 'Chờ duyệt'>('Tất cả');

  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/training-manager' },
    { label: 'Hồ sơ Cá nhân', href: '/training-manager/documents' }
  ];

  // LOGIC LỌC
  const filteredDocs = initialDocs.filter(doc => {
    const matchSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'Tất cả' || doc.documentType === typeFilter;
    const matchStatus = 
      statusFilter === 'Tất cả' || 
      (statusFilter === 'Đã duyệt' && doc.isVerified) || 
      (statusFilter === 'Chờ duyệt' && !doc.isVerified);

    return matchSearch && matchType && matchStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('Tất cả');
    setStatusFilter('Tất cả');
  };

  const isFiltering = searchTerm !== '' || typeFilter !== 'Tất cả' || statusFilter !== 'Tất cả';

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="mb-2">
            <Breadcrumbs items={breadcrumbsItems} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Quản lý Hồ sơ</h2>
          <p className="text-slate-500 mt-1">Kiểm tra và xác thực giấy tờ tùy thân, bằng cấp của nhân sự & học viên.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95">
          <UploadCloud className="w-5 h-5" /> Tải hồ sơ lên
        </button>
      </div>

      {/* FILTER BAR SECTION - ĐÃ ĐƯA LÊN CÙNG 1 HÀNG */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        
        {/* Thanh tìm kiếm */}
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên file..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Các Dropdown và Nút Bỏ lọc */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 shrink-0">
          
          {/* Lọc loại giấy tờ */}
          <div className="relative flex-1 sm:w-56">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer outline-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'Tất cả')}
            >
              <option value="Tất cả">Loại giấy tờ: Tất cả</option>
              <option value="CCCD / CMND">CCCD / CMND</option>
              <option value="Giấy phép Lái xe">Giấy phép Lái xe</option>
              <option value="Giấy khám Sức khỏe">Giấy khám Sức khỏe</option>
              <option value="Chứng chỉ nghề">Chứng chỉ nghề</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Lọc trạng thái xác thực */}
          <div className="relative flex-1 sm:w-44">
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer outline-none text-center"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'Đã duyệt' | 'Chờ duyệt' | 'Tất cả')}
            >
              <option value="Tất cả">Trạng thái: Tất cả</option>
              <option value="Đã duyệt">Đã duyệt (Xanh)</option>
              <option value="Chờ duyệt">Chờ duyệt (Cam)</option>
            </select>
          </div>

          {/* Nút Xóa bộ lọc */}
          {isFiltering && (
            <button 
              onClick={clearFilters}
              className="px-4 py-3 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 font-bold text-sm rounded-xl transition-colors border border-transparent"
              title="Bỏ lọc"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Bảng Dữ liệu */}
      <DocumentTable 
        documents={filteredDocs} 
        onView={(doc) => console.log('View', doc.fileName)}
        onDownload={(doc) => console.log('Download', doc.fileUrl)}
        onDelete={(doc) => console.log('Delete', doc.id)}
      />
    </div>
  );
}