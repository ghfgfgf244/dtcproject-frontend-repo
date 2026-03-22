import React from "react";
import { Breadcrumbs } from "@/components/manager/Shared/Breadcrumbs/index";
import { DocStats } from "@/components/manager/EnrollmentDocuments/DocStats";
import { ContractsTable } from "@/components/manager/EnrollmentDocuments/ContractsTable";
import { OtherDocsGrid } from "@/components/manager/EnrollmentDocuments/OtherDocsGrid";
import DocumentClientView from "@/components/manager/ManagerDocuments/DocumentClientView";
import { MOCK_DOCUMENTS } from "@/constants/document-data";

export default function EnrollmentDocumentsPage() {
  const breadcrumbItems = [
    { label: "Enrollment Hub", href: "/enrollment-manager/dashboard" },
    { label: "My Documents" },
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 bg-slate-50 min-h-screen">
      <Breadcrumbs items={breadcrumbItems} />

      <DocumentClientView initialDocs={MOCK_DOCUMENTS} />
    </div>
  );
}
