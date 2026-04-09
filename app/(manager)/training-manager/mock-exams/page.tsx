import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import MockExamClientView from "@/components/manager/MockExamManagement/MockExamClientView";

export default function MockExamsPage() {
  const breadcrumbsItems = [
    { label: "He thong", href: "/training-manager/dashboard" },
    { label: "Quan ly thi thu", href: "/training-manager/mock-exams" },
    { label: "Danh sach bo de" },
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
