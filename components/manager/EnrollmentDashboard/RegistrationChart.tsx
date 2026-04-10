import React from 'react';
import styles from './EnrollmentDashboard.module.css';

export const RegistrationChart = () => {
  const chartData = [
    { month: 'Th01', value: 124, height: '45%', color: 'bg-primary/20' },
    { month: 'Th02', value: 158, height: '65%', color: 'bg-primary/40' },
    { month: 'Th03', value: 142, height: '55%', color: 'bg-primary/30' },
    { month: 'Th04', value: 210, height: '90%', color: 'bg-primary/80' },
    { month: 'Th05', value: 185, height: '75%', color: 'bg-primary/60' },
    { month: 'Th06', value: 198, height: '85%', color: 'bg-primary' },
  ];

  return (
    <div className={`${styles.chartSection} bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thống kê Đăng ký</h3>
          <p className="text-sm text-slate-500">Xu hướng ghi danh hàng tháng (6 tháng gần nhất)</p>
        </div>
        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-primary/50 py-2 px-4 outline-none">
          <option>Học kỳ I</option>
          <option>Học kỳ II</option>
        </select>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
        {chartData.map((data, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
            <div 
              className={`w-full ${data.color} rounded-t-lg relative group transition-all hover:opacity-80`} 
              style={{ height: data.height }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {data.value} Học viên
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">{data.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};