import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import MockExamClientView from "@/components/manager/MockExamManagement/MockExamClientView";

export default function MockExamsPage() {
  const breadcrumbsItems = [
    { label: "Hệ thống", href: "/training-manager/dashboard" },
    { label: "Quản lý thi thử", href: "/training-manager/mock-exams" },
    { label: "Danh sách bộ đề" },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <MockExamClientView />
      </div>
    </div>
  );
}
