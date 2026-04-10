import React from 'react';
import { KPICards } from '@/components/manager/EnrollmentDashboard/KPICards';
import { RegistrationChart } from '@/components/manager/EnrollmentDashboard/RegistrationChart';
import { CollaboratorRank } from '@/components/manager/EnrollmentDashboard/CollaboratorRank';
import { AdmissionPostsTable } from '@/components/manager/EnrollmentDashboard/AdmissionPostsTable';
import styles from '@/components/manager/EnrollmentDashboard/EnrollmentDashboard.module.css';

export default function EnrollmentDashboardPage() {
  return (
    <div className={styles.pageContainer}>
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight mt-[-10px] text-slate-900 dark:text-white">
          Tổng quan Tuyển sinh
        </h1>
        <p className="text-slate-500 mt-1">
          Theo dõi số lượng đăng ký, doanh thu và hiệu suất của cộng tác viên.
        </p>
      </div>
      
      {/* Các thẻ chỉ số chính */}
      <KPICards />
      
      <div className={styles.middleGrid}>
        {/* Biểu đồ thống kê đăng ký */}
        <RegistrationChart />
        
        {/* Bảng xếp hạng cộng tác viên */}
        <CollaboratorRank />
      </div>

      {/* Bảng danh sách bài đăng tuyển sinh */}
      <AdmissionPostsTable />
    </div>
  );
}