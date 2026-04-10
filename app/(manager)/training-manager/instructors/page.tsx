import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import InstructorClientView from "@/components/manager/InstructorManagement/InstructorClientView";

export default function InstructorDirectoryPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/training-manager/dashboard" },
    { label: "Quản lý giảng viên" },
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 bg-slate-50 min-h-screen">
      <Breadcrumbs items={breadcrumbItems} />
      <InstructorClientView />
    </div>
  );
}
