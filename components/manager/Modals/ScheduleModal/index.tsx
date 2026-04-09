"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ChevronDown, Download, Info, Upload, X } from "lucide-react";
import { ScheduleEvent } from "@/types/schedule";
import { scheduleService, ScheduleDraft } from "@/services/scheduleService";

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
  onSubmit: (data: ScheduleFormData) => void;
  defaultDate?: string;
  classes?: ClassOption[];
  instructors?: InstructorOption[];
  addresses?: AddressOption[];
  fixedClassId?: string;
}

function toLocalDateTimeValue(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
}: Props) {
  const [classId, setClassId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [addressId, setAddressId] = useState<number | "">("");
  const [importedSchedules, setImportedSchedules] = useState<ScheduleDraft[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setClassId(initialData.classId || fixedClassId || "");
      setInstructorId(initialData.instructorId || "");
      setStartTime(toLocalDateTimeValue(initialData.startDateTime));
      setEndTime(toLocalDateTimeValue(initialData.endDateTime));
      setAddressId(initialData.addressId || "");
      setImportedSchedules([]);
      setError("");
      return;
    }

    setClassId(fixedClassId || "");
    setInstructorId("");
    setAddressId("");
    setStartTime(buildDefaultDateTime(defaultDate, "08:00"));
    setEndTime(buildDefaultDateTime(defaultDate, "10:00"));
    setImportedSchedules([]);
    setError("");
  }, [defaultDate, fixedClassId, initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!classId) {
      return;
    }

    if (importedSchedules.length === 0 && (!instructorId || !startTime || !endTime || addressId === "")) {
      return;
    }

    onSubmit({
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
      "InstructorId,StartTime,EndTime,AddressId",
      "11111111-1111-1111-1111-111111111111,2026-04-10T08:00,2026-04-10T10:00,1",
      "11111111-1111-1111-1111-111111111111,2026-04-12T13:00,2026-04-12T15:00,2",
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

    try {
      const preview = await scheduleService.importPreview(file);
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
      setError(importError?.response?.data?.message || "Khong the nhap file lich hoc.");
      setImportedSchedules([]);
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-auto my-6 flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl max-h-[calc(100vh-48px)]">
        <div className="shrink-0 flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 md:px-8 md:py-6">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900">
              {initialData ? "Cap nhat lich hoc" : "Tao lich hoc moi"}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500">Thiet lap lop hoc, giang vien va dia diem hoc</p>
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
                  Tai file Excel mau
                </button>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100">
                  <Upload className="h-4 w-4" />
                  {isImporting ? "Dang nhap file..." : "Nhap lich tu Excel"}
                  <input type="file" accept=".xlsx,.csv" className="hidden" onChange={handleImportFile} disabled={isImporting} />
                </label>
              </div>
            )}

            {!fixedClassId && (
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Chon lop hoc</label>
                <div className="relative">
                  <select
                    required
                    value={classId}
                    onChange={(event) => setClassId(event.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="" disabled>
                      -- Chon lop hoc --
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Chon giang vien</label>
              <div className="relative">
                <select
                  required
                  value={instructorId}
                  onChange={(event) => setInstructorId(event.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                >
                  <option value="" disabled>
                    -- Chon giang vien --
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Chon dia diem</label>
              <div className="relative">
                <select
                  required
                  value={addressId}
                  onChange={(event) => setAddressId(Number(event.target.value))}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                >
                  <option value="" disabled>
                    -- Chon dia diem --
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Bat dau</label>
                <input
                  required
                  type="datetime-local"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Ket thuc</label>
                <input
                  required
                  type="datetime-local"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <Info className="h-5 w-5 shrink-0 text-blue-600" />
              <p className="text-[11px] font-medium leading-relaxed text-blue-800">
                He thong se kiem tra xung dot lich hoc cua giang vien va dia diem truoc khi luu.
              </p>
            </div>

            {importedSchedules.length > 0 && !initialData && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                Da doc {importedSchedules.length} dong lich hoc tu file. Khi bam luu, he thong se tao toan bo cac dong nay cho lop da chon.
              </div>
            )}

            {error && <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}</div>}
          </div>

          <div className="shrink-0 flex justify-end gap-3 rounded-b-xl border-t border-slate-100 bg-slate-50 px-6 py-4 md:px-8 md:py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-95"
            >
              Huy bo
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
            >
              Luu lich hoc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
