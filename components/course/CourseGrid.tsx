import CourseCard from "./CourseCard";

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
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
}