"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Download, PlusCircle, Trash2, Upload, X } from "lucide-react";
import { ClassFormData, ClassSession, ClassType } from "@/types/class";
import { TermRecord } from "@/types/term";
import { UserListItem } from "@/services/userService";
import { AddressOption } from "@/services/addressService";
import { scheduleService } from "@/services/scheduleService";
import styles from "@/components/manager/Modals/modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ClassFormData | null;
  terms: TermRecord[];
  instructors: UserListItem[];
  addresses: AddressOption[];
  onSubmit: (data: ClassFormData) => Promise<void>;
}

const defaultFormData: ClassFormData = {
  className: "",
  termId: "",
  instructorId: "",
  classType: "Theory",
  maxStudents: 25,
  schedules: [],
};

export default function ClassModal({ isOpen, onClose, initialData, terms, instructors, addresses, onSubmit }: Props) {
  const [formData, setFormData] = useState<ClassFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    if (!isOpen) return;

    const firstTerm = terms[0]?.id ?? "";
    const firstInstructor = instructors[0]?.id ?? "";

    setFormData(
      initialData ?? {
        ...defaultFormData,
        termId: firstTerm,
        instructorId: firstInstructor,
      },
    );
    setError(null);
  }, [initialData, instructors, isOpen, terms]);

  const addressMap = useMemo(() => new Map(addresses.map((address) => [address.id, address.addressName])), [addresses]);
  const instructorMap = useMemo(() => new Map(instructors.map((instructor) => [instructor.id, instructor.fullName])), [instructors]);

  if (!isOpen) return null;

  const addSession = () => {
    setFormData((prev) => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        {
          instructorId: prev.instructorId || instructors[0]?.id || "",
          startTime: "",
          endTime: "",
          addressId: addresses[0]?.id || 0,
        },
      ],
    }));
  };

  const updateSession = (index: number, field: keyof ClassSession, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.map((session, sessionIndex) => (sessionIndex === index ? { ...session, [field]: value } : session)),
    }));
  };

  const removeSession = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, sessionIndex) => sessionIndex !== index),
    }));
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);

    try {
      const preview = await scheduleService.importPreview(file, formData.instructorId || undefined);
      setFormData((prev) => ({
        ...prev,
        schedules: preview.schedules.map((schedule) => ({
          instructorId: schedule.instructorId,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          addressId: schedule.addressId,
        })),
      }));

      if (preview.warnings.length > 0) {
        setError(preview.warnings.join(" "));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể nhập file lịch học.");
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
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
    link.download = "mau-import-lich-lop.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Không thể lưu lớp học.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={!isSubmitting ? onClose : undefined} />

      <div className={`${styles.modalContainer} flex max-h-[90vh] max-w-4xl flex-col`}>
        <div className="shrink-0 border-b border-slate-100 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black leading-tight text-slate-900">{isEditMode ? "Cập nhật lớp học" : "Thêm lớp học thủ công"}</h3>
                <p className="text-xs font-medium text-slate-500">
                  {isEditMode ? "Cập nhật thông tin lớp học và giảng viên phụ trách." : "Tạo lớp học, sau đó thêm lịch thủ công hoặc nhập từ file Excel/CSV."}
                </p>
              </div>
            </div>

            <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-8 p-8">
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">Tên lớp học</label>
                <input
                  required
                  type="text"
                  className="w-full rounded-lg border-none bg-slate-100 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-600"
                  value={formData.className}
                  onChange={(event) => setFormData((prev) => ({ ...prev, className: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">Kỳ học</label>
                <select
                  className="w-full rounded-lg border-none bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  value={formData.termId}
                  onChange={(event) => setFormData((prev) => ({ ...prev, termId: event.target.value }))}
                  disabled={isEditMode}
                >
                  {terms.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.name} - {term.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">Giảng viên phụ trách</label>
                <select
                  className="w-full rounded-lg border-none bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  value={formData.instructorId}
                  onChange={(event) => setFormData((prev) => ({ ...prev, instructorId: event.target.value }))}
                >
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">Loại lớp học</label>
                <select
                  className="w-full rounded-lg border-none bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  value={formData.classType}
                  onChange={(event) => setFormData((prev) => ({ ...prev, classType: event.target.value as ClassType }))}
                >
                  <option value="Theory">Lý thuyết</option>
                  <option value="Practice">Thực hành</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">Sĩ số tối đa</label>
                <input
                  required
                  type="number"
                  min={1}
                  className="w-full rounded-lg border-none bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  value={formData.maxStudents}
                  onChange={(event) => setFormData((prev) => ({ ...prev, maxStudents: Number(event.target.value) }))}
                />
              </div>
            </section>

            {!isEditMode && (
              <section className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">Lịch học của lớp</h4>
                    <p className="mt-1 text-sm text-slate-500">Có thể thêm từng dòng lịch học hoặc nhập nhanh từ file Excel/CSV.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <Download className="h-4 w-4" />
                      Tải file Excel mẫu
                    </button>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100">
                      <Upload className="h-4 w-4" />
                      {isImporting ? "Đang nhập file..." : "Nhập file Excel"}
                      <input type="file" accept=".xlsx,.csv" className="hidden" onChange={handleImportFile} disabled={isImporting} />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.schedules.map((session, index) => (
                    <div key={`${session.startTime}-${index}`} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <button
                        type="button"
                        onClick={() => removeSession(index)}
                        className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Giảng viên</label>
                          <select
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={session.instructorId}
                            onChange={(event) => updateSession(index, "instructorId", event.target.value)}
                          >
                            {instructors.map((instructor) => (
                              <option key={instructor.id} value={instructor.id}>
                                {instructor.fullName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Địa điểm</label>
                          <select
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={session.addressId}
                            onChange={(event) => updateSession(index, "addressId", Number(event.target.value))}
                          >
                            {addresses.map((address) => (
                              <option key={address.id} value={address.id}>
                                {address.addressName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bắt đầu</label>
                          <input
                            type="datetime-local"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={session.startTime}
                            onChange={(event) => updateSession(index, "startTime", event.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kết thúc</label>
                          <input
                            type="datetime-local"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={session.endTime}
                            onChange={(event) => updateSession(index, "endTime", event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-slate-500">
                        {instructorMap.get(session.instructorId) ?? "Chưa rõ giảng viên"} / {addressMap.get(session.addressId) ?? "Chưa rõ địa điểm"}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSession}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-slate-400 transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <PlusCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="text-xs font-bold uppercase tracking-widest">Thêm dòng lịch học</span>
                  </button>
                </div>
              </section>
            )}

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 p-6">
            <button type="button" onClick={onClose} className="rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:bg-slate-200">
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isImporting}
              className="rounded-lg bg-blue-600 px-8 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu lớp học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
