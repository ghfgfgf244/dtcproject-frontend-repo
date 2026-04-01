// src/components/manager/RoadmapManagement/RoadmapClientView/index.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Zap, TrendingUp, Search, Filter, Download, Edit, Trash2, ChevronLeft, ChevronRight, ArrowRight, HelpCircle, FileText, Headphones } from 'lucide-react';
import { Roadmap, RoadmapStats } from '@/types/roadmap';
import RoadmapModal, { RoadmapFormData } from '@/components/manager/Modals/RoadmapModal';
import ConfirmModal from '@/components/ui/confirm-modal';

interface Props {
  initialRoadmaps: Roadmap[];
  stats: RoadmapStats;
}

export default function RoadmapClientView({ initialRoadmaps, stats }: Props) {
  // --- STATES CHÍNH ---
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(initialRoadmaps);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // --- STATES MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // --- LỌC DỮ LIỆU EDIT ---
  const editingRoadmap = useMemo(() => {
    if (!editingId) return null;
    return roadmaps.find(r => r.id === editingId) || null;
  }, [editingId, roadmaps]);

  // --- LOGIC: SEARCH ---
  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter(rm => 
      rm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rm.relatedCourses.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roadmaps, searchQuery]);

  // --- LOGIC: PAGINATION ---
  const totalPages = Math.ceil(filteredRoadmaps.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredRoadmaps.slice(startIndex, startIndex + itemsPerPage);

  // --- HANDLERS: CRUD ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleSubmitRoadmap = (formData: RoadmapFormData) => {
    // Tự động tạo code ngắn từ Course ID (VD: "FIN-101" -> "FIN")
    const shortCode = formData.courseId.split('-')[0] || 'RM';
    
    // Random màu cho đẹp mắt khi thêm mới
    const themes: ('blue' | 'emerald' | 'orange' | 'purple')[] = ['blue', 'emerald', 'orange', 'purple'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    if (editingId) {
      // Cập nhật
      setRoadmaps(prev => prev.map(item => 
        item.id === editingId 
          ? { 
              ...item, 
              title: formData.title,
              description: formData.description,
              relatedCourses: formData.courseId,
              code: shortCode
            } 
          : item
      ));
    } else {
      // Thêm mới
      const newRoadmap: Roadmap = {
        id: `RM-${Date.now()}`,
        code: shortCode,
        title: formData.title,
        description: formData.description,
        relatedCourses: formData.courseId,
        theme: randomTheme,
        createdAt: new Date().toLocaleDateString('vi-VN')
      };
      setRoadmaps(prev => [newRoadmap, ...prev]);
      setCurrentPage(1);
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setRoadmaps(prev => prev.filter(item => item.id !== itemToDelete));
      const newTotalItems = filteredRoadmaps.length - 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage) || 1;
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Helper render màu sắc
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'emerald': return 'bg-emerald-100 text-emerald-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[1.875rem] font-black tracking-tight text-slate-900 leading-none">Lộ trình học tập</h1>
          <p className="text-slate-500 mt-2 text-[0.875rem]">Quản lý và thiết kế các giai đoạn đào tạo lái xe chuyên nghiệp.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Thêm lộ trình mới
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng lộ trình</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black">{stats.total}</span>
            <span className="text-emerald-500 text-[10px] font-bold">{stats.totalGrowth}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang hoạt động</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black">{stats.active}</span>
            <Zap className="w-4 h-4 text-blue-500 fill-blue-500" />
          </div>
        </div>
        <div className="bg-blue-50/50 border-blue-200 border p-5 rounded-lg shadow-sm md:col-span-2 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Tỷ lệ hoàn thành</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-blue-600">{stats.completionRate}</span>
              <span className="text-slate-500 text-[10px]">{stats.systemAverage}</span>
            </div>
          </div>
          <TrendingUp className="absolute right-[-20px] top-[-20px] opacity-10 text-blue-600 w-40 h-40" />
        </div>
      </div>

      {/* Main Content (Table) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-8">
        
        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
              placeholder="Tìm kiếm lộ trình..." 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none p-2 flex justify-center text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="flex-1 sm:flex-none p-2 flex justify-center text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-white">
                <th className="px-6 py-4">Tiêu đề</th>
                <th className="px-6 py-4">Mô tả</th>
                <th className="px-6 py-4">Khóa học liên quan</th>
                <th className="px-6 py-4 text-center">Ngày tạo</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length > 0 ? currentData.map((rm) => (
                <tr key={rm.id} className="hover:bg-slate-50/80 transition-colors group bg-white">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${getThemeClasses(rm.theme)}`}>
                        {rm.code}
                      </div>
                      <span className="font-bold text-slate-900">{rm.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-slate-500 text-[13px] line-clamp-1 max-w-[250px]">{rm.description}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                      {rm.relatedCourses}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center text-slate-500 text-[12px] font-medium">
                    {rm.createdAt}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleOpenEdit(rm.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(rm.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">Không tìm thấy lộ trình nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRoadmaps.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-[12px] font-medium text-slate-500 bg-white">
            <span>Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredRoadmaps.length)} trong tổng số {filteredRoadmaps.length} lộ trình</span>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button 
                  key={idx} onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-all font-bold ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contextual Information Bottom */}
      {/* <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="font-bold text-slate-900 mb-2">Tính năng mới: AI Roadmap Generator</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-md">Sử dụng trí tuệ nhân tạo để tự động tối ưu hóa lộ trình dựa trên dữ liệu tỷ lệ đỗ của học viên các khóa trước.</p>
            <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
              Thử nghiệm ngay <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500"></div>
        </div>

        <div className="lg:w-80 bg-slate-900 text-white p-6 rounded-lg shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold mb-1">Trợ giúp nhanh</h3>
            <p className="text-[12px] text-slate-400 mb-4">Mọi thắc mắc về quy trình đào tạo</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer">
                <HelpCircle className="w-4 h-4" /> <span>Hướng dẫn tạo mới lộ trình</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer">
                <FileText className="w-4 h-4" /> <span>Quy định của Bộ GTVT</span>
              </li>
            </ul>
          </div>
          <Headphones className="absolute bottom-[-10px] left-[-10px] w-32 h-32 opacity-10" />
        </div>
      </div> */}

      {/* --- GẮN MODALS --- */}
      <RoadmapModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingRoadmap}
        onSubmit={handleSubmitRoadmap}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa lộ trình"
        message="Bạn có chắc chắn muốn xóa lộ trình đào tạo này không? Hành động này không thể hoàn tác."
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}