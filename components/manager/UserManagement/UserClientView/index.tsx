"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Filter, Loader2, X, ShieldAlert, CheckCircle2, UserCog, Ban, Trash2 } from "lucide-react";
import { userService, UserProfile, UserStats as UserStatsType } from "@/services/userService";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import toast from "react-hot-toast";
import UserStats from "../UserStats";
import UserTable from "../UserTable";

const ITEMS_PER_PAGE = 8;

const ROLE_OPTIONS = [
  { id: 0, label: "Tất cả chức vụ", key: "" },
  { id: 1, label: "Admin", key: "Admin" },
  { id: 2, label: "QL Đào tạo", key: "TrainingManager" },
  { id: 4, label: "QL Tuyển sinh", key: "EnrollmentManager" },
  { id: 3, label: "Giáo viên", key: "Instructor" },
  { id: 5, label: "Cộng tác viên", key: "Collaborator" },
  { id: 6, label: "Học viên", key: "Student" },
];

export default function UserClientView() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UserStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [editTarget, setEditTarget] = useState<UserProfile | null>(null);
  const [draftRole, setDraftRole] = useState<number>(6);
  const [toggleTarget, setToggleTarget] = useState<UserProfile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);

      // Calculate stats on FE (Matching Center logic)
      const calculatedStats: UserStatsType = {
        totalUsers: allUsers.length,
        staffCount: allUsers.filter(u => 
          (u.roles?.includes("TrainingManager") || u.roleName === "TrainingManager") ||
          (u.roles?.includes("EnrollmentManager") || u.roleName === "EnrollmentManager")
        ).length,
        instructorCount: allUsers.filter(u => 
          u.roles?.includes("Instructor") || u.roleName === "Instructor"
        ).length,
        collaboratorCount: allUsers.filter(u => 
          u.roles?.includes("Collaborator") || u.roleName === "Collaborator"
        ).length,
        studentCount: allUsers.filter(u => 
          u.roles?.includes("Student") || u.roleName === "Student"
        ).length,
      };
      
      setStats(calculatedStats);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { loadData(); }, [loadData]);

  // Combined filtering
  const filtered = useMemo(() => {
    let result = users;
    
    // By Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.fullName.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    
    // By Role
    if (roleFilter) {
      result = result.filter(u => {
        const role = u.roles?.[0] || u.roleName || "Student";
        return role === roleFilter;
      });
    }
    
    return result;
  }, [users, searchQuery, roleFilter]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Role Update Handler
  const handleUpdateRole = async () => {
    if (!editTarget) return;
    setActionLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      await userService.updateUserRoles(editTarget.id, [draftRole]);
      toast.success("Cập nhật vai trò thành công!");
      await loadData();
      setEditTarget(null);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Lỗi cập nhật vai trò.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Status Toggle Handler
  const handleToggleStatus = async () => {
    if (!toggleTarget) return;
    setActionLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      await userService.toggleUserStatus(toggleTarget.id);
      const newStatus = !toggleTarget.isActive;
      setUsers(prev => prev.map(u => u.id === toggleTarget.id ? { ...u, isActive: newStatus } : u));
      toast.success(newStatus ? "Đã kích hoạt người dùng." : "Đã khóa người dùng.");
      setToggleTarget(null);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Thao tác trạng thái thất bại.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Handler
  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      await userService.deleteUser(deleteTarget.id);
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      toast.success("Xóa người dùng thành công.");
      setDeleteTarget(null);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Lỗi xóa người dùng.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-black tracking-tight text-slate-900 leading-none">
            Quản lý Người dùng
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Quản trị quyền hạn, trạng thái hoạt động và thông tin nhân sự toàn hệ thống.
          </p>
        </div>
      </div>

      {/* Stats */}
      <UserStats stats={stats} loading={loading} />

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/20">
          <div className="flex flex-col md:flex-row gap-3 flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Tìm tên, email, số điện thoại..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            {/* Role Select */}
            <div className="relative min-w-[180px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold text-slate-600 cursor-pointer"
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              >
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{totalItems} người dùng</p>
        </div>

        {/* User Table Component */}
        <UserTable 
          data={paginated}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEditRole={(u) => { setEditTarget(u); setDraftRole(ROLE_OPTIONS.find(o => o.key === (u.roles?.[0] || u.roleName))?.id || 6); }}
          onToggleStatus={(u) => setToggleTarget(u)}
          onDelete={(u) => setDeleteTarget(u)}
        />
      </div>

      {/* --- Modals --- */}
      
      {/* Edit Role Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
               <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                 <UserCog className="w-5 h-5 text-blue-600" />
                 Sửa vai trò
               </h3>
               <button onClick={() => setEditTarget(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4 text-center">
              <p className="text-sm text-slate-500">Thay đổi vai trò hệ thống cho <span className="font-black text-slate-900">{editTarget.fullName}</span></p>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                value={draftRole}
                onChange={(e) => setDraftRole(Number(e.target.value))}
              >
                {ROLE_OPTIONS.filter(o => o.key !== "").map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setEditTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 bg-white hover:bg-slate-100 transition-colors"
                disabled={actionLoading}
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdateRole}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                disabled={actionLoading}
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Status Modal */}
      {toggleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${toggleTarget.isActive ? "bg-red-100" : "bg-emerald-100"}`}>
              {toggleTarget.isActive ? <Ban className="w-8 h-8 text-red-500" /> : <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
            </div>
            <h4 className="font-black text-slate-900 text-lg mb-2">
              {toggleTarget.isActive ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
            </h4>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Xác nhận thay đổi trạng thái hoạt động cho <span className="font-black text-slate-900">{toggleTarget.fullName}</span>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setToggleTarget(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
              <button 
                onClick={handleToggleStatus}
                disabled={actionLoading}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 ${toggleTarget.isActive ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="font-black text-slate-900 text-lg mb-2">Xóa người dùng?</h4>
            <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
              Dữ liệu của <span className="font-black text-slate-900">{deleteTarget.fullName}</span> sẽ được chuyển vào thùng rác. Hành động này có thể hoàn tác bởi Admin.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
              <button 
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}