// src/app/(manager)/enrollment-manager/profiles/_components/ProfileClientView/index.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  UserPlus,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  StudentProfile,
  CollaboratorProfile,
  ProfileFormData,
} from "@/types/profile";
import { MOCK_PROFILE_STATS } from "@/constants/profile-data";

import ProfileStats from "../ProfileStats";
import ProfileTable from "../ProfileTable";
import ProfileModal from "../../Modals/ProfileModal";

interface Props {
  initialStudents: StudentProfile[];
  initialCollaborators: CollaboratorProfile[];
}

const ITEMS_PER_PAGE = 5;

export default function ProfileClientView({
  initialStudents,
  initialCollaborators,
}: Props) {
  // States Quản lý Tab & Filter
  const [activeTab, setActiveTab] = useState<"student" | "collaborator">(
    "student",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("Tất cả Khóa học");
  const [statusFilter, setStatusFilter] = useState("Tất cả Trạng thái");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfileFormData | null>(
    null,
  );

  // Logic Đổi Tab (Reset các bộ lọc khi đổi)
  const handleTabChange = (tab: "student" | "collaborator") => {
    setActiveTab(tab);
    setSearchQuery("");
    setCourseFilter("Tất cả Khóa học");
    setStatusFilter("Tất cả Trạng thái");
    setCurrentPage(1);
  };

  // Logic Lọc (Chạy động dựa trên Tab hiện tại)
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();

    if (activeTab === "student") {
      return initialStudents.filter((item) => {
        const matchSearch =
          item.fullName.toLowerCase().includes(query) ||
          item.code.toLowerCase().includes(query) ||
          item.phone.includes(query);
        const matchCourse =
          courseFilter === "Tất cả Khóa học" ||
          item.course.includes(courseFilter.replace("Hạng ", "")); // Trick map chuỗi
        const matchStatus =
          statusFilter === "Tất cả Trạng thái" || item.status === statusFilter;
        return matchSearch && matchCourse && matchStatus;
      });
    } else {
      return initialCollaborators.filter((item) => {
        const matchSearch =
          item.fullName.toLowerCase().includes(query) ||
          item.code.toLowerCase().includes(query) ||
          item.phone.includes(query);
        const matchStatus =
          statusFilter === "Tất cả Trạng thái" || item.status === statusFilter;
        return matchSearch && matchStatus; // CTV không có khóa học
      });
    }
  }, [
    activeTab,
    initialStudents,
    initialCollaborators,
    searchQuery,
    courseFilter,
    statusFilter,
  ]);

  // Logic Phân trang
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
            Quản lý Hồ sơ
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Theo dõi và quản lý danh sách học viên & cộng tác viên trong hệ
            thống.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProfile(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" /> Thêm hồ sơ mới
        </button>
      </div>

      {/* Stats Cards */}
      <ProfileStats data={MOCK_PROFILE_STATS} />

      {/* Main Content Area (Tabs + Filters + Table) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-2 pt-2">
          <button
            onClick={() => handleTabChange("student")}
            className={`px-8 py-3.5 text-sm font-bold border-b-2 transition-colors rounded-t-lg ${activeTab === "student" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
          >
            Danh sách Học viên
          </button>
          <button
            onClick={() => handleTabChange("collaborator")}
            className={`px-8 py-3.5 text-sm font-bold border-b-2 transition-colors rounded-t-lg ${activeTab === "collaborator" ? "border-purple-600 text-purple-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
          >
            Danh sách Cộng tác viên
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-white">
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-3xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium w-full focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="Tìm theo tên, SĐT hoặc ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Chỉ hiển thị Lọc Khóa học khi ở Tab Học viên */}
            {activeTab === "student" && (
              <select
                className="bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 py-2.5 px-4 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer w-full sm:w-auto"
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="Tất cả Khóa học">Tất cả Khóa học</option>
                <option value="B1">Hạng B1</option>
                <option value="B2">Hạng B2</option>
                <option value="C">Hạng C</option>
              </select>
            )}

            <select
              className="bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 py-2.5 px-4 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer w-full sm:w-auto"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Tất cả Trạng thái">Trạng thái: Tất cả</option>
              {activeTab === "student" ? (
                <>
                  <option value="Đang học">Đang học</option>
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                </>
              ) : (
                <>
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </>
              )}
            </select>
          </div>

          <button className="text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-sm flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all active:scale-95 w-full md:w-auto justify-center">
            <Download className="w-4 h-4" /> Xuất Excel
          </button>
        </div>

        {/* Bảng Dữ liệu */}
        <ProfileTable
          type={activeTab}
          data={paginatedData}
          onView={(item) => {
            console.log("Xem chi tiết hồ sơ:", item.id);
            // Logic điều hướng sau này: router.push(`/enrollment-manager/profiles/${item.id}`)
          }}
          onEdit={(item) => {
            console.log("Chỉnh sửa hồ sơ:", item.id);
            // Logic mở Modal Edit sau này
          }}
          onDelete={(item) => {
            console.log("Xóa hồ sơ:", item.id);
            // Logic mở Modal Xác nhận Xóa sau này
          }}
        />

        {/* Phân trang */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-500">
            Hiển thị{" "}
            <span className="font-bold">
              {totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
            </span>{" "}
            trên tổng số <span className="font-bold">{totalItems}</span> hồ sơ
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-blue-600 bg-blue-50 text-blue-600 text-xs font-bold">
              {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingProfile}
        defaultRole={activeTab} // Nếu đang đứng ở Tab Học viên thì mở lên là form Học Viên, Tab CTV thì mở lên là form CTV
        onSubmit={(data) => {
          console.log("Dữ liệu cần lưu:", data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
