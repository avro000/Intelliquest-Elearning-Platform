"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  AlertCircle,
  CheckCircle,
  Star,
  Users,
  Clock,
  Globe,
  Award,
  BookOpen,
  Play,
  ArrowLeft,
  TrendingUp,
  Shield,
  Target,
  Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import CheckoutButton from "@/components/Payment/CheckoutButton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import UserNavbar from "./UserNavbar"
import { Skeleton } from "@/components/ui/skeleton"
import { jwtDecode } from "jwt-decode"
import { API_BASE_URL } from "@/api/config"

interface CourseOptionDTO {
  benefits: string
  prerequisites: string
}

interface CourseResponseDTO {
  courseId: number
  title: string
  description: string
  price: number
  category: string
  level: string
  language: string
  published: boolean
  instructorEmail?: string
  thumbnailUrl: string
  courseOptions?: CourseOptionDTO
}

const getRandomStudentCount = (courseId: number) => {
  const seed = courseId * 1234567
  const random = Math.sin(seed) * 10000
  const count = Math.floor(Math.abs(random) % 5000) + 500
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

const getRandomRating = (courseId: number) => {
  const seed = courseId * 9876543
  const random = Math.sin(seed) * 10000
  const rating = 4.0 + (Math.abs(random) % 1000) / 1000 // Between 4.0-5.0
  return rating.toFixed(1)
}

const getRandomReviewCount = (courseId: number) => {
  const seed = courseId * 5432109
  const random = Math.sin(seed) * 10000
  return Math.floor(Math.abs(random) % 500) + 50 // Between 50-550
}

const getLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
    case "intermediate":
      return "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
    case "advanced":
      return "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
    default:
      return "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg"
  }
}

const getCategoryColor = (category: string) => {
  const colorSchemes = [
    "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
    "bg-gradient-to-r from-purple-500 to-violet-600 text-white",
    "bg-gradient-to-r from-indigo-500 to-blue-600 text-white",
    "bg-gradient-to-r from-pink-500 to-rose-600 text-white",
    "bg-gradient-to-r from-teal-500 to-cyan-600 text-white",
    "bg-gradient-to-r from-orange-500 to-red-600 text-white",
  ]
  const hash = category.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
  return colorSchemes[hash % colorSchemes.length]
}

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<CourseResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([])

  const token = localStorage.getItem("token")
  let userEmail: string | null = null
  if (token) {
    try {
      const decoded: any = jwtDecode(token)
      userEmail = decoded?.sub || null
    } catch (err) {
      console.error("Invalid token format:", err)
      userEmail = null
    }
  }

  useEffect(() => {
    if (!token) {
      setError("Authentication token is missing.")
      setLoading(false)
      return
    }

    if (!id) {
      setError("Course ID is missing from the URL.")
      setLoading(false)
      return
    }

    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourse(res.data)
      } catch (err) {
        setError("Failed to fetch course details.")
      } finally {
        setLoading(false)
      }
    }

    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/enrolled-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const enrolledIds = res.data.map((course: { courseId: number }) => course.courseId)
        setEnrolledCourses(enrolledIds)
      } catch (err) {
        console.error("Failed to fetch enrolled courses", err)
      }
    }

    fetchCourseDetails()
    fetchEnrolledCourses()
  }, [id, token])

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-6 mb-4 inline-block">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view course details.</p>
          <Button
            onClick={() => navigate("/login")}
            className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 w-full max-w-full overflow-x-hidden">
        <div className="fixed top-0 left-0 right-0 z-50">
          <UserNavbar userEmail={userEmail} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-6 sm:pb-10 space-y-6 sm:space-y-8">
          <Skeleton className="h-9 sm:h-10 w-28 rounded-xl" />

          {/* Hero Banner Skeleton */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-4 sm:space-y-6">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 sm:h-10 w-3/5 rounded-xl" />
            <Skeleton className="h-4 sm:h-5 w-4/5 rounded-lg" />
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Skeleton className="h-5 sm:h-6 w-28 sm:w-32 rounded-md" />
              <Skeleton className="h-5 sm:h-6 w-28 sm:w-32 rounded-md" />
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
              <div className="rounded-2xl p-4 sm:p-6 bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-3 sm:space-y-4">
                <Skeleton className="h-7 sm:h-8 w-40 sm:w-48 rounded-lg" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
              <div className="rounded-2xl p-4 sm:p-6 bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-3 sm:space-y-4">
                <Skeleton className="h-7 sm:h-8 w-36 sm:w-40 rounded-lg" />
                <Skeleton className="h-12 sm:h-14 w-full rounded-xl" />
                <Skeleton className="h-12 sm:h-14 w-full rounded-xl" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="rounded-2xl p-4 sm:p-6 bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-4 sm:space-y-5 static lg:sticky lg:top-24">
                <Skeleton className="h-44 sm:h-48 w-full rounded-xl" />
                <Skeleton className="h-8 sm:h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 sm:h-12 w-full rounded-xl" />
                <div className="space-y-2.5 sm:space-y-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <Skeleton className="h-4 sm:h-5 w-full rounded" />
                  <Skeleton className="h-4 sm:h-5 w-full rounded" />
                  <Skeleton className="h-4 sm:h-5 w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 w-full max-w-full overflow-x-hidden">
        <div className="fixed top-0 left-0 right-0 z-50">
          <UserNavbar userEmail={userEmail} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10 sm:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-2xl shadow-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-800 dark:text-red-300 text-lg font-bold">Error Loading Course</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-400">{error}</AlertDescription>
            </Alert>
            <div className="flex justify-center mt-6 sm:mt-8">
              <Button
                onClick={() => navigate("/UserDashboard")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!course) return null

  const isEnrolled = enrolledCourses.includes(course.courseId)
  const studentCount = getRandomStudentCount(course.courseId)
  const rating = getRandomRating(course.courseId)
  const reviewCount = getRandomReviewCount(course.courseId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 w-full max-w-full overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <UserNavbar userEmail={userEmail} />
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden w-full max-w-full pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto w-full min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 sm:mb-8"
            >
              <Button
                onClick={() => navigate("/UserDashboard")}
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl px-4 sm:px-6 py-2 text-xs sm:text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white min-w-0"
            >
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Badge
                  className={`${getCategoryColor(course.category)} text-xs sm:text-sm font-semibold sm:font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md`}
                >
                  {course.category}
                </Badge>
                <Badge className={`${getLevelColor(course.level)} text-xs sm:text-sm font-semibold sm:font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md`}>
                  {course.level}
                </Badge>
                <Badge className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs sm:text-sm font-semibold sm:font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md">
                  <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 shrink-0" />
                  {course.language}
                </Badge>
                {isEnrolled && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs sm:text-sm font-semibold sm:font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 shrink-0" />
                    Enrolled
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight break-words">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-blue-100">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current shrink-0" />
                    <span className="font-bold text-white">{rating}</span>
                  </div>
                  <span className="opacity-90">({reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span>{studentCount} students enrolled</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span>Trending Course</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 py-8 sm:py-16 w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-full">
            {/* Left Column - Course Details */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-10 min-w-0 w-full">
              {/* Course Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full min-w-0"
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-xl w-full">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                      <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mr-2.5 sm:mr-3 text-blue-600 shrink-0" />
                      Course Overview
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line break-words">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Instructor Section */}
              {course.instructorEmail && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="w-full min-w-0"
                >
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-xl w-full">
                    <CardContent className="p-4 sm:p-6 md:p-8">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                        <Award className="h-6 w-6 sm:h-8 sm:w-8 mr-2.5 sm:mr-3 text-purple-600 shrink-0" />
                        Meet Your Instructor
                      </h2>
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-2.5 sm:p-4 shrink-0">
                          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white break-all sm:break-normal truncate">
                            {course.instructorEmail}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Expert Instructor</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Course Benefits and Prerequisites */}
              {course.courseOptions && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full min-w-0">
                  {/* Benefits */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="w-full min-w-0"
                  >
                    <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/50 dark:via-green-950/50 dark:to-teal-950/50 border border-emerald-200/50 dark:border-emerald-800/50 rounded-2xl sm:rounded-3xl shadow-xl h-full w-full">
                      <CardContent className="p-4 sm:p-6 md:p-8">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                          <Target className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-emerald-600 shrink-0" />
                          What You'll Learn
                        </h2>
                        <ul className="space-y-3 sm:space-y-4">
                          {course.courseOptions.benefits.split(/[.;\n]+/).map((item, idx) =>
                            item.trim() ? (
                              <li key={idx} className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-1 mt-0.5 shrink-0">
                                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed break-words min-w-0 flex-1">{item.trim()}</span>
                              </li>
                            ) : null,
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Prerequisites */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="w-full min-w-0"
                  >
                    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50 rounded-2xl sm:rounded-3xl shadow-xl h-full w-full">
                      <CardContent className="p-4 sm:p-6 md:p-8">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                          <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600 shrink-0" />
                          Prerequisites
                        </h2>
                        <ul className="space-y-3 sm:space-y-4">
                          {course.courseOptions.prerequisites.split(/[.;\n]+/).map((item, idx) =>
                            item.trim() ? (
                              <li key={idx} className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1 mt-0.5 shrink-0">
                                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed break-words min-w-0 flex-1">{item.trim()}</span>
                              </li>
                            ) : null,
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Right Column - Course Card */}
            <div className="lg:col-span-1 min-w-0 w-full">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="static lg:sticky lg:top-8 w-full min-w-0"
              >
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full">
                  {/* Course Thumbnail */}
                  <div className="relative overflow-hidden w-full">
                    <img
                      src={course.thumbnailUrl || "/placeholder.svg?height=300&width=500"}
                      alt={course.title}
                      className="w-full h-48 sm:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/20">
                        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                          <div className="flex items-center gap-1.5 sm:gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                              <span className="font-bold">{rating}</span>
                            </div>
                            <span className="text-[11px] sm:text-xs opacity-75">({reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium">
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                            <span>{studentCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    {/* Price Section */}
                    <div className="text-center mb-6 sm:mb-8">
                      <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                        Course Price
                      </p>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <span className="text-emerald-500 text-xl sm:text-2xl font-semibold">₹</span>
                        <span className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">{course.price}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                          <span>Lifetime Access</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                          <span>Certificate</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <AnimatePresence mode="wait">
                      {isEnrolled ? (
                        <motion.div
                          key="enrolled"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="w-full"
                        >
                          <Button
                            onClick={() => navigate(`/course-content/${course.courseId}`)}
                            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer text-sm sm:text-base flex items-center justify-center"
                          >
                            <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2 shrink-0" />
                            Continue Learning
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="purchase"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="w-full"
                        >
                          <CheckoutButton
                            userEmail={userEmail}
                            courseId={course.courseId}
                            price={course.price}
                            className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer text-sm sm:text-base flex items-center justify-center"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Course Features */}
                    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        This course includes:
                      </h3>
                      <div className="space-y-2.5 sm:space-y-3">
                        <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 dark:text-gray-300">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 sm:p-2 rounded-lg shrink-0">
                            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-xs sm:text-sm">Comprehensive curriculum</span>
                        </div>
                        <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 dark:text-gray-300">
                          <div className="bg-green-100 dark:bg-green-900/30 p-1.5 sm:p-2 rounded-lg shrink-0">
                            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-xs sm:text-sm">Lifetime access</span>
                        </div>
                        <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 dark:text-gray-300">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 sm:p-2 rounded-lg shrink-0">
                            <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-xs sm:text-sm">Certificate of completion</span>
                        </div>
                        <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 dark:text-gray-300">
                          <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 sm:p-2 rounded-lg shrink-0">
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <span className="text-xs sm:text-sm">Community access</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CourseDetailsPage
