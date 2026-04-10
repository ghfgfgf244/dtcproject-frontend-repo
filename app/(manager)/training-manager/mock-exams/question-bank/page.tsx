import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import QuestionBankClientView from "@/components/manager/MockExamManagement/QuestionBankClientView";

export default function QuestionBankPage() {
  const breadcrumbsItems = [
    { label: "Hệ thống", href: "/training-manager/dashboard" },
    { label: "Quản lý thi thử", href: "/training-manager/mock-exams" },
    { label: "Ngân hàng câu hỏi" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <QuestionBankClientView />
      </div>
    </div>
  );
}
