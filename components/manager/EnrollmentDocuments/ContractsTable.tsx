import React from 'react';
import styles from './EnrollmentDocuments.module.css';

export const ContractsTable = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">gavel</span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contracts & Compliance</h3>
      </div>
      <div className={`${styles.tableWrapper} bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm`}>
        <div className={styles.scrollArea}>
          <table className={`${styles.mainTable} text-left`}>
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">File Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Document Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Last Updated</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">NDA_Data_Protection.pdf</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">Security Policy</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">Jan 10, 2025</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                    <span className="size-1.5 rounded-full bg-green-500"></span> Signed
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary/80 font-bold text-sm">View/Download</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-500">image</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Passport_Scan.jpg</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">Identity</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">Aug 22, 2024</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                    <span className="size-1.5 rounded-full bg-green-500"></span> Verified
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary/80 font-bold text-sm">View/Download</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-500">description</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Employment_Contract_2026.docx</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">HR Contract</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">Mar 01, 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span> Needs Signature
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary/80 font-bold text-sm">Review & Sign</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};