export interface Course {
  courseId: number;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  language: string;
  published: boolean;
  instructorEmail: string;
  thumbnailUrl: string;
  courseOptions?: CourseOption;
  topics: Topic[];
  studyMaterials: StudyMaterial[];
}

export interface CourseOption {
  benefits: string;
  prerequisites: string;
}

export interface Topic {
  name: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  name: string;
  videos: Video[];
}

export interface Video {
  title: string;
  description: string;
  url: string;
}

export interface StudyMaterial {
  name: string;
  fileName: string;
  fileUrl: string;
  downloadUrl: string;
}
