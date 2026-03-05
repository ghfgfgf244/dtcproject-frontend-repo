"use client";

import { ClassScheduleDTO, UpcomingScheduleDTO } from "@/types/schedule";
import { SessionCard } from "@/components/ui/student/schedule/SessionCard";
import { MiniCalendar } from "@/components/ui/student/schedule/MiniCalendar";

const MOCK_DATA: ClassScheduleDTO[] = [
  {
    id: "uuid-1",
    classId: "class-1",
    className: "Road Signs & Markings",
    instructorName: "John Miller",
    startTime: "2023-10-24T09:00:00",
    endTime: "2023-10-24T10:30:00",
    location: "Classroom 101",
    category: "Theory",
  },
  {
    id: "uuid-2",
    classId: "class-2",
    className: "Parallel Parking Module",
    instructorName: "Sarah Connor",
    startTime: "2023-10-24T13:00:00",
    endTime: "2023-10-24T15:00:00",
    location: "Practice Field A",
    category: "Practice",
    equipment: "Toyota Camry #42",
  },
];

export default function SchedulePage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            My Learning Schedule
          </h1>
          <p className="text-slate-500 mt-1">
            Track your progress and upcoming driving sessions.
          </p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">
            Calendar
          </button>
          <button className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg shadow-md">
            List View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Calendar & Stats */}
        <aside className="lg:col-span-4 space-y-6">
          <MiniCalendar />

          {/* Milestone Card - Dựa trên logic 40h học của Course */}
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
            <h4 className="font-bold text-lg mb-2">Next Milestone</h4>
            <p className="text-white/80 text-sm mb-4">
              You are only 4 practice hours away from your Mock Test!
            </p>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span>36/40 Hours Done</span>
              <span>75%</span>
            </div>
          </div>
        </aside>

        {/* Main Content: Sessions List */}
        <main className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Today, Oct 24 2023</h2>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              3 Sessions Today
            </span>
          </div>

          <div className="space-y-4">
            {MOCK_DATA.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>

          {/* Upcoming Section */}
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6">Upcoming This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex gap-4 items-center border border-slate-100 dark:border-slate-800"
                >
                  <div className="bg-white dark:bg-slate-800 size-12 rounded-lg flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="text-[10px] font-bold text-primary uppercase">
                      Oct
                    </span>
                    <span className="text-lg font-black leading-none">26</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">City Traffic Practical</p>
                    <p className="text-xs text-slate-500">
                      10:00 AM - Practice Field B
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
