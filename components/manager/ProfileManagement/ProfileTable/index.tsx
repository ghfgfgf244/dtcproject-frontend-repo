// src/app/(manager)/enrollment-manager/profiles/_components/ProfileTable/index.tsx
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react'; // Đổi icon import
import { StudentProfile, CollaboratorProfile } from '@/types/profile';

interface Props {
  type: 'student' | 'collaborator';
  data: (StudentProfile | CollaboratorProfile)[];
  // Thêm các Props sự kiện để component cha xử lý
  onView: (item: StudentProfile | CollaboratorProfile) => void;
  onEdit: (item: StudentProfile | CollaboratorProfile) => void;
  onDelete: (item: StudentProfile | CollaboratorProfile) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function ProfileTable({ type, data, onView, onEdit, onDelete }: Props) {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Đang học': case 'Hoạt động': return 'bg-emerald-100 text-emerald-700';
      case 'Chờ duyệt': return 'bg-amber-100 text-amber-700';
      case 'Đã tốt nghiệp': case 'Ngừng hoạt động': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">ID</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Họ và tên</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Liên hệ</th>
            
            {type === 'student' ? (
              <>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Khóa học</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Ngày ĐK</th>
              </>
            ) : (
              <>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Đã giới thiệu</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Hoa hồng (VNĐ)</th>
              </>
            )}

            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Trạng thái</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
              <td className="px-6 py-4 text-xs font-bold text-slate-400">#{item.code}</td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs mr-3 ${type === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    {getInitials(item.fullName)}
                  </div>
                  <div className="text-sm font-bold text-slate-900">{item.fullName}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-slate-600">{item.email}</div>
                <div className="text-[10px] text-slate-400">{item.phone}</div>
              </td>

              {type === 'student' ? (
                <>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{(item as StudentProfile).course}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{(item as StudentProfile).registrationDate}</td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 text-sm text-slate-700 font-bold">{(item as CollaboratorProfile).totalReferred} HV</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-bold">{formatCurrency((item as CollaboratorProfile).commission)}</td>
                </>
              )}

              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                  {item.status}
                </span>
              </td>
              
              {/* KHU VỰC 3 NÚT THAO TÁC */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onView(item)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors rounded hover:bg-emerald-50" 
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50" 
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(item)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50" 
                    title="Xóa hồ sơ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500 font-medium">
                Không tìm thấy hồ sơ nào khớp với bộ lọc.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}