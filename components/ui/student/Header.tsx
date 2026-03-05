"use client";
import { Bell, UserCircle, Search } from "lucide-react";

export const Header = ({ title }: { title: string }) => (
  <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#1a2632] border-b border-gray-100 dark:border-gray-800 shrink-0">
    <h2 className="text-lg font-bold dark:text-white">{title}</h2>

    <div className="flex items-center gap-4">
      <div className="relative group hidden md:block">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
        />
      </div>

      <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
        <Bell size={22} />
        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2632]" />
      </button>

      <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-2" />

      <div className="flex items-center gap-3 cursor-pointer group">
        <div className="size-9 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 border border-blue-100 dark:border-blue-800">
          <UserCircle size={24} />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold leading-none dark:text-white">
            Alex Morgan
          </p>
          <p className="text-[11px] text-gray-400 mt-1 leading-none font-medium">
            Student ID: #8832
          </p>
        </div>
      </div>
    </div>
  </header>
);
