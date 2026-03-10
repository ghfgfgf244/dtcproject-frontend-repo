import SharedManagerLayout from '@/components/manager/SharedManagerLayout/SharedManagerLayout';
import React from 'react';

export default function ManagerRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    // Truyền role giả lập xuống Layout UI
    <SharedManagerLayout>
      {children}
    </SharedManagerLayout>
  );
}