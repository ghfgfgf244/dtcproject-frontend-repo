import { Instructor, InstructorStatsData } from "@/types/instructor";

export const MOCK_INSTRUCTOR_STATS: InstructorStatsData = {
  total: 24,
  newThisMonth: 2,
  activeToday: 18,
  capacityPercent: 75,
  avgRating: 4.8,
  pendingCerts: 3
};

export const FILTER_OPTIONS = {
  licenses: ['All Licenses', 'Class B1', 'Class B2', 'Class C'],
  statuses: ['All Statuses', 'Active', 'Inactive']
};

export const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: "ins-1", code: "INS-49201", name: "Marcus Sterling", email: "m.sterling@driving.edu", phone: "+1 (555) 012-3456",
    avatar: "https://i.pravatar.cc/150?img=11", licenses: ['B1', 'B2'], classesWeekly: 8, status: "Active"
  },
  {
    id: "ins-2", code: "INS-22831", name: "Sarah Jenkins", email: "s.jenkins@driving.edu", phone: "+1 (555) 098-7654",
    avatar: "https://i.pravatar.cc/150?img=5", licenses: ['C'], classesWeekly: 4, status: "Active"
  },
  {
    id: "ins-3", code: "INS-33104", name: "David Thorne", email: "d.thorne@driving.edu", phone: "+1 (555) 443-2211",
    avatar: "https://i.pravatar.cc/150?img=68", licenses: ['B2'], classesWeekly: 0, status: "Inactive"
  }
];