import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import ScheduleClientView from "@/components/manager/ScheduleManagement/ScheduleClientView";

export const metadata = {
  title: "Lịch học | Quản lý đào tạo",
  description: "Quản lý lịch học và phân công giảng dạy",
};

export default function SchedulePage() {
  const breadcrumbsItems = [
    { label: "Trang chủ", href: "/training-manager/dashboard" },
    { label: "Quản lý lớp học", href: "/training-manager/classes" },
    { label: "ịch học" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        <ScheduleClientView />
      </div>
    </div>
  );
}
