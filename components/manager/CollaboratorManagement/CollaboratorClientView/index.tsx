// src/components/manager/CollaboratorManagement/CollaboratorClientView/index.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Users, QrCode, Banknote, Wallet, Filter, 
  Download, Eye, Edit, Ban, CheckCircle, 
  Info, PlusCircle, LayoutGrid, Trash2
} from 'lucide-react';
import { Collaborator, CollaboratorStats, RegionalDistribution } from '@/types/collaborator';
import CollaboratorModal, { CollabFormData } from '@/components/manager/Modals/CollaboratorModal';
import ConfirmModal from '@/components/ui/confirm-modal'; // Đường dẫn tới ConfirmModal bạn vừa gửi

interface Props {
  initialData: Collaborator[];
  stats: CollaboratorStats;
  regions: RegionalDistribution[];
}

export default function CollaboratorClientView({ initialData, stats, regions }: Props) {
  // --- STATES DỮ LIỆU ---
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // --- STATES MODALS ---
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState<Collaborator | null>(null);

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    return collaborators.filter(item => {
      const matchesSearch = item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [collaborators, searchQuery, statusFilter]);

  // --- HANDLERS: CREATE / EDIT ---
  const handleOpenCreate = () => {
    setSelectedCollab(null);
    setIsCollabModalOpen(true);
  };

  const handleOpenEdit = (collab: Collaborator) => {
    setSelectedCollab(collab);
    setIsCollabModalOpen(true);
  };

  const handleSubmitCollab = (formData: CollabFormData) => {
    if (selectedCollab) {
      // Logic Update
      setCollaborators(prev => prev.map(item => 
        item.id === selectedCollab.id ? { ...item, ...formData } : item
      ));
    } else {
      // Logic Create (Fake ID và initials)
      const newId = Date.now().toString();
      const newCollab: Collaborator = {
        ...formData,
        id: newId,
        code: `CTV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        registrationCount: 0,
        pendingCommission: 0,
        initials: formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      };
      setCollaborators(prev => [newCollab, ...prev]);
    }
    setIsCollabModalOpen(false);
  };

  // --- HANDLERS: DELETE ---
  const handleOpenDelete = (collab: Collaborator) => {
    setSelectedCollab(collab);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCollab) {
      setCollaborators(prev => prev.filter(item => item.id !== selectedCollab.id));
      setIsDeleteModalOpen(false);
      setSelectedCollab(null);
    }
  };

  // --- HANDLERS: STATUS ---
  const handleToggleStatus = (id: string) => {
    setCollaborators(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : item
    ));
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' đ';

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-black text-slate-900 tracking-tighter leading-tight">Quản lý Cộng tác viên</h1>
          <p className="text-slate-500 mt-1">Mạng lưới cộng tác viên và hiệu suất tuyển sinh.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 group active:scale-95"
        >
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Thêm Cộng tác viên mới
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users />} label="Total Collaborators" value={stats.total} growth={stats.growth} color="blue" />
        <StatCard icon={<QrCode />} label="Active Referral Codes" value={stats.activeCodes} status="Active" color="purple" />
        <StatCard icon={<Banknote />} label="Pending Commissions" value={`${stats.pendingCommissionTotal} VND`} status="Processing" color="amber" />
        <StatCard icon={<Wallet />} label="Total Payouts" value={`${stats.totalPayouts} VND`} status="This Year" color="emerald" />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-72 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="Tìm theo tên hoặc mã..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="bg-white border border-slate-200 rounded-lg text-sm py-2 px-3 outline-none focus:ring-2 focus:ring-blue-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Lọc nâng cao
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
              <Download className="w-4 h-4" /> Xuất Excel
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Cộng tác viên</th>
                <th className="px-6 py-4">Liên hệ</th>
                <th className="px-6 py-4">Mã giới thiệu</th>
                <th className="px-6 py-4 text-center">Lượt ĐK</th>
                <th className="px-6 py-4 text-right">Hoa hồng treo</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.fullName}</p>
                        <p className="text-[11px] text-slate-500">ID: {item.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{item.email}</p>
                    <p className="text-xs text-slate-400">{item.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-600 font-mono font-bold text-xs px-2.5 py-1 rounded border border-blue-100">
                      {item.referralCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    {item.registrationCount}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                    {formatCurrency(item.pendingCommission)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Chỉnh sửa"><Edit className="w-4 h-4" /></button>
                      <button 
                        onClick={() => handleToggleStatus(item.id)}
                        className={`p-1.5 rounded transition-colors ${item.status === 'ACTIVE' ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        title={item.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        {item.status === 'ACTIVE' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      {/* NÚT DELETE THÊM MỚI */}
                      <button 
                        onClick={() => handleOpenDelete(item)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ... Widgets Section (Giữ nguyên phần Biểu đồ khu vực và Ghi chú bên dưới) ... */}

      {/* --- MODALS --- */}
      <CollaboratorModal 
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        initialData={selectedCollab}
        onSubmit={handleSubmitCollab}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa cộng tác viên "${selectedCollab?.fullName}" không? Hành động này không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}

// StatCard helper component (Đã sửa lỗi TypeScript theo rule trước đó)
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  growth?: string;
  status?: string;
  color: 'blue' | 'purple' | 'amber' | 'emerald';
}

function StatCard({ icon, label, value, growth, status, color }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{className: string}>, { className: 'w-5 h-5' }) : icon}
        </div>
        {growth && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{growth}</span>}
        {status && <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-full">{status}</span>}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
    </div>
  );
}