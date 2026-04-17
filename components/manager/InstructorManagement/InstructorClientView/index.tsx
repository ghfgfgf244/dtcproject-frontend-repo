"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Filter, XCircle } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import InstructorTable from "../InstructorTable";
import InstructorModal from "@/components/manager/Modals/InstructorModal";
import InstructorHeader from "../InstructorHeader";
import ConfirmModal from "@/components/ui/confirm-modal";
import { Instructor, InstructorFormData } from "@/types/instructor";
import { setAuthToken } from "@/lib/api";
import { UserListItem, userService } from "@/services/userService";

const ITEMS_PER_PAGE = 10;

const mapInstructor = (user: UserListItem): Instructor => ({
  id: user.id,
  code: user.id.slice(0, 8).toUpperCase(),
  name: user.fullName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatarUrl || "",
  licenses: user.roles || ["Instructor"],
  classesWeekly: 0,
  status: user.isActive ? "Active" : "Inactive",
});

export default function InstructorClientView() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<InstructorFormData | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInstructors = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;

    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data = await userService.getInstructors();
      setInstructors(data.map(mapInstructor));
    } catch {
      toast.error("Không thể tải danh sách giảng viên.");
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    void fetchInstructors();
  }, [fetchInstructors]);

  const handleCreate = () => {
    setEditingInstructor(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: InstructorFormData) => {
    try {
      const token = await getToken();
      setAuthToken(token);

      if (data.id) {
        const updated = await userService.updateInstructor(data.id, {
          fullName: data.fullName,
          phone: data.phone,
          isActive: data.isActive,
        });
        setInstructors((prev) =>
          prev.map((item) => (item.id === updated.id ? mapInstructor(updated) : item)),
        );
        toast.success("Đã cập nhật giảng viên.");
      } else {
        const created = await userService.createInstructor({
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          isActive: data.isActive,
        });
        setInstructors((prev) => [mapInstructor(created), ...prev]);
        toast.success("Đã tạo giảng viên mới.");
      }

      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể lưu giảng viên.");
    }
  };

  const handleEdit = (instructorData: Instructor) => {
    setEditingInstructor({
      id: instructorData.id,
      fullName: instructorData.name,
      email: instructorData.email,
      phone: instructorData.phone,
      isActive: instructorData.status === "Active",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (instructor: Instructor) => {
    setInstructorToDelete(instructor);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;

    try {
      const token = await getToken();
      setAuthToken(token);
      await userService.deleteInstructor(instructorToDelete.id);
      setInstructors((prev) => prev.filter((ins) => ins.id !== instructorToDelete.id));
      toast.success("Đã xóa giảng viên.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể xóa giảng viên.");
    } finally {
      setIsConfirmModalOpen(false);
      setInstructorToDelete(null);
    }
  };

  const handleToggleStatus = async (instructor: Instructor) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await userService.toggleInstructorStatus(instructor.id);
      setInstructors((prev) =>
        prev.map((ins) =>
          ins.id === instructor.id
            ? { ...ins, status: ins.status === "Active" ? "Inactive" : "Active" }
            : ins,
        ),
      );
      toast.success("Đã cập nhật trạng thái giảng viên.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể đổi trạng thái giảng viên.");
    }
  };

  const filteredInstructors = useMemo(() => {
    return instructors.filter((ins) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        ins.name.toLowerCase().includes(q) ||
        ins.email.toLowerCase().includes(q) ||
        ins.code.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "Tất cả" ||
        (statusFilter === "Hoạt động" && ins.status === "Active") ||
        (statusFilter === "Tạm nghỉ" && ins.status === "Inactive");

      return matchSearch && matchStatus;
    });
  }, [instructors, searchQuery, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, instructors.length]);

  const totalItems = filteredInstructors.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginatedInstructors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInstructors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInstructors, currentPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("Tất cả");
  };

  const isFiltering = searchQuery !== "" || statusFilter !== "Tất cả";

  return (
    <div className="space-y-6">
      <InstructorHeader onAddClick={handleCreate} />

      <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="group relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-600"
            placeholder="Tìm kiếm theo tên, email hoặc mã giảng viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <select
            className="min-w-[160px] cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Tất cả">Trạng thái: Tất cả</option>
            <option value="Hoạt động">Đang hoạt động</option>
            <option value="Tạm nghỉ">Tạm nghỉ</option>
          </select>

          {isFiltering ? (
            <button
              onClick={clearFilters}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-100"
              title="Xóa bộ lọc"
            >
              <XCircle className="h-5 w-5" />
            </button>
          ) : (
            <button className="flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-600 transition-colors hover:bg-slate-100">
              <Filter className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center font-medium text-slate-500">
          Đang tải danh sách giảng viên...
        </div>
      ) : (
        <InstructorTable
          instructors={paginatedInstructors}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onEditClick={handleEdit}
          onToggleStatusClick={handleToggleStatus}
          onDeleteClick={handleDeleteClick}
        />
      )}

      <InstructorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingInstructor}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Xóa hồ sơ giảng viên"
        message={`Bạn có chắc chắn muốn xóa hồ sơ giảng viên "${instructorToDelete?.name}" không?`}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setInstructorToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
