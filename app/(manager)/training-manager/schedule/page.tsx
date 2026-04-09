import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import ScheduleClientView from "@/components/manager/ScheduleManagement/ScheduleClientView";

export const metadata = {
  title: "Lich hoc | Quan ly dao tao",
  description: "Quan ly lich hoc va phan cong giang day",
};

export default function SchedulePage() {
  const breadcrumbsItems = [
    { label: "Trang chu", href: "/training-manager/dashboard" },
    { label: "Quan ly lop hoc", href: "/training-manager/classes" },
    { label: "Lich hoc" },
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
