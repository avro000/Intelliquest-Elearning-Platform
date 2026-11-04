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
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex justify-start items-center max-w-[500px] max-h-[300px]">
                                <img
                                    src={
                                        previewThumbnail
                                            ? previewThumbnail
                                            : `http://localhost:9092/auth/courses/${formData.courseId}/thumbnail`
                                    }
                                    alt="Course Thumbnail"
                                    className="rounded-xl object-contain max-w-full max-h-full"
                                />
                            </div>
                            <div className="flex flex-col gap-4 justify-center ">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    onChange={handleThumbnailChange}
                                />
                                <p className="text-sm text-muted-foreground">Please upload a valid image file in JPG, PNG, or GIF format.</p>
                                {formData.thumbnail && (
                                    <p className="text-sm text-muted-foreground">Selected: {formData.thumbnail?.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex flex-col gap-4 mb-4">
                                    <Label htmlFor="title">Course Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={(e) => handleChange(e, "title")}
                                        placeholder="Enter course title"
                                    />
                                </div>
                                <div className="flex flex-col gap-4 mb-4">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        value={formData.price.toString()}
                                        onChange={(e) => handleChange(e, "price")}
                                        type="number"
                                        placeholder="Enter course price"
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="description">Course Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange(e, "description")}
                                        placeholder="Enter course description"
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col gap-4 mb-4">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={(e) => handleChange(e, "category")}
                                        placeholder="Enter course category"
                                    />
                                </div>
                                <div className="flex flex-col gap-4 mb-4">
                                    <Label htmlFor="level">Level</Label>
                                    <Input
                                        id="level"
                                        name="level"
                                        value={formData.level}
                                        onChange={(e) => handleChange(e, "level")}
                                        placeholder="Enter course level"
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="language">Language</Label>
                                    <Input
                                        id="language"
                                        name="language"
                                        value={formData.language}
                                        onChange={(e) => handleChange(e, "language")}
                                        placeholder="Enter course language"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Topics */}
                {formData.topics.map((topic, topicIndex) => (
                    <Card key={topicIndex}>
                        <CardHeader>
                            <CardTitle className="text-xl text-[#1447e6]">Topic: {topicIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* Topic Name Input */}
                            <div className="flex flex-col gap-4 mb-4">
                                <Label htmlFor={`topic-name-${topicIndex}`}>Topic Name</Label>
                                <Input
                                    id={`topic-name-${topicIndex}`}
                                    value={topic.name}
                                    onChange={(e) => handleTopicChange(e, topicIndex, null, "topicName")}
                                    placeholder="Enter topic name"
                                />
                            </div>

                            {topic.subtopics.map((subtopic, subtopicIndex) => (
                                <div key={subtopicIndex}>
                                    <h2 className="mb-4 p-2 font-semibold bg-[#1447e6] rounded-2xl w-max">Subtopic: {subtopicIndex + 1} </h2>
                                    <div className="flex flex-col gap-4 mb-4">
                                        <Label htmlFor={`subtopic-name-${subtopicIndex}`}>Subtopic Name</Label>
                                        <Input
                                            id={`subtopic-name-${subtopicIndex}`}
                                            value={subtopic.name}
                                            onChange={(e) => handleTopicChange(e, topicIndex, subtopicIndex, "name")}
                                            placeholder="Enter subtopic name"
                                        />
                                    </div>

                                    {subtopic.videos.map((video, videoIndex) => (
                                        <div className="bg-sidebar p-5 rounded-2xl mt-4" key={videoIndex}>
                                            <h1 className="mb-4 font-semibold text-xl text-[#1447e6]">Video: {videoIndex + 1}</h1>

                                            <div className="flex flex-col gap-4 mb-4">
                                                <Label htmlFor={`video-title-${videoIndex}`}>Video Title</Label>
                                                <Input
                                                    id={`video-title-${videoIndex}`}
                                                    value={video.title}
                                                    onChange={(e) => handleVideoChange(e, topicIndex, subtopicIndex, videoIndex, "title")}
                                                    placeholder="Enter video title"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-4 mb-4">
                                                <Label htmlFor={`video-description-${videoIndex}`}>Video Description</Label>
                                                <Textarea
                                                    id={`video-description-${videoIndex}`}
                                                    value={video.description}
                                                    onChange={(e) => handleVideoChange(e, topicIndex, subtopicIndex, videoIndex, "description")}
                                                    placeholder="Enter video description"
                                                    rows={2}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <Label htmlFor={`video-url-${videoIndex}`}>Video URL</Label>
                                                <div className="flex flex-row gap-4">
                                                    <Input
                                                        id={`video-url-${videoIndex}`}
                                                        value={video.url}
                                                        onChange={(e) => handleVideoChange(e, topicIndex, subtopicIndex, videoIndex, "url")}
                                                        placeholder="Enter video URL"
                                                    />
                                                    <a href={video.url} target="_blank" className="w-max">
                                                        <Button variant="default" type="button" className="cursor-pointer"><FaEye /></Button>
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
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Course Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="benefits">Course Benefits</Label>
                            <Textarea
                                id="benefits"
                                name="benefits"
                                value={formData.courseOptions.benefits}
                                onChange={(e) => handleCourseOptionsChange(e, "benefits")}
                                placeholder="Enter course benefits"
                                rows={4}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="prerequisites">Course Prerequisites</Label>
                            <Textarea
                                id="prerequisites"
                                name="prerequisites"
                                value={formData.courseOptions.prerequisites}
                                onChange={(e) => handleCourseOptionsChange(e, "prerequisites")}
                                placeholder="Enter course prerequisites"
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Study Materials */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Study Materials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formData.studyMaterials.map((material, index) => (
                            <div key={index}>
                                <div className="flex flex-col gap-4 mb-4">
                                    <Label htmlFor={`material-name-${index}`}>Material Name</Label>
                                    <Input
                                        id={`material-name-${index}`}
                                        value={material.name}
                                        onChange={(e) => handleStudyMaterialChange(e, index, "name")}
                                        placeholder="Enter material name"
                                    />
                                </div>
                                <div className="flex flex-col gap-4 mb-4">
                                    <Label htmlFor={`material-file-${index}`}>Upload File</Label>
                                    <Input
                                        id={`material-file-${index}`}
                                        type="file"
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
                                        <p className="text-sm text-muted-foreground">Selected: {material.fileName}</p>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="button"
                                            className="cursor-pointer"
                                            variant="secondary"
                                            onClick={() => {
                                                window.open(
                                                    `http://localhost:9092/auth/courses/${formData.courseId}/materials/${material.fileName}`,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            <FaEye />
                                        </Button>

                                        <a
                                            href={`http://localhost:9092/auth/courses/${formData.courseId}/materials/${material.fileName}?download=true`}
                                            download
                                        >
                                            <Button type="button"
                                                className="cursor-pointer"
                                                variant="secondary">
                                                <Download />
                                            </Button>
                                        </a>
                                    </div>


                                </div>
                            </div>
                        ))}
                    </CardContent>

                </Card>

                <div className="flex gap-4">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" onClick={onCancel}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};

export default EditCourse;