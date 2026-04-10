'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CloudUpload, Search, Video, FileText, Image as ImageIcon, Link2, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { setAuthToken } from '@/lib/api';
import { LearningResource, ResourceLearningDTO, ResourceStats, ResourceType } from '@/types/learning-resource';
import { resourceLearningService } from '@/services/resourceLearningService';
import { courseService } from '@/services/courseService';
import ResourceStatsBento from '../ResourceStatsBento';
import ResourceModal, { ResourceFormData } from '@/components/manager/Modals/ResourceModal';
import ConfirmModal from '@/components/ui/confirm-modal';

const TYPE_MAP: Record<number, ResourceType> = {
  1: 'Video',
  2: 'Pdf',
  3: 'Link',
  4: 'Slide',
  5: 'Image',
};

const TYPE_NAME_TO_INT: Record<ResourceType, number> = {
  Video: 1,
  Pdf: 2,
  Link: 3,
  Slide: 4,
  Image: 5,
};

export default function ResourceClientView() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [courses, setCourses] = useState<{ id: string; courseName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  const itemsPerPage = 10;

  const ensureToken = useCallback(async () => {
    const token = await getToken({ skipCache: true });
    setAuthToken(token);
  }, [getToken]);

  const mapDtoToModel = useCallback((dto: ResourceLearningDTO): LearningResource => ({
    id: dto.id,
    title: dto.title,
    type: ((typeof dto.resourceType === 'number' ? TYPE_MAP[dto.resourceType] : dto.resourceType) as ResourceType) || 'Link',
    courseId: dto.courseId,
    courseName: dto.courseName || 'Không rõ khóa học',
    url: dto.resourceUrl,
    uploadDate: new Date(dto.createdAt).toLocaleDateString('vi-VN'),
    isActive: dto.isActive,
  }), []);

  const fetchData = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    setLoading(true);
    try {
      await ensureToken();
      const [resourcesData, coursesData] = await Promise.all([
        resourceLearningService.getAll(),
        courseService.getAllAdminCourses(),
      ]);

      setResources(resourcesData.filter((item) => item.isActive !== false).map(mapDtoToModel));
      setCourses(coursesData.map((course) => ({ id: course.id, courseName: course.courseName })));
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast.error('Không thể tải dữ liệu tài nguyên.');
    } finally {
      setLoading(false);
    }
  }, [ensureToken, isLoaded, isSignedIn, mapDtoToModel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo((): ResourceStats => {
    const total = resources.length;
    const videos = resources.filter((r) => r.type === 'Video').length;

    return {
      totalResources: total.toString(),
      growthPercentage: '+12%',
      storageUsed: '2.4 GB',
      storagePercentage: 48,
      videoCount: videos.toString(),
      videoOptimizedPercentage: '85%',
      downloadCount: '1,240',
      avgDownloadsPerDay: '42',
    };
  }, [resources]);

  const editingResource = useMemo(
    () => (editingId ? resources.find((resource) => resource.id === editingId) || null : null),
    [editingId, resources]
  );

  const filteredResources = useMemo(() => resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  }), [filterType, resources, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmitResource = async (formData: ResourceFormData) => {
    try {
      await ensureToken();

      if (editingId) {
        const result = await resourceLearningService.update(editingId, {
          title: formData.title,
          resourceType: TYPE_NAME_TO_INT[formData.type],
          resourceUrl: formData.url,
        });
        setResources((prev) => prev.map((item) => item.id === editingId ? mapDtoToModel(result) : item));
        toast.success('Cập nhật tài nguyên thành công.');
      } else {
        const result = await resourceLearningService.create({
          courseId: formData.courseId,
          title: formData.title,
          resourceType: TYPE_NAME_TO_INT[formData.type],
          resourceUrl: formData.url,
        });
        setResources((prev) => [mapDtoToModel(result), ...prev]);
        setCurrentPage(1);
        toast.success('Thêm tài nguyên mới thành công.');
      }

      setIsModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save resource:', error);
      toast.error('Lỗi khi lưu tài nguyên.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) {
      return;
    }

    try {
      await ensureToken();
      await resourceLearningService.delete(resourceToDelete);
      setResources((prev) => prev.filter((item) => item.id !== resourceToDelete));
      toast.success('Đã xóa tài nguyên.');
    } catch (error) {
      console.error('Failed to delete resource:', error);
      toast.error('Lỗi khi xóa tài nguyên.');
    } finally {
      setIsDeleteModalOpen(false);
      setResourceToDelete(null);
    }
  };

  const getFileIconAndColor = (type: ResourceType) => {
    switch (type) {
      case 'Video':
        return { icon: <Video className="w-5 h-5" />, bg: 'bg-blue-50 text-blue-600', badge: 'bg-blue-100 text-blue-700' };
      case 'Pdf':
        return { icon: <FileText className="w-5 h-5" />, bg: 'bg-red-50 text-red-600', badge: 'bg-red-100 text-red-700' };
      case 'Image':
        return { icon: <ImageIcon className="w-5 h-5" />, bg: 'bg-amber-50 text-amber-600', badge: 'bg-amber-100 text-amber-700' };
      case 'Slide':
        return { icon: <FileText className="w-5 h-5" />, bg: 'bg-purple-50 text-purple-600', badge: 'bg-purple-100 text-purple-700' };
      default:
        return { icon: <Link2 className="w-5 h-5" />, bg: 'bg-emerald-50 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-20">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />
        <p className="font-medium text-slate-500">Đang tải danh sách tài nguyên...</p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[1.875rem] font-black tracking-tight text-slate-900">Tài nguyên học tập</h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý và tổ chức kho tài liệu đào tạo cho học viên.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
        >
          <CloudUpload className="w-5 h-5" />
          Tải lên tài liệu
        </button>
      </div>

      {/* <ResourceStatsBento stats={stats} /> */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4 md:flex-row">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-600"
              placeholder="Tìm kiếm tài liệu hoặc khóa học..."
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 outline-none transition-all focus:ring-2 focus:ring-blue-600 md:w-auto"
          >
            <option value="All">Tất cả định dạng</option>
            {Object.values(TYPE_MAP).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-[300px] overflow-x-auto">
          <table className="min-w-[800px] w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Tên tài liệu</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Loại</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Khóa học</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length > 0 ? currentData.map((item) => {
                const style = getFileIconAndColor(item.type);
                const validUrl = item.url.startsWith('http') ? item.url : `https://${item.url}`;

                return (
                  <tr key={item.id} className="group transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.bg}`}>{style.icon}</div>
                        <span className="text-sm font-bold text-slate-900">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.courseName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <a href={validUrl} target="_blank" rel="noopener noreferrer" className="rounded-md p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600" title="Xem tài liệu">
                          <Eye className="w-4 h-4" />
                        </a>
                        <button onClick={() => { setEditingId(item.id); setIsModalOpen(true); }} className="rounded-md p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600" title="Chỉnh sửa">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setResourceToDelete(item.id); setIsDeleteModalOpen(true); }} className="rounded-md p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Xóa tài liệu">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center font-medium text-slate-500">
                    Không tìm thấy tài liệu nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredResources.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 sm:flex-row">
            <p className="text-xs font-medium text-slate-500">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredResources.length)} của {filteredResources.length} tài liệu
            </p>
            <div className="flex gap-1.5">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${currentPage === idx + 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingResource}
        onSubmit={handleSubmitResource}
        courses={courses}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xóa tài nguyên"
        message="Bạn có chắc chắn muốn xóa tài nguyên học tập này không? Hành động này không thể hoàn tác."
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
