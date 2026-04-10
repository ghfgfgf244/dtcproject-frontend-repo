import React from "react";
import { Plus } from "lucide-react";

interface Props {
  onAddClick: () => void;
}

export default function InstructorHeader({ onAddClick }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="text-[1.875rem] font-black tracking-tight text-slate-900 leading-none mb-2">
          Quản lý giảng viên
        </h2>
        <p className="text-slate-500 font-medium">
          Tạo tài khoản giảng viên nội bộ trước để khi người dùng đăng nhập bằng Clerk sẽ tự nhận đúng vai trò giảng viên.
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-all active:scale-95 text-sm"
      >
        <Plus className="w-4 h-4" /> Thêm giảng viên mới
      </button>
    </div>
  );
}
