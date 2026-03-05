interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: string;
  color: "primary" | "orange" | "purple" | "emerald"; // Giới hạn các màu bạn dùng
  negative?: boolean;
}

interface TransactionRowProps {
  name: string;
  type: string;
  date: string;
  amount: string;
  status: "Completed" | "Pending" | "Refunded"; // Các trạng thái cố định
}
export default function FinancePage() {
  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-8">
      {/* Breadcrumbs & Search */}
      <div className="hidden lg:flex justify-between items-center w-full">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>/</span> <span>Admin</span> <span>/</span>
          <span className="text-primary font-medium">Finance</span>
        </div>
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1a2632] border-none rounded-lg text-sm shadow-sm focus:ring-1 ring-primary/20"
            placeholder="Search transactions..."
          />
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold dark:text-white">
            Finance Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi doanh thu và lịch sử giao dịch các hạng bằng lái.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium dark:text-white">
            <span className="material-symbols-outlined text-[20px]">
              calendar_today
            </span>{" "}
            Tháng này
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-md">
            <span className="material-symbols-outlined text-[20px]">
              download
            </span>{" "}
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value="$124,500"
          change="+12%"
          icon="payments"
          color="primary"
        />
        <StatCard
          title="Thanh toán chờ"
          value="$8,350"
          change="+5%"
          icon="pending_actions"
          color="orange"
        />
        <StatCard
          title="Học viên mới"
          value="45"
          change="-2%"
          icon="group_add"
          color="purple"
          negative
        />
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold dark:text-white mb-6">
          Doanh thu theo hạng bằng
        </h3>
        <div className="w-full aspect-[21/9] min-h-[300px] relative">
          {/* SVG Chart giữ nguyên từ thiết kế của bạn */}
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 1000 400"
          >
            <path
              d="M0 300 C 150 280, 250 150, 400 180 S 600 250, 750 120 S 900 80, 1000 50"
              fill="none"
              stroke="#258cf4"
              strokeWidth="4"
            />
            <path
              d="M0 350 C 150 320, 250 250, 400 280 S 600 180, 750 220 S 900 150, 1000 100"
              fill="none"
              stroke="#a855f7"
              strokeWidth="4"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between">
          <h3 className="font-bold text-lg dark:text-white">
            Giao dịch gần đây
          </h3>
          <button className="text-primary text-sm font-semibold">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Học viên</th>
                <th className="px-6 py-4">Hạng bằng</th>
                <th className="px-6 py-4">Ngày</th>
                <th className="px-6 py-4">Số tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <TransactionRow
                name="Alex Morgan"
                type="B2 (Số sàn)"
                date="24/10/2023"
                amount="$450.00"
                status="Completed"
              />
              <TransactionRow
                name="Sarah Jenkins"
                type="B1 (Tự động)"
                date="23/10/2023"
                amount="$380.00"
                status="Pending"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sub-components để code sạch hơn
function StatCard({
  title,
  value,
  change,
  icon,
  color,
  negative,
}: StatCardProps) {
  const colorMap = {
    primary: "bg-blue-100/50 text-blue-600",
    orange: "bg-orange-100/50 text-orange-600",
    purple: "bg-purple-100/50 text-purple-600",
    emerald: "bg-emerald-100/50 text-emerald-600",
  };

  return (
    <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold dark:text-white mt-1">{value}</p>
        </div>
        <div
          className={`size-10 rounded-full flex items-center justify-center ${colorMap[color]}`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${negative ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
        >
          {change}
        </span>
        <span className="text-sm text-slate-400">vs tháng trước</span>
      </div>
    </div>
  );
}

function TransactionRow({
  name,
  type,
  date,
  amount,
  status,
}: TransactionRowProps) {
  const statusStyles = {
    Completed: "bg-emerald-100 text-emerald-700",
    Pending: "bg-orange-100 text-orange-700",
    Refunded: "bg-red-100 text-red-700",
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-4 flex items-center gap-3">
        <div className="size-8 rounded-full bg-slate-200" />
        <span className="text-sm font-medium dark:text-white">{name}</span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {type}
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">{date}</td>
      <td className="px-6 py-4 text-sm font-bold dark:text-white">{amount}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
