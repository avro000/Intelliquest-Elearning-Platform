"use client"

import type React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/Sidebar/mode-toggle"
import { useNavigate, useLocation } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { GraduationCap, LogOut, Settings, Home, BookOpen, LayoutDashboard } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "../AuthContext"
import { MdLeaderboard } from "react-icons/md"

interface UserNavbarProps {
  userEmail?: string
}

const UserNavbar: React.FC<UserNavbarProps> = ({ userEmail }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, profileImage, currentUser, refreshUser } = useAuth()

  useEffect(() => {
    // If user profile or picture hasn't been fetched yet in context, load it
    if (!profileImage && !currentUser) {
      refreshUser()
    }
  }, [profileImage, currentUser, refreshUser])

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const getInitials = (text: string) => {
    if (!text) return "U"
    const cleaned = text.includes("@") ? text.split("@")[0] : text
    const parts = cleaned.trim().split(/[\s._]+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return cleaned.slice(0, 2).toUpperCase()
  }

  const displayName = currentUser?.username || (userEmail ? userEmail.split("@")[0] : "Student")
  const displayEmail = currentUser?.email || userEmail || ""
  const avatarSrc = profileImage || currentUser?.profilePictureUrl || ""

  const isActive = (path: string) => location.pathname === path

  const baseButtonClasses =
    "font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl px-4 py-2 transition-all duration-200"

  const activeClasses = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg dark:bg-gray-900/95 dark:text-white px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50">
      <div
        className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none"
        onClick={() => navigate("/UserDashboard")}
      >
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-md">
          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          IntelliQuest
        </span>
      </div>

      <div className="hidden md:flex items-center space-x-2">
        <Button
          variant="ghost"
          className={`${baseButtonClasses} ${isActive("/UserDashboard") ? activeClasses : ""}`}
          onClick={() => navigate("/UserDashboard")}
        >
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>

        <Button
          variant="ghost"
          className={`${baseButtonClasses} ${isActive("/EnrolledCourses") ? activeClasses : ""}`}
          onClick={() => navigate("/EnrolledCourses")}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          My Courses
        </Button>

        <Button
          variant="ghost"
          className={`${baseButtonClasses} ${isActive("/quiz-list") ? activeClasses : ""}`}
          onClick={() => navigate("/quiz-list")}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Play Quiz
        </Button>

        <Button
          variant="ghost"
          className={`${baseButtonClasses} ${isActive("/quiz-dashboard") ? activeClasses : ""}`}
          onClick={() => navigate("/quiz-dashboard")}
        >
          <MdLeaderboard className="h-4 w-4 mr-2" />
          Leaderboard
        </Button>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <Avatar className="w-9 h-9 sm:w-10 sm:h-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-200 cursor-pointer">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60 mt-2 rounded-2xl shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-2 z-50"
          >
            <div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-700/70 mb-1.5 flex items-center gap-3">
              <Avatar className="w-9 h-9 ring-2 ring-blue-500/20 shrink-0">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{displayEmail}</p>
              </div>
            </div>

            {/* Mobile-only Navigation links (shown in avatar dropdown on mobile screens) */}
            <div className="md:hidden">
              <DropdownMenuItem
                onClick={() => navigate("/UserDashboard")}
                className={`flex items-center cursor-pointer rounded-xl px-3 py-2 text-sm transition-all duration-150 ${
                  isActive("/UserDashboard")
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <Home className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                <span>Home</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/EnrolledCourses")}
                className={`flex items-center cursor-pointer rounded-xl px-3 py-2 text-sm transition-all duration-150 ${
                  isActive("/EnrolledCourses")
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <BookOpen className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                <span>My Courses</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/quiz-list")}
                className={`flex items-center cursor-pointer rounded-xl px-3 py-2 text-sm transition-all duration-150 ${
                  isActive("/quiz-list")
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                <span>Play Quiz</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/quiz-dashboard")}
                className={`flex items-center cursor-pointer rounded-xl px-3 py-2 text-sm transition-all duration-150 ${
                  isActive("/quiz-dashboard")
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <MdLeaderboard className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                <span>Leaderboard</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1.5 bg-gray-100 dark:bg-gray-700/70" />
            </div>

            <DropdownMenuItem
              onClick={() => navigate("/account-settings")}
              className={`flex items-center cursor-pointer rounded-xl px-3 py-2 text-sm transition-all duration-150 ${
                isActive("/account-settings")
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
            >
              <Settings className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
              <span>Account Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5 bg-gray-100 dark:bg-gray-700/70" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 cursor-pointer rounded-xl px-3 py-2 text-sm transition-all duration-150 font-medium"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default UserNavbar
