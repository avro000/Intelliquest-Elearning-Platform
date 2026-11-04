import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { AlertCircle, FilePenLine, Trash } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { TbCloudOff } from "react-icons/tb";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Skeleton } from "./components/ui/skeleton";

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
    thumbnailUrl: string;
    thumbnail: File | null;
    level: string;
    language: string;
    topics: Topic[];
    courseOptions: CourseOptions;
    studyMaterials: StudyMaterial[];
    published: boolean;
}

interface Instructor {
    sub: string;
    name: string;
    picture: string;
}

interface CourseListProps {
    onEdit: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onEdit }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [instructor, setInstructor] = useState<Instructor | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found.");
            setLoading(false);
            return;
        }

        try {
            const decoded: Instructor = jwtDecode(token);
            setInstructor(decoded);
            axios
                .get("http://localhost:9092/auth/instructor-courses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    const allCourses: Course[] = res.data;
                    setCourses(allCourses);
                })
                .catch((err) => {
                    console.error("Error fetching courses:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            console.error("Failed to decode token", error);
            setLoading(false);
        }
    }, []);

    const handleDelete = (courseId: number) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found.");
            return;
        }

        axios
            .delete(`http://localhost:9092/auth/courses/${courseId}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setCourses((prevCourses) => prevCourses.filter((course) => course.courseId !== courseId));

                toast.success("Course deleted", {
                    description: response.data,
                    style: {
                        backgroundColor: "#16a34a",
                        color: "white",
                    },
                });
            })
            .catch((error) => {
                toast.error("Error deleting course", {
                    description: error.response?.data || "Please try again.",
                    style: {
                        backgroundColor: "#dc2626",
                        color: "white",
                    },
                });
            });
    };

    const handlePublish = (courseId: number) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found.");
            return;
        }

        axios
            .patch(
                `http://localhost:9092/auth/courses/${courseId}/publish`,
                { published: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                setCourses((prevCourses) =>
                    prevCourses.map((course) =>
                        course.courseId === courseId ? { ...course, published: true } : course
                    )
                );
                toast.success("Course published", {
                    description: response.data,
                    style: {
                        backgroundColor: "#16a34a",
                        color: "white",
                    },
                });
            })
            .catch((error) => {
                toast.error("Error publishing course", {
                    description: error.response?.data || "Please try again.",
                    style: {
                        backgroundColor: "#dc2626",
                        color: "white",
                    },
                });
            });
    };

    const handleUnpublish = (courseId: number) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found.");
            return;
        }

        axios
            .patch(
                `http://localhost:9092/auth/courses/${courseId}/publish`,
                { published: false },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                setCourses((prevCourses) =>
                    prevCourses.map((course) =>
                        course.courseId === courseId ? { ...course, published: false } : course
                    )
                );
                toast.success("Course unpublished", {
                    description: response.data,
                    style: {
                        backgroundColor: "#f97316",
                        color: "white",
                    },
                });
            })
            .catch((error) => {
                toast.error("Error unpublishing course", {
                    description: error.response?.data || "Please try again.",
                    style: {
                        backgroundColor: "#dc2626",
                        color: "white",
                    },
                });
            });

    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="rounded-2xl transition duration-300 group pt-0 overflow-hidden">
                        <Skeleton className="w-full h-48 rounded-t-2xl" />
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-6 w-3/4 rounded" />
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-5 w-20 rounded-md" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16 rounded-md" />
                                <Skeleton className="h-5 w-16 rounded-md" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-7 w-7 rounded-full" />
                                <div className="space-y-1 flex-1">
                                    <Skeleton className="h-3 w-24 rounded" />
                                    <Skeleton className="h-3 w-32 rounded" />
                                </div>
                                <Skeleton className="h-8 w-16 rounded-md" />
                                <Skeleton className="h-8 w-10 rounded-md" />
                            </div>
                            <Skeleton className="h-10 w-full rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length > 0 ? (
                courses.map((course) => (
                    <Card key={course.courseId} className="rounded-2xl transition duration-300 group pt-0">
                        <div className="relative overflow-hidden rounded-t-2xl">
                            <img
                                src={course.thumbnailUrl}
                                alt={course.title}
                                className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute bottom-2 right-2 z-40">
                                <Badge className="bg-white/10 backdrop-blur-md text-card-foreground border border-white/20 shadow-md text-sm">
                                    &#8377; {course.price}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
                            <CardDescription className="text-sm">{course.description}</CardDescription>
                            <div>
                                <Badge variant="outline">{course.category}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div>
                                <Badge variant="secondary">{course.level}</Badge> |{" "}
                                <Badge variant="secondary">{course.language}</Badge>
                            </div>
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src={instructor?.picture || ""} alt={instructor?.name || "User"} />
                                    <AvatarFallback className="rounded-lg">
                                        {instructor?.name?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate font-semibold text-xs">by, {instructor?.name || "User"}</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {instructor?.sub || "Loading..."}
                                    </span>
                                </div>
                                <div>
                                    <Button variant="outline" onClick={() => onEdit(course)}>
                                        <FilePenLine /> Edit
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        className="p-5"
                                        variant="destructive"
                                        onClick={() => handleDelete(course.courseId)}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-center items-center">
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => (course.published ? handleUnpublish(course.courseId) : handlePublish(course.courseId))}
                                >
                                    {course.published ? <><TbCloudOff /> Unpublish</> : <><AiOutlineCloudUpload /> Publish</>}
                                </Button>

                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Alert className="border-red-500 text-red-500">
                    <AlertCircle />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>No course available.</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default CourseList;