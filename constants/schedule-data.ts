// src/constants/schedule-data.ts
import { ScheduleEvent, CourseStatusItem, WeeklyInsight, DailyInsight } from "@/types/schedule";

// FIX: eventType values must match ScheduleEventType = "Theory" | "Practice" | "Simulator" | "Exam"
//      Also added required fields: classId, className, instructorId, startDateTime, endDateTime, dateKey, addressId, addressName
export const MOCK_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 'EV-01',
    classId: 'CLS-01',
    className: 'Lái xe cơ bản',
    courseId: 'B2-01',
    courseName: 'Lái xe cơ bản',
    instructorId: 'INS-01',
    instructorName: 'Nguyễn Văn A',
    eventType: 'Theory',
    startTime: '08:00',
    endTime: '10:00',
    startDateTime: '2024-10-02T08:00:00',
    endDateTime: '2024-10-02T10:00:00',
    dateKey: '2024-10-02',
    addressId: 1,
    addressName: 'Phòng 101 - Tòa A',
  },
  {
    id: 'EV-02',
    classId: 'CLS-02',
    className: 'Sa hình tổng hợp',
    courseId: 'C-15',
    courseName: 'Sa hình tổng hợp',
    instructorId: 'INS-02',
    instructorName: 'Trần Thị B',
    eventType: 'Practice',
    startTime: '13:30',
    endTime: '15:30',
    startDateTime: '2024-10-04T13:30:00',
    endDateTime: '2024-10-04T15:30:00',
    dateKey: '2024-10-04',
    addressId: 2,
    addressName: 'Sân tập số 1',
  },
  {
    id: 'EV-03',
    classId: 'CLS-03',
    className: 'Cabin điện tử',
    courseId: 'B2-04',
    courseName: 'Cabin điện tử',
    instructorId: 'INS-03',
    instructorName: 'Lê Văn C',
    eventType: 'Simulator',
    startTime: '09:00',
    endTime: '11:00',
    startDateTime: '2024-10-05T09:00:00',
    endDateTime: '2024-10-05T11:00:00',
    dateKey: '2024-10-05',
    addressId: 3,
    addressName: 'Phòng Cabin Mô phỏng',
  },
  {
    id: 'EV-04',
    classId: 'CLS-04',
    className: 'Luật Giao thông',
    courseId: 'B2-02',
    courseName: 'Luật Giao thông',
    instructorId: 'INS-01',
    instructorName: 'Nguyễn Văn A',
    eventType: 'Theory',
    startTime: '08:00',
    endTime: '10:00',
    startDateTime: '2024-10-09T08:00:00',
    endDateTime: '2024-10-09T10:00:00',
    dateKey: '2024-10-09',
    addressId: 1,
    addressName: 'Phòng 101 - Tòa A',
  },
  {
    id: 'EV-05',
    classId: 'CLS-05',
    className: 'Biển báo giao thông',
    courseId: 'B2-01',
    courseName: 'Biển báo giao thông',
    instructorId: 'INS-01',
    instructorName: 'Nguyễn Văn A',
    eventType: 'Theory',
    startTime: '08:00',
    endTime: '10:00',
    startDateTime: '2024-10-12T08:00:00',
    endDateTime: '2024-10-12T10:00:00',
    dateKey: '2024-10-12',
    addressId: 1,
    addressName: 'Phòng 101 - Tòa A',
  },
  {
    id: 'EV-06',
    classId: 'CLS-06',
    className: 'Thực hành đường trường',
    courseId: 'C-12',
    courseName: 'Thực hành đường trường',
    instructorId: 'INS-02',
    instructorName: 'Trần Thị B',
    eventType: 'Practice',
    startTime: '13:30',
    endTime: '15:30',
    startDateTime: '2024-10-15T13:30:00',
    endDateTime: '2024-10-15T15:30:00',
    dateKey: '2024-10-15',
    addressId: 2,
    addressName: 'Sân tập số 2',
  }
];

export const MOCK_DAILY_EVENTS: ScheduleEvent[] = [
  {
    id: 'EV-D1',
    classId: 'Lớp B2-2023-A1',
    className: 'Luật giao thông đường bộ & Biển báo',
    courseId: 'Lớp B2-2023-A1',
    courseName: 'Luật giao thông đường bộ & Biển báo',
    instructorId: 'INS-01',
    instructorName: 'Nguyễn Văn An',
    eventType: 'Theory',
    startTime: '08:00',
    endTime: '10:30',
    startDateTime: '2024-10-24T08:00:00',
    endDateTime: '2024-10-24T10:30:00',
    dateKey: '2024-10-24',
    addressId: 1,
    addressName: 'Phòng 302 - Tòa A',
    location: 'Phòng 302 - Tòa A',
    studentCount: 15
  },
  {
    id: 'EV-D2',
    classId: 'Lớp B1-2023-C2',
    className: 'Kỹ thuật lái xe trong hình',
    courseId: 'Lớp B1-2023-C2',
    courseName: 'Kỹ thuật lái xe trong hình',
    instructorId: 'INS-02',
    instructorName: 'Trần Thanh Tùng',
    eventType: 'Practice',
    startTime: '13:00',
    endTime: '15:00',
    startDateTime: '2024-10-24T13:00:00',
    endDateTime: '2024-10-24T15:00:00',
    dateKey: '2024-10-24',
    addressId: 2,
    addressName: 'Sân tập số 2',
    location: 'Sân tập số 2',
    studentCount: 15
  },
  {
    id: 'EV-D3',
    classId: 'Lớp C-2023-F4',
    className: 'Xử lý tình huống giao thông nguy hiểm (Cabin)',
    courseId: 'Lớp C-2023-F4',
    courseName: 'Xử lý tình huống giao thông nguy hiểm (Cabin)',
    instructorId: 'INS-03',
    instructorName: 'Lê Hoàng Nam',
    eventType: 'Simulator',
    startTime: '15:00',
    endTime: '17:00',
    startDateTime: '2024-10-24T15:00:00',
    endDateTime: '2024-10-24T17:00:00',
    dateKey: '2024-10-24',
    addressId: 3,
    addressName: 'Phòng Cabin Mô phỏng',
    location: 'Phòng Cabin Mô phỏng',
    studentCount: 15
  }
];

// FIX: type and status must use English enum values; added required classId/className
export const MOCK_COURSE_STATUSES: CourseStatusItem[] = [
  {
    id: 'ST-01',
    classId: 'CLS-01',
    className: 'Lý thuyết',
    courseCode: 'B2-01',
    courseName: 'Lý thuyết',
    instructorName: 'Nguyễn Văn A',
    type: 'Theory',
    status: 'Completed'
  },
  {
    id: 'ST-02',
    classId: 'CLS-02',
    className: 'Thực hành',
    courseCode: 'C-15',
    courseName: 'Thực hành',
    instructorName: 'Trần Thị B',
    type: 'Practice',
    status: 'Pending'
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