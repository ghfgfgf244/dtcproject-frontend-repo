import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs";
import ClassDetailClientView from "@/components/manager/ClassManagement/ClassDetailClientView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: PageProps) {
  const resolvedParams = await params;

  const breadcrumbsItems = [
    { label: "Trang chu", href: "/training-manager/dashboard" },
    { label: "Lop hoc", href: "/training-manager/classes" },
    { label: "Chi tiet lop hoc" },
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        <ClassDetailClientView classId={resolvedParams.id} />
      </div>
    </div>
  );
}
