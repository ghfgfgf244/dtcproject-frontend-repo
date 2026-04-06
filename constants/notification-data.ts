import { NotificationRecord, NotificationDetailRecord, SystemAlert, BellNotification, UserRole } from "@/types/notification";

export const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: "notif-1",
    title: "Yêu cầu Đánh giá Tuân thủ Quý 3",
    message: "Tất cả nhân sự đào tạo bắt buộc phải hoàn thành bài đánh giá An toàn và Toàn vẹn Q3 2023 trước Thứ Sáu...",
    content: "Chi tiết: Tất cả nhân sự đào tạo bắt buộc phải hoàn thành bài đánh giá An toàn và Toàn vẹn Q3 2023 trước Thứ Sáu...",
    type: "System",
    typeLabel: "Thông báo hệ thống",
    isRead: false,
    createdAt: new Date().toISOString(),
    timeAgo: "2 phút trước"
  },
  {
    id: "notif-2",
    title: "Học viên mới: Khóa B2 Nâng cao",
    message: "Học viên Trần Văn Nam vừa hoàn tất thủ tục đăng ký và nộp đủ học phí cho khóa thực hành đường đèo.",
    content: "Chi tiết: Học viên Trần Văn Nam vừa hoàn tất thủ tục đăng ký và nộp đủ học phí cho khóa thực hành đường đèo.",
    type: "Registration",
    typeLabel: "Đăng ký khóa học",
    isRead: false,
    createdAt: new Date().toISOString(),
    timeAgo: "2 giờ trước"
  },
  {
    id: "notif-3",
    title: "Phát hiện trùng lịch giảng dạy",
    message: "Phòng lý thuyết 402 đang bị trùng lịch giữa lớp 'Luật Giao thông' và 'Cấu tạo xe' vào sáng thứ Sáu.",
    content: "Chi tiết: Phòng lý thuyết 402 đang bị trùng lịch giữa lớp 'Luật Giao thông' và 'Cấu tạo xe' vào sáng thứ Sáu.",
    type: "Class",
    typeLabel: "Thông báo lớp học",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "45 phút trước"
  },
  {
    id: "notif-4",
    title: "Đã có điểm thi: Khóa A1 (Đợt 1)",
    message: "Kết quả bài thi sát hạch lý thuyết A1 tổ chức vào thứ Hai đã được cập nhật lên hệ thống chính.",
    content: "Kết quả bài thi sát hạch lý thuyết A1 tổ chức vào thứ Hai đã được cập nhật lên hệ thống chính.",
    type: "Exam",
    typeLabel: "Thông báo kỳ thi",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "5 giờ trước"
  },
  {
    id: "notif-5",
    title: "Tài liệu mới được tải lên",
    message: "File PDF 'Hướng dẫn Sử dụng Camera Cabin 2024' vừa được thêm vào kho tài liệu dùng chung.",
    content: "File PDF 'Hướng dẫn Sử dụng Camera Cabin 2024' vừa được thêm vào kho tài liệu dùng chung.",
    type: "System",
    typeLabel: "Thông báo hệ thống",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "Hôm qua"
  },
  {
    id: "notif-6",
    title: "Cập nhật Chính sách Bảo mật",
    message: "Chính sách bảo mật dữ liệu học viên vừa được cập nhật theo Nghị định mới.",
    content: "Chính sách bảo mật dữ liệu học viên vừa được cập nhật theo Nghị định mới.",
    type: "System",
    typeLabel: "Thông báo hệ thống",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "Hôm qua"
  },
  {
    id: "notif-7",
    title: "Lịch thi sát hạch tháng 11",
    message: "Lịch thi dự kiến cho các khóa B2-K22 và C-K15 đã được phê duyệt.",
    content: "Lịch thi dự kiến cho các khóa B2-K22 và C-K15 đã được phê duyệt.",
    type: "Exam",
    typeLabel: "Thông báo kỳ thi",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "2 ngày trước"
  },
  {
    id: "notif-8",
    title: "Bảo trì hệ thống DAT",
    message: "Hệ thống giám sát hành trình sẽ bảo trì vào 0h00 Chủ nhật tới.",
    content: "Hệ thống giám sát hành trình sẽ bảo trì vào 0h00 Chủ nhật tới.",
    type: "System",
    typeLabel: "Thông báo hệ thống",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "3 ngày trước"
  },
  {
    id: "notif-9",
    title: "Khen thưởng Giảng viên xuất sắc",
    message: "Chúc mừng Thầy Nguyễn Văn A đã đạt tỷ lệ học viên đỗ 100% trong tháng 9.",
    content: "Chúc mừng Thầy Nguyễn Văn A đã đạt tỷ lệ học viên đỗ 100% trong tháng 9.",
    type: "System",
    typeLabel: "Thông báo hệ thống",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "3 ngày trước"
  },
  {
    id: "notif-10",
    title: "Thông báo Nghỉ lễ",
    message: "Trung tâm sẽ nghỉ lễ vào ngày 20/10, học viên thực hành sẽ được sắp xếp bù.",
    content: "Trung tâm sẽ nghỉ lễ vào ngày 20/10, học viên thực hành sẽ được sắp xếp bù.",
    type: "System",
    typeLabel: "Thông báo hệ thống",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "4 ngày trước"
  },
  {
    id: "notif-11",
    title: "Học viên hoàn thành khóa học",
    message: "Có 25 học viên vừa hoàn thành bài kiểm tra cuối khóa hạng B1.",
    content: "Có 25 học viên vừa hoàn thành bài kiểm tra cuối khóa hạng B1.",
    type: "Registration",
    typeLabel: "Đăng ký khóa học",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "5 ngày trước"
  },
  {
    id: "notif-12",
    title: "Cảnh báo quá hạn nộp hồ sơ",
    message: "Còn 10 học viên chưa nộp đủ ảnh chân dung cho hồ sơ thi sát hạch.",
    content: "Còn 10 học viên chưa nộp đủ ảnh chân dung cho hồ sơ thi sát hạch.",
    type: "Registration",
    typeLabel: "Đăng ký khóa học",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "1 tuần trước"
  },
  {
    id: "notif-13",
    title: "Cập nhật ứng dụng di động",
    message: "Phiên bản mới của DTC Mobile App đã có mặt trên iOS và Android.",
    content: "Phiên bản mới của DTC Mobile App đã có mặt trên iOS và Android.",
    type: "System",
    typeLabel: "Thông báo hệ thống",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "1 tuần trước"
  },
  {
    id: "notif-14",
    title: "Thông báo thu học phí đợt 2",
    message: "Đề nghị các học viên khóa C-K18 hoàn thành học phí trước ngày 15/11.",
    content: "Đề nghị các học viên khóa C-K18 hoàn thành học phí trước ngày 15/11.",
    type: "Registration",
    typeLabel: "Đăng ký khóa học",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "2 tuần trước"
  },
  {
    id: "notif-15",
    title: "Lễ bế giảng khóa B2-K21",
    message: "Buổi lễ bế giảng sẽ diễn ra vào sáng Thứ 7 tuần này tại Hội trường lớn.",
    content: "Buổi lễ bế giảng sẽ diễn ra vào sáng Thứ 7 tuần này tại Hội trường lớn.",
    type: "Class",
    typeLabel: "Thông báo lớp học",
    isRead: true,
    createdAt: new Date().toISOString(),
    timeAgo: "2 tuần trước"
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
    ...MOCK_NOTIFICATIONS[0],
  },
  "notif-2": {
    ...MOCK_NOTIFICATIONS[1],
  },
  "notif-3": {
    ...MOCK_NOTIFICATIONS[2],
  },
  "notif-4": {
    ...MOCK_NOTIFICATIONS[3],
  },
  "notif-5": {
    ...MOCK_NOTIFICATIONS[4],
  }
};