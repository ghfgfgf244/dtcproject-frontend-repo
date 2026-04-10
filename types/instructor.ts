export type InstructorStatus = "Active" | "Inactive" | "Pending";

export interface Instructor {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  licenses: string[];
  classesWeekly: number;
  status: InstructorStatus;
}

export interface InstructorFormData {
  id?: string;
  email: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  avatarUrl?: string;
}
