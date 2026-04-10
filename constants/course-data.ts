// src/constants/course-data.ts
import { CourseRecord } from "@/types/course";

export const MOCK_COURSES: CourseRecord[] = [
  { id: "crs-1", name: "Đào tạo Lái xe ô tô hạng B2 (Tiêu chuẩn)", description: "20 buổi thực hành • 1 kèm 1", licenseType: "B2", price: 14500000, status: "Hoạt động" },
  { id: "crs-2", name: "Đào tạo Lái xe ô tô tự động B1 (Cao cấp)", description: "24 buổi thực hành • Xe đời mới", licenseType: "B1", price: 16800000, status: "Hoạt động" },
  { id: "crs-3", name: "Đào tạo Lái xe Mô tô A1", description: "12 buổi • Bao gồm đồ bảo hộ", licenseType: "A1", price: 1200000, status: "Ngừng hoạt động" },
  { id: "crs-4", name: "Đào tạo Lái xe Tải hạng C", description: "30 buổi thực hành • Giấy phép nâng cao", licenseType: "C", price: 21000000, status: "Hoạt động" },
  { id: "crs-5", name: "Khóa bổ túc tay lái B2 (Cuối tuần)", description: "10 buổi thực hành • Lịch linh hoạt", licenseType: "B2", price: 8000000, status: "Hoạt động" },
  { id: "crs-6", name: "Đào tạo Mô tô A1 (Cấp tốc)", description: "Học T7 & CN • Thi nhanh gọn", licenseType: "A1", price: 1500000, status: "Hoạt động" },
  { id: "crs-7", name: "Nâng hạng B2 lên C", description: "Dành cho người đã có bằng B2", licenseType: "C", price: 11000000, status: "Hoạt động" }
];

export const MOCK_COURSE_DETAIL = {
  id: "crs-1",
  name: "Đào tạo Lái xe ô tô hạng B2 (Tiêu chuẩn)",
  status: "Hoạt động",
  licenseType: "B2",
  longDescription: "Gói Đào tạo Lái xe Tiêu chuẩn hạng B2 là chương trình phổ biến nhất dành cho học viên có nhu cầu thi lấy Giấy phép lái xe ô tô chở người đến 9 chỗ ngồi. Chương trình đào tạo toàn diện bao gồm lý thuyết Luật Giao thông đường bộ, kỹ năng thực hành sa hình cơ bản và huấn luyện đường trường thực tế. Đội ngũ giảng viên được cấp chứng chỉ của chúng tôi cam kết giúp học viên hình thành thói quen lái xe an toàn và tự tin vượt qua kỳ thi sát hạch quốc gia.",
  duration: "3 Tháng (Tiêu chuẩn)",
  inclusions: "Học Cabin mô phỏng, 810km đường trường DAT, Tài liệu ôn tập",
  price: 15000000
};