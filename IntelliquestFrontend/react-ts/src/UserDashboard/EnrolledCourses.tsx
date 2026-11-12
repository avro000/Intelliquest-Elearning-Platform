"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { AlertCircle, BookOpen, Play, Star, Globe, Users, TrendingUp, Clock, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import UserNavbar from "./UserNavbar"
import { Skeleton } from "@/components/ui/skeleton"
import { API_BASE_URL } from "@/api/config"


interface Course {
  courseId: number
  title: string
  description: string
  price: number
  category: string
  level: string
  language: string
  thumbnailUrl: string
  published: boolean
  progress?: number // Optional progress percentage
}

const getRandomStudentCount = (courseId: number) => {
  // Use courseId as seed for consistent random numbers per course
  const seed = courseId * 1234567
  const random = Math.sin(seed) * 10000
  const count = Math.floor(Math.abs(random) % 5000) + 500 // Between 500-5500

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

const getRandomProgress = (courseId: number) => {
  // Use courseId as seed for consistent random numbers per course
  const seed = courseId * 7654321
  const random = Math.sin(seed) * 10000
  return Math.floor(Math.abs(random) % 101) // Between 0-100%
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

const getCardGradient = (index: number) => {
  const gradients = [
    "from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50",
    "from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50",
    "from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/50 dark:via-pink-950/50 dark:to-purple-950/50",
    "from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/50 dark:via-orange-950/50 dark:to-red-950/50",
    "from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/50 dark:via-purple-950/50 dark:to-indigo-950/50",
    "from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/50 dark:via-blue-950/50 dark:to-indigo-950/50",
  ]
  return gradients[index % gradients.length]
}

const getCardBorder = (index: number) => {
  const borders = [
    "border-blue-200/50 dark:border-blue-800/50",
    "border-emerald-200/50 dark:border-emerald-800/50",
    "border-rose-200/50 dark:border-rose-800/50",
    "border-amber-200/50 dark:border-amber-800/50",
    "border-violet-200/50 dark:border-violet-800/50",
    "border-cyan-200/50 dark:border-cyan-800/50",
  ]
  return borders[index % borders.length]
}

const EnrolledCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

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
      setError("Authentication token is missing")
      setLoading(false)
      return
    }

    axios
      .get(`${API_BASE_URL}/auth/enrolled-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Add random progress to each course
        const coursesWithProgress = response.data.map((course: Course) => ({
          ...course,
          progress: getRandomProgress(course.courseId),
        }))
        setCourses(coursesWithProgress)
        setLoading(false)
      })
      .catch((err) => {
        if (err.response?.status === 204) {
          setError("No enrolled courses found.")
        } else {
          setError("Failed to load enrolled courses.")
        }
        setLoading(false)
      })
  }, [token])

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-6 mb-4 inline-block">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to access your enrolled courses.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950">
      <UserNavbar userEmail={userEmail} />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 text-white leading-[1.3]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Continue Your
              <span className="block bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Track your progress and continue learning with your enrolled courses
            </motion.p>

            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                onClick={() => navigate("/UserDashboard")}
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl px-6 py-2 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Browse More Courses
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-4">
              My Learning Library
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Continue where you left off and complete your courses to earn certificates
            </p>
          </motion.div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-800/80 p-0">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-7 w-4/5 rounded-lg" />
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-16 rounded" />
                          <Skeleton className="h-4 w-10 rounded" />
                        </div>
                        <Skeleton className="h-3 w-full rounded-full" />
                      </div>
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Skeleton className="h-11 w-full rounded-xl" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-2xl shadow-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300 text-lg font-bold">
                  No Courses Found
                </AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400">{error}</AlertDescription>
              </Alert>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => navigate("/UserDashboard")}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Browse Courses
                </Button>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.length > 0 && !loading && !error
                ? courses.map((course, index) => (
                    <motion.div
                      key={course.courseId}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -12, scale: 1.02 }}
                      viewport={{ once: true }}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/course/${course.courseId}`)}
                    >
                      <Card
                        className={`overflow-hidden rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-500 border-2 ${getCardBorder(index)} bg-gradient-to-br ${getCardGradient(index)} h-full relative backdrop-blur-sm`}
                      >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>

                        {/* Course Image with Progress Bar */}
                        <div className="relative overflow-hidden">
                          <img
                            src={course.thumbnailUrl || "/placeholder.svg?height=240&width=400"}
                            alt={course.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                          {/* Progress Bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700/50">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>

                          {/* Progress Indicator */}
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                              {course.progress}% Complete
                            </div>
                            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{getRandomStudentCount(course.courseId)}</span>
                            </div>
                          </div>
                        </div>

                        <CardContent className="px-5 flex flex-col justify-around h-full relative z-10">
                          <div>
                            {/* Title and Category Row */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1 mr-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 leading-tight">
                                  {course.title}
                                </h3>
                                <Badge
                                  className={`${getCategoryColor(course.category)} text-xs font-bold px-3 py-1 rounded-lg shadow-lg`}
                                >
                                  {course.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg mb-2">
                                  ₹{course.price}
                                </div>
                                <Badge
                                  className={`${getLevelColor(course.level)} font-bold px-3 py-1 text-xs rounded-lg`}
                                >
                                  {course.level}
                                </Badge>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed text-sm">
                              {course.description}
                            </p>

                            {/* Course Features */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
                                  <Globe className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-xs font-medium">{course.language}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-lg">
                                  <Clock className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-xs font-medium">Last accessed 2d ago</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Section */}
                          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="font-bold">4.8</span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">(124 reviews)</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <TrendingUp className="h-3 w-3" />
                                <span className="text-xs font-medium">Popular</span>
                              </div>
                            </div>
                            <Button
                              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-700 hover:via-purple-700 hover:to-violet-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/course/${course.courseId}`)
                              }}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              {(course.progress ?? 0) > 0 ? "Continue Learning" : "Start Learning"}
                            </Button>
                          </div>
                        </CardContent>

                        {/* Enhanced Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </Card>
                    </motion.div>
                  ))
                : null}
            </div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

export default EnrolledCourses
