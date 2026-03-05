import { CourseRow, CourseType } from "@/components/ui/training/CourseTable";

export default function CourseManagementPage() {
  // Dữ liệu mẫu thay cho HTML cứng
  const courses: CourseType[] = [
    {
      id: "1",
      name: "Beginner Manual",
      details: "24 Lessons • 2 Exams",
      licenseType: "Class B",
      price: "$500",
      status: "Active",
    },
    {
      id: "2",
      name: "Automatic Intensive",
      details: "12 Lessons • 1 Exam",
      licenseType: "Class B Auto",
      price: "$650",
      status: "Active",
    },
    {
      id: "3",
      name: "Heavy Truck",
      details: "40 Lessons • 4 Exams",
      licenseType: "Class C",
      price: "$1,200",
      status: "Draft",
    },
    {
      id: "4",
      name: "Motorcycle Basic",
      details: "10 Lessons • 1 Exam",
      licenseType: "Class A",
      price: "$350",
      status: "Active",
    },
    {
      id: "5",
      name: "Advanced Eco-Driving",
      details: "5 Lessons • Certification",
      licenseType: "Special",
      price: "$200",
      status: "Inactive",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Alert Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-900 border-l-4 border-amber-500 rounded-xl shadow-sm gap-4">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              Schedule Conflict
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              There is a scheduling overlap in Room 302 for the upcoming
              &apos;Advanced Driving&apos; class between 2:00 PM and 4:00 PM.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0">
          Resolve Now
        </button>
      </div>

      {/* Header Page */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tight">Courses</h3>
          <p className="text-slate-500 mt-1">
            Manage and monitor all driving school curriculum and pricing tiers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              filter_list
            </span>{" "}
            Filters
          </button>
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">download</span>{" "}
            Export
          </button>
        </div>
      </div>

      {/* Course Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  License Type
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {courses.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {courses.length} of 18 courses
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors">
              <span className="material-symbols-outlined text-lg">
                chevron_left
              </span>
            </button>
            <span className="text-xs font-bold bg-primary text-white size-6 flex items-center justify-center rounded">
              1
            </span>
            <span className="text-xs font-medium text-slate-500 size-6 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
              2
            </span>
            <span className="text-xs font-medium text-slate-500 size-6 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
              3
            </span>
            <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors">
              <span className="material-symbols-outlined text-lg">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
