"use client"

import { AppSidebar } from "@/components/AdminSidebar/app-sidebar"
import { SquareLibrary, User2, ShieldCheck, ActivitySquare, TrendingUp, Calendar, Award } from "lucide-react"
import { motion } from "framer-motion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ModeToggle } from "@/components/Sidebar/mode-toggle"
import { useLocation } from "react-router-dom"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"

// Animated count-up hook
function useCountUp(end: number, duration = 1000) {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = timestamp - startTimeRef.current
      const progressRatio = Math.min(progress / duration, 1)
      const currentCount = Math.floor(progressRatio * end)
      setCount(currentCount)

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      startTimeRef.current = null
    }
  }, [end, duration])

  return count
}

export default function AdminDashboard() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)
  const currentPage = pathnames[pathnames.length - 1]

  const [totalUsers, setTotalUsers] = useState(1247)
  const [totalInstructors, setTotalInstructors] = useState(89)
  const [totalCourses, setTotalCourses] = useState(156)
  const [totalEnabledUsers, setTotalEnabledUsers] = useState(1089)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("http://localhost:9092/auth/admin/dashboard-counts")
        const { users, instructors, courses, enabledUsers } = response.data
        setTotalUsers(users)
        setTotalInstructors(instructors)
        setTotalCourses(courses)
        setTotalEnabledUsers(enabledUsers)
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error)
        // Using demo data for showcase
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  const animatedUsers = useCountUp(totalUsers, 1500)
  const animatedInstructors = useCountUp(totalInstructors, 1200)
  const animatedCourses = useCountUp(totalCourses, 1000)
  const animatedEnabledUsers = useCountUp(totalEnabledUsers, 1800)

  // Enhanced data with more realistic trends
  const monthlyData = [
    { name: "Jan", users: 850, instructors: 45, courses: 120, revenue: 45000, engagement: 78 },
    { name: "Feb", users: 920, instructors: 52, courses: 135, revenue: 52000, engagement: 82 },
    { name: "Mar", users: 1050, instructors: 61, courses: 142, revenue: 58000, engagement: 85 },
    { name: "Apr", users: 1180, instructors: 73, courses: 148, revenue: 65000, engagement: 88 },
    { name: "May", users: 1247, instructors: 89, courses: 156, revenue: 72000, engagement: 91 },
  ]

  const courseCategories = [
    { name: "Programming", value: 45, color: "#8B5CF6" },
    { name: "Design", value: 28, color: "#06B6D4" },
    { name: "Business", value: 32, color: "#10B981" },
    { name: "Marketing", value: 25, color: "#F59E0B" },
    { name: "Data Science", value: 26, color: "#EF4444" },
  ]

  const userEngagement = [
    { name: "Highly Active", value: 35, fill: "#10B981" },
    { name: "Moderately Active", value: 45, fill: "#3B82F6" },
    { name: "Low Activity", value: 15, fill: "#F59E0B" },
    { name: "Inactive", value: 5, fill: "#EF4444" },
  ]

  const performanceMetrics = [
    { subject: "User Satisfaction", A: 92, fullMark: 100 },
    { subject: "Course Completion", A: 78, fullMark: 100 },
    { subject: "Instructor Rating", A: 88, fullMark: 100 },
    { subject: "Platform Stability", A: 95, fullMark: 100 },
    { subject: "Content Quality", A: 85, fullMark: 100 },
  ]

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
                  <BreadcrumbPage className="capitalize">{currentPage || "dashboard"}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>

        <div className="flex flex-col gap-6 p-6 bg-background dark:bg-black min-h-screen">
          {/* Enhanced Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Users</p>
                      {loading ? (
                        <Skeleton className="h-9 w-24 bg-white/20 rounded-md my-0.5" />
                      ) : (
                        <p className="text-3xl font-bold">{animatedUsers.toLocaleString()}</p>
                      )}
                      <div className="flex items-center mt-2 text-purple-100">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-xs">+12.5% from last month</span>
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <User2 className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Instructors</p>
                      {loading ? (
                        <Skeleton className="h-9 w-20 bg-white/20 rounded-md my-0.5" />
                      ) : (
                        <p className="text-3xl font-bold">{animatedInstructors.toLocaleString()}</p>
                      )}
                      <div className="flex items-center mt-2 text-blue-100">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-xs">+8.2% from last month</span>
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <ShieldCheck className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Courses</p>
                      {loading ? (
                        <Skeleton className="h-9 w-20 bg-white/20 rounded-md my-0.5" />
                      ) : (
                        <p className="text-3xl font-bold">{animatedCourses.toLocaleString()}</p>
                      )}
                      <div className="flex items-center mt-2 text-green-100">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-xs">+15.3% from last month</span>
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <SquareLibrary className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">Active Users</p>
                      {loading ? (
                        <Skeleton className="h-9 w-24 bg-white/20 rounded-md my-0.5" />
                      ) : (
                        <p className="text-3xl font-bold">{animatedEnabledUsers.toLocaleString()}</p>
                      )}
                      <div className="flex items-center mt-2 text-yellow-100">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-xs">+9.7% from last month</span>
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <ActivitySquare className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <Skeleton className="h-6 w-40 rounded" />
                  </div>
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                </Card>
                <Card className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="flex items-center gap-2">
                    <ActivitySquare className="h-5 w-5 text-green-500" />
                    <Skeleton className="h-6 w-40 rounded" />
                  </div>
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                </Card>
              </div>

              <Card className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-4">
                <div className="flex items-center gap-2">
                  <SquareLibrary className="h-5 w-5 text-purple-500" />
                  <Skeleton className="h-6 w-64 rounded" />
                </div>
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6 rounded-2xl shadow-xl border border-green-100 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <Skeleton className="h-6 w-36 rounded" />
                  </div>
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                </Card>
                <Card className="p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <Skeleton className="h-6 w-36 rounded" />
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <>
              {/* Enhanced Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Area Chart - User Growth */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Growth Analytics
              </h3>
              <ChartContainer
                config={{
                  users: { label: "Users", color: "#8B5CF6" },
                  instructors: { label: "Instructors", color: "#06B6D4" },
                  courses: { label: "Courses", color: "#10B981" },
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorInstructors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
                    <YAxis className="text-gray-600 dark:text-gray-400" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#8B5CF6"
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="instructors"
                      stroke="#06B6D4"
                      fillOpacity={1}
                      fill="url(#colorInstructors)"
                      strokeWidth={3}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </motion.section>

            {/* Radial Bar Chart - User Engagement */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <ActivitySquare className="h-5 w-5 mr-2 text-green-500" />
                User Engagement
              </h3>
              <ChartContainer
                config={{
                  active: { label: "Highly Active", color: "#10B981" },
                  moderate: { label: "Moderately Active", color: "#3B82F6" },
                  low: { label: "Low Activity", color: "#F59E0B" },
                  inactive: { label: "Inactive", color: "#EF4444" },
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={userEngagement}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {userEngagement.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </motion.section>
          </div>

          {/* Course Categories Bar Chart */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
              <SquareLibrary className="h-5 w-5 mr-2 text-purple-500" />
              Course Categories Distribution
            </h3>
            <ChartContainer
              config={{
                programming: { label: "Programming", color: "#8B5CF6" },
                design: { label: "Design", color: "#06B6D4" },
                business: { label: "Business", color: "#10B981" },
                marketing: { label: "Marketing", color: "#F59E0B" },
                datascience: { label: "Data Science", color: "#EF4444" },
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseCategories} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {courseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.section>

          {/* Revenue and Performance Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl shadow-xl border border-green-100 dark:border-green-800"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <Award className="h-5 w-5 mr-2 text-green-600" />
                Revenue Trend
              </h3>
              <ChartContainer config={{ revenue: { label: "Revenue ($)", color: "#10B981" } }}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
                    <YAxis className="text-gray-600 dark:text-gray-400" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      strokeWidth={4}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: "#059669" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </motion.section>

            {/* Quick Stats */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-800"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Quick Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Avg. Course Rating</span>
                  <span className="text-2xl font-bold text-blue-600">4.8/5</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Completion Rate</span>
                  <span className="text-2xl font-bold text-green-600">78%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Monthly Growth</span>
                  <span className="text-2xl font-bold text-purple-600">+12.5%</span>
                </div>
              </div>
            </motion.section>
          </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
