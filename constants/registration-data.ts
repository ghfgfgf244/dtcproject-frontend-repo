// src/constants/registration-data.ts
import { RegistrationRecord } from "@/types/registration";

export const MOCK_REGISTRATIONS: RegistrationRecord[] = [
  {
    id: "reg-1",
    studentName: "Nguyễn Văn Lâm",
    studentId: "20240901",
    avatarInitials: "NL",
    avatarColor: "bg-blue-100 text-blue-700",
    course: "Hạng B2 - Xe Số Sàn", // <-- BỔ SUNG DATA
    examBatch: "Đợt B2-2024-01",
    registrationDate: "12/05/2024",
    paymentStatus: "Đã đóng",
    conditionStatus: "Đủ giờ học",
    approvalStatus: "Đang chờ duyệt"
  },
  {
    id: "reg-2",
    studentName: "Trần Thị Hoa",
    studentId: "20240915",
    avatarInitials: "TH",
    avatarColor: "bg-purple-100 text-purple-700",
    course: "Hạng B1 - Số Tự Động", // <-- BỔ SUNG DATA
    examBatch: "Đợt B1-2024-02",
    registrationDate: "14/05/2024",
    paymentStatus: "Chưa đóng",
    conditionStatus: "Đủ giờ học",
    approvalStatus: "Đang chờ duyệt"
  },
  {
    id: "reg-3",
    studentName: "Lê Minh Mạnh",
    studentId: "20240922",
    avatarInitials: "LM",
    avatarColor: "bg-slate-200 text-slate-700",
    course: "Hạng B2 - Xe Số Sàn", // <-- BỔ SUNG DATA
    examBatch: "Đợt B2-2024-01",
    registrationDate: "15/05/2024",
    paymentStatus: "Đã đóng",
    conditionStatus: "Chưa đủ ĐK",
    approvalStatus: "Đang chờ duyệt"
  },
  {
    id: "reg-4",
    studentName: "Phạm Văn Võ",
    studentId: "20240988",
    avatarInitials: "PV",
    avatarColor: "bg-blue-100 text-blue-700",
    course: "Hạng C - Xe Tải", // <-- BỔ SUNG DATA
    examBatch: "Đợt C-2024-01",
    registrationDate: "16/05/2024",
    paymentStatus: "Đã đóng",
    conditionStatus: "Đủ giờ học",
    approvalStatus: "Đang chờ duyệt"
  }
];