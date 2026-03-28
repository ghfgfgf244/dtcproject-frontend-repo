// src/app/(manager)/training-manager/mock-exams/[id]/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { MOCK_EXAM_INFO, MOCK_QUESTIONS } from '@/constants/mock-exam-detail-data';
import MockExamDetailClientView from '@/components/manager/MockExamManagement/MockExamDetail/MockExamDetailClientView';

interface PageProps {
  params: Promise<{ id: string }>;
}

// 2. Chuyển hàm thành async function
export default async function MockExamDetailPage({ params }: PageProps) {
  
  // 3. Giải nén params bằng await
  const resolvedParams = await params;
  const id = resolvedParams.id;
  // Thực tế sẽ fetch data dựa vào params.id
  
  const breadcrumbsItems = [
    { label: 'Hệ thống', href: '/training-manager/dashboard' },
    { label: 'Quản lý Thi thử', href: '/training-manager/mock-exams' },
    { label: 'Chi tiết Bộ đề' }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        <MockExamDetailClientView 
          info={MOCK_EXAM_INFO} 
          initialQuestions={MOCK_QUESTIONS} 
        />
      </div>
    </div>
  );
}