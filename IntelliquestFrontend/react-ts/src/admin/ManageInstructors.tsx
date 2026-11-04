"use client"

import { useEffect, useState } from "react"
import { getAllUsers, updateUserRole, deleteUser } from "@/api/api"
import type { User } from "@/types/User"
import type { Course } from "@/types/Course"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { toast } from "sonner"
import { ConfirmModal } from "@/components/ConfirmModal"
import { InstructorCoursesDrawer } from "@/components/InstructorCoursesDrawer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ShieldCheck,
  BookOpen,
  UserMinus,
  Trash2,
  Eye,
  Award,
  TrendingUp,
  Mail,
  GraduationCap,
} from "lucide-react"

export default function ManageInstructors() {
  const [instructors, setInstructors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const [drawerCourses, setDrawerCourses] = useState<Course[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmTitle, setConfirmTitle] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchInstructors = async () => {
    try {
      const users = await getAllUsers()
      setInstructors(users.filter((user: User) => user.role === "INSTRUCTOR"))
    } catch (err) {
      toast.error("Failed to fetch instructors")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstructors()
  }, [])

  const handleRevoke = (userId: number) => {
    setConfirmTitle("Revoke instructor to user?")
    setConfirmAction(() => async () => {
      try {
        await updateUserRole(userId, "USER" as any)
        toast.success("Instructor revoked successfully")
        fetchInstructors()
      } catch (err) {
        toast.error("Failed to revoke instructor")
      } finally {
        setConfirmOpen(false)
      }
    })
    setConfirmOpen(true)
  }

  const handleDelete = (userId: number) => {
    setConfirmTitle("Delete this instructor?")
    setConfirmAction(() => async () => {
      try {
        await deleteUser(userId)
        toast.success("Instructor deleted successfully")
        fetchInstructors()
      } catch (err) {
        toast.error("Failed to delete instructor")
      } finally {
        setConfirmOpen(false)
      }
    })
    setConfirmOpen(true)
  }

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openDrawer = (instructor: User) => {
    console.log("Instructor Courses:", instructor.courses)
    setDrawerCourses(instructor.courses || [])
    setSelectedCourses(instructor.courses || [])
    setTimeout(() => {
      setDrawerOpen(true)
    }, 0)
  }

  // Calculate statistics
  const totalInstructors = instructors.length
  const totalCourses = instructors.reduce((acc, instructor) => acc + (instructor.courses?.length || 0), 0)
  const avgCoursesPerInstructor = totalInstructors > 0 ? (totalCourses / totalInstructors).toFixed(1) : "0"

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
                  <BreadcrumbPage className="capitalize">Manage Instructors</BreadcrumbPage>
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
              className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 flex items-center">
                    <ShieldCheck className="h-10 w-10 mr-3" />
                    Instructor Management
                  </h1>
                  <p className="text-purple-100 text-lg">Manage your platform's instructors and their courses</p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      <span className="text-sm flex items-center gap-1.5">
                        {loading ? <Skeleton className="h-4 w-10 bg-white/20 rounded inline-block" /> : totalInstructors} Instructors
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      <span className="text-sm flex items-center gap-1.5">
                        {loading ? <Skeleton className="h-4 w-10 bg-white/20 rounded inline-block" /> : totalCourses} Total Courses
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      <span className="text-sm flex items-center gap-1.5">
                        {loading ? <Skeleton className="h-4 w-10 bg-white/20 rounded inline-block" /> : avgCoursesPerInstructor} Avg. Courses/Instructor
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <TrendingUp className="h-12 w-12 mb-2" />
                    <p className="text-sm text-purple-100">Instructor Growth</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search and Controls */}
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
                    placeholder="Search by instructor name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl"
                  />
                </div>
              </div>
            </motion.div>

            {/* Instructor Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {loading ? (
                  Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <motion.div
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden rounded-2xl shadow-lg border-0 bg-white dark:bg-gray-800">
                          <CardContent className="p-8">
                            <div className="flex flex-col items-center space-y-4">
                              <Skeleton className="h-24 w-24 rounded-full" />
                              <div className="space-y-2 text-center w-full flex flex-col items-center">
                                <Skeleton className="h-6 w-36 rounded" />
                                <Skeleton className="h-4 w-48 rounded" />
                              </div>
                              <div className="flex gap-2">
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                              </div>
                              <div className="grid grid-cols-3 w-full gap-2 pt-2">
                                <Skeleton className="h-9 w-full rounded-xl" />
                                <Skeleton className="h-9 w-full rounded-xl" />
                                <Skeleton className="h-9 w-full rounded-xl" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                ) : filteredInstructors.length > 0 ? (
                  filteredInstructors.map((instructor, index) => (
                    <motion.div
                      key={instructor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                        <CardContent className="p-8">
                          <div className="flex flex-col items-center text-center space-y-5">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full opacity-20 blur-lg transform scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${instructor.username}`}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-xl">
                                  {instructor.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {instructor.username}
                              </h3>
                              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {instructor.email}
                              </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2">
                              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                Instructor
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                <BookOpen className="h-4 w-4 mr-1" />
                                {instructor.courses?.length ?? 0} Courses
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 w-full gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDrawer(instructor)}
                                className="rounded-xl border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20"
                              >
                                <Eye className="h-4 w-4" />
                                Courses
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRevoke(instructor.id)}
                                className="rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20"
                              >
                                <UserMinus className="h-4 w-4" />
                                Revoke
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(instructor.id)}
                                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
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
                      <ShieldCheck className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No instructors found</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                      {searchTerm
                        ? `No instructors match your search for "${searchTerm}"`
                        : "No instructors have been registered yet."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </SidebarInset>

      {/* Modals */}
      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
      <InstructorCoursesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} courses={drawerCourses} />
    </SidebarProvider>
  )
}
