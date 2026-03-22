// src/constants/exam-result-data.ts
import { StudentResult, FilterOptions } from "@/types/exam-result";

export const FILTER_CONFIG: FilterOptions = {
  batches: ['Driver License B Summer 2024', 'Driver License A Winter 2024'],
  exams: ['Theory Test', 'Practical Test'],
  statuses: ['All Results', 'Passed Only', 'Failed Only']
};

export const MOCK_RESULTS: StudentResult[] = [
  { id: "res-1", studentId: "#AE-88921", studentName: "Alexander Morgan", initials: "AM", examName: "Theory Test", score: 94, isPassed: true, examDate: "Oct 12, 2024" },
  { id: "res-2", studentId: "#AE-88924", studentName: "Sarah Jenkins", initials: "SJ", examName: "Theory Test", score: 88, isPassed: true, examDate: "Oct 12, 2024" },
  { id: "res-3", studentId: "#AE-88930", studentName: "Marcus Wright", initials: "MW", examName: "Practical Test", score: 58, isPassed: false, examDate: "Oct 12, 2024" },
  { id: "res-4", studentId: "#AE-88941", studentName: "Elena Lopez", initials: "EL", examName: "Practical Test", score: 76, isPassed: true, examDate: "Oct 13, 2024" },
];