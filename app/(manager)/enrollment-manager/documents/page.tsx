import React from "react";
import DocumentClientView from "@/components/manager/ManagerDocuments/DocumentClientView";
import { MOCK_DOCUMENTS } from "@/constants/document-data";

export default function EnrollmentDocumentsPage() {
 
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 bg-slate-50 min-h-screen">

      <DocumentClientView initialDocs={MOCK_DOCUMENTS} />
    </div>
  );
}
