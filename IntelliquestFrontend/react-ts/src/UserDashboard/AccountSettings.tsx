"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { User, Mail, Lock, Camera, Shield, Loader2, CheckCircle, AlertCircle, Upload, Trash } from "lucide-react"
import UserNavbar from "./UserNavbar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "../AuthContext"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"

const BACKEND_URL = "http://localhost:9092"

interface UserData {
  username: string
  email: string
  role: string
}

const AccountSettings: React.FC = () => {
  const { currentUser, profileImage, setProfileImage, refreshUser } = useAuth()
  const [userData, setUserData] = useState<UserData>({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    role: currentUser?.role || "USER",
  })
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(profileImage || currentUser?.profilePictureUrl || null)
  const [loading, setLoading] = useState({
    fetchUser: true,
    updateProfile: false,
    roleRequest: false,
    uploadImage: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const token = localStorage.getItem("token")
  let userEmail = ""

  if (token) {
    try {
      const decoded: any = jwtDecode(token)
      userEmail = decoded.sub
    } catch (error) {
      toast.error("Invalid token. Please log in again.")
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchUserData = async () => {
      if (!token) {
        if (isMounted) setLoading((prev) => ({ ...prev, fetchUser: false }))
        return
      }

      try {
        const [user] = await Promise.all([refreshUser(), new Promise((r) => setTimeout(r, 350))])
        if (isMounted && user) {
          setUserData({
            username: user.username || "",
            email: user.email || userEmail || "",
            role: user.role || "USER",
          })
          setFormData((prev) => ({ ...prev, username: user.username || "" }))
          setPreviewUrl(user.profilePictureUrl || null)
        }
      } catch (err: any) {
        toast.error("Failed to fetch user data")
        console.error(err)
      } finally {
        if (isMounted) {
          setLoading((prev) => ({ ...prev, fetchUser: false }))
        }
      }
    }

    fetchUserData()

    return () => {
      isMounted = false
    }
  }, [token, userEmail])

  const handleDeletePicture = async () => {
    setLoading((prev) => ({ ...prev, updateProfile: true }))
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("removePicture", "true")

      await axios.post(`${BACKEND_URL}/auth/users/update-profile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      // Refresh updated user across the whole app
      await refreshUser()
      setPreviewUrl(null)
      setProfilePic(null)
      setProfileImage(null)
      localStorage.removeItem("profileImage")
      toast.success("Profile picture removed successfully!", {
        description: "Your profile picture has been deleted.",
        style: { backgroundColor: "#16a34a", color: "white" },
      })
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data || "Failed to remove profile picture"
      toast.error(errorMessage, {
        style: { backgroundColor: "#dc2626", color: "white" },
      })
    } finally {
      setLoading((prev) => ({ ...prev, updateProfile: false }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to set new password"
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters"
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)

    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }

      const preview = URL.createObjectURL(file)
      setProfilePic(file)
      setPreviewUrl(preview)
      setHasChanges(true)
    }
  }

  const handleSaveChanges = async () => {
    if (!validateForm()) return

    setLoading((prev) => ({ ...prev, updateProfile: true }))

    const formDataToSend = new FormData()
    formDataToSend.append("username", formData.username)
    formDataToSend.append("email", userEmail)

    if (formData.currentPassword && formData.newPassword) {
      formDataToSend.append("currentPassword", formData.currentPassword)
      formDataToSend.append("newPassword", formData.newPassword)
    }

    if (profilePic) {
      formDataToSend.append("profilePic", profilePic)
    }

    try {
      await axios.post(`${BACKEND_URL}/auth/users/update-profile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      // Immediately refresh updated user from server across the whole app
      const updatedUser = await refreshUser()
      if (updatedUser) {
        setUserData({
          username: updatedUser.username || formData.username,
          email: updatedUser.email || userEmail || "",
          role: updatedUser.role || userData.role || "USER",
        })
        setFormData((prev) => ({
          ...prev,
          username: updatedUser.username || formData.username,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
        if (updatedUser.profilePictureUrl) {
          setPreviewUrl(updatedUser.profilePictureUrl)
          setProfileImage(updatedUser.profilePictureUrl)
        }
      } else {
        setUserData((prev) => ({ ...prev, username: formData.username }))
      }

      setProfilePic(null)
      setHasChanges(false)
      toast.success("Profile updated successfully!", {
        description: "Your account details have been saved.",
        style: { backgroundColor: "#16a34a", color: "white" },
      })
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data || "Failed to update profile"
      toast.error(errorMessage, {
        style: { backgroundColor: "#dc2626", color: "white" },
      })
    } finally {
      setLoading((prev) => ({ ...prev, updateProfile: false }))
    }
  }

  const handleRoleChangeRequest = async () => {
    setLoading((prev) => ({ ...prev, roleRequest: true }))

    try {
      await axios.post(`${BACKEND_URL}/auth/users/request-role-change?newRole=INSTRUCTOR`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Instructor role request submitted successfully")
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to request role change"
      toast.error(errorMessage, {
        style: { backgroundColor: "#dc2626", color: "white" },
      })
    } finally {
      setLoading((prev) => ({ ...prev, roleRequest: false }))
    }
  }

  if (loading.fetchUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
        <UserNavbar userEmail={userEmail} />
        <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
              <Skeleton className="h-5 w-96 mx-auto rounded-lg" />
            </div>

            {/* Profile Information Card */}
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-44 rounded" />
                  <Skeleton className="h-4 w-64 rounded" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-4 w-24 rounded" />
                <div className="flex items-center gap-6">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-36 rounded-lg" />
                    <Skeleton className="h-3 w-48 rounded" />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </Card>

            {/* Security Card */}
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-32 rounded" />
                  <Skeleton className="h-4 w-72 rounded" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </Card>

            {/* Role Management Card */}
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-36 rounded" />
                  <Skeleton className="h-4 w-60 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-56 rounded" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-9 w-44 rounded-lg" />
              </div>
            </Card>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <UserNavbar userEmail={userEmail} />



      <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-muted-foreground">Manage your profile, security, and preferences</p>
          </div>

          {/* Profile Information Card */}
          <Card className="shadow-lg border-0 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Profile Information</CardTitle>
                  <CardDescription>Update your personal details and profile picture</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Profile Picture Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Profile Picture</Label>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover border-2 border-border shadow-md"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl border-2 border-border shadow-md">
                        {(userData.username || userEmail || "U").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 p-1 bg-background border border-border rounded-full shadow-sm">
                      <Camera className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="relative overflow-hidden"
                        disabled={loading.uploadImage || loading.updateProfile}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Photo
                      </Button>
                      {previewUrl && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeletePicture}
                          disabled={loading.updateProfile}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Remove Photo
                        </Button>
                      )}
                      {profilePic && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready to save
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 5MB.</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Username and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      readOnly
                      className="pl-10 cursor-not-allowed opacity-70"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="shadow-lg border-0 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Security</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    className={errors.currentPassword ? "border-red-500" : ""}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className={errors.newPassword ? "border-red-500" : ""}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {formData.newPassword && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Make sure your new password is at least 6 characters long and includes a mix of letters, numbers,
                    and symbols.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Role Management Card */}
          <Card className="shadow-lg border-0 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Role Management</CardTitle>
                  <CardDescription>Request role upgrades and manage permissions</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Current Role</p>
                  <p className="text-sm text-muted-foreground">Your current account role and permissions</p>
                </div>
                <Badge variant={userData.role === "INSTRUCTOR" ? "default" : "secondary"}>{userData.role}</Badge>
              </div>

              {userData.role !== "INSTRUCTOR" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Want to become an instructor? Request an upgrade to access teaching features and create courses.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRoleChangeRequest}
                    disabled={loading.roleRequest}
                    className="w-full sm:w-auto"
                  >
                    {loading.roleRequest ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Request Instructor Role
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Changes */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  username: userData.username,
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                })
                setProfilePic(null)
                setHasChanges(false)
                setErrors({})
              }}
              disabled={!hasChanges || loading.updateProfile}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges || loading.updateProfile}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading.updateProfile ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default AccountSettings
