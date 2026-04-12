// src/app/(manager)/training-manager/exams/page.tsx
import React from "react";
import { MOCK_BATCHES, MOCK_EXAMS } from "@/constants/exam-data";
import ExamClientView from "@/components/manager/ExamManagement/ExamClientView";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs/index";

export default async function ExamManagementPage() {
  // Thực tế bạn sẽ fetch API tại đây:
  // const batches = await fetchBatches();
  // const exams = await fetchExams();

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/training-manager" },
    { label: "Quản lý Kỳ thi" },
  ];
  return (
    <div className="flex flex-col gap-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      {/* Phần Content bên dưới cần được bọc padding */}
      <div className="flex flex-col gap-8">
        {/* Tiêu đề trang */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Quản lý Kỳ thi
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Theo dõi đăng ký và lên lịch các kỳ thi cụ thể.
            </p>
          </div>
        </div>

        {/* Đẩy data xuống Client Component để xử lý tương tác */}
        <ExamClientView/>
      </div>
    </div>
  );
}
