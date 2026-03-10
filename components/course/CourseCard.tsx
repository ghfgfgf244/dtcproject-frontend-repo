import Link from "next/link";

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
  course: Course;
}

export default function CourseCard({ course }: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
      
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-r from-blue-500 to-sky-400 flex items-center justify-center text-xl font-semibold">
        🚗 {course.name}
      </div>

      <div className="p-6 flex flex-col justify-between h-64">
        <div>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>

          <p className="text-sky-400 font-bold text-lg">
            {course.price.toLocaleString()} VNĐ
          </p>

          <div className="mt-3 text-sm text-gray-400">
            <p>{course.center.name}</p>
            <p>{course.center.address}</p>
          </div>
        </div>

        <Link
          href={`/courses/${course.courseId}`}
          className="mt-6 inline-block text-center bg-sky-500 hover:bg-sky-600 transition px-4 py-2 rounded-lg font-semibold"
        >
          Xem Chi Tiết
        </Link>
      </div>
    </div>
  );
}