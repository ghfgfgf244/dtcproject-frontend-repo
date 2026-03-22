import React from 'react';
import { MOCK_DOCUMENTS } from '@/constants/document-data';

import DocumentClientView from '@/components/manager/ManagerDocuments/DocumentClientView';

export default function DocumentManagementPage() {

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 bg-slate-50 min-h-screen">
      <DocumentClientView initialDocs={MOCK_DOCUMENTS} />
    </div>
  );
}