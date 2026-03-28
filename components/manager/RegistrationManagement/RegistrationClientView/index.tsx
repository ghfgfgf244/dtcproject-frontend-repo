// src/app/(manager)/training-manager/registrations/_components/RegistrationClientView/index.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Download, CheckCircle2, Info, Verified, History } from 'lucide-react';
import { RegistrationRecord } from '@/types/registration';
import RegistrationTable from '../RegistrationTable';

interface Props {
  initialData: RegistrationRecord[];
}

const ITEMS_PER_PAGE = 10;

export default function RegistrationClientView({ initialData }: Props) {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(initialData);
  
  // 1. FILTER STATES
  const [courseFilter, setCourseFilter] = useState('Tất cả khóa học');
  const [batchFilter, setBatchFilter] = useState('Tất cả đợt thi');
  const [statusFilter, setStatusFilter] = useState('Đang chờ duyệt');
  const [currentPage, setCurrentPage] = useState(1);

  // 2. EXTRACT DYNAMIC OPTIONS (Tự động lấy danh sách Khóa/Đợt không trùng lặp từ data)
  const uniqueCourses = useMemo(() => {
    const courses = registrations.map(reg => reg.course);
    return Array.from(new Set(courses));
  }, [registrations]);

  const uniqueBatches = useMemo(() => {
    // Nếu có chọn khóa học, chỉ lấy đợt thi của khóa học đó. Nếu không, lấy tất cả.
    const relevantRegs = courseFilter === 'Tất cả khóa học' 
      ? registrations 
      : registrations.filter(reg => reg.course === courseFilter);
    const batches = relevantRegs.map(reg => reg.examBatch);
    return Array.from(new Set(batches));
  }, [registrations, courseFilter]);

  // 3. LOGIC LỌC DỮ LIỆU ĐA CHIỀU
  const filteredData = useMemo(() => {
    return registrations.filter(reg => {
      const matchCourse = courseFilter === 'Tất cả khóa học' || reg.course === courseFilter;
      const matchBatch = batchFilter === 'Tất cả đợt thi' || reg.examBatch === batchFilter;
      const matchStatus = statusFilter === 'Tất cả trạng thái' || reg.approvalStatus === statusFilter;
      
      return matchCourse && matchBatch && matchStatus;
    });
  }, [registrations, courseFilter, batchFilter, statusFilter]);

  // 4. LOGIC PHÂN TRANG
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  
  // Thống kê đơn chờ (Dựa trên data đã filter)
  const pendingCount = filteredData.filter(r => r.approvalStatus === 'Đang chờ duyệt').length;

  // --- HANDLERS DUYỆT / TỪ CHỐI ---
  const handleApprove = (id: string) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id ? { ...reg, approvalStatus: 'Đã duyệt' } : reg
    ));
  };

  const handleReject = (id: string) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id ? { ...reg, approvalStatus: 'Bị từ chối' } : reg
    ));
  };

  const handleApproveAll = () => {
    if (confirm("Bạn có chắc chắn muốn duyệt hàng loạt tất cả các hồ sơ hợp lệ đang chờ trong danh sách lọc này?")) {
      // Chỉ duyệt những hồ sơ NẰM TRONG DANH SÁCH LỌC (filteredData) để an toàn
      const eligibleIdsToApprove = filteredData
        .filter(reg => reg.approvalStatus === 'Đang chờ duyệt' && reg.paymentStatus === 'Đã đóng' && reg.conditionStatus === 'Đủ giờ học')
        .map(reg => reg.id);

      setRegistrations(prev => prev.map(reg => 
        eligibleIdsToApprove.includes(reg.id)
          ? { ...reg, approvalStatus: 'Đã duyệt' }
          : reg
      ));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-black tracking-tight text-slate-900 leading-none">Duyệt Đăng ký Thi</h1>
          <p className="text-sm text-slate-500 mt-2">Kiểm tra điều kiện và duyệt danh sách học viên tham gia các đợt thi.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all active:scale-95">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </button>
          <button 
            onClick={handleApproveAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Duyệt hàng loạt
          </button>
        </div>
      </div>

      {/* Filters (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Khóa học Dropdown */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-blue-600">Khóa học</label>
          <select 
            value={courseFilter}
            onChange={(e) => { 
              setCourseFilter(e.target.value); 
              setBatchFilter('Tất cả đợt thi'); // Reset batch khi đổi course
              setCurrentPage(1); 
            }}
            className="bg-transparent border-none p-0 text-sm font-bold text-slate-800 focus:ring-0 cursor-pointer outline-none"
          >
            <option value="Tất cả khóa học">Tất cả khóa học</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        {/* Đợt thi Dropdown */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Đợt thi</label>
          <select 
            value={batchFilter}
            onChange={(e) => { setBatchFilter(e.target.value); setCurrentPage(1); }}
            className="bg-transparent border-none p-0 text-sm font-bold text-slate-800 focus:ring-0 cursor-pointer outline-none"
          >
            <option value="Tất cả đợt thi">Tất cả đợt thi</option>
            {uniqueBatches.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>

        {/* Trạng thái Dropdown */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Trạng thái duyệt</label>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-transparent border-none p-0 text-sm font-bold text-slate-800 focus:ring-0 cursor-pointer outline-none"
          >
            <option value="Tất cả trạng thái">Tất cả trạng thái</option>
            <option value="Đang chờ duyệt">Đang chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Bị từ chối">Bị từ chối</option>
          </select>
        </div>

        {/* Cột Thống kê */}
        <div className="bg-slate-900 p-4 rounded-xl flex flex-col justify-center items-center text-white shadow-md">
          <span className="text-[24px] font-black leading-none">{pendingCount}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Đơn chờ duyệt</span>
        </div>
      </div>

      {/* Table */}
      <RegistrationTable 
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Rules Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Quy tắc duyệt</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">Học viên chỉ đủ điều kiện thi khi hoàn thành 100% số giờ học lý thuyết và thực hành, đồng thời hoàn tất nghĩa vụ học phí.</p>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Verified className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Duyệt tự động</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">Sử dụng nút &quot;Duyệt hàng loạt&quot; để hệ thống tự động duyệt toàn bộ các hồ sơ hợp lệ đang chờ trong danh sách hiện tại.</p>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Lịch sử thao tác</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">Mọi thay đổi trạng thái đăng ký đều được lưu vết trong nhật ký hệ thống để phục vụ công tác hậu kiểm.</p>
        </div>
      </div>
    </div>
  );
}