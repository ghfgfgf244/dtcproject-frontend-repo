"use client";

import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import styles from '@/components/manager/Modals/modal.module.css';
import { StudentOption } from '@/types/class-detail';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableStudents: StudentOption[];
  onSubmit: (selectedStudentIds: string[]) => void;
}

export default function AddStudentModal({ isOpen, onClose, availableStudents, onSubmit }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Lọc học viên theo từ khóa tìm kiếm
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return availableStudents.filter(stu => 
      stu.fullName.toLowerCase().includes(q) || 
      stu.email.toLowerCase().includes(q) || 
      stu.phone.includes(q)
    );
  }, [availableStudents, searchQuery]);

  if (!isOpen) return null;

  // Logic Checkbox
  const handleToggleStudent = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleToggleAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set()); // Bỏ chọn tất cả
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id))); // Chọn tất cả
    }
  };

  // Logic Submit
  const handleSubmit = () => {
    onSubmit(Array.from(selectedIds));
    // Reset state sau khi submit
    setSearchQuery('');
    setSelectedIds(new Set());
  };

  // Logic Hủy (Đóng Modal và clear dữ liệu đang chọn dở)
  const handleCancel = () => {
    setSearchQuery('');
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={handleCancel} />
      
      <div className={`${styles.modalContainer} max-w-3xl flex flex-col max-h-[85vh]`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Tìm và Thêm Học viên</h3>
          <button onClick={handleCancel} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Section */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text"
              className="w-full bg-white border-none ring-1 ring-slate-200 focus:ring-blue-600 focus:ring-2 py-3.5 pl-12 pr-4 text-sm rounded-lg shadow-sm transition-all placeholder:text-slate-400 outline-none" 
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results Table (Scrollable) */}
        <div className="flex-1 overflow-y-auto bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white border-b border-slate-200 z-10 shadow-sm">
              <tr>
                <th className="pl-6 pr-2 py-3 w-12">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    checked={filteredStudents.length > 0 && selectedIds.size === filteredStudents.length}
                    onChange={handleToggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Học viên</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Liên hệ</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Khóa học đã đăng ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => {
                const isSelected = selectedIds.has(stu.id);
                return (
                  <tr 
                    key={stu.id} 
                    onClick={() => handleToggleStudent(stu.id)}
                    className={`transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="pl-6 pr-2 py-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                        checked={isSelected}
                        onChange={() => {}} // Đã handle ở thẻ tr
                        onClick={(e) => e.stopPropagation()} // Tránh click 2 lần
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={stu.avatar} alt={stu.fullName} className="w-9 h-9 rounded-full bg-slate-100 object-cover ring-1 ring-slate-200" />
                        <div className="text-sm font-bold text-slate-900 leading-tight">{stu.fullName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] text-slate-600 font-medium">{stu.email}</div>
                      <div className="text-[10px] text-slate-400">{stu.phone}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1">
                        {stu.enrolledCourses.map((course, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                            {course}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-sm text-slate-500">Không tìm thấy học viên nào phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500 font-medium">Đã chọn <span className="text-blue-600 font-bold">{selectedIds.size}</span> học viên</span>
          <div className="flex gap-3">
            <button onClick={handleCancel} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-all active:scale-95">
              Hủy bỏ
            </button>
            <button 
              onClick={handleSubmit}
              disabled={selectedIds.size === 0}
              className="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm vào lớp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}