"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  ChevronDown,
  Download,
  Info,
  Loader2,
  SearchCheck,
  Upload,
  X,
} from "lucide-react";
import { ScheduleEvent } from "@/types/schedule";
import {
  scheduleService,
  ScheduleConflictExplainResponse,
  ScheduleDraft,
} from "@/services/scheduleService";
import ScheduleConflictInsight from "@/components/ai/ScheduleConflictInsight";

export interface ScheduleFormData {
  classId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  addressId: number;
  importedSchedules?: ScheduleDraft[];
}

interface ClassOption {
  id: string;
  className: string;
}

interface InstructorOption {
  id: string;
  fullName: string;
}

interface AddressOption {
  id: number;
  addressName: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: ScheduleEvent | null;
  onSubmit: (data: ScheduleFormData) => void | Promise<void>;
  defaultDate?: string;
  classes?: ClassOption[];
  instructors?: InstructorOption[];
  addresses?: AddressOption[];
  fixedClassId?: string;
  fixedInstructorId?: string;
}

function toLocalDateTimeValue(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildDefaultDateTime(defaultDate?: string, hour = "08:00") {
  if (!defaultDate) return "";
  return `${defaultDate}T${hour}`;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  defaultDate,
  classes = [],
  instructors = [],
  addresses = [],
  fixedClassId,
  fixedInstructorId,
}: Props) {
  const [classId, setClassId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [addressId, setAddressId] = useState<number | "">("");
  const [importedSchedules, setImportedSchedules] = useState<ScheduleDraft[]>(
    []
  );
  const [isImporting, setIsImporting] = useState(false);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);
  const [error, setError] = useState("");
  const [conflictInsight, setConflictInsight] =
    useState<ScheduleConflictExplainResponse | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setClassId(initialData.classId || fixedClassId || "");
      setInstructorId(initialData.instructorId || fixedInstructorId || "");
      setStartTime(toLocalDateTimeValue(initialData.startDateTime));
      setEndTime(toLocalDateTimeValue(initialData.endDateTime));
      setAddressId(initialData.addressId || "");
      setImportedSchedules([]);
      setError("");
      setConflictInsight(null);
      return;
    }

    setClassId(fixedClassId || "");
    setInstructorId(fixedInstructorId || "");
    setAddressId("");
    setStartTime(buildDefaultDateTime(defaultDate, "08:00"));
    setEndTime(buildDefaultDateTime(defaultDate, "10:00"));
    setImportedSchedules([]);
    setError("");
    setConflictInsight(null);
  }, [defaultDate, fixedClassId, fixedInstructorId, initialData, isOpen]);

  if (!isOpen) return null;

  const canCheckConflict =
    Boolean(classId) &&
    Boolean(instructorId) &&
    Boolean(startTime) &&
    Boolean(endTime) &&
    addressId !== "" &&
    importedSchedules.length === 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!classId) {
      return;
    }

    if (
      importedSchedules.length === 0 &&
      (!instructorId || !startTime || !endTime || addressId === "")
    ) {
      return;
    }

    await onSubmit({
      classId,
      instructorId,
      startTime,
      endTime,
      addressId: Number(addressId),
      importedSchedules,
    });
  };

  const handleDownloadTemplate = () => {
    const csvContent = [
      "StartTime,EndTime,AddressName",
      "2026-04-10T08:00,2026-04-10T10:00,Bãi tập sa hình Trung tâm Quận 1",
      "2026-04-12T13:00,2026-04-12T15:00,Phòng học lý thuyết Trung tâm Quận 1",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mau-import-lich-hoc.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError("");
    setConflictInsight(null);

    try {
      const preview = await scheduleService.importPreview(
        file,
        fixedInstructorId || instructorId || undefined
      );
      setImportedSchedules(preview.schedules);
      if (preview.schedules.length > 0) {
        const firstRow = preview.schedules[0];
        setInstructorId(firstRow.instructorId);
        setStartTime(firstRow.startTime);
        setEndTime(firstRow.endTime);
        setAddressId(firstRow.addressId);
      }
      if (preview.warnings.length > 0) {
        setError(preview.warnings.join(" "));
      }
    } catch (importError: any) {
      setError(
        importError?.response?.data?.message || "Không thể nhập file lịch học."
      );
      setImportedSchedules([]);
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const handleCheckConflict = async () => {
    if (!canCheckConflict) return;
    setIsCheckingConflict(true);
    setError("");

    try {
      const response = await scheduleService.explainConflict({
        classId,
        instructorId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        addressId: Number(addressId),
        ignoreScheduleId: initialData?.id,
      });
      setConflictInsight(response);
    } catch (checkError: any) {
      setError(
        checkError?.response?.data?.message ||
          "Không thể kiểm tra xung đột lịch học."
      );
      setConflictInsight(null);
    } finally {
      setIsCheckingConflict(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-auto my-6 flex max-h-[calc(100vh-48px)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="shrink-0 flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 md:px-8 md:py-6">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900">
              {initialData ? "Cập nhật lịch học" : "Tạo lịch học mới"}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Thiết lập lớp học, giảng viên và địa điểm học
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
            {!initialData && (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <Download className="h-4 w-4" />
                  Tải file Excel mẫu
                </button>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100">
                  <Upload className="h-4 w-4" />
                  {isImporting ? "Đang nhập file..." : "Nhập lịch từ Excel"}
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    className="hidden"
                    onChange={handleImportFile}
                    disabled={isImporting}
                  />
                </label>
              </div>
            )}

            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              File mẫu hỗ trợ các cột để nhập nhanh:{" "}
              <span className="font-bold">StartTime, EndTime, AddressName</span>.
              {fixedInstructorId || instructorId
                ? " Giảng viên sẽ được tự động lấy theo lớp hiện tại hoặc giảng viên đang chọn."
                : " Bạn có thể chọn giảng viên trên form, hoặc thêm cột InstructorName trong file nếu cần."}
            </div>

            {!fixedClassId && (
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Chọn lớp học
                </label>
                <div className="relative">
                  <select
                    required
                    value={classId}
                    onChange={(event) => {
                      setClassId(event.target.value);
                      setConflictInsight(null);
                    }}
                    className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="" disabled>
                      -- Chọn lớp học --
                    </option>
                    {classes.map((classOption) => (
                      <option key={classOption.id} value={classOption.id}>
                        {classOption.className}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Chọn giảng viên
              </label>
              <div className="relative">
                <select
                  required
                  value={instructorId}
                  onChange={(event) => {
                    setInstructorId(event.target.value);
                    setConflictInsight(null);
                  }}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                >
                  <option value="" disabled>
                    -- Chọn giảng viên --
                  </option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.fullName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Chọn địa điểm
              </label>
              <div className="relative">
                <select
                  required
                  value={addressId}
                  onChange={(event) => {
                    setAddressId(Number(event.target.value));
                    setConflictInsight(null);
                  }}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                >
                  <option value="" disabled>
                    -- Chọn địa điểm --
                  </option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.addressName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Bắt đầu
                </label>
                <input
                  required
                  type="datetime-local"
                  value={startTime}
                  onChange={(event) => {
                    setStartTime(event.target.value);
                    setConflictInsight(null);
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Kết thúc
                </label>
                <input
                  required
                  type="datetime-local"
                  value={endTime}
                  onChange={(event) => {
                    setEndTime(event.target.value);
                    setConflictInsight(null);
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <Info className="h-5 w-5 shrink-0 text-blue-600" />
              <p className="text-[11px] font-medium leading-relaxed text-blue-800">
                Hệ thống sẽ kiểm tra xung đột của giảng viên, lớp học và địa
                điểm. Bạn có thể dùng nút kiểm tra trước khi lưu để xem giải
                thích chi tiết và gợi ý giờ thay thế.
              </p>
            </div>

            {importedSchedules.length > 0 && !initialData ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                Đã đọc {importedSchedules.length} dòng lịch học từ file. Khi bấm
                lưu, hệ thống sẽ tạo toàn bộ các dòng này cho lớp đã chọn.
              </div>
            ) : null}

            <ScheduleConflictInsight insight={conflictInsight} />

            {error ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {error}
              </div>
            ) : null}
          </div>

          <div className="shrink-0 flex justify-end gap-3 rounded-b-xl border-t border-slate-100 bg-slate-50 px-6 py-4 md:px-8 md:py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-95"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleCheckConflict}
              disabled={!canCheckConflict || isCheckingConflict}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-5 py-2.5 text-sm font-black text-indigo-700 transition-all hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCheckingConflict ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang kiểm tra
                </>
              ) : (
                <>
                  <SearchCheck className="h-4 w-4" /> Kiểm tra xung đột
                </>
              )}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
            >
              Lưu lịch học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
