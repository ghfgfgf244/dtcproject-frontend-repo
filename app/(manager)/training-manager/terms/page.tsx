import React from 'react';
import { TermTable } from '@/components/manager/TermManagement/TermTable';
import { TermItem } from '@/types/term';

// Mock Data
const MOCK_TERMS: TermItem[] = [
  { id: 't1', courseId: 'c1', termName: 'Khóa K122 - B2', startDate: '2026-03-01', endDate: '2026-06-30', status: 'Ongoing', courseName: 'Standard Car B2', classCount: 4 },
  { id: 't2', courseId: 'c2', termName: 'Khóa K123 - B1', startDate: '2026-04-15', endDate: '2026-07-15', status: 'Upcoming', courseName: 'Premium Automatic B1', classCount: 2 },
];

export default function TermsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <TermTable terms={MOCK_TERMS} />
    </div>
  );
}