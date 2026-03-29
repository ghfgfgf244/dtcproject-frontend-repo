// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\components\course\CourseGrid.tsx

import CourseCard from "./CourseCard";
import styles from "@/styles/course-grid.module.css";
import { Course } from "@/types/course";

interface Props {
  courses: Course[];
}

export default function CourseGrid({ courses }: Props) {
  return (
    <div className={styles.grid}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
