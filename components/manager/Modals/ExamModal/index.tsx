"use client";

import React, { useEffect, useState } from "react";
import styles from "@/components/manager/Modals/modal.module.css";
import { X, Archive, CheckCircle } from "lucide-react";
import { Exam, ExamStatus, ExamType } from "@/types/exam";
import { Course } from "@/types/course";
import { courseService } from "@/services/courseService";
import { addressService, AddressOption } from "@/services/addressService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  batchContext: { id: string; name: string; courseId: string };
  initialData?: Exam | null;
  onSubmit: (data: Partial<Exam>) => void;
}

export default function ExamModal({ isOpen, onClose, batchContext, initialData, onSubmit }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [addresses, setAddresses] = useState<AddressOption[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [courseData, addressData] = await Promise.all([courseService.getAvailableCourses(), addressService.getAll()]);
      setCourses(courseData);
      setAddresses(addressData);
    };

    if (isOpen) {
      fetchOptions().catch(() => {
        setCourses([]);
        setAddresses([]);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const examData: Partial<Exam> = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      examBatchId: batchContext.id,
      courseId: formData.get("courseId") as string,
      addressId: Number(formData.get("addressId")),
      examName: formData.get("examName") as string,
      examType: parseInt(formData.get("examType") as string, 10) as ExamType,
      examDate: formData.get("examDate") as string,
      durationMinutes: Number(formData.get("durationMinutes")),
      totalScore: Number(formData.get("totalScore")),
      passScore: Number(formData.get("passScore")),
      status: parseInt(formData.get("status") as string, 10) as ExamStatus,
    };

    onSubmit(examData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={`${styles.modalContainer} ${styles.modalMaxLg}`}>
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">{initialData ? "Cập nhật bài thi" : "Tạo bài thi mới"}</h3>
            <p className="text-xs font-medium text-slate-500">
              Thêm vào đợt thi: <span className="text-blue-600 font-bold">{batchContext.name}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className={styles.modalBody}>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mã tham chiếu đợt thi</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <Archive className="text-slate-400 w-4 h-4" />
                  <span className="text-sm text-slate-600 font-medium">ID: {batchContext.id}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Khóa học áp dụng</label>
                <select required name="courseId" defaultValue={initialData?.courseId || ""} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none cursor-pointer">
                  <option value="">-- Chọn khóa học --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.licenseType}] {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tên bài thi</label>
                <input required name="examName" type="text" defaultValue={initialData?.examName} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none" placeholder="Ví dụ: Thi sát hạch lý thuyết" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hình thức thi</label>
                  <select required name="examType" defaultValue={initialData?.examType || ExamType.Theory} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none cursor-pointer">
                    <option value={ExamType.Theory}>Lý thuyết</option>
                    <option value={ExamType.Practice}>Thực hành</option>
                    <option value={ExamType.Simulation}>Mô phỏng</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ngày thi</label>
                  <input required name="examDate" type="date" defaultValue={initialData?.examDate?.toString().slice(0, 10)} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2 px-4 font-medium outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Địa điểm thi</label>
                  <select required name="addressId" defaultValue={initialData?.addressId || ""} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none cursor-pointer">
                    <option value="">-- Chọn địa điểm --</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.addressName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trạng thái</label>
                  <select required name="status" defaultValue={initialData?.status || ExamStatus.Draft} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none cursor-pointer">
                    <option value={ExamStatus.Draft}>Bản nháp</option>
                    <option value={ExamStatus.Scheduled}>Đã lên lịch</option>
                    <option value={ExamStatus.Finished}>Đã kết thúc</option>
                    <option value={ExamStatus.Cancelled}>Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Thời lượng</label>
                  <input required name="durationMinutes" type="number" min="1" defaultValue={initialData?.durationMinutes || 60} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng điểm</label>
                  <input required name="totalScore" type="number" min="1" defaultValue={initialData?.totalScore || 100} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Điểm đạt</label>
                  <input required name="passScore" type="number" min="1" defaultValue={initialData?.passScore || 40} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 mt-auto">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
              Hủy bỏ
            </button>
            <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2">
              <span>Lưu bài thi</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
