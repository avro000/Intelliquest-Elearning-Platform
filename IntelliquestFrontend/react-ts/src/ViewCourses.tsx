import { useState } from "react";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./components/Sidebar/mode-toggle";
import CourseList from "./CourseList";
import EditCourse from "./EditCourse";

interface Video {
  title: string;
  description: string;
  url: string;
}

interface Subtopic {
  name: string;
  videos: Video[];
}

interface Topic {
  name: string;
  subtopics: Subtopic[];
}

interface StudyMaterial {
  name: string;
  fileName: string;
  fileUrl: string;
  downloadUrl: string;
}

interface CourseOptions {
  benefits: string;
  prerequisites: string;
}

interface Course {
  courseId: number;
  title: string;
  description: string;
  price: number;
  category: string;
  instructorEmail: string;
  thumbnail: File | null;
  thumbnailUrl: string;
  level: string;
  language: string;
  topics: Topic[];
  courseOptions: CourseOptions;
  studyMaterials: StudyMaterial[];
  published: boolean;
}


export default function ViewCourses() {

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const handleBack = () => {
    setEditingCourse(null);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-y-auto">
        <header className="flex h-14 sm:h-16 shrink-0 items-center justify-between gap-2 px-3 sm:px-4 border-b">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SidebarTrigger className="-ml-1 shrink-0" />
            <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4 shrink-0" />
            <Breadcrumb className="min-w-0 flex-1">
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem className="hidden md:block shrink-0">
                  <span>Admin</span>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block shrink-0" />

                {!editingCourse ? (
                  <BreadcrumbItem className="shrink-0">
                    <BreadcrumbPage>Courses</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem className="shrink-0">
                      <span className="cursor-pointer hover:underline text-xs sm:text-sm font-medium" onClick={handleBack}>
                        Courses
                      </span>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="shrink-0" />
                    <BreadcrumbItem className="min-w-0">
                      <BreadcrumbPage className="capitalize truncate max-w-[170px] xs:max-w-[240px] sm:max-w-md md:max-w-xl text-xs sm:text-sm font-semibold">
                        Editing: {editingCourse.title}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="shrink-0 pl-1">
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-col gap-4 p-3 sm:p-5 pt-3 sm:pt-4">
          {editingCourse ? (
            <EditCourse course={editingCourse} onCancel={handleBack} />
          ) : (
            <CourseList onEdit={setEditingCourse} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}