// src/constants/schedule-data.ts
import { ScheduleEvent, CourseStatusItem, WeeklyInsight, DailyInsight } from "@/types/schedule";

export const MOCK_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 'EV-01',
    courseId: 'B2-01',
    courseName: 'Lái xe cơ bản',
    eventType: 'Lý thuyết',
    startTime: '08:00',
    endTime: '10:00',
    instructorName: 'Nguyễn Văn A',
    date: 2
  },
  {
    id: 'EV-02',
    courseId: 'C-15',
    courseName: 'Sa hình tổng hợp',
    eventType: 'Thực hành',
    startTime: '13:30',
    endTime: '15:30',
    instructorName: 'Trần Thị B',
    date: 4
  },
  {
    id: 'EV-03',
    courseId: 'B2-04',
    courseName: 'Cabin điện tử',
    eventType: 'Mô phỏng',
    startTime: '09:00',
    endTime: '11:00',
    instructorName: 'Lê Văn C',
    date: 5
  },
  {
    id: 'EV-04',
    courseId: 'B2-02',
    courseName: 'Luật Giao thông',
    eventType: 'Lý thuyết',
    startTime: '08:00',
    endTime: '10:00',
    instructorName: 'Nguyễn Văn A',
    date: 9
  },
  {
    id: 'EV-05',
    courseId: 'B2-01',
    courseName: 'Biển báo giao thông',
    eventType: 'Lý thuyết',
    startTime: '08:00',
    endTime: '10:00',
    instructorName: 'Nguyễn Văn A',
    date: 12
  },
  {
    id: 'EV-06',
    courseId: 'C-12',
    courseName: 'Thực hành đường trường',
    eventType: 'Thực hành',
    startTime: '13:30',
    endTime: '15:30',
    instructorName: 'Trần Thị B',
    date: 15
  }
];

export const MOCK_DAILY_EVENTS: ScheduleEvent[] = [
  {
    id: 'EV-D1',
    courseId: 'Lớp B2-2023-A1',
    courseName: 'Luật giao thông đường bộ & Biển báo',
    eventType: 'Lý thuyết',
    startTime: '08:00',
    endTime: '10:30',
    instructorName: 'Nguyễn Văn An',
    location: 'Phòng 302 - Tòa A',
    date: 24,
    studentCount: 15
  },
  {
    id: 'EV-D2',
    courseId: 'Lớp B1-2023-C2',
    courseName: 'Kỹ thuật lái xe trong hình',
    eventType: 'Thực hành',
    startTime: '13:00',
    endTime: '15:00',
    instructorName: 'Trần Thanh Tùng',
    location: 'Sân tập số 2',
    date: 24,
    studentCount: 15
  },
  {
    id: 'EV-D3',
    courseId: 'Lớp C-2023-F4',
    courseName: 'Xử lý tình huống giao thông nguy hiểm (Cabin)',
    eventType: 'Mô phỏng',
    startTime: '15:00',
    endTime: '17:00',
    instructorName: 'Lê Hoàng Nam',
    location: 'Phòng Cabin Mô phỏng',
    date: 24,
    studentCount: 15
  }
];

export const MOCK_COURSE_STATUSES: CourseStatusItem[] = [
  {
    id: 'ST-01',
    courseCode: 'B2-01',
    courseName: 'Lý thuyết',
    instructorName: 'Nguyễn Văn A',
    type: 'Lý thuyết',
    status: 'Hoàn thành'
  },
  {
    id: 'ST-02',
    courseCode: 'C-15',
    courseName: 'Thực hành',
    instructorName: 'Trần Thị B',
    type: 'Thực hành',
    status: 'Sắp diễn ra'
  }
];

export const MOCK_WEEKLY_INSIGHTS: WeeklyInsight = {
  completedClasses: 12,
  totalClasses: 48,
  activeClasses: 8,
  pendingCourses: 3
};

export const MOCK_DAILY_INSIGHTS: DailyInsight = {
  theoryCount: 1,
  practiceCount: 1,
  simulationCount: 1,
  totalStudents: 45
};