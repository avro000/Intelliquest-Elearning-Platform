import { useEffect, useState } from "react";
import { getAllCourses, deleteCourse } from "@/api/api"; // ✅ fixed import
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Course } from "@/types/Course";
import { AxiosError } from "axios";

export default function CourseTable() {
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      console.log(data); // Check the structure of `data` here

      // Ensure `data` is an array
      if (Array.isArray(data)) {
        setCourses(data); // Only set courses if the response is an array
      } else {
        setCourses([]); // Fallback to empty array if data is not an array
        console.error("Expected an array of courses, but received:", data);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Failed to fetch courses:", err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.error("Error:", err.message);
      } else {
        console.error("An unknown error occurred", err);
      }
      setCourses([]); // Fallback to empty array in case of error
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id);
      setCourses((prevCourses) => prevCourses.filter((course) => ((course as any).id ?? course.courseId) !== id)); // 🪄 update locally
    } catch (err) {
      console.error("Failed to delete course", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Courses</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Course ID</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Instructor</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course) => (
                <tr key={(course as any).id ?? course.courseId} className="border-t">
                  <td className="px-4 py-2">{(course as any).id ?? course.courseId}</td>
                  <td className="px-4 py-2">{course.title}</td>
                  <td className="px-4 py-2">{course.instructorEmail ?? (course as any).instructorId ?? "-"}</td>
                  <td className="px-4 py-2">
                    <Button variant="destructive" onClick={() => handleDelete((course as any).id ?? course.courseId)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center">No courses available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
