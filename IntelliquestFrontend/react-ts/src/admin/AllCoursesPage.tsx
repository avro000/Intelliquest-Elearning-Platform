"use client"

import { useEffect, useState } from "react"
import { getAllCourses, deleteCourse } from "@/api/api"
import type { Course } from "@/types/Course"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { AppSidebar } from "@/components/AdminSidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/Sidebar/mode-toggle"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { CourseDrawer } from "@/components/CourseDrawer"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  BookOpen,
  Users,
  Star,
  Clock,
  Globe,
  TrendingUp,
  Filter,
  Eye,
  Trash2,
  GraduationCap,
  IndianRupee,
  X,
} from "lucide-react"

interface FilterState {
  levels: string[]
  languages: string[]
  priceRange: [number, number]
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    levels: [],
    languages: [],
    priceRange: [0, 10000],
  })

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses()
      setCourses(data)
      // Set initial price range based on actual course prices
      if (data.length > 0) {
        const prices = data.map((course: Course) => course.price)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        setFilters((prev) => ({
          ...prev,
          priceRange: [minPrice, maxPrice],
        }))
      }
    } catch (err) {
      toast.error("Failed to fetch courses")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await deleteCourse(courseId)
      setCourses(courses.filter((course) => course.courseId !== courseId))
      toast.success("Course deleted successfully")
    } catch (err) {
      toast.error("Failed to delete course")
    }
  }

  const openCourseDetails = (course: Course) => {
    setSelectedCourse(course)
    setDrawerOpen(true)
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  // Get unique values for filter options
  const uniqueLevels = [...new Set(courses.map((course) => course.level).filter(Boolean))]
  const uniqueLanguages = [...new Set(courses.map((course) => course.language).filter(Boolean))]
  const priceRange =
    courses.length > 0
      ? [Math.min(...courses.map((course) => course.price)), Math.max(...courses.map((course) => course.price))]
      : [0, 10000]

  // Apply filters
  const filteredCourses = courses.filter((course) => {
    // Search filter
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructorEmail.toLowerCase().includes(searchTerm.toLowerCase())

    // Level filter
    const matchesLevel = filters.levels.length === 0 || filters.levels.includes(course.level)

    // Language filter
    const matchesLanguage = filters.languages.length === 0 || filters.languages.includes(course.language)

    // Price filter
    const matchesPrice = course.price >= filters.priceRange[0] && course.price <= filters.priceRange[1]

    return matchesSearch && matchesLevel && matchesLanguage && matchesPrice
  })

  const handleLevelFilter = (level: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      levels: checked ? [...prev.levels, level] : prev.levels.filter((l) => l !== level),
    }))
  }

  const handleLanguageFilter = (language: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      languages: checked ? [...prev.languages, language] : prev.languages.filter((l) => l !== language),
    }))
  }

  const handlePriceRangeChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }))
  }

  const clearFilters = () => {
    setFilters({
      levels: [],
      languages: [],
      priceRange: priceRange as [number, number],
    })
  }

  const hasActiveFilters =
    filters.levels.length > 0 ||
    filters.languages.length > 0 ||
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1]

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language?.toLowerCase()) {
      case "english":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "spanish":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "french":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between px-4 border-b border-border bg-background dark:bg-black">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">Admin</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">All Courses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>

        <div className="min-h-screen bg-background dark:bg-black">
          <div className="flex flex-col gap-6 p-6">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 flex items-center">
                    <GraduationCap className="h-10 w-10 mr-3" />
                    Course Management
                  </h1>
                  <p className="text-blue-100 text-lg">Browse, manage, and analyze all courses in your platform</p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      <span className="text-sm flex items-center gap-1.5">
                        {loading ? <Skeleton className="h-4 w-20 bg-white/20 rounded inline-block" /> : `${filteredCourses.length} of ${courses.length} Courses`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span className="text-sm flex items-center gap-1.5">
                        {loading ? <Skeleton className="h-4 w-16 bg-white/20 rounded inline-block" /> : `${new Set(courses.map((c) => c.instructorEmail)).size} Instructors`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <TrendingUp className="h-12 w-12 mb-2" />
                    <p className="text-sm text-blue-100">Platform Growth</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by course title or instructor email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                  />
                </div>
                <div className="flex gap-2">
                  <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-12 px-6 rounded-xl border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${hasActiveFilters ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400" : ""}`}
                      >
                        <Filter className="h-5 w-5 mr-2" />
                        Filters
                        {hasActiveFilters && (
                          <Badge
                            variant="secondary"
                            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {filters.levels.length +
                              filters.languages.length +
                              (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1]
                                ? 1
                                : 0)}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[350px] sm:w-[450px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-0">
                      <div className="p-8">
                        <SheetHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
                          <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Filter Courses
                          </SheetTitle>
                          <SheetDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
                            Filter courses by level, language, and price range
                          </SheetDescription>
                        </SheetHeader>

                        <div className="py-6 space-y-8">
                          {/* Level Filter */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Course Level</h3>
                            <div className="space-y-3 pl-2">
                              {uniqueLevels.map((level) => (
                                <div key={level} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`level-${level}`}
                                    checked={filters.levels.includes(level)}
                                    onCheckedChange={(checked) => handleLevelFilter(level, checked as boolean)}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                  <Label htmlFor={`level-${level}`} className="text-base capitalize">
                                    {level}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Language Filter */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Language</h3>
                            <div className="space-y-3 pl-2">
                              {uniqueLanguages.map((language) => (
                                <div key={language} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`language-${language}`}
                                    checked={filters.languages.includes(language)}
                                    onCheckedChange={(checked) => handleLanguageFilter(language, checked as boolean)}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                  <Label htmlFor={`language-${language}`} className="text-base capitalize">
                                    {language}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Price Range Filter */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price Range</h3>
                            <div className="space-y-6 px-2">
                              <Slider
                                value={filters.priceRange}
                                onValueChange={handlePriceRangeChange}
                                max={priceRange[1]}
                                min={priceRange[0]}
                                step={10}
                                className="w-full"
                              />
                              <div className="flex justify-between items-center">
                                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-sm">
                                  <span className="flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-0.5" />
                                    {filters.priceRange[0]}
                                  </span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-sm">
                                  <span className="flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-0.5" />
                                    {filters.priceRange[1]}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                              variant="default"
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() => setFilterOpen(false)}
                            >
                              Apply Filters
                            </Button>
                            {hasActiveFilters && (
                              <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Clear
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.levels.map((level) => (
                    <Badge
                      key={level}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/30 px-2 py-1 rounded-md cursor-pointer"
                      onClick={() => handleLevelFilter(level, false)}
                    >
                      {level}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {filters.languages.map((language) => (
                    <Badge
                      key={language}
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/30 px-2 py-1 rounded-md cursor-pointer"
                      onClick={() => handleLanguageFilter(language, false)}
                    >
                      {language}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {(filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1]) && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/30 px-2 py-1 rounded-md cursor-pointer"
                      onClick={() => setFilters((prev) => ({ ...prev, priceRange: priceRange as [number, number] }))}
                    >
                      <div className="flex items-center">
                        <IndianRupee className="h-3 w-3 mr-0.5" />
                        {filters.priceRange[0]} - <IndianRupee className="h-3 w-3 mx-0.5" />
                        {filters.priceRange[1]}
                      </div>
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                </div>
              )}
            </motion.div>

            {/* Courses Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {loading ? (
                    Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden rounded-2xl shadow-lg border-0 bg-white dark:bg-gray-800">
                            <Skeleton className="w-full h-48 rounded-t-2xl" />
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div>
                                  <Skeleton className="h-6 w-4/5 rounded mb-2" />
                                  <Skeleton className="h-4 w-3/5 rounded" />
                                </div>
                                <Skeleton className="h-4 w-full rounded" />
                                <div className="flex items-center gap-2">
                                  <Skeleton className="h-5 w-16 rounded-md" />
                                  <Skeleton className="h-5 w-20 rounded-md" />
                                  <Skeleton className="h-5 w-16 rounded-md" />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                  <Skeleton className="h-6 w-16 rounded" />
                                  <div className="flex gap-2">
                                    <Skeleton className="h-8 w-16 rounded-lg" />
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                  ) : filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
                      <motion.div
                        key={course.courseId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group"
                      >
                        <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                          <div className="relative">
                            <img
                              src={course.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                              alt={course.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {course.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {course.instructorEmail}
                                </p>
                              </div>

                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {course.description}
                              </p>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`${getLevelColor(course.level)} text-xs font-medium`}>
                                  {course.level}
                                </Badge>
                                <Badge className={`${getLanguageColor(course.language)} text-xs`}>
                                  <Globe className="h-3 w-3 mr-1" />
                                  {course.language}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Course
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="h-5 w-5 text-green-600" />
                                  <span className="text-2xl font-bold text-green-600">{course.price}</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm font-medium">4.8</span>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openCourseDetails(course)}
                                  className="flex-1 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteCourse(course.courseId)}
                                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full flex flex-col items-center justify-center py-16"
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                        {searchTerm || hasActiveFilters
                          ? "No courses match your current search and filter criteria"
                          : "No courses have been uploaded yet. Check back later!"}
                      </p>
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </SidebarInset>

      {/* Course Details Drawer */}
      <CourseDrawer course={selectedCourse} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SidebarProvider>
  )
}
