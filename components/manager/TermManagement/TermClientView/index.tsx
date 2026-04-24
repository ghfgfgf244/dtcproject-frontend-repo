"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, CalendarCheck2, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { TermRecord } from "@/types/term";
import { termService } from "@/services/termService";
import { setAuthToken } from "@/lib/api";
import { EXAM_LEVEL_OPTIONS } from "@/constants/exam-levels";
import TermTable from "../TermTable";
import TermModal from "../../Modals/TermModal";
import ConfirmModal from "@/components/ui/confirm-modal";

interface Props {
  initialTerms?: TermRecord[];
}

export default function TermClientView({ initialTerms = [] }: Props) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [terms, setTerms] = useState<TermRecord[]>(initialTerms);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<TermRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState<TermRecord | null>(null);

  const ensureAuthToken = useCallback(async () => {
    const token = await getToken({ skipCache: true });
    setAuthToken(token);
    return token;
  }, [getToken]);

  const fetchTerms = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setTerms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await ensureAuthToken();
      const data = await termService.getAllTerms();
      setTerms(data);
    } catch (error) {
      console.error("Error fetching terms:", error);
      toast.error("Không thể tải danh sách học kỳ.");
    } finally {
      setLoading(false);
    }
  }, [ensureAuthToken, isLoaded, isSignedIn]);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      if (courseFilter === "All") return true;
      return term.courseName.toUpperCase().includes(courseFilter.toUpperCase());
    });
  }, [courseFilter, terms]);

  const activeCount = terms.filter((term) => term.isActive).length;

  const handleOpenDelete = (term: TermRecord) => {
    setTermToDelete(term);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!termToDelete) return;

    try {
      await ensureAuthToken();
      await termService.deleteTerm(termToDelete.id);
      toast.success("Đã xóa học kỳ thành công!");
      fetchTerms();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa học kỳ.");
    } finally {
      setIsDeleteModalOpen(false);
      setTermToDelete(null);
    }
  };

  const handleSave = async (data: Partial<TermRecord>) => {
    try {
      await ensureAuthToken();

      if (editingTerm) {
        const updated = await termService.updateTerm(editingTerm.id, {
          termName: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          maxStudents: data.maxStudents,
          isActive: data.isActive,
        });

        if (updated) {
          toast.success("Cập nhật học kỳ thành công!");
          fetchTerms();
        }
      } else {
        const created = await termService.createTerm({
          courseId: data.courseId!,
          termName: data.name!,
          startDate: data.startDate!,
          endDate: data.endDate!,
          maxStudents: data.maxStudents!,
        });

        if (created) {
          toast.success("Tạo học kỳ mới thành công!");
          fetchTerms();
        }
      }

      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving term:", error);
      toast.error(error.message || "Lỗi khi lưu thông tin học kỳ.");
    }
  };

  const handleToggleStatus = async (term: TermRecord) => {
    try {
      await ensureAuthToken();

      const updated = await termService.updateTerm(term.id, {
        isActive: !term.isActive,
      });

      if (updated) {
        toast.success(`Đã ${updated.isActive ? "kích hoạt" : "tạm dừng"} học kỳ thành công!`);
        setTerms((current) => current.map((item) => (item.id === term.id ? updated : item)));
      }
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái học kỳ.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <nav className="mb-2 flex gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Học thuật</span>
            <span>/</span>
            <span className="text-blue-600">Quản lý Học kỳ</span>
          </nav>
          <h2 className="text-3xl font-black leading-none tracking-tight text-slate-900">
            Danh mục Học kỳ
          </h2>
        </div>
        <button
          onClick={() => {
            setEditingTerm(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-5 w-5" /> Tạo học kỳ mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Hệ đào tạo
            </label>
            <select
              className="min-w-[180px] cursor-pointer rounded-lg border-none bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              value={courseFilter}
              onChange={(event) => setCourseFilter(event.target.value)}
            >
              <option value="All">Tất cả hạng bằng</option>
              {EXAM_LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.label}>
                  Hạng {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 p-6 text-white shadow-lg">
          <CalendarCheck2 className="absolute -right-4 -top-4 h-32 w-32 opacity-10" strokeWidth={1} />
          <div className="relative z-10">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest opacity-80">
              Học kỳ đang mở
            </p>
            <h3 className="text-3xl font-black">
              {activeCount} <span className="text-sm font-medium opacity-70">Học kỳ</span>
            </h3>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-20 shadow-sm">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-blue-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Đang tải danh mục học kỳ...
          </p>
        </div>
      ) : (
        <TermTable
          terms={filteredTerms}
          onEdit={(term) => {
            setEditingTerm(term);
            setIsModalOpen(true);
          }}
          onDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <TermModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingTerm}
        onSubmit={handleSave}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa học kỳ"
        message={`Bạn có chắc chắn muốn xóa học kỳ "${termToDelete?.name}"? Hành động này sẽ gỡ bỏ học kỳ khỏi danh sách tuyển sinh và không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTermToDelete(null);
        }}
      />
    </div>
  );
}
