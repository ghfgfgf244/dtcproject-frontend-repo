import React from "react";
import ResultClientView from "@/components/manager/ExamManagement/ResultClientView";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs/index";

export default function ExamResultsPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/training-manager/dashboard" },
    { label: "Quản lý kỳ thi", href: "/training-manager/exams" },
    { label: "Điểm thi" },
  ];

  return (
    <div className="p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mb-8">
        <h2 className="text-[30px] font-black tracking-tighter text-slate-900 uppercase">
          Quản lý điểm thi
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Nhập điểm lý thuyết, thực hành và mô phỏng theo khóa học, kỳ học và đợt thi.
        </p>
      </div>

      <ResultClientView />
    </div>
  );
}
