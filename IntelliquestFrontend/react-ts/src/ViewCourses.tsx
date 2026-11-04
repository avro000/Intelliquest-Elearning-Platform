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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <span>Admin</span>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                {!editingCourse ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Courses</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem>
                      <span className="cursor-pointer" onClick={handleBack}>Courses</span>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">Editing course: {editingCourse.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">
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