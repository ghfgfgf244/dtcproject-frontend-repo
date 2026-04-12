// src/components/manager/CourseRegistrationClientView/index.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, TrendingUp, ListFilter, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { RegistrationRecord, EXAM_LEVEL_LABELS } from '@/types/registration';
import { registrationService } from '@/services/registrationService';
import RegistrationDetailModal from './RegistrationDetailModal';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/nextjs';
import { setAuthToken } from '@/lib/api';
import { EXAM_LEVEL_OPTIONS } from '@/constants/exam-levels';

export default function RegistrationClientView() {
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();

  // --- STATES ---
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [stats, setStats] = useState({ newRegistrationsThisMonth: 0, pendingRegistrations: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLicense, setFilterLicense] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('Pending'); // Default to Pending
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FETCH DATA ---
  const fetchData = async () => {
    if (!authLoaded || !isSignedIn) return;
    
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      const [data, statsData] = await Promise.all([
        registrationService.getAllCourseRegistrations(),
        registrationService.getRegistrationStats()
      ]);
      setRegistrations(data);
      setStats(statsData);
    } catch (error) {
      toast.error("Không thể tải dữ liệu đăng ký");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      fetchData();
    }
  }, [authLoaded, isSignedIn]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // --- LOGIC: FILTERING ---
  const filteredData = useMemo(() => {
    return registrations.filter(reg => {
      // 1. Search (Name, Email, Phone, or ID)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = 
          reg.studentName.toLowerCase().includes(q) || 
          reg.studentId.toLowerCase().includes(q) ||
          reg.email.toLowerCase().includes(q) ||
          reg.phone.includes(q);
        if (!match) return false;
      }
      
      // 2. Filter License Type
      if (filterLicense !== 'ALL' && reg.licenseType !== filterLicense) return false;
      
      // 3. Filter Status
      if (filterStatus !== 'ALL' && reg.status !== filterStatus) return false;
      
      return true;
    });
  }, [registrations, searchQuery, filterLicense, filterStatus]);

  // --- LOGIC: PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // --- HANDLERS ---
  const handleApprove = async (id: string) => {
    if(!confirm('Bạn xác nhận duyệt hồ sơ này?')) return;
    
    try {
      await registrationService.updateCourseStatus(id, 'Approved');
      toast.success("Đã duyệt hồ sơ");
      fetchData(); // Refresh
    } catch (error) {
      toast.error("Lỗi khi duyệt hồ sơ");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Lý do từ chối hồ sơ:');
    if (reason === null) return;
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    
    try {
      await registrationService.updateCourseStatus(id, 'Rejected', reason);
      toast.success("Đã từ chối hồ sơ");
      fetchData(); // Refresh
    } catch (error) {
      toast.error("Lỗi khi từ chối hồ sơ");
    }
  };

  const openDetail = (reg: RegistrationRecord) => {
    setSelectedReg(reg);
    setIsModalOpen(true);
  };

  // --- HELPERS ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading && !refreshing) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-black tracking-tighter text-slate-900 mb-1 uppercase">Hồ sơ Đăng ký</h1>
          <p className="text-slate-600 text-sm">Quản lý và xét duyệt hồ sơ học viên đăng ký khóa học lái xe.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          title="Tải lại dữ liệu"
        >
          <RefreshCw className={`w-5 h-5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-center md:text-left">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đăng ký mới tháng này</p>
            <h3 className="text-4xl font-black text-slate-900">{stats.newRegistrationsThisMonth}</h3>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">Tổng số hồ sơ tiếp nhận tính từ đầu tháng</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="relative z-10 text-amber-600">
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Hồ sơ chờ duyệt</p>
            <h3 className="text-4xl font-black">{stats.pendingRegistrations}</h3>
            <p className="text-[11px] text-amber-500 mt-2 font-medium">Cần xử lý trong ngày hôm nay</p>
          </div>
        </div>
      </div>

      {/* Unified Filters Section */}
      <div className="bg-slate-50/80 p-4 rounded-2xl mb-8 border border-slate-200 flex flex-wrap items-center gap-5">
        {/* Search */}
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
            placeholder="Tìm theo tên, email, SĐT hoặc ID..." 
          />
        </div>
        
        {/* License Filter */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">Hạng bằng</span>
          <div className="flex p-1 bg-slate-200/50 rounded-xl border border-slate-200">
            {['ALL', ...EXAM_LEVEL_OPTIONS.map((item) => item.label)].map(type => (
              <button 
                key={type}
                onClick={() => { setFilterLicense(type); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${filterLicense === type ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {type === 'ALL' ? 'Tất cả' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">Trạng thái</span>
          <select 
            value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-sm min-w-[160px]"
          >
            <option value="ALL">Tất cả</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Rejected">Từ chối</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Registration List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Học viên / Liên hệ</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Khóa học & Hạng</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Ngày đăng ký</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Học phí</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length > 0 ? currentData.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`h-11 w-11 rounded-full flex items-center justify-center font-black text-xs shadow-sm ${reg.avatarColor}`}>
                        {reg.avatarInitials}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{reg.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-bold mt-0.5">{reg.phone} • {reg.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-700">{reg.courseName}</div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-600 mt-1.5 uppercase border border-blue-100">
                      Hạng {reg.licenseType}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-slate-600 font-bold">{reg.registrationDate}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-1">ID: {reg.studentId}</div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="text-sm font-black text-slate-900">{formatCurrency(reg.totalFee ?? 0)}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openDetail(reg)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100" 
                        title="Xem chi tiết hồ sơ"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {reg.status === 'Pending' ? (
                        <>
                          <button onClick={() => handleApprove(reg.id)} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100" title="Duyệt hồ sơ">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleReject(reg.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100" title="Từ chối hồ sơ">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-tight ${
                          reg.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          reg.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {reg.status === 'Approved' ? 'Đã duyệt' : reg.status === 'Rejected' ? 'Đã từ chối' : 'Đã hủy'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ListFilter className="w-12 h-12 text-slate-200" />
                      <p className="text-slate-400 font-bold">Không tìm thấy hồ sơ nào phù hợp.</p>
                      <button onClick={() => {setSearchQuery(''); setFilterLicense('ALL'); setFilterStatus('ALL');}} className="text-blue-600 text-xs font-black hover:underline underline-offset-4">Xóa tất cả bộ lọc</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        {filteredData.length > itemsPerPage && (
          <div className="px-6 py-5 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">
              Hiển thị hồ sơ {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} / {filteredData.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1} 
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                      currentPage === idx + 1 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-600/20' 
                        : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages} 
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <RegistrationDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        registration={selectedReg}
      />
    </div>
  );
}
