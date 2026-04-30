'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  FileText,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import { RegistrationRecord, RegistrationTermOption } from '@/types/registration';
import { registrationService } from '@/services/registrationService';
import { toast } from 'react-hot-toast';

interface Props {
  registration: RegistrationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: (registration: RegistrationRecord) => Promise<void> | void;
}

export default function RegistrationDetailModal({
  registration,
  isOpen,
  onClose,
  onUpdated,
}: Props) {
  const [termOptions, setTermOptions] = useState<RegistrationTermOption[]>([]);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [submittingTermChange, setSubmittingTermChange] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState('');

  const canManuallyReassignTerm =
    registration?.status === 'Approved' || registration?.status === 'Pending';

  useEffect(() => {
    let active = true;

    const loadTermOptions = async () => {
      if (!isOpen || !registration || !canManuallyReassignTerm) {
        setTermOptions([]);
        setSelectedTermId('');
        return;
      }

      setLoadingTerms(true);
      try {
        const options = await registrationService.getRegistrationTermOptions(registration.id);
        if (!active) {
          return;
        }

        setTermOptions(options);
        const currentOption = options.find((option) => option.isCurrentAssignment);
        setSelectedTermId(currentOption?.id ?? options[0]?.id ?? '');
      } catch {
        if (active) {
          toast.error('Không thể tải danh sách kỳ học để chuyển kỳ.');
        }
      } finally {
        if (active) {
          setLoadingTerms(false);
        }
      }
    };

    loadTermOptions();

    return () => {
      active = false;
    };
  }, [canManuallyReassignTerm, isOpen, registration]);

  const currentTerm = useMemo(
    () => termOptions.find((option) => option.isCurrentAssignment),
    [termOptions],
  );

  if (!isOpen || !registration) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handleReassignTerm = async () => {
    if (!selectedTermId || selectedTermId === registration.assignedTermId) {
      toast('Bạn đang chọn đúng kỳ hiện tại.', { icon: 'ℹ️' });
      return;
    }

    setSubmittingTermChange(true);
    try {
      const updatedRegistration = await registrationService.reassignRegistrationTerm(
        registration.id,
        selectedTermId,
      );
      toast.success('Đã chuyển kỳ học thành công.');
      await onUpdated?.(updatedRegistration);
      setSelectedTermId(updatedRegistration.assignedTermId ?? selectedTermId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể chuyển kỳ học cho hồ sơ này.';
      toast.error(message);
    } finally {
      setSubmittingTermChange(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg ${registration.avatarColor}`}
            >
              {registration.avatarInitials}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                {registration.studentName}
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                ID: {registration.studentId}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-200">
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <User className="h-3.5 w-3.5" /> Thông tin học viên
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Email</p>
                      <p className="text-sm font-medium text-slate-700">{registration.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Số điện thoại</p>
                      <p className="text-sm font-medium text-slate-700">{registration.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-50 p-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Ngày đăng ký</p>
                      <p className="text-sm font-medium text-slate-700">
                        {registration.registrationDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <CreditCard className="h-3.5 w-3.5" /> Thông tin khóa học
                </h3>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-slate-500">Khóa học:</span>
                    <span className="text-right text-sm font-bold text-slate-900">
                      {registration.courseName}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-slate-500">Hạng bằng:</span>
                    <span className="rounded-full border border-blue-200 bg-blue-100 px-2 py-0.5 text-xs font-black uppercase text-blue-700">
                      Hạng {registration.licenseType}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 border-t border-slate-200 pt-2">
                    <span className="text-xs font-bold text-slate-700">Tổng học phí:</span>
                    <span className="text-base font-black text-blue-600">
                      {formatCurrency(registration.totalFee || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {(registration.placementMessage ||
                registration.assignedTermName ||
                registration.suggestedTermName) && (
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="mb-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Xếp kỳ và xếp lớp
                  </h3>
                  <div className="space-y-3 rounded-xl border border-sky-100 bg-sky-50/70 p-4">
                    {registration.placementMessage && (
                      <p className="text-sm leading-relaxed text-slate-700">
                        {registration.placementMessage}
                      </p>
                    )}
                    {registration.assignedTermName && (
                      <div className="text-xs text-slate-600">
                        <span className="font-bold text-slate-800">Kỳ đã xếp:</span>{' '}
                        {registration.assignedTermName}
                      </div>
                    )}
                    {registration.assignedClassName && (
                      <div className="text-xs text-slate-600">
                        <span className="font-bold text-slate-800">Lớp đã xếp:</span>{' '}
                        {registration.assignedClassName}
                      </div>
                    )}
                    {!registration.assignedTermName && registration.suggestedTermName && (
                      <div className="text-xs text-slate-600">
                        <span className="font-bold text-slate-800">Kỳ dự kiến gần nhất:</span>{' '}
                        {registration.suggestedTermName}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {registration.notes && (
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <FileText className="h-3.5 w-3.5" /> Ghi chú
                  </h3>
                  <p className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs italic leading-relaxed text-slate-600">
                    &quot;{registration.notes}&quot;
                  </p>
                </div>
              )}

              {canManuallyReassignTerm && (
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <RefreshCw className="h-3.5 w-3.5" /> Chuyển kỳ thủ công
                  </h3>
                  <div className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                    <p className="text-sm leading-relaxed text-slate-700">
                      Hệ thống chỉ tự xếp học viên vào kỳ còn trong 7 ngày đầu tính từ ngày bắt đầu kỳ.
                      Nếu cần điều chỉnh, bạn có thể chuyển thủ công sang kỳ cùng khóa học còn chỗ.
                    </p>

                    {currentTerm && (
                      <div className="rounded-lg border border-white/70 bg-white/80 p-3 text-xs text-slate-600">
                        <span className="font-bold text-slate-800">Kỳ hiện tại:</span>{' '}
                        {currentTerm.termName}
                        <span className="ml-2">
                          ({currentTerm.startDate} - {currentTerm.endDate})
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500">
                        Chọn kỳ mới
                      </label>
                      <select
                        value={selectedTermId}
                        onChange={(event) => setSelectedTermId(event.target.value)}
                        disabled={loadingTerms || submittingTermChange || termOptions.length === 0}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        {termOptions.length === 0 ? (
                          <option value="">Không có kỳ phù hợp để chuyển</option>
                        ) : (
                          termOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.termName} ({option.startDate} - {option.endDate}) •{' '}
                              {option.currentStudents}/{option.maxStudents}
                              {option.isCurrentAssignment ? ' • hiện tại' : ''}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {loadingTerms ? (
                      <p className="text-xs text-slate-500">Đang tải danh sách kỳ học...</p>
                    ) : (
                      termOptions.some((option) => option.isLateForAutoPlacement) && (
                        <p className="text-xs leading-relaxed text-amber-700">
                          Một số kỳ đang hiển thị đã quá mốc tự động nhận học viên, nên chỉ có thể
                          gán bằng thao tác thủ công.
                        </p>
                      )
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={handleReassignTerm}
                        disabled={
                          loadingTerms ||
                          submittingTermChange ||
                          !selectedTermId ||
                          selectedTermId === registration.assignedTermId
                        }
                        className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {submittingTermChange ? 'Đang chuyển kỳ...' : 'Chuyển kỳ'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <ImageIcon className="h-3.5 w-3.5" /> Hồ sơ hình ảnh
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="ml-1 text-[10px] font-black uppercase tracking-tighter text-slate-500">
                    Ảnh hồ sơ
                  </p>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-slate-100 bg-slate-100">
                    {registration.photoUrl ? (
                      <img
                        src={registration.photoUrl}
                        alt="Ảnh hồ sơ"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                        <ImageIcon className="mb-2 h-8 w-8" />
                        <span className="text-[10px] font-bold">Chưa có ảnh</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="ml-1 text-[10px] font-black uppercase tracking-tighter text-slate-500">
                      CCCD mặt trước
                    </p>
                    <div className="group relative aspect-[1.6/1] overflow-hidden rounded-xl border-2 border-slate-100 bg-slate-100">
                      {registration.idFrontUrl ? (
                        <img
                          src={registration.idFrontUrl}
                          alt="CCCD mặt trước"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                          <ImageIcon className="mb-2 h-8 w-8" />
                          <span className="text-[10px] font-bold">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="ml-1 text-[10px] font-black uppercase tracking-tighter text-slate-500">
                      CCCD mặt sau
                    </p>
                    <div className="group relative aspect-[1.6/1] overflow-hidden rounded-xl border-2 border-slate-100 bg-slate-100">
                      {registration.idBackUrl ? (
                        <img
                          src={registration.idBackUrl}
                          alt="CCCD mặt sau"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                          <ImageIcon className="mb-2 h-8 w-8" />
                          <span className="text-[10px] font-bold">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm font-bold">
          <button onClick={onClose} className="px-6 py-2 text-slate-500 transition-colors hover:text-slate-700">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
