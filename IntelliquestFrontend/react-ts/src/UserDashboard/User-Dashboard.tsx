"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { AlertCircle, Search, BookOpen, Star, Globe, Users, Play, TrendingUp, ShoppingCart, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const UserDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([])

  const courseSectionRef = useRef<HTMLDivElement | null>(null)
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
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

    axios
      .get(`${API_BASE_URL}/auth/fetch-all-courses`, config)
      .then((response) => {
        const list = Array.isArray(response.data) ? response.data : []
        setCourses(list)
        setFilteredCourses(list)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching courses:", err)
        setError("Failed to load courses")
        setLoading(false)
      })

    if (token) {
      axios
        .get(`${API_BASE_URL}/auth/enrolled-courses`, config)
        .then((res) => {
          const ids = (res.data || []).map((c: any) => c.courseId)
          setEnrolledCourseIds(ids)
        })
        .catch(() => {})
    }
  }, [token])

  const navigate = useNavigate()

  const handleSearch = () => {
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCourses(filtered)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const scrollToCourses = () => {
    courseSectionRef.current?.scrollIntoView({ behavior: "smooth" })
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

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-6 mb-4 inline-block">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950">
      {/* Enhanced Navbar */}
      <UserNavbar userEmail={userEmail} />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative px-6 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-[1.3]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover Your
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Unlock your potential with our comprehensive courses designed by industry experts
            </motion.p>

            {/* Enhanced Search Section */}
            <motion.div
              className="max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
                <div className="relative flex flex-col sm:flex-row gap-4 p-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search courses, categories, or topics..."
                      className="p-5 h-14 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:bg-white transition-all duration-300 text-black"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="h-14 px-8 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Search className="h-5 w-5" />
                    Search
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Stats Section */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{courses.length}+</div>
                <div className="text-blue-100 text-lg font-medium">Courses Available</div>
              </div>
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-blue-100 text-lg font-medium">Active Learners</div>
              </div>
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-purple-400 to-violet-500 p-4 rounded-2xl shadow-lg">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">4.8</div>
                <div className="text-blue-100 text-lg font-medium">Average Rating</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Button
                onClick={scrollToCourses}
                className="h-16 px-10 bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-gray-200 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="h-6 w-6" />
                Explore Courses
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Courses Section */}
      <section className="px-6 py-20 lg:py-28">
        <div ref={courseSectionRef} className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-6">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Choose from our carefully curated selection of courses designed to help you achieve your goals and advance
              your career
            </p>
          </motion.div>

          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-800/80 p-0">
                    <Skeleton className="h-52 w-full rounded-none" />
                    <CardContent className="p-6 space-y-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-7 w-4/5 rounded-lg" />
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-2/3 rounded-md" />
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Skeleton className="h-8 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-28 rounded-xl" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 max-w-2xl mx-auto rounded-2xl shadow-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-800 dark:text-red-300">Error Loading Courses</AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-400">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <AnimatePresence>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.length > 0
                ? filteredCourses.map((course, index) => (
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

                        {/* Course Image with Enhanced Overlay */}
                        <div className="relative overflow-hidden">
                          <img
                            src={course.thumbnailUrl || "/placeholder.svg?height=240&width=400"}
                            alt={course.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                          {/* Enhanced Course Stats Overlay */}
                          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                              <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold">4.8</span>
                                  </div>
                                  <span className="text-xs opacity-75">(124 reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium">
                                  <Users className="h-3 w-3" />
                                  <span>{getRandomStudentCount(course.courseId)} students</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardContent className="px-5 flex flex-col justify-around h-full relative z-10">
                          <div>
                            {/* Title and Category Row */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1 mr-4">
                                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                                  {course.title}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    className={`${getCategoryColor(course.category)} text-xs font-bold px-3 py-1 rounded-lg shadow-lg`}
                                  >
                                    {course.category}
                                  </Badge>
                                  {enrolledCourseIds.includes(course.courseId) && (
                                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow">
                                      <CheckCircle className="h-3 w-3 mr-1 inline" />
                                      Enrolled
                                    </Badge>
                                  )}
                                </div>
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
                            <CardDescription className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed text-sm">
                              {course.description}
                            </CardDescription>

                            {/* Course Features in Two Columns */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
                                  <Globe className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-xs font-medium">{course.language}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-lg">
                                  <Users className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                </div>
                                <span className="text-xs font-medium">
                                  {getRandomStudentCount(course.courseId)} students
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Action Section */}
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
                                <span className="text-xs font-medium">Trending</span>
                              </div>
                            </div>
                            {enrolledCourseIds.includes(course.courseId) ? (
                              <Button
                                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/course/${course.courseId}`)
                                }}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Continue Learning
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/course/${course.courseId}`)
                                }}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Buy Course • ₹{course.price}
                              </Button>
                            )}
                          </div>
                        </CardContent>

                        {/* Enhanced Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </Card>
                    </motion.div>
                  ))
                : !loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full flex flex-col items-center justify-center py-20"
                    >
                      <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-full p-12 mb-8 shadow-2xl">
                        <BookOpen className="h-20 w-20 text-blue-500 dark:text-blue-400" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No courses found</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8 text-lg leading-relaxed">
                        {searchTerm
                          ? `No courses match your search for "${searchTerm}". Try different keywords or browse all courses.`
                          : "No courses are available at the moment. Check back later for new content!"}
                      </p>
                      {searchTerm && (
                        <Button
                          onClick={() => {
                            setSearchTerm("")
                            setFilteredCourses(courses)
                          }}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Clear Search & Browse All
                        </Button>
                      )}
                    </motion.div>
                  )}
            </div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

export default UserDashboard
