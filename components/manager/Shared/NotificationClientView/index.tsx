"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import useRouter của Next.js
import { CheckCircle2, Edit3 } from 'lucide-react';
import { NotificationRecord, SystemAlert } from '@/types/notification';

import NotificationList from '../NotificationList';
import NotificationModal from '@/components/manager/Modals/NotificationModal';

interface Props {
  initialNotifications: NotificationRecord[];
  alerts: SystemAlert[];
}

const TABS = [
  { id: 'All', label: 'Tất cả' },
  { id: 'Enrollment', label: 'Tuyển sinh' },
  { id: 'Schedule', label: 'Lịch trình' },
  { id: 'Exams', label: 'Thi cử' },
  { id: 'System', label: 'Hệ thống' }
];

export default function NotificationClientView({ initialNotifications, alerts }: Props) {
  const router = useRouter(); // 2. Khởi tạo router

  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<NotificationRecord | null>(null);

  const filteredNotifications = initialNotifications.filter(notif => {
    return activeTab === 'All' || notif.category === activeTab;
  });

  const handleCreate = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  // 3. Cập nhật hàm xử lý click để chuyển trang
  const handleViewDetail = (id: string) => {
    // Điều hướng tương đối: Thêm ID vào sau URL hiện tại 
    // VD: Đang ở /training-manager/notifications -> sẽ nhảy sang /training-manager/notifications/[id]
    router.push(`notifications/${id}`); 
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      
      {/* Cột Trái: Nội dung chính */}
      <div className="flex-1 space-y-6 min-w-0">
        
        {/* Thanh Tabs & Nút bấm Hành động */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
            {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-xs rounded transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'font-bold bg-blue-600 text-white' : 'font-medium text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 hover:underline px-2 py-1 transition-colors">
              <CheckCircle2 className="w-4 h-4" /> Đã đọc tất cả
            </button>
            
            <button 
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm active:scale-95"
            >
              <Edit3 className="w-4 h-4" /> Soạn thông báo
            </button>
          </div>
        </div>

        {/* Component Danh sách */}
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <NotificationList 
            notifications={filteredNotifications} 
            onViewDetail={handleViewDetail} 
          />
        </div>

      </div>
      
      {/* Modal Soạn thông báo */}
      <NotificationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingData}
        onSubmit={(data) => {
          console.log('Push to API:', data);
          setIsModalOpen(false);
        }}
      />
      
    </div>
  );
}