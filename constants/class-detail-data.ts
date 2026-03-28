// src/constants/class-detail-data.ts
import { ClassDetailRecord } from "@/types/class-detail";
import { StudentOption } from "@/types/class-detail";

export const MOCK_CLASS_DETAIL: ClassDetailRecord = {
  id: "cls-1",
  code: "B2",
  name: "Lớp B2 - Khóa Tháng 1/2026",
  courseName: "Đào tạo Lái xe Hạng B2 (Tiêu chuẩn)",
  status: "Active",
  startDate: "15 Thg 01, 2026",
  endDate: "20 Thg 05, 2026",
  instructor: {
    name: "Thầy Lê Hữu B",
    role: "Giảng viên Thực hành Cao cấp",
    email: "lehuub@drivesafe.vn",
    phone: "0901.234.567",
    avatarUrl: "https://ui-avatars.com/api/?name=Le+Huu+B&background=e2e8f0&color=475569"
  },
  location: {
    room: "Phòng Lý thuyết 102-B",
    building: "Cơ sở 1 - Tòa nhà Trung tâm"
  },
  students: [
    { id: "stu-1", fullName: "Nguyễn Văn An", email: "an.nguyen@email.com", enrollDate: "12 Thg 12, 2025", initials: "NA", theme: "blue" },
    { id: "stu-2", fullName: "Trần Thị Bé", email: "be.tran@email.com", enrollDate: "15 Thg 12, 2025", initials: "TB", theme: "pink" },
    { id: "stu-3", fullName: "Lê Hoàng Cường", email: "cuong.le@email.com", enrollDate: "02 Thg 01, 2026", initials: "LC", theme: "amber" },
    { id: "stu-4", fullName: "Phạm Dung", email: "dung.pham@email.com", enrollDate: "05 Thg 01, 2026", initials: "PD", theme: "emerald" },
  ]
};

export const MOCK_STUDENT_OPTIONS: StudentOption[] = [
  {
    id: "stu-search-1",
    fullName: "Nguyễn Thành Trung",
    email: "trung.nt@gmail.com",
    phone: "090 123 4567",
    avatar: "https://i.pravatar.cc/150?u=trung",
    enrolledCourses: ["Lập trình React", "Python Pro"]
  },
  {
    id: "stu-search-2",
    fullName: "Trần Thị Mỹ Hạnh",
    email: "hanhtran@edu.vn",
    phone: "098 888 7777",
    avatar: "https://i.pravatar.cc/150?u=hanh",
    enrolledCourses: ["Java Master"]
  },
  {
    id: "stu-search-3",
    fullName: "Đặng Quang Vinh",
    email: "vinhdang@gmail.com",
    phone: "097 555 4433",
    avatar: "https://i.pravatar.cc/150?u=vinh",
    enrolledCourses: ["Marketing Digital"]
  },
  {
    id: "stu-search-4",
    fullName: "Phạm Quỳnh Hoa",
    email: "hoapq@gmail.com",
    phone: "091 222 3344",
    avatar: "https://i.pravatar.cc/150?u=hoa",
    enrolledCourses: ["UI/UX Design", "Figma Mastery"]
  }
];