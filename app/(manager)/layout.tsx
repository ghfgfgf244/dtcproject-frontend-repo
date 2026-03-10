import SharedManagerLayout from '@/components/manager/SharedManagerLayout/SharedManagerLayout';
import React from 'react';

export default function ManagerRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   // 1. Lấy session từ Clerk
//   const { sessionClaims } = await auth();

//   // 2. Trích xuất role từ metadata (ép kiểu về string | undefined thay vì any)
//   const rawRole = sessionClaims?.metadata?.role as string | undefined;

//   // 3. Type Guard: Kiểm tra xem role có hợp lệ trong danh sách ManagerRole không
//   const isValidRole = (role: string | undefined): role is ManagerRole => {
//     return ['admin', 'training_manager', 'enrollment_manager'].includes(role as ManagerRole);
//   };

//   // 4. Nếu không có role hoặc role không đúng quyền Manager -> Redirect về trang chủ hoặc Unauthorized
//   if (!isValidRole(rawRole)) {
//     // Trong môi trường dev, bạn có thể tạm thời để 'training_manager' để test
//     // return redirect('/unauthorized'); 
//     console.warn("User does not have a valid manager role, falling back to training_manager for dev.");
//   }

//   const currentRole: ManagerRole = isValidRole(rawRole) ? rawRole : 'training_manager';
return (
    <SharedManagerLayout>
      {children}
    </SharedManagerLayout>
  );
}