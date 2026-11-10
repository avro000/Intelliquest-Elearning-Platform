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
      <SidebarInset className="dark:bg-black min-w-0 w-full max-w-full overflow-x-hidden overflow-y-auto">
        <header className="flex h-14 sm:h-16 shrink-0 items-center justify-between gap-2 px-3 sm:px-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem className="hidden md:block">Admin</BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="capitalize truncate max-w-[160px] sm:max-w-none text-xs sm:text-sm font-semibold">All Courses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-2 sm:px-4 shrink-0">
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 pb-8 sm:pb-12 pt-0 w-full max-w-full min-w-0 overflow-x-hidden">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold mb-1.5 sm:mb-2 flex items-center">
                    <GraduationCap className="h-7 w-7 sm:h-10 sm:w-10 mr-2 sm:mr-3 shrink-0" />
                    Course Management
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-lg">Browse, manage, and analyze all courses in your platform</p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-3 sm:mt-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                      <span className="text-xs sm:text-sm flex items-center gap-1.5">
                        {loading ? <Skeleton className="h-4 w-20 bg-white/20 rounded inline-block" /> : `${filteredCourses.length} of ${courses.length} Courses`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                      <span className="text-xs sm:text-sm flex items-center gap-1.5">
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-3.5 sm:p-5 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by course title or instructor email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                  />
                </div>
                <div className="flex gap-2 shrink-0">
                  <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-11 sm:h-12 px-4 sm:px-6 rounded-xl border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs sm:text-sm ${hasActiveFilters ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400" : ""}`}
                      >
                        <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
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
                    <SheetContent className="w-full sm:max-w-[420px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-0 overflow-y-auto">
                      <div className="p-5 sm:p-8">
                        <SheetHeader className="pb-5 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                          <SheetTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Filter Courses
                          </SheetTitle>
                          <SheetDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                            Filter courses by level, language, and price range
                          </SheetDescription>
                        </SheetHeader>

                        <div className="py-5 sm:py-6 space-y-6 sm:space-y-8">
                          {/* Level Filter */}
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Course Level</h3>
                            <div className="space-y-3 pl-2">
                              {uniqueLevels.map((level) => (
                                <div key={level} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`level-${level}`}
                                    checked={filters.levels.includes(level)}
                                    onCheckedChange={(checked) => handleLevelFilter(level, checked as boolean)}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                  <Label htmlFor={`level-${level}`} className="text-sm sm:text-base capitalize cursor-pointer">
                                    {level}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Language Filter */}
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Language</h3>
                            <div className="space-y-3 pl-2">
                              {uniqueLanguages.map((language) => (
                                <div key={language} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`language-${language}`}
                                    checked={filters.languages.includes(language)}
                                    onCheckedChange={(checked) => handleLanguageFilter(language, checked as boolean)}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                  <Label htmlFor={`language-${language}`} className="text-sm sm:text-base capitalize cursor-pointer">
                                    {language}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Price Range Filter */}
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Price Range</h3>
                            <div className="space-y-5 sm:space-y-6 px-2">
                              <Slider
                                value={filters.priceRange}
                                onValueChange={handlePriceRangeChange}
                                max={priceRange[1]}
                                min={priceRange[0]}
                                step={10}
                                className="w-full"
                              />
                              <div className="flex justify-between items-center">
                                <div className="bg-white dark:bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
                                  <span className="flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-0.5" />
                                    {filters.priceRange[0]}
                                  </span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
                                  <span className="flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-0.5" />
                                    {filters.priceRange[1]}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-5 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                              variant="default"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-xs sm:text-sm"
                              onClick={() => setFilterOpen(false)}
                            >
                              Apply Filters
                            </Button>
                            {hasActiveFilters && (
                              <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 h-10 sm:h-11 text-xs sm:text-sm"
                              >
                                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full min-w-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 w-full min-w-0 justify-items-stretch">
                {loading ? (
                  Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="h-full flex flex-col w-full min-w-0 max-w-full justify-self-stretch"
                      >
                        <Card className="overflow-hidden rounded-2xl shadow-lg border-0 bg-white dark:bg-gray-800 h-full flex flex-col w-full min-w-0 max-w-full">
                          <Skeleton className="w-full aspect-[16/9] shrink-0" />
                          <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between w-full min-w-0 max-w-full">
                            <div className="space-y-3 min-w-0 w-full">
                              <div>
                                <Skeleton className="h-5 sm:h-6 w-4/5 rounded mb-1.5" />
                                <Skeleton className="h-3.5 sm:h-4 w-1/2 rounded" />
                              </div>
                              <Skeleton className="h-9 w-full rounded mt-2" />
                              <div className="flex items-center gap-2 pt-1">
                                <Skeleton className="h-5 w-14 rounded-md" />
                                <Skeleton className="h-5 w-16 rounded-md" />
                                <Skeleton className="h-5 w-14 rounded-md" />
                              </div>
                            </div>
                            <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-700/60 space-y-3 min-w-0 w-full">
                              <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-20 rounded" />
                                <Skeleton className="h-5 w-12 rounded-full" />
                              </div>
                              <div className="flex gap-2">
                                <Skeleton className="h-9 sm:h-10 flex-1 rounded-xl" />
                                <Skeleton className="h-9 sm:h-10 w-9 sm:w-10 rounded-xl" />
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
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="group h-full flex flex-col w-full min-w-0 max-w-full justify-self-stretch"
                      >
                        <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-0 bg-white dark:bg-gray-800 h-full flex flex-col w-full min-w-0 max-w-full">
                          <div className="relative aspect-[16/9] w-full max-w-full overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                            <img
                              src={course.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between w-full min-w-0 max-w-full">
                            <div className="flex flex-col min-w-0 w-full">
                              <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[2.75rem] sm:min-h-[3.25rem] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words">
                                  {course.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center min-w-0">
                                  <Users className="h-3.5 w-3.5 mr-1 shrink-0" />
                                  <span className="truncate">{course.instructorEmail}</span>
                                </p>
                              </div>

                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2 leading-relaxed min-h-[2.5rem] break-words">
                                {course.description}
                              </p>

                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mt-3 min-h-[1.6rem] w-full">
                                <Badge className={`${getLevelColor(course.level)} text-[11px] sm:text-xs font-medium px-2 py-0.5`}>
                                  {course.level}
                                </Badge>
                                <Badge className={`${getLanguageColor(course.language)} text-[11px] sm:text-xs px-2 py-0.5`}>
                                  <Globe className="h-3 w-3 mr-1" />
                                  {course.language}
                                </Badge>
                                <Badge variant="secondary" className="text-[11px] sm:text-xs px-2 py-0.5">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Course
                                </Badge>
                              </div>
                            </div>

                            <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-700/60 flex flex-col gap-3 w-full min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                  <span className="text-xl sm:text-2xl font-bold text-green-600">{course.price.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                  <Star className="h-3.5 w-3.5 fill-current" />
                                  <span className="text-xs sm:text-sm font-semibold">4.8</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openCourseDetails(course)}
                                  className="flex-1 h-9 sm:h-10 text-xs sm:text-sm rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 font-medium"
                                >
                                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteCourse(course.courseId)}
                                  className="h-9 sm:h-10 w-9 sm:w-10 p-0 rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 shrink-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
            </motion.div>
          </div>
      </SidebarInset>

      {/* Course Details Drawer */}
      <CourseDrawer course={selectedCourse} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SidebarProvider>
  )
}
