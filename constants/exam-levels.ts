export const EXAM_LEVEL_OPTIONS = [
  { value: 1, label: "A1" },
  { value: 2, label: "A" },
  { value: 3, label: "B1" },
  { value: 4, label: "B" },
  { value: 5, label: "C1" },
  { value: 6, label: "C" },
  { value: 7, label: "D1" },
  { value: 8, label: "D2" },
  { value: 9, label: "D" },
  { value: 10, label: "BE" },
  { value: 11, label: "C1E" },
  { value: 12, label: "CE" },
  { value: 13, label: "D1E" },
  { value: 14, label: "D2E" },
  { value: 15, label: "DE" },
] as const;

export type ExamLevelLabel = (typeof EXAM_LEVEL_OPTIONS)[number]["label"];

export const EXAM_LEVEL_LABEL_BY_VALUE: Record<number, ExamLevelLabel> = Object.fromEntries(
  EXAM_LEVEL_OPTIONS.map((item) => [item.value, item.label]),
) as Record<number, ExamLevelLabel>;

export const EXAM_LEVEL_VALUE_BY_LABEL: Record<string, number> = Object.fromEntries(
  EXAM_LEVEL_OPTIONS.map((item) => [item.label, item.value]),
);
