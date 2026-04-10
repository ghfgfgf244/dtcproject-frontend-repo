"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import CollaboratorModal, { CollabFormData } from "@/components/manager/Modals/CollaboratorModal";
import {
  collaboratorAdminService,
  CollaboratorAdminStats,
  CollaboratorAdminRecord,
  CommissionAdminRecord,
} from "@/services/collaboratorAdminService";
import { userService } from "@/services/userService";
import { setAuthToken } from "@/lib/api";
import { Loader2, Users, DollarSign, Wallet, Clock, CheckCircle2, XCircle, Power, CreditCard, Plus } from "lucide-react";

export default function CollaboratorsMergePage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CollaboratorAdminStats | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorAdminRecord[]>([]);
  const [commissions, setCommissions] = useState<CommissionAdminRecord[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const breadcrumbsItems = [
    { label: "Trang chủ", href: "/enrollment-manager/dashboard" },
    { label: "Cộng tác viên & hoa hồng", href: "/enrollment-manager/collaborators" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn) return;

      setLoading(true);
      try {
        const token = await getToken();
        setAuthToken(token);

        const [fetchedStats, fetchedCollabs, fetchedComms] = await Promise.all([
          collaboratorAdminService.getStats(),
          collaboratorAdminService.getCollaborators(),
          collaboratorAdminService.getCommissions(),
        ]);

        setStats(fetchedStats);
        setCollaborators(fetchedCollabs);
        setCommissions(fetchedComms);
      } catch {
        toast.error("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, isLoaded, isSignedIn, getToken]);

  const handleToggleCode = async (collaboratorId: string) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await collaboratorAdminService.toggleReferralCode(collaboratorId);
      toast.success("Đã cập nhật trạng thái mã giới thiệu.");
      setRefreshKey((k) => k + 1);
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái mã.");
    }
  };

  const handlePayCommissions = async (collaboratorId: string) => {
    if (!confirm("Xác nhận thanh toán toàn bộ hoa hồng đang chờ cho cộng tác viên này?")) {
      return;
    }

    try {
      const token = await getToken();
      setAuthToken(token);
      await collaboratorAdminService.payCommissions(collaboratorId);
      toast.success("Thanh toán hoa hồng thành công.");
      setRefreshKey((k) => k + 1);
    } catch {
      toast.error("Lỗi khi thanh toán hoa hồng.");
    }
  };

  const handleCreateCollaborator = async (data: CollabFormData) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await userService.createCollaborator({
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        isActive: data.status === "ACTIVE",
      });
      toast.success("Đã tạo cộng tác viên mới.");
      setIsCreateModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể tạo cộng tác viên.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-slate-50">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Cộng tác viên và hoa hồng</h2>
            <p className="text-slate-500 font-medium mt-2 text-lg">Quản lý mạng lưới cộng tác viên và thanh toán hoa hồng.</p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm cộng tác viên
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng cộng tác viên</p>
              <h4 className="text-2xl font-bold text-slate-900">{stats?.totalCollaborators ?? 0}</h4>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng hoa hồng</p>
              <h4 className="text-2xl font-bold text-slate-900">{(stats?.totalCommissions ?? 0).toLocaleString("vi-VN")} đ</h4>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-2xl border border-emerald-400 shadow-sm flex items-center gap-4 text-white">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-50">Đã thanh toán</p>
              <h4 className="text-2xl font-bold">{(stats?.paidCommissions ?? 0).toLocaleString("vi-VN")} đ</h4>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl border border-amber-400 shadow-sm flex items-center gap-4 text-white">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-50">Chờ thanh toán</p>
              <h4 className="text-2xl font-bold">{(stats?.unpaidCommissions ?? 0).toLocaleString("vi-VN")} đ</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">Danh sách cộng tác viên</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Cộng tác viên</th>
                  <th className="px-6 py-4">Mã code</th>
                  <th className="px-6 py-4">Lượt dùng</th>
                  <th className="px-6 py-4">Chờ thanh toán</th>
                  <th className="px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collaborators.map((c) => (
                  <tr key={c.userId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{c.fullName}</div>
                      <div className="text-xs text-slate-500">{c.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">{c.referralCode}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">{c.usedCount}</td>
                    <td className="px-6 py-4 font-bold text-amber-600">{c.totalPendingCommission.toLocaleString("vi-VN")} đ</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleCode(c.userId)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1 transition-colors ${
                          c.isCodeActive ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {c.isCodeActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      </button>

                      {c.totalPendingCommission > 0 && (
                        <button
                          onClick={() => handlePayCommissions(c.userId)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center gap-1 hover:bg-blue-700 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Thanh toán
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {collaborators.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">Lịch sử hoa hồng ghi nhận</h3>
            <p className="text-sm text-slate-500 mt-1">Chi tiết các khoản hoa hồng phát sinh từ lượt sử dụng mã giới thiệu.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Tên cộng tác viên</th>
                  <th className="px-6 py-4">Số tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày ghi nhận</th>
                  <th className="px-6 py-4">Ngày thanh toán</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commissions.map((cmd) => (
                  <tr key={cmd.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{cmd.collaboratorName}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{cmd.amount.toLocaleString("vi-VN")} đ</td>
                    <td className="px-6 py-4">
                      {cmd.status === "Paid" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã trả
                        </span>
                      ) : cmd.status === "Pending" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                          <Clock className="w-3.5 h-3.5" /> Chờ xử lý
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
                          <XCircle className="w-3.5 h-3.5" /> Đã hủy
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(cmd.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="px-6 py-4 text-slate-500">{cmd.paidAt ? new Date(cmd.paidAt).toLocaleDateString("vi-VN") : "-"}</td>
                  </tr>
                ))}
                {commissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CollaboratorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialData={null}
        onSubmit={handleCreateCollaborator}
      />
    </div>
  );
}
