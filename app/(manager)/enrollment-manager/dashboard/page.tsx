import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import { KPICards } from '@/components/manager/EnrollmentDashboard/KPICards';
import { RegistrationChart } from '@/components/manager/EnrollmentDashboard/RegistrationChart';
import { CollaboratorRank } from '@/components/manager/EnrollmentDashboard/CollaboratorRank';
import { AdmissionPostsTable } from '@/components/manager/EnrollmentDashboard/AdmissionPostsTable';
import styles from '@/components/manager/EnrollmentDashboard/EnrollmentDashboard.module.css';

export default function EnrollmentDashboardPage() {
  const breadcrumbs = [
    { label: 'Enrollment Manager' },
    { label: 'Dashboard' }
  ];

  return (
    <div className={styles.pageContainer}>
      <div className="mb-2">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-extrabold tracking-tight mt-[-10px] text-slate-900 dark:text-white">Enrollment Overview</h1>
        <p className="text-slate-500 mt-1">Monitor registrations, revenue, and collaborator performance.</p>
      </div>

      <KPICards />
      
      <div className={styles.middleGrid}>
        <RegistrationChart />
        <CollaboratorRank />
      </div>

      <AdmissionPostsTable />
    </div>
  );
}