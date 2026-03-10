import SharedManagerLayout from '@/components/manager/SharedManagerLayout/SharedManagerLayout';
import React from 'react';

export default function ManagerRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🚀 Mock Role (Thay đổi chuỗi này để test các menu khác nhau)
  const currentRole = 'TrainingManager'; 
  
  return (
    // Truyền role giả lập xuống Layout UI
    <SharedManagerLayout role={currentRole}>
      {children}
    </SharedManagerLayout>
  );
}