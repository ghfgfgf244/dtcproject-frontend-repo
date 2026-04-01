// src/app/(manager)/training-manager/registrations/_components/RegistrationClientView/index.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Download, CheckCircle2, Info, Verified, History, Loader2 } from 'lucide-react';
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { RegistrationRecord, ExamRegistrationStatus } from '@/types/registration';
import { ExamBatch } from '@/types/exam';
import { examService } from '@/services/examService';
import { registrationService } from '@/services/registrationService';
import RegistrationTable from '../RegistrationTable';

interface Props {
  initialData?: RegistrationRecord[]; // Optional as we now fetch
}

const ITEMS_PER_PAGE = 10;

export default function RegistrationClientView({ initialData = [] }: Props) {
  const { getToken } = useAuth();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(initialData);
  const [batches, setBatches] = useState<ExamBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 1. FILTER STATES
  const [courseFilter, setCourseFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all'); // This will store Batch ID
  const [statusFilter, setStatusFilter] = useState('Đang chờ duyệt');
  const [currentPage, setCurrentPage] = useState(1);

  // 2. DATA FETCHING
  const fetchBatches = useCallback(async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      
      const data = await examService.getAllExamBatches();
      setBatches(data);
      if (data.length > 0) {
        setBatchFilter(data[0].id);
      }
    } catch (err) {
      setError("Không thể tải danh sách đợt thi.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const fetchRegistrations = useCallback(async (batchId: string) => {
    if (batchId === 'all') return;
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      
      const data = await registrationService.getRegistrationsByBatch(batchId);
      setRegistrations(data);
    } catch (err) {
      setError("Lỗi khi tải danh sách đăng ký.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (batchFilter !== 'all') {
      fetchRegistrations(batchFilter);
    }
  }, [batchFilter, fetchRegistrations]);

  // 3. EXTRACT DYNAMIC OPTIONS (Courses are derived from all batches)
  const uniqueCourses = useMemo(() => {
    const courses = batches.map(b => b.batchName.split(' - ')[0] || "Khóa học");
    return Array.from(new Set(courses));
  }, [batches]);

  const batchesInSelectedCourse = useMemo(() => {
    if (courseFilter === 'all') return batches;
    return batches.filter(b => b.batchName.startsWith(courseFilter));
  }, [batches, courseFilter]);

  // 4. LOGIC LỌC DỮ LIỆU ĐA CHIỀU (Frontend filtering on fetched data)
  const filteredData = useMemo(() => {
    return registrations.filter(reg => {
      const matchStatus = statusFilter === 'Tất cả trạng thái' || reg.approvalStatus === statusFilter;
      return matchStatus;
    });
  }, [registrations, statusFilter]);

  // 4. LOGIC PHÂN TRANG
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  
  // Thống kê đơn chờ (Dựa trên data đã filter)
  const pendingCount = filteredData.filter(r => r.approvalStatus === 'Đang chờ duyệt').length;

  // --- HANDLERS DUYỆT / TỪ CHỐI ---
  // --- HANDLERS DUYỆT / TỪ CHỐI ---
  const handleApprove = async (id: string) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await registrationService.updateStatus(id, ExamRegistrationStatus.Approved);
      setRegistrations(prev => prev.map(reg => 
        reg.id === id ? { ...reg, approvalStatus: 'Đã duyệt', status: ExamRegistrationStatus.Approved } : reg
      ));
    } catch (err) {
      alert("Lỗi khi duyệt đăng ký.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await registrationService.updateStatus(id, ExamRegistrationStatus.Rejected);
      setRegistrations(prev => prev.map(reg => 
        reg.id === id ? { ...reg, approvalStatus: 'Bị từ chối', status: ExamRegistrationStatus.Rejected } : reg
      ));
    } catch (err) {
      alert("Lỗi khi từ chối đăng ký.");
    }
  };

  const handleApproveAll = async () => {
    if (confirm("Bạn có chắc chắn muốn duyệt hàng loạt tất cả hồ sơ đang chờ trong danh sách này?")) {
      const pendingIds = filteredData.filter(reg => reg.status === ExamRegistrationStatus.Pending).map(reg => reg.id);
      if (pendingIds.length === 0) return;

      try {
        const token = await getToken();
        setAuthToken(token);
        await Promise.all(pendingIds.map(id => registrationService.updateStatus(id, ExamRegistrationStatus.Approved)));
        fetchRegistrations(batchFilter); // Refresh data
        alert("Đã duyệt thành công.");
      } catch (err) {
        alert("Lỗi khi duyệt hàng loạt.");
      }
    }
  };

  if (loading && batches.length === 0) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

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
              setBatchFilter('all'); 
              setCurrentPage(1); 
            }}
            className="bg-transparent border-none p-0 text-sm font-bold text-slate-800 focus:ring-0 cursor-pointer outline-none"
          >
            <option value="all">Tất cả khóa học</option>
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
            <option value="all" disabled>-- Chọn đợt thi --</option>
            {batchesInSelectedCourse.map(batch => (
              <option key={batch.id} value={batch.id}>{batch.batchName}</option>
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