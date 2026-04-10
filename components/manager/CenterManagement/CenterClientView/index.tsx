"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { PlusCircle, Search, Loader2, X, Building2, Zap, Ban } from "lucide-react";
import { centerService, Center, CreateCenterPayload, UpdateCenterPayload } from "@/services/centerService";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import toast from "react-hot-toast";
import CenterTable from "../CenterTable";

const ITEMS_PER_PAGE = 8;

// ─── Create / Edit Modal ──────────────────────────────────────────────────────

type ModalMode = "create" | "edit";

interface CenterModalProps {
  mode: ModalMode;
  initial?: Center;
  onClose: () => void;
  onSaved: (c: Center) => void;
}

function CenterModal({ mode, initial, onClose, onSaved }: CenterModalProps) {
  const [form, setForm] = useState({
    centerName: initial?.centerName ?? "",
    address: initial?.address ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    numberOfClasses: initial?.numberOfClasses ?? 10,
    maxStudentPerClass: initial?.maxStudentPerClass ?? 30,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.centerName || !form.address || !form.phone || !form.email) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    setSaving(true);
    try {
      let saved: Center;
      if (mode === "create") {
        saved = await centerService.create(form as CreateCenterPayload);
        toast.success("Tạo trung tâm thành công!");
      } else {
        const payload: UpdateCenterPayload = {
          centerName: form.centerName,
          address: form.address,
          phone: form.phone,
          email: form.email,
          numberOfClasses: form.numberOfClasses,
          maxStudentPerClass: form.maxStudentPerClass,
        };
        saved = await centerService.update(initial!.id, payload);
        toast.success("Cập nhật trung tâm thành công!");
      }
      onSaved(saved);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-lg">
            {mode === "create" ? "➕ Thêm trung tâm mới" : "✏️ Chỉnh sửa trung tâm"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Tên trung tâm *</label>
            <input
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Trung tâm đào tạo Hà Nội 1"
              value={form.centerName}
              onChange={set("centerName")}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Địa chỉ *</label>
            <input
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Số nhà, đường, quận/huyện, tỉnh/TP"
              value={form.address}
              onChange={set("address")}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Số điện thoại *</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0901234567"
                value={form.phone}
                onChange={set("phone")}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Email *</label>
              <input
                type="email"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@trungtam.vn"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Số lớp học</label>
              <input
                type="number"
                min={1}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.numberOfClasses}
                onChange={(e) => setForm((p) => ({ ...p, numberOfClasses: +e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">SV/lớp (tối đa)</label>
              <input
                type="number"
                min={1}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.maxStudentPerClass}
                onChange={(e) => setForm((p) => ({ ...p, maxStudentPerClass: +e.target.value }))}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "create" ? "Tạo trung tâm" : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Confirm Toggle Modal ─────────────────────────────────────────────────────

interface ConfirmModalProps {
  center: Center;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

function ConfirmToggleModal({ center, onClose, onConfirm, loading }: ConfirmModalProps) {
  const isActive = center.isActive;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${isActive ? "bg-red-100" : "bg-emerald-100"}`}>
          {isActive ? <Ban className="w-7 h-7 text-red-500" /> : <Zap className="w-7 h-7 text-emerald-600" />}
        </div>
        <h4 className="font-black text-slate-900 text-lg mb-2">
          {isActive ? "Tạm dừng hoạt động?" : "Kích hoạt trung tâm?"}
        </h4>
        <p className="text-sm text-slate-500 mb-6">
          {isActive
            ? `Trung tâm "${center.centerName}" sẽ bị tạm dừng và không thể tiếp nhận học viên mới.`
            : `Trung tâm "${center.centerName}" sẽ được kích hoạt trở lại.`}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-colors ${isActive ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"} disabled:opacity-60`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isActive ? "Tạm dừng" : "Kích hoạt"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function CenterStatsBar({ centers }: { centers: Center[] }) {
  const total = centers.length;
  const active = centers.filter((c) => c.isActive).length;
  const suspended = total - active;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">Tổng số trung tâm</p>
          <h3 className="text-3xl font-black text-slate-900">{total}</h3>
        </div>
        <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <Building2 className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">Đang hoạt động</p>
          <h3 className="text-3xl font-black text-slate-900">{active}</h3>
        </div>
        <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
          <Zap className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">Tạm dừng</p>
          <h3 className="text-3xl font-black text-slate-900">{String(suspended).padStart(2, "0")}</h3>
        </div>
        <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
          <Ban className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Client View ─────────────────────────────────────────────────────────

export default function CenterClientView() {
  const { getToken } = useAuth();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [editTarget, setEditTarget] = useState<Center | undefined>();
  const [toggleTarget, setToggleTarget] = useState<Center | null>(null);
  const [toggling, setToggling] = useState(false);

  // Load data
  const loadCenters = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data = await centerService.getAll();
      setCenters(data);
    } catch {
      toast.error("Không thể tải danh sách trung tâm.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { loadCenters(); }, [loadCenters]);

  // Filter + paginate
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return centers;
    return centers.filter(
      (c) =>
        c.centerName.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [centers, searchQuery]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Handlers
  const handleSaved = (saved: Center) => {
    setCenters((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      return idx >= 0 ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev];
    });
    setModalMode(null);
    setEditTarget(undefined);
  };

  const handleToggleConfirm = async () => {
    if (!toggleTarget) return;
    setToggling(true);
    try {
      if (toggleTarget.isActive) {
        await centerService.deactivate(toggleTarget.id);
        setCenters((prev) =>
          prev.map((c) => (c.id === toggleTarget.id ? { ...c, isActive: false } : c))
        );
        toast.success("Đã tạm dừng trung tâm.");
      } else {
        await centerService.activate(toggleTarget.id);
        setCenters((prev) =>
          prev.map((c) => (c.id === toggleTarget.id ? { ...c, isActive: true } : c))
        );
        toast.success("Đã kích hoạt trung tâm.");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Thao tác thất bại. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setToggling(false);
      setToggleTarget(null);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-black tracking-tight text-slate-900 leading-none">
            Quản lý Trung tâm
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Theo dõi và vận hành các trung tâm đào tạo lái xe ở thành phố Đà Nẵng.
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(undefined); setModalMode("create"); }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Thêm trung tâm mới
        </button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex items-center gap-3 text-slate-500 py-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <CenterStatsBar centers={centers} />
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Tìm tên, địa chỉ, điện thoại..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <p className="text-xs text-slate-500 font-medium">{totalItems} trung tâm</p>
        </div>

        {/* Table */}
        <CenterTable
          data={paginated}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onEdit={(c) => { setEditTarget(c); setModalMode("edit"); }}
          onToggleStatus={(c) => setToggleTarget(c)}
        />
      </div>

      {/* Modals */}
      {modalMode && (
        <CenterModal
          mode={modalMode}
          initial={editTarget}
          onClose={() => { setModalMode(null); setEditTarget(undefined); }}
          onSaved={handleSaved}
        />
      )}
      {toggleTarget && (
        <ConfirmToggleModal
          center={toggleTarget}
          loading={toggling}
          onClose={() => setToggleTarget(null)}
          onConfirm={handleToggleConfirm}
        />
      )}
    </div>
  );
}