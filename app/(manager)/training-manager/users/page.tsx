// src/app/(manager)/training-manager/users/page.tsx
import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import {
  MOCK_INSTRUCTORS,
  MOCK_STUDENTS,
} from "@/constants/user-management-data";
import UserClientView from "@/components/manager/UserManagement/UserClientView";

export const metadata = {
  title: "Quản lý Người dùng | Quản lý Đào tạo",
  description: "Quản lý học viên và giảng viên của trung tâm",
};

export default function UserManagementPage() {
  const breadcrumbsItems = [
    { label: "Hệ thống", href: "/training-manager/dashboard" },
    { label: "Quản lý Người dùng" },
  ];

  // Gộp chung data để truyền xuống Client
  const combinedUsers = [...MOCK_INSTRUCTORS, ...MOCK_STUDENTS];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        <UserClientView />
      </div>
    </div>
  );
}
