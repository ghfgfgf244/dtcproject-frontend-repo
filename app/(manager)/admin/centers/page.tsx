import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs/index";
import CenterClientView from "@/components/manager/CenterManagement/CenterClientView";

export default function CenterManagementPage() {
  const breadcrumbsItems = [
    { label: "Hệ thống", href: "/admin/dashboard" },
    { label: "Quản lý Trung tâm", href: "/admin/centers" },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <div className="max-w-7xl mx-auto w-full">
        {/* CenterClientView now loads all data from API internally */}
        <CenterClientView />
      </div>
    </div>
  );
}