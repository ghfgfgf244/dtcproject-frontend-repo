import React from 'react';
import styles from './EnrollmentDashboard.module.css';

export const AdmissionPostsTable = () => {
  return (
    <div className={`${styles.tableWrapper} bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm`}>
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bài đăng Tuyển sinh Mới nhất</h3>
        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          Tạo Bài đăng Mới
        </button>
      </div>
      <div className={styles.scrollArea}>
        <table className={`${styles.mainTable} text-left`}>
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Tên Khóa học</th>
              <th className="px-6 py-4">Cộng tác viên</th>
              <th className="px-6 py-4">Ngày đăng</th>
              <th className="px-6 py-4">Lượt tiếp cận</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">directions_car</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Hạng B2 Tiêu chuẩn</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">Nguyễn Văn A</td>
              <td className="px-6 py-4 text-sm text-slate-500">24/10/2023</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">1.200</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Đang hoạt động</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-primary transition-colors tooltip-trigger" title="Chỉnh sửa">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
              </td>
            </tr>
            
            {/* Dòng mẫu thứ 2 */}
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">motorcycle</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Hạng A1 Cấp tốc</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">Trần Thị B</td>
              <td className="px-6 py-4 text-sm text-slate-500">22/10/2023</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">850</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Chờ duyệt</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-primary transition-colors tooltip-trigger" title="Chỉnh sửa">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};