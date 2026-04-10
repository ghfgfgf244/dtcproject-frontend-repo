"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, UploadCloud, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { DocumentRecord, DocumentType } from '@/types/document';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { documentService } from '@/services/documentService';
import DocumentTable from '../DocumentTable';

interface Props {
  initialDocs?: DocumentRecord[];
  hideHeader?: boolean;
}

export default function DocumentClientView({ initialDocs = [], hideHeader = false }: Props) {
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DATA STATES
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocs);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // STATES BỘ LỌC
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'Tất cả'>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | 'Đã duyệt' | 'Chờ duyệt'>('Tất cả');

  // FETCH DATA
  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data = await documentService.getMyDocuments();
      setDocuments(data);
    } catch (err) {
      setError("Không thể tải danh sách hồ sơ.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // HANDLERS
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      
      // Determine resourceType based on extension for Cloudinary
      const ext = file.name.split('.').pop()?.toLowerCase();
      const resourceType = ['jpg', 'jpeg', 'png', 'gif'].includes(ext || '') ? 'image' : 'raw';

      const newDoc = await documentService.uploadDocument(file, resourceType);
      if (newDoc) {
        setDocuments(prev => [newDoc, ...prev]);
        alert("Tải hồ sơ lên thành công!");
      }
    } catch (err) {
      alert("Lỗi khi tải hồ sơ lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) return;
    
    try {
      const token = await getToken();
      setAuthToken(token);
      await documentService.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      alert("Đã xóa hồ sơ.");
    } catch (err) {
      alert("Lỗi khi xóa hồ sơ.");
    }
  };

  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/training-manager' },
    { label: 'Hồ sơ Cá nhân', href: '/training-manager/documents' }
  ];

  // LOGIC LỌC
  const filteredDocs = documents.filter(doc => {
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

  if (loading && documents.length === 0) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8">
      
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="mb-2">
              <Breadcrumbs items={breadcrumbsItems} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Hồ sơ cá nhân</h2>
            <p className="text-slate-500 mt-1">Đăng tải và quản lý các giấy tờ cá nhân của bạn.</p>
          </div>
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
            {uploading ? "Đang tải lên..." : "Tải hồ sơ lên"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          />
        </div>
      )}

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
        onView={(doc) => window.open(doc.fileUrl, '_blank')}
        onDownload={(doc) => window.open(doc.fileUrl, '_blank')}
        onDelete={(doc) => handleDelete(doc.id)}
      />
    </div>
  );
}