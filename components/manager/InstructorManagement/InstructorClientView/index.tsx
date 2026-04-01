// src/app/(manager)/training-manager/instructors/_components/InstructorClientView/index.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, XCircle } from "lucide-react";
import { Instructor, LicenseType } from "@/types/instructor";
import { MOCK_INSTRUCTOR_STATS } from "@/constants/instructor-data";
import InstructorTable from "../InstructorTable";
import InstructorModal from "@/components/manager/Modals/InstructorModal";
import { InstructorFormData } from "@/types/instructor";
import InstructorHeader from "../InstructorHeader";
import InstructorStats from "../InstructorStats";
import ConfirmModal from "@/components/ui/confirm-modal";

interface Props {
  initialData: Instructor[];
}

export default function InstructorClientView({ initialData }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const [instructors, setInstructors] = useState<Instructor[]>(initialData);
  // Khởi tạo state bộ lọc bằng tiếng Việt
  const [licenseFilter, setLicenseFilter] = useState<string>("Tất cả");
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] =
    useState<InstructorFormData | null>(null);

  // State quản lý Modal Xóa
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] =
    useState<Instructor | null>(null);

  const handleCreate = () => {
    setEditingInstructor(null);
    setIsModalOpen(true);
  };


const handleSubmit = (data: InstructorFormData) => {
  if (data.id) {
    // Logic Cập nhật (Edit)
    setInstructors((prev) =>
      prev.map((ins) =>
        ins.id === data.id
          ? {
              ...ins,
              name: data.fullName,
              email: data.email,
              phone: data.phone,
              status: data.isActive ? "Active" : "Inactive",
              licenses: data.licenses,
            }
          : ins
      )
    );
  } else {
    // Logic Thêm mới (Create)
    const newInstructor: Instructor = {
      id: Date.now().toString(),
      code: `GV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      avatar: "",
      licenses: data.licenses,
      classesWeekly: 0,
      status: data.isActive ? "Active" : "Inactive",
    };
    setInstructors((prev) => [newInstructor, ...prev]);
  }
  setIsModalOpen(false); // Đóng modal sau khi xong
};

  const handleEdit = (instructorData: Instructor) => {
    const formData: InstructorFormData = {
      id: instructorData.id,
      fullName: instructorData.name,
      email: instructorData.email,
      phone: instructorData.phone,
      isActive: instructorData.status === "Active",
      licenses: instructorData.licenses,
    };
    setEditingInstructor(formData);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (instructor: Instructor) => {
    setInstructorToDelete(instructor);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (instructorToDelete) {
      // Xóa khỏi State UI
      setInstructors((prev) =>
        prev.filter((ins) => ins.id !== instructorToDelete.id),
      );
      console.log("Đã xóa giảng viên:", instructorToDelete.id);
      // TODO: Gọi API Delete ở đây
    }
    setIsConfirmModalOpen(false);
    setInstructorToDelete(null);
  };

  const handleToggleStatus = (instructor: Instructor) => {
    // Tìm và đảo ngược trạng thái trong State
    setInstructors((prev) =>
      prev.map((ins) => {
        if (ins.id === instructor.id) {
          return {
            ...ins,
            // Nếu đang Active -> Đổi thành Inactive và ngược lại
            status: ins.status === "Active" ? "Inactive" : "Active",
          } as Instructor;
        }
        return ins;
      }),
    );

    console.log(
      `Đã đổi trạng thái giảng viên ${instructor.id} thành ${instructor.status === "Active" ? "Inactive" : "Active"}`,
    );
    // TODO: Gọi API update status ở đây
  };
  // Logic Lọc (Real-time Filter) - Đã cập nhật để map Tiếng Việt với Tiếng Anh
  // Logic Lọc (Real-time Filter)
  const filteredInstructors = useMemo(() => {
    return instructors.filter((ins) => {
      // QUAN TRỌNG: Lọc từ state 'instructors'
      // 1. Tìm kiếm (Tên, Email hoặc Mã)
      const q = searchQuery.toLowerCase();
      const matchSearch =
        ins.name.toLowerCase().includes(q) ||
        ins.email.toLowerCase().includes(q) ||
        ins.code.toLowerCase().includes(q);

      // 2. Lọc Trạng thái (Map Tiếng Việt trên Select -> Type InstructorStatus)
      const matchStatus =
        statusFilter === "Tất cả" ||
        (statusFilter === "Hoạt động" && ins.status === "Active") ||
        (statusFilter === "Tạm nghỉ" && ins.status === "Inactive");

      // 3. Lọc Hạng bằng
      const matchLicense =
        licenseFilter === "Tất cả" ||
        ins.licenses.includes(licenseFilter as LicenseType);

      return matchSearch && matchStatus && matchLicense;
    });
  }, [instructors, searchQuery, licenseFilter, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setLicenseFilter("Tất cả");
    setStatusFilter("Tất cả");
  };

  const isFiltering =
    searchQuery !== "" ||
    licenseFilter !== "Tất cả" ||
    statusFilter !== "Tất cả";

  return (
    <div className="space-y-6">
      {/* Header, Title & Actions */}
      <InstructorHeader onAddClick={handleCreate} />

      {/* KPI Summary Cards */}
      <InstructorStats data={MOCK_INSTRUCTOR_STATS} />

      {/* Thanh Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        {/* Thanh tìm kiếm */}
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-600 transition-all outline-none"
            placeholder="Tìm kiếm theo tên, email hoặc mã giảng viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none min-w-[160px] cursor-pointer"
            value={licenseFilter}
            onChange={(e) => setLicenseFilter(e.target.value)}
          >
            <option value="Tất cả">Hạng bằng: Tất cả</option>
            <option value="A1">Hạng A1 - Mô tô</option>
            <option value="B1">Hạng B1 - Số tự động</option>
            <option value="B2">Hạng B2 - Số sàn</option>
            <option value="C">Hạng C - Xe tải</option>
          </select>

          <select
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none min-w-[160px] cursor-pointer"
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
              className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-bold text-sm shrink-0"
              title="Xóa bộ lọc"
            >
              <XCircle className="w-5 h-5" />
            </button>
          ) : (
            <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center shrink-0">
              <Filter className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Component Bảng */}
      <InstructorTable
        instructors={filteredInstructors}
        onEditClick={handleEdit}
        onToggleStatusClick={handleToggleStatus}
        onDeleteClick={handleDeleteClick}
      />

      {/* Gắn Modal */}
      {/* Gắn Modal */}

      <InstructorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingInstructor}
        onSubmit={handleSubmit}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Xóa hồ sơ giảng viên"
        message={`Bạn có chắc chắn muốn xóa hồ sơ giảng viên "${instructorToDelete?.name}" không? Dữ liệu lịch dạy liên quan có thể bị ảnh hưởng.`}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setInstructorToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
