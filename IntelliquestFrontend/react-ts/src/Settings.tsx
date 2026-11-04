import type React from "react"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import { useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./components/Sidebar/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Camera, Loader2, Trash, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { getLoggedInUser } from "@/api/api"
import { useAuth } from "@/AuthContext"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"

export default function Settings() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)
  const currentPage = pathnames[pathnames.length - 1]
  const { currentUser, profileImage, setProfileImage, refreshUser, userRole } = useAuth()

  // Real user data state initialized from AuthContext
  const [username, setUsername] = useState(currentUser?.username || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [profilePicture, setProfilePicture] = useState<string | null>(
    currentUser?.profilePictureUrl || profileImage || null
  )
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  const token = localStorage.getItem("token")

  // Keep state synced when currentUser or profileImage updates
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "")
      setEmail(currentUser.email || "")
      setProfilePicture(currentUser.profilePictureUrl || profileImage || null)
      setIsLoadingUser(false)
    }
  }, [currentUser, profileImage])

  // Load authenticated user profile from backend database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userData] = await Promise.all([getLoggedInUser(), new Promise((r) => setTimeout(r, 350))])
        if (userData) {
          setUsername(userData.username || "")
          setEmail(userData.email || "")

          if (userData.profilePictureUrl) {
            setProfilePicture(userData.profilePictureUrl)
            setProfileImage(userData.profilePictureUrl)
          } else if (token) {
            try {
              const decoded: any = jwtDecode(token)
              if (decoded.picture) {
                setProfilePicture(decoded.picture)
                setProfileImage(decoded.picture)
              }
            } catch (e) {
              console.error("Error decoding token in settings:", e)
            }
          }
        }
      } catch (error) {
        console.error("Failed to load user profile in settings:", error)
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUserData()
  }, [token, setProfileImage])

  // Get user initials for avatar fallback
  const getInitials = () => {
    const text = username || email || "U"
    const cleaned = text.includes("@") ? text.split("@")[0] : text
    const parts = cleaned.trim().split(/[\s._]+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return cleaned.slice(0, 2).toUpperCase()
  }

  // Handle profile picture upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("profilePic", file)

      const response = await axios.post("http://localhost:9092/auth/users/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        const updatedUser = await refreshUser()
        const newPicUrl = updatedUser?.profilePictureUrl || ""
        if (newPicUrl) {
          setProfilePicture(newPicUrl)
          setProfileImage(newPicUrl)
        }
        setIsDialogOpen(false)

        toast.success("Profile picture updated!", {
          description: "Your profile picture has been updated successfully.",
          style: { backgroundColor: "#16a34a", color: "white" },
        })
      }
    } catch (error: any) {
      console.error("Profile picture upload failed:", error)
      toast.error("Upload failed", {
        description: error.response?.data || "Could not upload profile picture.",
        style: { backgroundColor: "#dc2626", color: "white" },
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle profile picture deletion
  const handleDeletePicture = async () => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("removePicture", "true")

      const response = await axios.post("http://localhost:9092/auth/users/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        await refreshUser()
        setProfilePicture(null)
        setProfileImage(null)
        localStorage.removeItem("profileImage")
        setIsDialogOpen(false)

        toast.success("Profile picture removed!", {
          description: "Your profile picture has been removed.",
          style: { backgroundColor: "#16a34a", color: "white" },
        })
      }
    } catch (error: any) {
      console.error("Profile picture removal failed:", error)
      toast.error("Failed to remove profile picture", {
        style: { backgroundColor: "#dc2626", color: "white" },
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle save changes (username update)
  const handleSaveChanges = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty", {
        style: { backgroundColor: "#dc2626", color: "white" },
      })
      return
    }

    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append("username", username.trim())

      const response = await axios.post("http://localhost:9092/auth/users/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        const updatedUser = await refreshUser()
        if (updatedUser) {
          setUsername(updatedUser.username || username)
          setEmail(updatedUser.email || email)
          if (updatedUser.profilePictureUrl) {
            setProfilePicture(updatedUser.profilePictureUrl)
            setProfileImage(updatedUser.profilePictureUrl)
          }
        }
        toast.success("Settings saved!", {
          description: "Your account settings have been saved successfully.",
          style: { backgroundColor: "#16a34a", color: "white" },
        })
      }
    } catch (error: any) {
      console.error("Failed to update profile settings:", error)
      toast.error("Update failed", {
        description: error.response?.data || "Could not save settings.",
        style: { backgroundColor: "#dc2626", color: "white" },
      })
    } finally {
      setIsSaving(false)
    }
  }

  const roleLabel = userRole === "ADMIN" ? "Admin" : "Instructor"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <span>{roleLabel}</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">{currentPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">
          <Card className="border-0 shadow-none bg-sidebar">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingUser ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Skeleton className="w-28 h-28 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-40 rounded" />
                      <Skeleton className="h-4 w-56 rounded" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-10 w-full max-w-md rounded-md" />
                  </div>
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
              ) : (
                <>
                  {/* Profile Picture Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-28 h-28 border-2 border-muted">
                        <AvatarImage src={profilePicture || ""} alt={username || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>

                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg cursor-pointer">
                            <Camera className="w-4 h-4 text-primary-foreground" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Profile Picture</DialogTitle>
                            <DialogDescription>Upload a new profile picture or remove your current one.</DialogDescription>
                          </DialogHeader>

                          <div className="grid gap-8 py-4">
                            {isUploading ? (
                              <div className="flex items-center justify-center p-6">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-center">
                                  <Avatar className="w-44 h-44">
                                    <AvatarImage src={profilePicture || ""} alt={username || "User"} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                                      {getInitials()}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="picture" className="sr-only">
                                      Upload
                                    </Label>
                                    <div className="relative">
                                      <Input
                                        id="picture"
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileUpload}
                                      />
                                      <Button variant="outline" className="w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload
                                      </Button>
                                    </div>
                                  </div>

                                  <Button variant="destructive" onClick={handleDeletePicture} disabled={!profilePicture}>
                                    <Trash className="mr-2 h-4 w-4" />
                                    Remove
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{username}</h3>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Username Settings */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoadingUser}
                    />
                  </div>

                  <Button onClick={handleSaveChanges} disabled={isSaving || isLoadingUser}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
