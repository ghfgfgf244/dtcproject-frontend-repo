'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import NotificationBell from '@/components/ui/notification-bell';
import styles from './ManagerHeader.module.css';

// --- BƯỚC 1: TẠO TỪ ĐIỂN DỊCH URL SANG TIẾNG VIỆT ---
const ROUTE_TRANSLATIONS: Record<string, string> = {
  'dashboard': 'Tổng quan Hệ thống',
  'classes': 'Quản lý Lớp học',
  'courses': 'Quản lý Khóa học',
  'exams': 'Quản lý Kỳ thi',
  'exam-results': 'Kết quả Thi',
  'documents': 'Hồ sơ Cá nhân',
  'instructors': 'Danh sách Giảng viên',
  'students': 'Quản lý Học viên',
  'settings': 'Cài đặt Hệ thống',
  'enrollment': 'Tổng quan Tuyển sinh',
  'admin': 'Quản trị Trung tâm'
};

export const ManagerHeader = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // --- BƯỚC 2: LOGIC TẠO TITLE TIẾNG VIỆT TỪ URL ---
  const segments = pathname.split('/').filter(Boolean);
  let currentSegment = segments[segments.length - 1] || 'dashboard';

  // Xử lý trường hợp URL là trang chi tiết chứa ID (VD: /classes/cls-123)
  // Nếu segment cuối không có trong từ điển, ta kiểm tra segment cha của nó
  let isDetailPage = false;
  if (!ROUTE_TRANSLATIONS[currentSegment] && segments.length > 1) {
    const parentSegment = segments[segments.length - 2];
    if (ROUTE_TRANSLATIONS[parentSegment]) {
      currentSegment = parentSegment;
      isDetailPage = true;
    }
  }

  // Tra cứu từ điển. Nếu không có thì fallback về dạng viết hoa chữ cái đầu (như cũ)
  let pageTitle = ROUTE_TRANSLATIONS[currentSegment] || 
    (currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1).replace(/-/g, ' '));

  // Nếu là trang chi tiết, tự động thêm chữ "Chi tiết " lên đầu
  if (isDetailPage) {
    pageTitle = `Chi tiết ${pageTitle.replace('Quản lý ', '')}`; // VD: "Chi tiết Lớp học"
  }

  // --- LOGIC CLERK (GIỮ NGUYÊN) ---
  const displayName = user?.fullName || user?.firstName || 'Người dùng hệ thống';
  const rawRole = (user?.publicMetadata?.role as string) || '';
  
  let systemRole: 'training_manager' | 'enrollment_manager' | 'admin';
  let displayRoleTitle: string;

  if (rawRole.toLowerCase().includes('enrollment')) {
    systemRole = 'enrollment_manager';
    displayRoleTitle = 'Quản lý Tuyển sinh';
  } else if (rawRole.toLowerCase().includes('admin')) {
    systemRole = 'admin';
    displayRoleTitle = 'Quản trị viên (Admin)';
  } else if (rawRole.toLowerCase().includes('training')) {
    systemRole = 'training_manager';
    displayRoleTitle = 'Quản lý Đào tạo';
  } else {
    if (pathname.startsWith('/enrollment')) {
      systemRole = 'enrollment_manager';
      displayRoleTitle = 'Quản lý Tuyển sinh';
    } else if (pathname.startsWith('/admin')) {
      systemRole = 'admin';
      displayRoleTitle = 'Quản trị viên (Admin)';
    } else {
      systemRole = 'training_manager';
      displayRoleTitle = 'Quản lý Đào tạo';
    }
  }

  return (
    <header className={`${styles.header} bg-white/80 border-b border-slate-200 px-8 sticky top-0 z-40 backdrop-blur-md`}>
      
      {/* Cột trái: Dynamic Title */}
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          {/* {pageTitle} */}
        </h2>
      </div>
      
      {/* Cột phải: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <NotificationBell role={systemRole} />
        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            {isLoaded ? (
              <>
                <p className="text-sm font-bold leading-none text-slate-900">{displayName}</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-1 uppercase tracking-wider">{displayRoleTitle}</p>
              </>
            ) : (
              <div className="flex flex-col gap-1 items-end">
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-2 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
          
          <div className="size-10 rounded-full flex items-center justify-center bg-slate-50 border-2 border-slate-200 overflow-hidden shrink-0 shadow-sm">
            {mounted && isLoaded ? <UserButton afterSignOutUrl="/" /> : null}
          </div>
        </div>
      </div>
    </header>
  );
};
