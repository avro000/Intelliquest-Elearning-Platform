import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Course } from "@/types/Course";

interface InstructorCoursesDrawerProps {
  open: boolean;
  onClose: () => void;
  courses: Course[];
}

export const InstructorCoursesDrawer = ({
  open,
  onClose,
  courses,
}: InstructorCoursesDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold text-foreground">Instructor's Courses</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            Here are all the courses created by this instructor. You can view their details and status.
          </DrawerDescription>
        </DrawerHeader>

        <div className="mt-6 max-h-[60vh] overflow-y-auto px-4 pb-6">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.courseId}
                  className="rounded-xl bg-gray-700 bg-opacity-50 p-6 shadow-lg hover:scale-105 transition-transform"
                >
                  {/* Thumbnail with full display */}
                  <img
                    src={course.thumbnailUrl || "/fallback.jpg"} // Default fallback image
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-100 truncate">{course.title}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2 mb-4">{course.description}</p>
                  <div className="text-xs text-gray-200 space-y-2">
                    <p>Category: <span className="font-medium">{course.category}</span></p>
                    <p>Level: <span className="font-medium">{course.level}</span></p>
                    <p>Language: <span className="font-medium">{course.language}</span></p>
                    <p>Price: <span className="font-medium">₹{course.price}</span></p> {/* Change to rupee */}
                    <p
                      className={`font-medium ${
                        course.published ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {course.published ? "Published" : "Unpublished"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No courses available.
            </p>
          )}
        </div>

        <div className="flex justify-end mt-4 px-4">
          <DrawerClose asChild>
          <button className="px-6 py-2 text-sm rounded bg-red-500 text-white font-medium border border-transparent transition-all duration-200 ease-in-out shadow-md hover:bg-white hover:text-black hover:border-black hover:font-semibold hover:shadow-lg focus:outline-none">
  Close
</button>



          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
