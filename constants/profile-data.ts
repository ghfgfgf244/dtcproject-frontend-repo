// src/constants/profile-data.ts
import { StudentProfile, CollaboratorProfile, ProfileStatsData } from "@/types/profile";

export const MOCK_PROFILE_STATS: ProfileStatsData = {
  totalStudents: 1284,
  totalCollaborators: 142,
  pendingApprovals: 28,
  monthlyCommission: "45.2M"
};

export const MOCK_STUDENTS: StudentProfile[] = [
  { id: "st-1", code: "ST-2940", fullName: "Lê Thành Trung", email: "trung.le@gmail.com", phone: "090 123 4567", course: "Hạng B2 (Số sàn)", registrationDate: "12/10/2023", status: "Đang học" },
  { id: "st-2", code: "ST-2939", fullName: "Nguyễn Thu Hà", email: "ha.nguyen@outlook.com", phone: "098 765 4321", course: "Hạng B1 (Số tự động)", registrationDate: "11/10/2023", status: "Chờ duyệt" },
  { id: "st-3", code: "ST-2938", fullName: "Phạm Văn Vũ", email: "vu.pham@company.vn", phone: "035 888 9999", course: "Hạng C (Xe tải)", registrationDate: "10/10/2023", status: "Đang học" },
  { id: "st-4", code: "ST-2937", fullName: "Trần Thị Mai", email: "mai.tran@gmail.com", phone: "091 222 3333", course: "Hạng B2 (Số sàn)", registrationDate: "09/10/2023", status: "Đã tốt nghiệp" },
  { id: "st-5", code: "ST-2936", fullName: "Hoàng Văn Nam", email: "nam.hoang@yahoo.com", phone: "094 555 6666", course: "Hạng B1 (Số tự động)", registrationDate: "08/10/2023", status: "Đang học" },
  { id: "st-6", code: "ST-2935", fullName: "Đinh Quang Anh", email: "anh.dinh@gmail.com", phone: "097 888 1111", course: "Hạng C (Xe tải)", registrationDate: "07/10/2023", status: "Chờ duyệt" },
];

export const MOCK_COLLABORATORS: CollaboratorProfile[] = [
  { id: "col-1", code: "CTV-081", fullName: "Võ Minh Đạt", email: "dat.vo@marketing.vn", phone: "088 111 2222", totalReferred: 45, commission: 12500000, status: "Hoạt động" },
  { id: "col-2", code: "CTV-082", fullName: "Lý Thảo My", email: "my.ly@agency.com", phone: "089 333 4444", totalReferred: 12, commission: 3400000, status: "Hoạt động" },
  { id: "col-3", code: "CTV-083", fullName: "Bùi Quốc Khánh", email: "khanh.bui@gmail.com", phone: "086 555 7777", totalReferred: 0, commission: 0, status: "Chờ duyệt" },
];