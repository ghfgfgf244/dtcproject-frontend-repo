import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import MockExamDetailClientView from "@/components/manager/MockExamManagement/MockExamDetail/MockExamDetailClientView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MockExamDetailPage({ params }: PageProps) {
  const { id } = await params;

  const breadcrumbsItems = [
    { label: "He thong", href: "/training-manager/dashboard" },
    { label: "Quan ly thi thu", href: "/training-manager/mock-exams" },
    { label: "Chi tiet bo de" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <MockExamDetailClientView examId={id} />
      </div>
    </div>
  );
}
