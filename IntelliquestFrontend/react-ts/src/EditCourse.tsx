import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { FaEye } from "react-icons/fa6";
import { Download } from "lucide-react";
import { toast } from "sonner";

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
    file?: File;
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

interface EditCourseProps {
    course: Course;
    onCancel: () => void;
}

const EditCourse: React.FC<EditCourseProps> = ({ course, onCancel }) => {
    const [formData, setFormData] = useState<Course>(course);

    const handleChange = (e: React.ChangeEvent<HTMLElement>, path: string) => {
        const value = (e.target as HTMLInputElement).value;
        const keys = path.split(".");
        let updatedData = { ...formData };

        const lastKey = keys.pop()!;
        const lastObj = keys.reduce((acc: any, key: string) => acc[key], updatedData);

        if (lastKey === 'price') {
            lastObj[lastKey] = value ? parseFloat(value) : 0;
        } else {
            lastObj[lastKey] = value;
        }

        setFormData(updatedData);
    };

    const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const updatedData = { ...formData };
            updatedData.thumbnail = file;
            setFormData(updatedData);
            setPreviewThumbnail(URL.createObjectURL(file));
        }
    };


    const handleCourseOptionsChange = (
        e: React.ChangeEvent<HTMLElement>,
        path: keyof CourseOptions
    ) => {
        const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
        let updatedData = { ...formData };

        updatedData.courseOptions[path] = value;
        setFormData(updatedData);
    };


    const handleTopicChange = (
        e: React.ChangeEvent<HTMLElement>,
        topicIndex: number,
        subtopicIndex: number | null,
        path: keyof Subtopic | "topicName"
    ) => {
        const value = (e.target as HTMLInputElement).value;
        const updatedData = { ...formData };

        if (path === "topicName") {
            updatedData.topics[topicIndex].name = value;
        } else if (path === "name" && subtopicIndex !== null) {
            updatedData.topics[topicIndex].subtopics[subtopicIndex].name = value;
        } else if (path === "videos" && subtopicIndex !== null) {
            const newVideo: Video = { title: "", description: "", url: "" };
            updatedData.topics[topicIndex].subtopics[subtopicIndex].videos = [
                ...updatedData.topics[topicIndex].subtopics[subtopicIndex].videos,
                newVideo,
            ];
        }

        setFormData(updatedData);
    };


    const handleVideoChange = (e: React.ChangeEvent<HTMLElement>, topicIndex: number, subtopicIndex: number, videoIndex: number, path: keyof Video) => {
        const value = (e.target as HTMLInputElement).value;
        let updatedData = { ...formData };

        updatedData.topics[topicIndex].subtopics[subtopicIndex].videos[videoIndex][path] = value;
        setFormData(updatedData);
    };

    const handleStudyMaterialChange = (
        e: React.ChangeEvent<HTMLElement>,
        index: number,
        path: keyof StudyMaterial
    ) => {
        const updatedStudyMaterials = [...formData.studyMaterials];
        const updatedMaterial = { ...updatedStudyMaterials[index] };

        const value = (e.target as HTMLInputElement).value;

        if (path === "name") {
            updatedMaterial[path] = value;
        }

        updatedStudyMaterials[index] = updatedMaterial;

        setFormData({
            ...formData,
            studyMaterials: updatedStudyMaterials,
        });
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();

            formDataToSend.append('courseId', formData.courseId.toString());
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price.toString());
            formDataToSend.append('category', formData.category);
            formDataToSend.append('instructorEmail', formData.instructorEmail);
            if (formData.thumbnail) {
                formDataToSend.append('thumbnail', formData.thumbnail);
            }
            formDataToSend.append('level', formData.level);
            formDataToSend.append('language', formData.language);

            formDataToSend.append('benefits', formData.courseOptions.benefits);
            formDataToSend.append('prerequisites', formData.courseOptions.prerequisites);

            formData.studyMaterials.forEach((material, index) => {
                formDataToSend.append(`studyMaterials[${index}].name`, material.name);

                if (material.file) {
                    formDataToSend.append(`studyMaterials[${index}].file`, material.file);
                }

                formDataToSend.append(`studyMaterials[${index}].id`, formData.courseId.toString());

            });

            formData.topics.forEach((topic, topicIndex) => {
                formDataToSend.append(`topics[${topicIndex}].name`, topic.name);

                topic.subtopics.forEach((subtopic, subIndex) => {
                    formDataToSend.append(`topics[${topicIndex}].subtopics[${subIndex}].name`, subtopic.name);

                    subtopic.videos.forEach((video, videoIndex) => {
                        formDataToSend.append(`topics[${topicIndex}].subtopics[${subIndex}].videos[${videoIndex}].title`, video.title);
                        formDataToSend.append(`topics[${topicIndex}].subtopics[${subIndex}].videos[${videoIndex}].description`, video.description);
                        formDataToSend.append(`topics[${topicIndex}].subtopics[${subIndex}].videos[${videoIndex}].url`, video.url);
                    });
                });
            });

            const response = await axios.put(
                `http://localhost:9092/auth/courses/${formData.courseId}/edit`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success(response.data, {
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                },
            });
            onCancel();

        } catch (error: any) {
            const errorMessage =
                error?.response?.data || "Something went wrong while updating the course.";

            toast.error(errorMessage, {
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                },
            });
        }
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Card className="rounded-xl sm:rounded-2xl shadow-sm border">
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                        <CardTitle className="text-lg sm:text-xl font-bold">Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 space-y-5 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
                            <div className="flex justify-center items-center w-full max-w-xs mx-auto sm:mx-0 max-h-[220px] sm:max-h-[260px] rounded-xl overflow-hidden border bg-muted/20">
                                <img
                                    src={
                                        previewThumbnail
                                            ? previewThumbnail
                                            : `http://localhost:9092/auth/courses/${formData.courseId}/thumbnail`
                                    }
                                    alt="Course Thumbnail"
                                    className="rounded-xl object-contain w-full h-auto max-h-[220px] sm:max-h-[260px]"
                                />
                            </div>
                            <div className="flex flex-col gap-2.5 justify-center min-w-0">
                                <Label htmlFor="thumbnail" className="text-xs sm:text-sm font-semibold">Thumbnail</Label>
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    className="cursor-pointer file:cursor-pointer text-xs sm:text-sm"
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    onChange={handleThumbnailChange}
                                />
                                <p className="text-xs sm:text-sm text-muted-foreground">Please upload a valid image file in JPG, PNG, or GIF format.</p>
                                {formData.thumbnail && (
                                    <p className="text-xs sm:text-sm text-primary font-medium truncate">Selected: {formData.thumbnail?.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div className="flex flex-col gap-2 min-w-0">
                                <Label htmlFor="title" className="text-xs sm:text-sm font-semibold">Course Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={(e) => handleChange(e, "title")}
                                    placeholder="Enter course title"
                                    className="text-xs sm:text-sm h-10"
                                />
                            </div>
                            <div className="flex flex-col gap-2 min-w-0">
                                <Label htmlFor="category" className="text-xs sm:text-sm font-semibold">Category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => handleChange(e, "category")}
                                    placeholder="Enter course category"
                                    className="text-xs sm:text-sm h-10"
                                />
                            </div>
                            <div className="flex flex-col gap-2 min-w-0">
                                <Label htmlFor="price" className="text-xs sm:text-sm font-semibold">Price</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    value={formData.price.toString()}
                                    onChange={(e) => handleChange(e, "price")}
                                    type="number"
                                    placeholder="Enter course price"
                                    className="text-xs sm:text-sm h-10"
                                />
                            </div>
                            <div className="flex flex-col gap-2 min-w-0">
                                <Label htmlFor="level" className="text-xs sm:text-sm font-semibold">Level</Label>
                                <Input
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    onChange={(e) => handleChange(e, "level")}
                                    placeholder="Enter course level"
                                    className="text-xs sm:text-sm h-10"
                                />
                            </div>
                            <div className="flex flex-col gap-2 min-w-0 sm:col-span-2">
                                <Label htmlFor="language" className="text-xs sm:text-sm font-semibold">Language</Label>
                                <Input
                                    id="language"
                                    name="language"
                                    value={formData.language}
                                    onChange={(e) => handleChange(e, "language")}
                                    placeholder="Enter course language"
                                    className="text-xs sm:text-sm h-10"
                                />
                            </div>
                            <div className="flex flex-col gap-2 min-w-0 sm:col-span-2">
                                <Label htmlFor="description" className="text-xs sm:text-sm font-semibold">Course Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) => handleChange(e, "description")}
                                    placeholder="Enter course description"
                                    rows={3}
                                    className="text-xs sm:text-sm min-h-[80px]"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Topics */}
                {formData.topics.map((topic, topicIndex) => (
                    <Card key={topicIndex} className="rounded-xl sm:rounded-2xl shadow-sm border">
                        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                            <CardTitle className="text-lg sm:text-xl font-bold text-primary">Topic: {topicIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0 space-y-4">

                            {/* Topic Name Input */}
                            <div className="flex flex-col gap-2 mb-4">
                                <Label htmlFor={`topic-name-${topicIndex}`} className="text-xs sm:text-sm font-semibold">Topic Name</Label>
                                <Input
                                    id={`topic-name-${topicIndex}`}
                                    value={topic.name}
                                    onChange={(e) => handleTopicChange(e, topicIndex, null, "topicName")}
                                    placeholder="Enter topic name"
                                    className="text-xs sm:text-sm h-10"
                                />
                            </div>

                            {topic.subtopics.map((subtopic, subtopicIndex) => (
                                <div key={subtopicIndex} className="space-y-3 pt-1">
                                    <h2 className="mb-2 px-3 py-1 font-semibold bg-primary text-primary-foreground rounded-lg text-xs sm:text-sm w-max shadow-2xs">Subtopic: {subtopicIndex + 1}</h2>
                                    <div className="flex flex-col gap-2 mb-4">
                                        <Label htmlFor={`subtopic-name-${subtopicIndex}`} className="text-xs sm:text-sm font-semibold">Subtopic Name</Label>
                                        <Input
                                            id={`subtopic-name-${subtopicIndex}`}
                                            value={subtopic.name}
                                            onChange={(e) => handleTopicChange(e, topicIndex, subtopicIndex, "name")}
                                            placeholder="Enter subtopic name"
                                            className="text-xs sm:text-sm h-10"
                                        />
                                    </div>

                                    {subtopic.videos.map((video, videoIndex) => (
                                        <div className="bg-sidebar p-3.5 sm:p-5 rounded-xl sm:rounded-2xl mt-4 border border-border/50" key={videoIndex}>
                                            <h3 className="mb-3 font-semibold text-sm sm:text-base text-primary">Video: {videoIndex + 1}</h3>

                                            <div className="flex flex-col gap-2 mb-3">
                                                <Label htmlFor={`video-title-${videoIndex}`} className="text-xs sm:text-sm font-semibold">Video Title</Label>
                                                <Input
                                                    id={`video-title-${videoIndex}`}
                                                    value={video.title}
                                                    onChange={(e) => handleVideoChange(e, topicIndex, subtopicIndex, videoIndex, "title")}
                                                    placeholder="Enter video title"
                                                    className="text-xs sm:text-sm h-10"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2 mb-3">
                                                <Label htmlFor={`video-description-${videoIndex}`} className="text-xs sm:text-sm font-semibold">Video Description</Label>
                                                <Textarea
                                                    id={`video-description-${videoIndex}`}
                                                    value={video.description}
                                                    onChange={(e) => handleVideoChange(e, topicIndex, subtopicIndex, videoIndex, "description")}
                                                    placeholder="Enter video description"
                                                    rows={2}
                                                    className="text-xs sm:text-sm"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor={`video-url-${videoIndex}`} className="text-xs sm:text-sm font-semibold">Video URL</Label>
                                                <div className="flex flex-row items-center gap-2">
                                                    <Input
                                                        id={`video-url-${videoIndex}`}
                                                        value={video.url}
                                                        onChange={(e) => handleVideoChange(e, topicIndex, subtopicIndex, videoIndex, "url")}
                                                        placeholder="Enter video URL"
                                                        className="text-xs sm:text-sm h-10 flex-1 min-w-0"
                                                    />
                                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                                        <Button variant="secondary" size="icon" type="button" className="h-10 w-10 shrink-0 cursor-pointer" aria-label="Preview video">
                                                            <FaEye className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}


                {/* Course Options */}
                <Card className="rounded-xl sm:rounded-2xl shadow-sm border">
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                        <CardTitle className="text-lg sm:text-xl font-bold">Course Options</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="benefits" className="text-xs sm:text-sm font-semibold">Course Benefits</Label>
                            <Textarea
                                id="benefits"
                                name="benefits"
                                value={formData.courseOptions.benefits}
                                onChange={(e) => handleCourseOptionsChange(e, "benefits")}
                                placeholder="Enter course benefits"
                                rows={3}
                                className="text-xs sm:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="prerequisites" className="text-xs sm:text-sm font-semibold">Course Prerequisites</Label>
                            <Textarea
                                id="prerequisites"
                                name="prerequisites"
                                value={formData.courseOptions.prerequisites}
                                onChange={(e) => handleCourseOptionsChange(e, "prerequisites")}
                                placeholder="Enter course prerequisites"
                                rows={3}
                                className="text-xs sm:text-sm"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Study Materials */}
                <Card className="rounded-xl sm:rounded-2xl shadow-sm border">
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                        <CardTitle className="text-lg sm:text-xl font-bold">Study Materials</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                        {formData.studyMaterials.map((material, index) => (
                            <div key={index} className="p-3 sm:p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`material-name-${index}`} className="text-xs sm:text-sm font-semibold">Material Name</Label>
                                    <Input
                                        id={`material-name-${index}`}
                                        value={material.name}
                                        onChange={(e) => handleStudyMaterialChange(e, index, "name")}
                                        placeholder="Enter material name"
                                        className="text-xs sm:text-sm h-10"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`material-file-${index}`} className="text-xs sm:text-sm font-semibold">Upload File</Label>
                                    <Input
                                        id={`material-file-${index}`}
                                        type="file"
                                        className="cursor-pointer file:cursor-pointer text-xs sm:text-sm"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                let updatedData = { ...formData };
                                                updatedData.studyMaterials[index].file = file;
                                                updatedData.studyMaterials[index].fileName = file.name;

                                                setFormData(updatedData);
                                            }
                                        }}
                                    />
                                    {material.fileName && (
                                        <p className="text-xs sm:text-sm text-primary font-medium truncate">Selected: {material.fileName}</p>
                                    )}

                                    <div className="flex items-center gap-2 pt-1">
                                        <Button
                                            type="button"
                                            className="cursor-pointer h-9 px-3 text-xs sm:text-sm gap-1.5"
                                            variant="secondary"
                                            onClick={() => {
                                                window.open(
                                                    `http://localhost:9092/auth/courses/${formData.courseId}/materials/${material.fileName}`,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            <FaEye className="h-3.5 w-3.5" />
                                            <span>View</span>
                                        </Button>

                                        <a
                                            href={`${(import.meta.env.VITE_BACKEND_URL as string) || "https://intelliquest-elearning-platform.onrender.com"}/auth/courses/${formData.courseId}/materials/${material.fileName}?download=true`}
                                            download
                                        >
                                            <Button type="button"
                                                className="cursor-pointer h-9 px-3 text-xs sm:text-sm gap-1.5"
                                                variant="secondary">
                                                <Download className="h-3.5 w-3.5" />
                                                <span>Download</span>
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>

                </Card>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-10">
                    <Button type="submit" className="w-full sm:w-auto px-6 py-2.5 font-semibold text-sm">Save Changes</Button>
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto px-6 py-2.5 text-sm">Cancel</Button>
                </div>
            </form>
        </div>
    );
};

export default EditCourse;