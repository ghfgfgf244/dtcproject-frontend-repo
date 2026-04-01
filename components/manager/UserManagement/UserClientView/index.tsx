// src/components/manager/UserManagement/UserClientView/index.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Upload, UserPlus, Eye, Edit, Ban, CheckCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ManagedUser, UserRole, Instructor, Student, UserStatus } from '@/types/user-management';
import UserModal, { UserFormData } from '@/components/manager/Modals/UserModal';
import ConfirmModal from '@/components/ui/confirm-modal';

interface Props {
  initialUsers: ManagedUser[];
}

export default function UserClientView({ initialUsers }: Props) {
  // --- STATES CHÍNH ---
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<UserRole>('STUDENT');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- BỘ LỌC (FILTER) ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [filterCourse, setFilterCourse] = useState<string>('ALL');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('ALL');

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // --- TRÍCH XUẤT SELECT DATA ---
  const uniqueCourses = useMemo(() => Array.from(new Set(users.filter(u => u.role === 'STUDENT').map(s => (s as Student).enrolledCourse))), [users]);
  const uniqueSpecialties = useMemo(() => Array.from(new Set(users.filter(u => u.role === 'INSTRUCTOR').map(i => (i as Instructor).specialty))), [users]);

  // Lọc data truyền vào Modal Edit
  const editingUser = useMemo(() => {
    if (!editingId) return null;
    return users.find(u => u.id === editingId) || null;
  }, [editingId, users]);

  // --- LOGIC: FILTER & SEARCH ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (user.role !== activeTab) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!user.fullName.toLowerCase().includes(q) && !user.code.toLowerCase().includes(q) && !user.email.toLowerCase().includes(q)) return false;
      }
      if (filterStatus !== 'ALL' && user.status !== filterStatus) return false;
      if (activeTab === 'STUDENT' && filterCourse !== 'ALL' && (user as Student).enrolledCourse !== filterCourse) return false;
      if (activeTab === 'INSTRUCTOR' && filterSpecialty !== 'ALL' && (user as Instructor).specialty !== filterSpecialty) return false;
      return true;
    });
  }, [users, activeTab, searchQuery, filterStatus, filterCourse, filterSpecialty]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const activeFilterCount = (filterStatus !== 'ALL' ? 1 : 0) + (activeTab === 'STUDENT' && filterCourse !== 'ALL' ? 1 : 0) + (activeTab === 'INSTRUCTOR' && filterSpecialty !== 'ALL' ? 1 : 0);

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setSearchQuery('');
    setCurrentPage(1);
    setFilterStatus('ALL');
    setFilterCourse('ALL');
    setFilterSpecialty('ALL');
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilterStatus('ALL'); setFilterCourse('ALL'); setFilterSpecialty('ALL'); setCurrentPage(1);
  };

  // --- HANDLERS: ACTIONS ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleSubmitUser = (formData: UserFormData) => {
    // Generate Fake Initials "Nguyễn Văn An" -> "NA"
    const words = formData.fullName.trim().split(' ');
    const initials = words.length > 1 
      ? words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase()
      : formData.fullName.substring(0, 2).toUpperCase();

    if (editingId) {
      // CẬP NHẬT
      setUsers(prev => prev.map(u => 
        u.id === editingId ? { ...u, ...formData, avatarInitials: initials } as ManagedUser : u
      ));
    } else {
      // THÊM MỚI
      const prefix = formData.role === 'INSTRUCTOR' ? 'GV' : 'HV';
      const randomCode = `${prefix}-2024-${String(Math.floor(Math.random() * 900) + 100)}`;
      const themes: ('blue' | 'purple' | 'emerald' | 'orange' | 'slate')[] = ['blue', 'purple', 'emerald', 'orange', 'slate'];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];

      const newUser: ManagedUser = {
        id: `USR-${Date.now()}`,
        code: randomCode,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        avatarInitials: initials,
        theme: randomTheme,
        // Fake data mảng để không bị rỗng
        ...(formData.role === 'INSTRUCTOR' ? { specialty: 'Chuyên môn mới' } : { enrolledCourse: 'Khóa học mới' })
      } as ManagedUser;

      setUsers(prev => [newUser, ...prev]);
      
      // Nếu thêm user khác tab hiện tại thì chuyển tab sang để xem
      if (formData.role !== activeTab) setActiveTab(formData.role);
      setCurrentPage(1);
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete));
      const newTotalItems = filteredUsers.length - 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage) || 1;
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'emerald': return 'bg-emerald-100 text-emerald-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="pb-10">
      <div className="mb-8">
        <h2 className="text-[30px] font-black text-slate-900 tracking-tighter mb-2">Quản lý Người dùng</h2>
        <p className="text-sm text-slate-500">Xem và quản lý hồ sơ của tất cả học viên và giảng viên trong hệ thống.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button onClick={() => handleTabChange('STUDENT')} className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'STUDENT' ? 'text-blue-600 border-blue-600 bg-white' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>Học viên</button>
          <button onClick={() => handleTabChange('INSTRUCTOR')} className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'INSTRUCTOR' ? 'text-blue-600 border-blue-600 bg-white' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>Giảng viên</button>
        </div>

        {/* Action Bar */}
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1 min-w-0 md:min-w-[400px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder={`Tìm kiếm ${activeTab === 'STUDENT' ? 'học viên' : 'giảng viên'} theo tên, ID, email...`} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
            </div>
            
            <div className="relative">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors shrink-0 ${isFilterOpen || activeFilterCount > 0 ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <SlidersHorizontal className="w-4 h-4" /> Bộ lọc
                {activeFilterCount > 0 && <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-bold ml-1">{activeFilterCount}</span>}
              </button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                  <div className="absolute top-full right-0 md:left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-5 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900">Bộ lọc hiển thị</h4>
                      {activeFilterCount > 0 && <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline">Xóa lọc</button>}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Trạng thái</label>
                        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value as UserStatus); setCurrentPage(1); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                          <option value="ALL">Tất cả trạng thái</option><option value="ACTIVE">Đang hoạt động</option><option value="SUSPENDED">Tạm khóa</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{activeTab === 'INSTRUCTOR' ? 'Chuyên môn' : 'Khóa học'}</label>
                        {activeTab === 'INSTRUCTOR' ? (
                          <select value={filterSpecialty} onChange={(e) => { setFilterSpecialty(e.target.value); setCurrentPage(1); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                            <option value="ALL">Tất cả chuyên môn</option>{uniqueSpecialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                          </select>
                        ) : (
                          <select value={filterCourse} onChange={(e) => { setFilterCourse(e.target.value); setCurrentPage(1); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                            <option value="ALL">Tất cả khóa học</option>{uniqueCourses.map(course => <option key={course} value={course}>{course}</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Upload className="w-4 h-4" /> Nhập file
            </button>
            <button onClick={handleOpenAdd} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
              <UserPlus className="w-4 h-4" /> Thêm {activeTab === 'STUDENT' ? 'học viên' : 'giảng viên'}
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Họ tên</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Email & SĐT</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">{activeTab === 'INSTRUCTOR' ? 'Chuyên môn' : 'Khóa đang học'}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length > 0 ? currentData.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group bg-white">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${getThemeStyles(user.theme)}`}>{user.avatarInitials}</div>
                      <div className="font-bold text-slate-900 text-sm">{user.fullName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono font-medium">{user.code}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-900 font-medium">{user.email}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{user.role === 'INSTRUCTOR' ? (user as Instructor).specialty : (user as Student).enrolledCourse}</td>
                  <td className="px-6 py-4">
                    {user.status === 'ACTIVE' ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Đang hoạt động</span> : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">Tạm khóa</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Xem chi tiết"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenEdit(user.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Chỉnh sửa"><Edit className="w-4 h-4" /></button>
                      {user.status === 'ACTIVE' ? <button onClick={() => handleToggleStatus(user.id, user.status)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" title="Khóa tài khoản"><Ban className="w-4 h-4" /></button> : <button onClick={() => handleToggleStatus(user.id, user.status)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Mở khóa"><CheckCircle className="w-4 h-4" /></button>}
                      <button onClick={() => handleDeleteClick(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Xóa người dùng"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">Không tìm thấy {activeTab === 'STUDENT' ? 'học viên' : 'giảng viên'} nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <p className="text-xs font-medium text-slate-500">Hiển thị <span className="text-slate-900 font-bold">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> của <span className="text-slate-900 font-bold">{filteredUsers.length}</span> {activeTab === 'STUDENT' ? 'học viên' : 'giảng viên'}</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button key={idx} onClick={() => setCurrentPage(idx + 1)} className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-bold transition-colors ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{idx + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingUser}
        defaultRole={activeTab} // Truyền tab đang đứng
        onSubmit={handleSubmitUser}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa tài khoản"
        message="Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống không? Hành động này không thể hoàn tác và dữ liệu học tập/giảng dạy liên quan có thể bị ảnh hưởng."
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}