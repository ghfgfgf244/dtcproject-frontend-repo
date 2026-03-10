export interface CourseItem {
  id: string;
  courseName: string;
  description: string;
  price: number;
  durationMonths: number;
  status: 'Active' | 'Draft' | 'Archived';
  category?: string; // Ví dụ: Car, Motorcycle, Truck
}