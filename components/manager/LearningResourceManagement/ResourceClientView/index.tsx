// src/components/manager/LearningResource/ResourceClientView/index.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { CloudUpload, Search, Download, Video, FileText, Image as ImageIcon, Link2, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LearningResource, ResourceStats, ResourceType } from '@/types/learning-resource';
import ResourceStatsBento from '../ResourceStatsBento';
import ResourceModal, { ResourceFormData } from '@/components/manager/Modals/ResourceModal';
import ConfirmModal from '@/components/ui/confirm-modal';

interface Props {
  initialResources: LearningResource[];
  stats: ResourceStats;
}

export default function ResourceClientView({ initialResources, stats }: Props) {
  // --- STATES CHÍNH ---
  const [resources, setResources] = useState<LearningResource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- STATES MODAL CREATE/EDIT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- STATES MODAL DELETE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  // Lọc data để đẩy vào Modal Edit
  const editingResource = useMemo(() => {
    if (!editingId) return null;
    return resources.find(r => r.id === editingId) || null;
  }, [editingId, resources]);

  // --- LOGIC: FILTER & SEARCH ---
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.courseName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [resources, searchQuery, filterType]);

  // --- LOGIC: PAGINATION ---
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  // --- HANDLERS: CREATE / EDIT ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleSubmitResource = (formData: ResourceFormData) => {
    if (editingId) {
      setResources(prev => prev.map(item => 
        item.id === editingId ? { ...item, ...formData } : item
      ));
    } else {
      const newResource: LearningResource = {
        id: `RES-${Date.now()}`,
        ...formData,
        uploadDate: new Date().toLocaleDateString('vi-VN')
      };
      setResources(prev => [newResource, ...prev]);
      setCurrentPage(1); 
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  // --- HANDLERS: DELETE ---
  const handleDeleteClick = (id: string) => {
    setResourceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (resourceToDelete) {
      setResources(prev => prev.filter(item => item.id !== resourceToDelete));
      
      // Fix lỗi trang trống nếu xóa item cuối cùng của 1 trang
      const newTotalItems = filteredResources.length - 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    }
    setIsDeleteModalOpen(false);
    setResourceToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setResourceToDelete(null);
  };

  const handleView = (id: string) => alert(`Mở cửa sổ xem trước tài liệu ID: ${id}`);

  // --- HELPER RENDERS ---
  const getFileIconAndColor = (type: ResourceType) => {
    switch (type) {
      case 'Video': return { icon: <Video className="w-5 h-5" />, bg: 'bg-blue-50 text-blue-600', badge: 'bg-blue-100 text-blue-700' };
      case 'PDF': return { icon: <FileText className="w-5 h-5" />, bg: 'bg-red-50 text-red-600', badge: 'bg-red-100 text-red-700' };
      case 'Image': return { icon: <ImageIcon className="w-5 h-5" />, bg: 'bg-amber-50 text-amber-600', badge: 'bg-amber-100 text-amber-700' };
      case 'Document': return { icon: <FileText className="w-5 h-5" />, bg: 'bg-emerald-50 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' };
      default: return { icon: <FileText className="w-5 h-5" />, bg: 'bg-slate-50 text-slate-600', badge: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-[1.875rem] font-black tracking-tight text-slate-900">Tài nguyên học tập</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý và tổ chức kho tài liệu đào tạo cho học viên.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <CloudUpload className="w-5 h-5" />
          Tải lên tài liệu
        </button>
      </div>

      <ResourceStatsBento stats={stats} />

      {/* Content Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all" 
              placeholder="Tìm kiếm tài liệu hoặc khóa học..." 
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="All">Tất cả định dạng</option>
              <option value="Video">Video</option>
              <option value="PDF">PDF</option>
              <option value="Image">Hình ảnh</option>
              <option value="Document">Tài liệu khác</option>
            </select>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" /> Xuất
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto custom-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tên tài liệu</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Khóa học</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Đường dẫn</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ngày tải lên</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length > 0 ? currentData.map((item) => {
                const style = getFileIconAndColor(item.type);
                
                // Đảm bảo link luôn có dạng hợp lệ (có http/https) để click mở tab mới
                const validUrl = item.url.startsWith('http') ? item.url : `https://${item.url}`;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.bg}`}>{style.icon}</div>
                        <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.courseName}</td>
                    
                    {/* NÂNG CẤP LÀM CHO URL CLICK ĐƯỢC (target="_blank") */}
                    <td className="px-6 py-4">
                      <a 
                        href={validUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1.5 truncate max-w-[150px]"
                        title={`Mở liên kết: ${validUrl}`}
                      >
                        <Link2 className="w-3.5 h-3.5 shrink-0" />
                        {item.url}
                      </a>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{item.uploadDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleView(item.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenEdit(item.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Chỉnh sửa">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa tài liệu">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Không tìm thấy tài liệu nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredResources.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <p className="text-xs text-slate-500 font-medium">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredResources.length)} của {filteredResources.length} tài liệu
            </p>
            <div className="flex gap-1.5">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 text-slate-500 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button 
                  key={idx} onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${currentPage === idx + 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 text-slate-500 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- GẮN MODAL CREATE / UPDATE VÀO ĐÂY --- */}
      <ResourceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingResource}
        onSubmit={handleSubmitResource}
      />

      {/* --- GẮN MODAL XÓA (CONFIRM) VÀO ĐÂY --- */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa tài nguyên"
        message="Bạn có chắc chắn muốn xóa tài nguyên học tập này không? Hành động này không thể hoàn tác."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}