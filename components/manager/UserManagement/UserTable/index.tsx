"use client";

import React from "react";
import { UserProfile } from "@/services/userService";
import { Loader2, Mail, Phone, Calendar, UserCog, ToggleLeft, ToggleRight, Trash2, Ban } from "lucide-react";

interface UserTableProps {
  data: UserProfile[];
  loading: boolean;
  onEditRole: (user: UserProfile) => void;
  onToggleStatus: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
  // Pagination (passed from parent)
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "N/A";
  }
};

const ROLE_DISPLAY: Record<string, { label: string; color: string }> = {
  Admin: { label: "Admin", color: "bg-red-100 text-red-700" },
  TrainingManager: { label: "Quản lý Đào tạo", color: "bg-blue-100 text-blue-700" },
  EnrollmentManager: { label: "Quản lý Tuyển sinh", color: "bg-purple-100 text-purple-700" },
  Instructor: { label: "Giáo viên", color: "bg-emerald-100 text-emerald-700" },
  Collaborator: { label: "Cộng tác viên", color: "bg-orange-100 text-orange-700" },
  Student: { label: "Học viên", color: "bg-slate-100 text-slate-700" },
};

export default function UserTable({
  data,
  loading,
  onEditRole,
  onToggleStatus,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-sm font-medium">Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-20 text-center text-slate-500">
        <p className="text-sm">Không tìm thấy người dùng phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider w-12">STT</th>
            <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider">Người dùng</th>
            <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider">Liên hệ</th>
            <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider">Vai trò</th>
            <th className="px-6 py-4 text-[11px) font-black uppercase text-slate-500 tracking-wider">Trạng thái</th>
            <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider text-right">Tùy chọn</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((user, idx) => {
            const roleKey = user.roles?.[0] || user.roleName || "Student";
            const roleInfo = ROLE_DISPLAY[roleKey] || ROLE_DISPLAY.Student;
            const serialNumber = (currentPage - 1) * 8 + idx + 1; // Assuming items_per_page = 8

            return (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-xs font-bold text-slate-400">{serialNumber}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-black text-slate-400 text-sm">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        user.fullName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-tight">{user.fullName}</p>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-tighter">
                        <Calendar className="w-3 h-3" />
                        Hoạt động lần cuối: {user.lastLoginAt ? formatDate(user.lastLoginAt) : "N/A"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => onToggleStatus(user)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase transition-all ${
                      user.isActive 
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                        : "bg-red-50 text-red-500 hover:bg-red-100"
                    }`}
                  >
                    {user.isActive ? (
                        <>
                            <ToggleRight className="w-4 h-4" />
                            Đang hoạt động
                        </>
                    ) : (
                        <>
                            <ToggleLeft className="w-4 h-4" />
                            Đang bị khóa
                        </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEditRole(user)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Sửa vai trò"
                    >
                      <UserCog className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(user)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Xóa người dùng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Fixes needed if many items, but for now matching the Center UI style */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30">
        <p className="text-xs font-bold text-slate-400 uppercase">
          Trang {currentPage} / {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white disabled:opacity-40 hover:bg-slate-50"
          >
            Trước
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white disabled:opacity-40 hover:bg-slate-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
