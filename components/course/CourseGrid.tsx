import CourseCard from "./CourseCard";
import styles from "@/styles/course-grid.module.css";

interface Course {
  courseId: number;
  name: string;
  description: string;
  price: number;
  center: {
    name: string;
    address: string;
  };
}

interface Props {
  courses: Course[];
}

export default function CourseGrid({ courses }: Props) {
  return (
    <div className={styles.grid}>
      {courses.map((course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
}
