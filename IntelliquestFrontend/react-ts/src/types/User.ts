export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'INSTRUCTOR' | 'ADMIN';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  courses?: Course[]; // if instructor
}




// 🔁 REPLACED UserRole object with enum for simplicity
export enum UserRoleName {
  USER = 'USER',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
}


export interface InstructorProfile {
  bio: string;
  experience: string;
  teachingStyle: string;
  socialLinks: SocialLinks;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

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
