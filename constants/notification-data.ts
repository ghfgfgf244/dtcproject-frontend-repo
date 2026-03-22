import { NotificationRecord, NotificationDetailRecord, SystemAlert } from "@/types/notification";
export const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: "notif-1",
    title: "Yêu cầu Đánh giá Tuân thủ Quý 3",
    timeAgo: "2 phút trước",
    message: "Tất cả nhân sự đào tạo bắt buộc phải hoàn thành bài đánh giá An toàn và Toàn vẹn Q3 2023 trước Thứ Sáu...",
    category: "System",
    status: "unread",
    actionText: "Làm bài ngay"
  },
  {
    id: "notif-2",
    title: "Học viên mới: Khóa B2 Nâng cao",
    timeAgo: "2 giờ trước",
    message: "Học viên Trần Văn Nam vừa hoàn tất thủ tục đăng ký và nộp đủ học phí cho khóa thực hành đường đèo.",
    category: "Enrollment",
    status: "unread",
    actionText: "Xem hồ sơ"
  },
  {
    id: "notif-3",
    title: "Phát hiện trùng lịch giảng dạy",
    timeAgo: "45 phút trước",
    message: "Phòng lý thuyết 402 đang bị trùng lịch giữa lớp 'Luật Giao thông' và 'Cấu tạo xe' vào sáng thứ Sáu.",
    category: "Schedule",
    status: "read",
    actionText: "Xử lý ngay"
  },
  {
    id: "notif-4",
    title: "Đã có điểm thi: Khóa A1 (Đợt 1)",
    timeAgo: "5 giờ trước",
    message: "Kết quả bài thi sát hạch lý thuyết A1 tổ chức vào thứ Hai đã được cập nhật lên hệ thống chính.",
    category: "Exams",
    status: "read",
  },
  {
    id: "notif-5",
    title: "Tài liệu mới được tải lên",
    timeAgo: "Hôm qua",
    message: "File PDF 'Hướng dẫn Sử dụng Camera Cabin 2024' vừa được thêm vào kho tài liệu dùng chung.",
    category: "Document",
    status: "read",
  }
];

export const MOCK_ALERTS: SystemAlert[] = [
  {
    id: "alert-1",
    title: "Vắng mặt Giảng viên",
    message: "Thầy Hùng xin nghỉ ốm đột xuất. Cần người dạy thay môn 'Thực hành B2 sa hình' ca 14:00 chiều nay.",
    type: "error"
  },
  {
    id: "alert-2",
    title: "Cảnh báo Máy chủ DAT",
    message: "Dung lượng lưu trữ dữ liệu Camera Cabin (DAT) đã đạt 85%. Cần sao lưu và dọn dẹp sớm.",
    type: "warning"
  }
];

import { BellNotification, UserRole } from "@/types/notification";

// Data cho Training Manager
const TRAINING_NOTIFICATIONS: BellNotification[] = [
  { id: 't1', title: 'Học viên mới đăng ký', message: 'Trần Văn A vừa đăng ký khóa học B2 Nâng cao.', timeAgo: '2 phút trước', isUnread: true, type: 'enrollment' },
  { id: 't2', title: 'Trùng lịch giảng dạy', message: 'Giảng viên Lê Hữu Bị trùng lịch ca 10:00 sáng mai.', timeAgo: '15 phút trước', isUnread: true, type: 'schedule' },
  { id: 't3', title: 'Điểm thi đã sẵn sàng', message: 'Kết quả thi lý thuyết khóa B2-2024 đã được cập nhật.', timeAgo: '1 giờ trước', isUnread: true, type: 'exam' },
  { id: 't4', title: 'Cập nhật giáo trình', message: 'Module An toàn giao thông đã được cập nhật lên v2.4.', timeAgo: '3 giờ trước', isUnread: false, type: 'document' },
];

// Data cho Enrollment Manager
const ENROLLMENT_NOTIFICATIONS: BellNotification[] = [
  { id: 'e1', title: 'Cộng tác viên mới', message: 'CTV Nguyễn Văn Minh vừa tạo tài khoản.', timeAgo: '5 phút trước', isUnread: true, type: 'system' },
  { id: 'e2', title: 'Hồ sơ chờ duyệt', message: 'Có 12 hồ sơ đăng ký mới đang chờ xác nhận.', timeAgo: '30 phút trước', isUnread: true, type: 'enrollment' },
  { id: 'e3', title: 'Bài đăng sắp hết hạn', message: 'Bài tuyển sinh "Ưu đãi tháng 10" sẽ hết hạn vào ngày mai.', timeAgo: '2 giờ trước', isUnread: false, type: 'system' },
];

// Data cho Admin
const ADMIN_NOTIFICATIONS: BellNotification[] = [
  { id: 'a1', title: 'Báo cáo doanh thu', message: 'Báo cáo tài chính tháng 10 đã được tổng hợp.', timeAgo: '10 phút trước', isUnread: true, type: 'finance' },
  { id: 'a2', title: 'Cảnh báo hệ thống', message: 'Dung lượng máy chủ lưu trữ video đã đạt 85%.', timeAgo: '1 giờ trước', isUnread: true, type: 'system' },
  { id: 'a3', title: 'Phân quyền mới', message: 'Tài khoản "Manager_02" vừa được cấp quyền Quản lý.', timeAgo: '4 giờ trước', isUnread: false, type: 'system' },
];

// Map data theo Role
export const getNotificationsByRole = (role: UserRole): BellNotification[] => {
  if (role === 'training_manager') return TRAINING_NOTIFICATIONS;
  if (role === 'enrollment_manager') return ENROLLMENT_NOTIFICATIONS;
  return ADMIN_NOTIFICATIONS;
};

export const MOCK_NOTIFICATION_DETAILS: Record<string, NotificationDetailRecord> = {
  "notif-1": {
    id: "notif-1-3444-4e20",
    tag: "CẢNH BÁO HỆ THỐNG",
    title: "Yêu cầu Đánh giá Tuân thủ Quý 3",
    type: "Bắt buộc tuân thủ",
    content: [
      "Tất cả nhân sự đào tạo bắt buộc phải hoàn thành bài đánh giá An toàn và Toàn vẹn Q3 2024 trước Thứ Sáu, ngày 27 tháng 10. Bài đánh giá này bao gồm các bản cập nhật mới nhất về quy trình đào tạo thực hành lái xe và tiêu chuẩn tuân thủ của Sở GTVT.",
      "Vui lòng đảm bảo tất cả hồ sơ học viên của khóa hiện tại được chốt trước khi bắt đầu bài đánh giá. Việc không hoàn thành đúng thời hạn có thể dẫn đến việc tạm thời bị đình chỉ lịch phân công giảng dạy.",
      "Nếu bạn có thắc mắc về quy trình mới, vui lòng tham khảo tài liệu trong Trung tâm Trợ giúp hoặc liên hệ trực tiếp với Phòng Đào tạo."
    ],
    centerId: "CTR-81e728d-9d3b",
    isDeleted: false,
    createdAt: "12 Thg 10, 2024 • 09:42 SA",
    createdBy: { id: "AD-1a2b3c", name: "Hệ thống Tự động", initials: "SYS" },
    updatedAt: "12 Thg 10, 2024 • 09:42 SA",
    updatedBy: { id: "AD-1a2b3c", name: "Hệ thống Tự động", initials: "SYS" }
  },
  "notif-2": {
    id: "notif-2-5555-9a8b",
    tag: "THÔNG BÁO TUYỂN SINH",
    title: "Học viên mới: Khóa B2 Nâng cao",
    type: "Ghi danh mới",
    content: [
      "Hệ thống vừa ghi nhận một hồ sơ đăng ký thành công cho Khóa học B2 Nâng cao (Thực hành đường đèo và sa hình phức tạp).",
      "Thông tin học viên: Trần Văn Nam (SĐT: 0987.xxx.xxx). Học viên đã hoàn thành thanh toán 100% học phí qua cổng thanh toán VNPay.",
      "Vui lòng bộ phận Đào tạo tiến hành sắp xếp Giảng viên hướng dẫn thực hành và gửi thông báo lịch học dự kiến cho học viên trong vòng 24h tới."
    ],
    centerId: "CTR-81e728d-9d3b",
    isDeleted: false,
    createdAt: "14 Thg 10, 2024 • 08:15 SA",
    createdBy: { id: "EN-5e6f7g", name: "Nguyễn Thị Mai", initials: "NM" },
    updatedAt: "14 Thg 10, 2024 • 08:20 SA",
    updatedBy: { id: "EN-5e6f7g", name: "Nguyễn Thị Mai", initials: "NM" }
  },
  "notif-3": {
    id: "notif-3-7777-1c2d",
    tag: "QUẢN LÝ LỊCH TRÌNH",
    title: "Phát hiện trùng lịch giảng dạy",
    type: "Lỗi xếp lịch",
    content: [
      "Hệ thống tự động quét và phát hiện có sự cố trùng lặp phòng học tại Cơ sở 1.",
      "Chi tiết sự cố: Phòng lý thuyết 402 đang được gán đồng thời cho lớp 'Luật Giao thông đường bộ' (Giảng viên: Lê Hữu B) và lớp 'Cấu tạo & Sửa chữa xe cơ bản' (Giảng viên: Trần Văn C) vào ca 08:00 - 10:00 sáng Thứ Sáu tuần này.",
      "Yêu cầu Quản lý Đào tạo vào phân hệ Xếp lịch để điều chỉnh lại phòng học hoặc thời gian tránh gây ảnh hưởng đến học viên."
    ],
    centerId: "CTR-81e728d-9d3b",
    isDeleted: false,
    createdAt: "14 Thg 10, 2024 • 10:30 SA",
    createdBy: { id: "SYS-AUTO", name: "Auto Scheduler", initials: "BOT" },
    updatedAt: "14 Thg 10, 2024 • 10:30 SA",
    updatedBy: { id: "SYS-AUTO", name: "Auto Scheduler", initials: "BOT" }
  },
  "notif-4": {
    id: "notif-4-8888-3e4f",
    tag: "QUẢN LÝ THI CỬ",
    title: "Đã có điểm thi: Khóa A1 (Đợt 1)",
    type: "Cập nhật kết quả",
    content: [
      "Phòng Khảo thí thông báo: Kết quả bài thi sát hạch lý thuyết Hạng A1 (Đợt 1 - Tháng 10) tổ chức vào thứ Hai vừa qua đã được chấm xong và cập nhật thành công lên hệ thống.",
      "Tỷ lệ đỗ đạt 92%. Có 3 học viên vắng mặt không lý do. Danh sách chi tiết đã được đính kèm trong phân hệ 'Quản lý Điểm thi'.",
      "Giảng viên phụ trách vui lòng kiểm tra và thông báo lịch thi lại (nếu có) cho các học viên chưa đạt."
    ],
    centerId: "CTR-81e728d-9d3b",
    isDeleted: false,
    createdAt: "13 Thg 10, 2024 • 16:45 CH",
    createdBy: { id: "EX-9h0i1j", name: "Phạm Văn Khảo", initials: "PK" },
    updatedAt: "13 Thg 10, 2024 • 17:00 CH",
    updatedBy: { id: "EX-9h0i1j", name: "Phạm Văn Khảo", initials: "PK" }
  },
  "notif-5": {
    id: "notif-5-9999-5g6h",
    tag: "QUẢN LÝ TÀI LIỆU",
    title: "Tài liệu mới được tải lên",
    type: "Tài liệu nội bộ",
    content: [
      "Kho tài liệu đào tạo vừa được bổ sung ấn phẩm mới: 'Hướng dẫn Sử dụng Camera Cabin và Thiết bị DAT (Phiên bản 2024)'.",
      "Tài liệu này bao gồm các quy định mới nhất của Bộ GTVT về việc ghi nhận quãng đường học thực hành và cách xử lý khi thiết bị mất tín hiệu.",
      "Đề nghị toàn thể Giảng viên thực hành tải về và nghiên cứu kỹ trước kỳ giảng dạy tháng tới."
    ],
    centerId: "CTR-81e728d-9d3b",
    isDeleted: false,
    createdAt: "11 Thg 10, 2024 • 08:00 SA",
    createdBy: { id: "TR-2k3l4m", name: "Đào Tạo Vụ", initials: "DV" },
    updatedAt: "11 Thg 10, 2024 • 08:00 SA",
    updatedBy: { id: "TR-2k3l4m", name: "Đào Tạo Vụ", initials: "DV" }
  }
};