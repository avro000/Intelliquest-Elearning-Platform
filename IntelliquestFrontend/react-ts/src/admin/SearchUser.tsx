"use client"

import { AppSidebar } from "@/components/AdminSidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/ConfirmModal"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/Sidebar/mode-toggle"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { getAllUsers, updateUserStatus, updateUserRole, deleteUser } from "@/api/api"
import type { User, UserRoleName } from "@/types/User"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Crown,
  Trash2,
  SortAsc,
  SortDesc,
  Filter,
  Shield,
  Mail,
  Hash,
  TrendingUp,
  Settings,
} from "lucide-react"

const sortUsers = (users: User[], sortBy: "userId" | "username", sortOrder: "asc" | "desc") => {
  return [...users].sort((a, b) => {
    if (sortBy === "userId") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id
    } else {
      return sortOrder === "asc" ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username)
    }
  })
}

export default function SearchUser() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)
  const currentPage = pathnames[pathnames.length - 1]

  const [searchTerm, setSearchTerm] = useState("")
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmTitle, setConfirmTitle] = useState("")
  const [confirmDescription, setConfirmDescription] = useState("")
  const [sortBy, setSortBy] = useState<"userId" | "username">("userId")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const setSort = (field: "userId" | "username", order: "asc" | "desc") => {
    setSortBy(field)
    setSortOrder(order)
  }

  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers()
      const filteredUsers = users.filter((user: User) => user.role === ("USER" as UserRoleName))
      const sortedUsers = sortUsers(filteredUsers, sortBy, sortOrder)
      setAllUsers(sortedUsers)
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => setSearchTerm("")

  const openConfirmModal = (title: string, onConfirm: () => void, description?: string) => {
    setConfirmTitle(title)
    setConfirmAction(() => onConfirm)
    setConfirmDescription(description || "")
    setConfirmOpen(true)
  }

  const handleRoleUpdate = async (userId: number, newRole: UserRoleName) => {
    openConfirmModal("Are you sure you want to update the role?", async () => {
      try {
        await updateUserRole(userId, newRole)
        toast.success("Role updated successfully")
        fetchAllUsers()
      } catch (err) {
        toast.error("Failed to update role")
      } finally {
        setConfirmOpen(false)
      }
    })
  }

  const handleDelete = async (userId: number) => {
    openConfirmModal(
      "Are you sure you want to delete this user?",
      async () => {
        try {
          await deleteUser(userId)
          toast.success("User deleted successfully")
          fetchAllUsers()
        } catch (err) {
          toast.error("Failed to delete user")
        } finally {
          setConfirmOpen(false)
        }
      },
      "This action cannot be undone.",
    )
  }

  const handleStatusToggle = async (user: User) => {
    try {
      const newEnabled = !user.enabled
      await updateUserStatus(user.id, newEnabled)
      fetchAllUsers()
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [sortBy, sortOrder])

  const filteredUsers = allUsers.filter(
    (user) =>
      `${user.username}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const activeUsers = allUsers.filter((user) => user.enabled).length
  const inactiveUsers = allUsers.length - activeUsers

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
                  <BreadcrumbPage className="capitalize">{currentPage}</BreadcrumbPage>
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
              className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 flex items-center">
                    <Users className="h-10 w-10 mr-3" />
                    User Management
                  </h1>
                  <p className="text-emerald-100 text-lg">Search, manage, and monitor all platform users</p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      <span className="text-sm flex items-center gap-1.5">
                        {loading ? <Skeleton className="h-4 w-12 bg-white/20 rounded inline-block" /> : activeUsers} Active Users
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserX className="h-5 w-5" />
                      <span className="text-sm flex items-center gap-1.5">
                        {loading ? <Skeleton className="h-4 w-12 bg-white/20 rounded inline-block" /> : inactiveUsers} Inactive Users
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      <span className="text-sm flex items-center gap-1.5">
                        {loading ? <Skeleton className="h-4 w-12 bg-white/20 rounded inline-block" /> : allUsers.length} Total Users
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <TrendingUp className="h-12 w-12 mb-2" />
                    <p className="text-sm text-emerald-100">User Growth</p>
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
                    placeholder="Search by ID, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="h-12 px-6 rounded-xl border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Clear
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Filter className="h-5 w-5 mr-2" />
                        Sort By
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Hash className="h-4 w-4 mr-2" />
                          ID
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setSort("userId", "asc")}>
                            <SortAsc className="h-4 w-4 mr-2" />
                            Ascending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSort("userId", "desc")}>
                            <SortDesc className="h-4 w-4 mr-2" />
                            Descending
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Users className="h-4 w-4 mr-2" />
                          Name
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setSort("username", "asc")}>
                            <SortAsc className="h-4 w-4 mr-2" />A → Z
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSort("username", "desc")}>
                            <SortDesc className="h-4 w-4 mr-2" />Z → A
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-6 w-6 mr-2 text-emerald-600" />
                  All Users ({filteredUsers.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          ID
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          User
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Role
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center justify-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Status
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center justify-center gap-2">
                          <Settings className="h-4 w-4" />
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {loading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4">
                            <Skeleton className="h-5 w-12 rounded" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-1">
                                <Skeleton className="h-4 w-28 rounded" />
                                <Skeleton className="h-3 w-16 rounded" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-44 rounded" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Skeleton className="h-6 w-10 mx-auto rounded-full" />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Skeleton className="h-8 w-24 mx-auto rounded-lg" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <AnimatePresence>
                        {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="font-mono">
                              #{user.id}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                  {getInitials(user.username)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">User ID: {user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-900 dark:text-white">{user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Switch
                                checked={user.enabled}
                                onCheckedChange={() => handleStatusToggle(user)}
                                className="data-[state=checked]:bg-emerald-600"
                              />
                              <Badge
                                variant={user.enabled ? "default" : "secondary"}
                                className={
                                  user.enabled
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                }
                              >
                                {user.enabled ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRoleUpdate(user.id, "INSTRUCTOR" as UserRoleName)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                              >
                                <Crown className="h-4 w-4 mr-1" />
                                Promote
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(user.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    )}
                  </tbody>
                </table>

                {!loading && filteredUsers.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                      <Users className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                      {searchTerm
                        ? `No users match your search for "${searchTerm}"`
                        : "No users have been registered yet."}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </SidebarInset>

      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </SidebarProvider>
  )
}
