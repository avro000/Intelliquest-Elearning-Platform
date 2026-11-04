"use client"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { LogOut, Settings, ShoppingBag, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

interface DecodedToken {
  name: string
  sub: string
  image?: string
  role?: string
  exp?: number
}

export function UserAvatarDropdown() {
  const navigate = useNavigate()
  const [user, setUser] = useState<DecodedToken | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const decoded: DecodedToken = jwtDecode(token)

        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          handleLogout()
          return
        }

        setUser(decoded)

        // Try to get cached profile image first
        const cachedImage = localStorage.getItem("profileImage")
        if (cachedImage) {
          setProfileImage(cachedImage)
        }

        // Fetch fresh profile image
        await fetchProfileImage(token)
      } catch (error) {
        console.error("Invalid token:", error)
        handleLogout()
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [navigate])

  const fetchProfileImage = async (token: string) => {
    try {
      setImageLoading(true)
      const response = await axios.get("http://localhost:9092/auth/users/profile-picture", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
        timeout: 5000, // 5 second timeout
      })

      const blob = response.data
      const imageUrl = URL.createObjectURL(blob)
      setProfileImage(imageUrl)
      localStorage.setItem("profileImage", imageUrl)
    } catch (error) {
      console.warn("Could not fetch profile image:", error)
      // Don't show error to user, just use fallback
    } finally {
      setImageLoading(false)
    }
  }

  const handleLogout = () => {
    // Clean up
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("profileImage")

    // Revoke object URLs to prevent memory leaks
    if (profileImage && profileImage.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage)
    }

    navigate("/login", { replace: true })
  }

  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      const nameParts = name.trim().split(" ")
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      }
      return name.slice(0, 2).toUpperCase()
    }

    // Fallback to email-based initials
    const [namePart] = email.split("@")
    const parts = namePart.split(".")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return namePart.slice(0, 2).toUpperCase()
  }

  const getRoleColor = (role?: string) => {
    switch (role?.toUpperCase()) {
      case "INSTRUCTOR":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "ADMIN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) return null

  const { name, sub, role } = user
  const displayName = name || sub.split("@")[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
        >
          <Avatar className="w-10 h-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-200 cursor-pointer">
            <AvatarImage src={profileImage || "/placeholder.svg"} alt={displayName} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
              {imageLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : getInitials(name, sub)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 mt-2 rounded-xl shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-2"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg mb-2">
            <Avatar className="h-12 w-12 ring-2 ring-white/50 shadow-md">
              <AvatarImage src={profileImage || "/placeholder.svg"} alt={displayName} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                {getInitials(name, sub)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{sub}</span>
              {role && (
                <Badge variant="secondary" className={`text-xs mt-1 w-fit ${getRoleColor(role)}`}>
                  {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <a
            href="/purchases"
            className="flex items-center w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer rounded-lg px-3 py-2.5 transition-colors duration-200"
          >
            <ShoppingBag className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">My Purchases</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href="/settings"
            className="flex items-center w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer rounded-lg px-3 py-2.5 transition-colors duration-200"
          >
            <Settings className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Settings</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 cursor-pointer rounded-lg px-3 py-2.5 transition-colors duration-200 focus:bg-red-50 dark:focus:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
