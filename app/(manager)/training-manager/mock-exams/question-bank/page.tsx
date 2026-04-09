import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import QuestionBankClientView from "@/components/manager/MockExamManagement/QuestionBankClientView";

export default function QuestionBankPage() {
  const breadcrumbsItems = [
    { label: "He thong", href: "/training-manager/dashboard" },
    { label: "Quan ly thi thu", href: "/training-manager/mock-exams" },
    { label: "Ngan hang cau hoi" },
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
