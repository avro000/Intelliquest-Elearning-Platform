"use client"
import React from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Course } from "@/types/Course"
import {
  CheckCircleIcon,
  XCircleIcon,
  MailIcon,
  PlayCircleIcon,
  FileTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react"

type Props = {
  course: Course | null
  open: boolean
  onClose: () => void
}

export const CourseDrawer = ({ course, open, onClose }: Props) => {
  const [descriptionExpanded, setDescriptionExpanded] = React.useState(false)

  if (!course) return null

  const handleEmailClick = () => {
    window.open(`mailto:${course.instructorEmail}`, "_blank")
  }

  const shouldShowExpandButton = course.description.length > 200

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="w-full px-6 pb-6 pt-4 max-h-[85vh] overflow-y-auto rounded-t-xl shadow-xl">
        <DrawerHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <DrawerTitle className="text-2xl font-bold text-foreground pr-4">{course.title}</DrawerTitle>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={handleEmailClick}
          >
            <MailIcon className="w-4 h-4" />
            {course.instructorEmail}
          </Button>
        </DrawerHeader>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Image */}
          <div className="lg:col-span-1">
            <div className="relative group">
              <img
                src={course.thumbnailUrl || "/placeholder.svg?height=300&width=400"}
                alt={`${course.title} thumbnail`}
                className="rounded-lg w-full h-64 object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <PlayCircleIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
              <Badge variant={course.published ? "default" : "secondary"} className="flex items-center gap-1">
                {course.published ? <CheckCircleIcon className="w-3 h-3" /> : <XCircleIcon className="w-3 h-3" />}
                {course.published ? "Published" : "Draft"}
              </Badge>
            </div>

            {/* Course Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{course.level}</Badge>
              <Badge variant="outline">{course.language}</Badge>
              <Badge variant="outline">{course.category}</Badge>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">About this course</h3>
              <div className="text-muted-foreground leading-relaxed">
                {descriptionExpanded || !shouldShowExpandButton
                  ? course.description
                  : `${course.description.slice(0, 200)}...`}
                {shouldShowExpandButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                    className="ml-2 p-0 h-auto font-medium text-primary hover:text-primary/80"
                  >
                    {descriptionExpanded ? (
                      <>
                        Show Less <ChevronUpIcon className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Show More <ChevronDownIcon className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Course Options */}
            {course.courseOptions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-700">✓ What you'll learn</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{course.courseOptions.benefits}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-700">⚡ Prerequisites</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{course.courseOptions.prerequisites}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Course Content */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <PlayCircleIcon className="w-5 h-5" />
              Course Content
            </h3>
            <div className="space-y-4">
              {course.topics.map((topic, i) => (
                <div key={i} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold text-lg mb-3">{topic.name}</h4>
                  <div className="space-y-3">
                    {topic.subtopics.map((sub, j) => (
                      <div key={j} className="ml-4">
                        <h5 className="font-medium text-base mb-2">{sub.name}</h5>
                        <div className="ml-4 space-y-1">
                          {sub.videos.map((video, k) => (
                            <div key={k} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <PlayCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-foreground">{video.title}</span>
                                {video.description && <span className="ml-1">- {video.description}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Materials */}
          {course.studyMaterials.length > 0 && (
            <div>
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <FileTextIcon className="w-5 h-5" />
                Study Materials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.studyMaterials.map((material, index) => (
                  <a
                    key={index}
                    href={material.downloadUrl || material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <FileTextIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    <span className="font-medium group-hover:text-primary transition-colors">{material.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="mt-8 flex justify-end">
          <Button variant="outline" onClick={onClose} className="min-w-32">
            Back to Courses
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
