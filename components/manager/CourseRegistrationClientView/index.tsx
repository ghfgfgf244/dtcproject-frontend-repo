'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  ListFilter,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { RegistrationRecord } from '@/types/registration';
import { registrationService } from '@/services/registrationService';
import RegistrationDetailModal from './RegistrationDetailModal';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/nextjs';
import { setAuthToken } from '@/lib/api';
import { EXAM_LEVEL_OPTIONS } from '@/constants/exam-levels';

type ActionDialogState =
  | {
      mode: 'approve';
      registration: RegistrationRecord;
    }
  | {
      mode: 'reject';
      registration: RegistrationRecord;
    }
  | null;

const ITEMS_PER_PAGE = 8;

export default function RegistrationClientView() {
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [stats, setStats] = useState({ newRegistrationsThisMonth: 0, pendingRegistrations: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filterLicense, setFilterLicense] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<ActionDialogState>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filterLicense, filterStatus]);

  const fetchData = useCallback(
    async (page = currentPage, showRefreshing = false) => {
      if (!authLoaded || !isSignedIn) return;

      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const token = await getToken();
        setAuthToken(token);

        const data = await registrationService.getCourseRegistrationsPaged({
          pageNumber: page,
          pageSize: ITEMS_PER_PAGE,
          search: debouncedSearchQuery,
          licenseType: filterLicense,
          status: filterStatus as 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'ALL',
        });

        setRegistrations(data.items);
        setStats({
          newRegistrationsThisMonth: data.newRegistrationsThisMonth,
          pendingRegistrations: data.pendingRegistrations,
        });
        setTotalItems(data.totalItems);
        setTotalPages(data.totalPages);

        if (data.totalPages > 0 && page > data.totalPages) {
          setCurrentPage(data.totalPages);
        }
      } catch (error) {
        toast.error('Không thể tải dữ liệu đăng ký');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [authLoaded, currentPage, debouncedSearchQuery, filterLicense, filterStatus, getToken, isSignedIn],
  );

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      fetchData(currentPage);
    }
  }, [authLoaded, isSignedIn, currentPage, fetchData]);

  const handleRefresh = () => {
    fetchData(currentPage, true);
  };

  const openDetail = (reg: RegistrationRecord) => {
    setSelectedReg(reg);
    setIsModalOpen(true);
  };

  const handleRegistrationUpdated = async (updatedRegistration: RegistrationRecord) => {
    setSelectedReg(updatedRegistration);
    setRegistrations((prev) =>
      prev.map((item) => (item.id === updatedRegistration.id ? updatedRegistration : item)),
    );
    await fetchData(currentPage, true);
  };

  const openApproveDialog = (registration: RegistrationRecord) => {
    setActionDialog({ mode: 'approve', registration });
    setRejectReason('');
  };

  const openRejectDialog = (registration: RegistrationRecord) => {
    setActionDialog({ mode: 'reject', registration });
    setRejectReason('');
  };

  const closeActionDialog = () => {
    setActionDialog(null);
    setRejectReason('');
  };

  const refreshAfterMutation = async () => {
    const shouldGoPrevPage = currentPage > 1 && registrations.length === 1;
    if (shouldGoPrevPage) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
      return;
    }

    await fetchData(currentPage, true);
  };

  const handleDialogSubmit = async () => {
    if (!actionDialog) return;

    if (actionDialog.mode === 'reject' && !rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    setSubmittingAction(true);
    try {
      if (actionDialog.mode === 'approve') {
        await registrationService.updateCourseStatus(actionDialog.registration.id, 'Approved');
        toast.success('Đã duyệt hồ sơ');
      } else {
        await registrationService.updateCourseStatus(
          actionDialog.registration.id,
          'Rejected',
          rejectReason.trim(),
        );
        toast.success('Đã từ chối hồ sơ');
      }

      closeActionDialog();
      await refreshAfterMutation();
    } catch (error) {
      toast.error(
        actionDialog.mode === 'approve'
          ? 'Lỗi khi duyệt hồ sơ'
          : 'Lỗi khi từ chối hồ sơ',
      );
    } finally {
      setSubmittingAction(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = totalItems === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const licenseOptions = useMemo(
    () => ['ALL', ...EXAM_LEVEL_OPTIONS.map((item) => item.label)],
    [],
  );

  if (loading && !refreshing) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-blue-500" />
          <p className="animate-pulse font-bold text-slate-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-[30px] font-black tracking-tighter text-slate-900 uppercase">
            Hồ sơ đăng ký
          </h1>
          <p className="text-sm text-slate-600">
            Quản lý và xét duyệt hồ sơ học viên đăng ký khóa học lái xe.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50"
          title="Tải lại dữ liệu"
        >
          <RefreshCw className={`h-5 w-5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className="mb-10 grid grid-cols-1 gap-6 text-center md:grid-cols-2 md:text-left">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-bl-full bg-blue-50 transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Đăng ký mới tháng này
            </p>
            <h3 className="text-4xl font-black text-slate-900">{stats.newRegistrationsThisMonth}</h3>
            <p className="mt-2 text-[11px] font-medium text-slate-500">
              Tổng số hồ sơ tiếp nhận tính từ đầu tháng
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-bl-full bg-amber-50 transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10 text-amber-600">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-400">
              Hồ sơ chờ duyệt
            </p>
            <h3 className="text-4xl font-black">{stats.pendingRegistrations}</h3>
            <p className="mt-2 text-[11px] font-medium text-amber-500">
              Cần xử lý trong ngày hôm nay
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-medium shadow-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm theo tên, email, SĐT hoặc ID..."
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Hạng bằng
          </span>
          <div className="flex rounded-xl border border-slate-200 bg-slate-200/50 p-1">
            {licenseOptions.map((type) => (
              <button
                key={type}
                onClick={() => setFilterLicense(type)}
                className={`rounded-lg px-4 py-2 text-xs font-black transition-all ${
                  filterLicense === type
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type === 'ALL' ? 'Tất cả' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Trạng thái
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="min-w-[160px] cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Rejected">Từ chối</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Học viên / Liên hệ
                </th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Khóa học & Hạng
                </th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Học phí
                </th>
                <th className="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrations.length > 0 ? (
                registrations.map((reg) => (
                  <tr key={reg.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-black shadow-sm ${reg.avatarColor}`}
                        >
                          {reg.avatarInitials}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 transition-colors group-hover:text-blue-600">
                            {reg.studentName}
                          </div>
                          <div className="mt-0.5 text-[11px] font-bold text-slate-400">
                            {reg.phone} • {reg.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-slate-700">{reg.courseName}</div>
                      <div className="mt-1.5 inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase text-blue-600">
                        Hạng {reg.licenseType}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-slate-600">{reg.registrationDate}</div>
                      <div className="mt-1 text-[10px] font-medium text-slate-400">
                        ID: {reg.studentId}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-black text-slate-900">
                        {formatCurrency(reg.totalFee ?? 0)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetail(reg)}
                          className="rounded-xl border border-transparent p-2.5 text-slate-400 transition-all hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                          title="Xem chi tiết hồ sơ"
                        >
                          <Eye className="h-5 w-5" />
                        </button>

                        {reg.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => openApproveDialog(reg)}
                              className="rounded-xl border border-transparent p-2.5 text-slate-400 transition-all hover:border-emerald-100 hover:bg-emerald-50 hover:text-emerald-600"
                              title="Duyệt hồ sơ"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openRejectDialog(reg)}
                              className="rounded-xl border border-transparent p-2.5 text-slate-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                              title="Từ chối hồ sơ"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <span
                            className={`rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-tight ${
                              reg.status === 'Approved'
                                ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                                : reg.status === 'Rejected'
                                  ? 'border-red-100 bg-red-50 text-red-600'
                                  : 'border-slate-200 bg-slate-100 text-slate-500'
                            }`}
                          >
                            {reg.status === 'Approved'
                              ? 'Đã duyệt'
                              : reg.status === 'Rejected'
                                ? 'Đã từ chối'
                                : 'Đã hủy'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ListFilter className="h-12 w-12 text-slate-200" />
                      <p className="font-bold text-slate-400">
                        Không tìm thấy hồ sơ nào phù hợp.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setDebouncedSearchQuery('');
                          setFilterLicense('ALL');
                          setFilterStatus('ALL');
                        }}
                        className="text-xs font-black text-blue-600 underline-offset-4 hover:underline"
                      >
                        Xóa tất cả bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > ITEMS_PER_PAGE && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/30 px-6 py-5 sm:flex-row">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Hiển thị hồ sơ {startIndex}-{endIndex} / {totalItems}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-slate-200 p-2 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-blue-600 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="mx-2 flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all ${
                      currentPage === idx + 1
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-600/20'
                        : 'border border-transparent text-slate-500 shadow-sm hover:border-slate-200 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-slate-200 p-2 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-blue-600 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {actionDialog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl ${
                    actionDialog.mode === 'approve'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {actionDialog.mode === 'approve' ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <AlertTriangle className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {actionDialog.mode === 'approve' ? 'Xác nhận duyệt hồ sơ' : 'Từ chối hồ sơ'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {actionDialog.registration.studentName} • {actionDialog.registration.courseName}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 px-6 py-5">
              {actionDialog.mode === 'approve' ? (
                <p className="text-sm leading-relaxed text-slate-600">
                  Bạn có chắc muốn duyệt hồ sơ này không? Hệ thống sẽ xếp kỳ học phù hợp cho học viên nếu còn chỗ.
                </p>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Vui lòng nhập lý do từ chối để học viên dễ theo dõi và bổ sung hồ sơ nếu cần.
                  </p>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                      Lý do từ chối
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-red-300 focus:ring-2 focus:ring-red-100"
                      placeholder="Ví dụ: Hồ sơ còn thiếu CCCD mặt sau hoặc thông tin liên hệ chưa hợp lệ..."
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-5">
              <button
                onClick={closeActionDialog}
                disabled={submittingAction}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDialogSubmit}
                disabled={submittingAction}
                className={`rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition disabled:opacity-60 ${
                  actionDialog.mode === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {submittingAction
                  ? 'Đang xử lý...'
                  : actionDialog.mode === 'approve'
                    ? 'Xác nhận duyệt'
                    : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      <RegistrationDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        registration={selectedReg}
        onUpdated={handleRegistrationUpdated}
      />
    </div>
  );
}
