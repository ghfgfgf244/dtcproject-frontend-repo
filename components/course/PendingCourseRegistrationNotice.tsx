"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CalendarDays, CircleDollarSign, Clock3, MapPinned, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { RegistrationRecord } from "@/types/registration";
import { registrationService } from "@/services/registrationService";

interface Props {
  registration: RegistrationRecord;
  onCancelled?: () => Promise<void> | void;
}

function formatCurrency(value?: number) {
  if (!value) return "Chưa cập nhật";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "Đang chờ xếp kỳ";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("vi-VN");
}

export default function PendingCourseRegistrationNotice({ registration, onCancelled }: Props) {
  const [isCancelling, setIsCancelling] = useState(false);

  const pendingMessage = useMemo(() => {
    return (
      registration.placementMessage ||
      "Hồ sơ của bạn đã được tiếp nhận và đang chờ bộ phận tuyển sinh xét duyệt."
    );
  }, [registration.placementMessage]);

  const handleCancel = async () => {
    const confirmed = window.confirm("Bạn có chắc muốn hủy hồ sơ đăng ký khóa học này không?");
    if (!confirmed) return;

    try {
      setIsCancelling(true);
      await registrationService.cancelCourseRegistration(
        registration.id,
        "Học viên chủ động hủy hồ sơ trong thời gian chờ duyệt.",
      );
      toast.success("Đã hủy đăng ký khóa học");
      await onCancelled?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể hủy đăng ký khóa học");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
            <Clock3 className="h-4 w-4" />
            Đang chờ duyệt khóa học
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            Hồ sơ đăng ký của bạn đã gửi thành công
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {pendingMessage}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isCancelling}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <XCircle className="h-4 w-4" />
          {isCancelling ? "Đang hủy đăng ký..." : "Hủy đăng ký"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Thông tin khóa học</div>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <MapPinned className="mt-0.5 h-4 w-4 text-blue-600" />
              <div>
                <div className="font-bold text-slate-900">{registration.courseName || "Khóa học đang đăng ký"}</div>
                <div>{registration.licenseType || "Đang cập nhật hạng GPLX"}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CircleDollarSign className="h-4 w-4 text-emerald-600" />
              <span>Tổng học phí dự kiến: <strong>{formatCurrency(registration.totalFee)}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-violet-600" />
              <span>Ngày gửi hồ sơ: <strong>{registration.registrationDate}</strong></span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Thông tin dự kiến</div>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
              <div>
                <div className="font-bold text-slate-900">
                  {registration.suggestedTermName || "Chưa chốt kỳ học"}
                </div>
                <div>
                  Ngày bắt đầu dự kiến: <strong>{formatDate(registration.suggestedTermStartDate)}</strong>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-slate-600">
              Khi hồ sơ được duyệt, hệ thống sẽ tiếp tục xếp kỳ học và lớp phù hợp cho bạn. Nếu kỳ gần nhất đã đủ chỗ, hồ sơ sẽ được chuyển sang kỳ sau còn chỗ.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
