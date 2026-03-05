// "use client";
// import { Check, Car, Lock, Flag } from "lucide-react";

// const steps = [
//   { id: 1, title: "Orientation", status: "completed", icon: Check },
//   { id: 2, title: "Theory Exam", status: "completed", icon: Check },
//   { id: 3, title: "Practical", status: "current", icon: Car },
//   { id: 4, title: "Mock Test", status: "locked", icon: Lock },
//   { id: 5, title: "Final Exam", status: "locked", icon: Flag },
// ];

// export const StudyPath = () => (
//   <div className="bg-white dark:bg-[#1a2632] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
//     <div className="flex justify-between items-center mb-10">
//       <h3 className="text-xl font-bold dark:text-white">Learning Journey</h3>
//       <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full uppercase">
//         Step 3 of 5
//       </span>
//     </div>

//     <div className="relative flex justify-between px-2">
//       <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 -z-0 rounded-full" />
//       <div className="absolute top-6 left-0 w-[50%] h-1 bg-blue-600 -z-0 rounded-full transition-all duration-1000" />

//       {steps.map((step) => {
//         const Icon = step.icon;
//         const isCompleted = step.status === "completed";
//         const isCurrent = step.status === "current";

//         return (
//           <div
//             key={step.id}
//             className={`relative z-10 flex flex-col items-center gap-3 ${step.status === "locked" ? "opacity-30" : ""}`}
//           >
//             <div
//               className={`size-12 rounded-2xl flex items-center justify-center ring-4 ring-white dark:ring-[#1a2632] transition-all duration-300 ${
//                 isCompleted
//                   ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
//                   : isCurrent
//                     ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110"
//                     : "bg-gray-100 dark:bg-gray-800 text-gray-400"
//               }`}
//             >
//               <Icon size={20} strokeWidth={2.5} />
//             </div>
//             <div className="text-center">
//               <p className="text-xs font-bold dark:text-white whitespace-nowrap">
//                 {step.title}
//               </p>
//               <p
//                 className={`text-[10px] font-medium mt-0.5 ${isCompleted ? "text-emerald-500" : isCurrent ? "text-blue-600" : "text-gray-400"}`}
//               >
//                 {step.status.toUpperCase()}
//               </p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// );
// src/components/student/StudyPath.tsx
export const StudyPath = () => (
  <div className="lg:col-span-3 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2a3b4c]">
     <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-6">Study Path</h3>
     <div className="relative flex justify-between items-start w-full">
        {/* Render các Step từ một mảng dữ liệu để code sạch hơn */}
     </div>
  </div>
);