"use client";
import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Folder,
  GraduationCap,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";

interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Courses", icon: BookOpen },
  { name: "Schedule", icon: Calendar },
  { name: "Materials", icon: Folder },
  { name: "Mock Exams", icon: GraduationCap },
  { name: "Results", icon: BarChart3 },
  { name: "Profile", icon: User },
];

export const StudentSidebar = ({
  activeTab,
  setActiveTab,
}: StudentSidebarProps) => {
  return (
    <aside className="w-64 bg-white dark:bg-[#1a2632] border-r border-gray-100 dark:border-gray-800 flex flex-col h-full shrink-0">
      <div className="p-6">
        <div className="flex gap-3 items-center mb-8">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-lg font-bold dark:text-white">DriveSafe</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold dark:bg-blue-900/20"
                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
