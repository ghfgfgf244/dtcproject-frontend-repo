// src/app/(manager)/enrollment-manager/posts/_components/PostTable/index.tsx
import React from 'react';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PostRecord } from '@/types/post';

interface Props {
  data: PostRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onView: (post: PostRecord) => void;
  onEdit: (post: PostRecord) => void;
  onDelete: (post: PostRecord) => void;
}

export default function PostTable({ data, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onView, onEdit, onDelete }: Props) {
  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case 'Hạng B1': return 'bg-rose-100 text-rose-700';
      case 'Hạng B2': return 'bg-blue-100 text-blue-700';
      case 'Hạng C': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Đang hiển thị': return 'bg-emerald-100 text-emerald-700 marker:bg-emerald-500';
      case 'Bản nháp': return 'bg-slate-100 text-slate-600 marker:bg-slate-400';
      case 'Đã ẩn': return 'bg-red-100 text-red-700 marker:bg-red-500';
      default: return 'bg-slate-100 text-slate-600 marker:bg-slate-400';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Tiêu đề bài đăng</th>
            <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Khóa học</th>
            <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Ngày đăng</th>
            <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Lượt xem</th>
            <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Đăng ký</th>
            <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Trạng thái</th>
            <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((post) => {
            const statusConfig = getStatusStyle(post.status);
            const [statusBg, statusText, marker] = statusConfig.split(' ');

            return (
              <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none mb-1">{post.title}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Mã: {post.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getCategoryStyle(post.category)}`}>
                    {post.category}
                  </span>
                </td>
                {/* Format yyyy-mm-dd to dd/mm/yyyy */}
                <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">{post.publishedDate.split('-').reverse().join('/')}</td>
                <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">{new Intl.NumberFormat('vi-VN').format(post.views)}</td>
                <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">{new Intl.NumberFormat('vi-VN').format(post.registrations)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusBg} ${statusText}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${marker.replace('marker:', '')}`}></span>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(post)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50" title="Xem trước">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(post)} className="p-2 text-slate-400 hover:text-amber-600 transition-colors rounded hover:bg-amber-50" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(post)} className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {data.length === 0 && (
            <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">Không tìm thấy bài đăng nào khớp với bộ lọc.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
        <p className="text-xs font-medium text-slate-500">
          Hiển thị <span className="text-slate-900 font-bold">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}</span> trong <span className="text-slate-900 font-bold">{totalItems}</span> bài đăng
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
            className="p-1.5 border border-slate-200 rounded-lg text-slate-400 disabled:opacity-50 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md bg-blue-600 text-white text-xs font-bold">{currentPage}</button>
            {/* Logic render số trang có thể làm phức tạp hơn sau */}
          </div>
          <button 
            onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages || totalPages === 0}
            className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}