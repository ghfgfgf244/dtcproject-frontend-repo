// src/components/manager/RegistrationManagement/RegistrationClientView/index.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, ListFilter, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Registration, RegistrationStats, RecentActivity, LicenseType } from '@/types/course-registration';

interface Props {
  initialRegistrations: Registration[];
  stats: RegistrationStats;
  recentActivities: RecentActivity[];
}

export default function RegistrationClientView({ initialRegistrations, stats, recentActivities }: Props) {
  // --- STATES ---
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [filterLicense, setFilterLicense] = useState<LicenseType>('ALL');
  const [filterStatus, setFilterStatus] = useState('PENDING'); // Mặc định hiển thị chờ duyệt
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- LOGIC: LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    return registrations.filter(reg => {
      // 1. Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!reg.fullName.toLowerCase().includes(q) && !reg.studentId.toLowerCase().includes(q)) return false;
      }
      // 2. Filter Course
      if (filterCourse !== 'ALL' && reg.courseName !== filterCourse) return false;
      // 3. Filter License
      if (filterLicense !== 'ALL' && reg.licenseType !== filterLicense) return false;
      // 4. Filter Status
      if (filterStatus !== 'ALL' && reg.approvalStatus !== filterStatus) return false;
      
      return true;
    });
  }, [registrations, searchQuery, filterCourse, filterLicense, filterStatus]);

  // --- LOGIC: PHÂN TRANG ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // --- HANDLERS: ACTION ---
  const handleApprove = (id: string) => {
    if(confirm('Bạn xác nhận duyệt hồ sơ này?')) {
      setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, approvalStatus: 'APPROVED' } : reg));
    }
  };

  const handleReject = (id: string) => {
    if(confirm('Bạn xác nhận TỪ CHỐI hồ sơ này?')) {
      setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, approvalStatus: 'REJECTED' } : reg));
    }
  };

  // --- HELPERS ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getThemeClass = (theme: string) => {
    switch (theme) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'emerald': return 'bg-emerald-100 text-emerald-600';
      case 'amber': return 'bg-amber-100 text-amber-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="pb-12">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-[30px] font-black tracking-tighter text-slate-900 mb-2 uppercase">Duyệt Đăng ký Khóa học</h1>
        <p className="text-slate-600 text-sm">Hệ thống xét duyệt hồ sơ học viên đăng ký lái xe tự động và thủ công.</p>
      </header>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng đơn đăng ký mới</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-black text-slate-900">{stats.totalNew.toLocaleString('en-US')}</h3>
              <span className="text-emerald-600 text-xs font-bold flex items-center mb-1">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> {stats.newGrowth}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Cập nhật 5 phút trước</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Đang chờ duyệt</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-black text-amber-600">{stats.pendingCount}</h3>
              <span className="text-amber-600 text-xs font-bold mb-1">{stats.pendingLabel}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Yêu cầu xử lý trong 24h</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tỷ lệ duyệt tháng này</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-black text-indigo-600">{stats.approvalRate}%</h3>
              <span className="text-slate-400 text-xs font-bold mb-1">Mục tiêu: {stats.approvalTarget}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${stats.approvalRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Section */}
      <div className="bg-slate-50/80 p-4 rounded-xl mb-6 border border-slate-200 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="Tìm theo tên hoặc mã học viên..." 
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase px-2 hidden sm:block">Khóa học</span>
          <select 
            value={filterCourse} onChange={(e) => { setFilterCourse(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả khóa học</option>
            <option value="Khóa cấp tốc">Cấp tốc</option>
            <option value="Khóa tiêu chuẩn">Tiêu chuẩn</option>
            <option value="Nâng hạng bằng">Nâng hạng</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase px-2 hidden sm:block">Hạng bằng</span>
          <div className="flex p-1 bg-slate-200/50 rounded-lg border border-slate-200">
            {(['ALL', 'B1', 'B2', 'C'] as LicenseType[]).map(type => (
              <button 
                key={type}
                onClick={() => { setFilterLicense(type); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filterLicense === type ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {type === 'ALL' ? 'Tất cả' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase px-2 hidden sm:block">Trạng thái</span>
          <select 
            value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
          </select>
        </div>

        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all ml-auto active:scale-95">
          <ListFilter className="w-4 h-4" /> Lọc dữ liệu
        </button>
      </div>

      {/* Registration List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Học viên</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Khóa học & Hạng</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Ngày đăng ký</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Học phí</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Thanh toán</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length > 0 ? currentData.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${getThemeClass(reg.theme)}`}>
                        {reg.avatarInitials}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{reg.fullName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">ID: {reg.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">{reg.courseName}</div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 mt-1 uppercase border border-blue-100">
                      Hạng {reg.licenseType}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 font-medium">{reg.registrationDate}</div>
                    <div className="text-[11px] text-slate-400 italic mt-0.5">{reg.registrationTime}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{formatCurrency(reg.tuitionFee)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {reg.paymentStatus === 'PAID' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đã thanh toán
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Chờ thanh toán
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Xem chi tiết">
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {reg.approvalStatus === 'PENDING' ? (
                        <>
                          <button onClick={() => handleApprove(reg.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Duyệt hồ sơ">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleReject(reg.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Từ chối">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${reg.approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {reg.approvalStatus === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Không tìm thấy hồ sơ đăng ký nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-medium">
              Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} của {filteredData.length} đơn đăng ký
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button 
                  key={idx} onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-bold transition-all ${currentPage === idx + 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Summary (Bento Sub-element) */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-600 rounded-xl p-8 text-white flex flex-col justify-center relative overflow-hidden shadow-lg shadow-blue-600/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-2">Thông báo quan trọng</h4>
            <p className="text-blue-100 text-sm mb-6 max-w-md leading-relaxed">Có 12 hồ sơ đăng ký hạng bằng C sắp hết hạn thời gian giữ chỗ ưu tiên. Vui lòng kiểm tra và phản hồi học viên sớm nhất có thể.</p>
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg text-sm font-black shadow-lg hover:shadow-xl hover:bg-slate-50 active:scale-95 transition-all w-fit">
              Xem hồ sơ ưu tiên
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-black text-slate-900 uppercase">Hoạt động xét duyệt gần đây</h4>
            <span className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer uppercase tracking-tight transition-colors">Tất cả nhật ký</span>
          </div>
          <div className="space-y-5">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-4">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${act.type === 'approve' ? 'bg-emerald-500' : act.type === 'reject' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                <div>
                  <p className="text-sm text-slate-800 leading-snug">
                    <span className="font-bold">{act.actor}</span> {act.action} {act.target && <span className="font-bold">{act.target}</span>} {act.detail && <span>{act.detail}</span>}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">{act.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

    </div>
  );
}