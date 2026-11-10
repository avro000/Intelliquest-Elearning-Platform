"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/AdminSidebar/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/Sidebar/mode-toggle"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Palette,
  Shield,
  Bell,
  Globe,
  Database,
  Wrench,
  Save,
  AlertTriangle,
  Loader2,
  Search,
  Info,
  Settings,
  TrendingUp,
  Activity,
  Server,
  Lock,
  Filter,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  Cpu,
  RotateCcw,
} from "lucide-react"
import { toast } from "react-hot-toast"
import Skeleton from "react-loading-skeleton"

interface AdminSettingsState {
  appearance: {
    darkMode: boolean
    compactMode: boolean
    animations: boolean
    sidebarCollapsed: boolean
  }
  notifications: {
    emailUpdates: boolean
    systemAlerts: boolean
    userRegistrations: boolean
    courseSubmissions: boolean
    securityAlerts: boolean
    maintenanceNotifications: boolean
  }
  platform: {
    maintenanceMode: boolean
    betaFeatures: boolean
    publicRegistration: boolean
    courseApproval: boolean
    autoBackups: boolean
    analyticsTracking: boolean
  }
  security: {
    twoFactorRequired: boolean
    sessionTimeout: number
    passwordPolicy: boolean
    ipWhitelist: boolean
    auditLogging: boolean
    encryptionEnabled: boolean
  }
  system: {
    maxFileSize: number
    backupFrequency: string
    logRetention: number
    cacheEnabled: boolean
    compressionEnabled: boolean
    cdnEnabled: boolean
  }
}

export default function AdminSettings() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)
  const currentPage = pathnames[pathnames.length - 1]

  const [settings, setSettings] = useState<AdminSettingsState>({
    appearance: {
      darkMode: false,
      compactMode: false,
      animations: true,
      sidebarCollapsed: false,
    },
    notifications: {
      emailUpdates: true,
      systemAlerts: true,
      userRegistrations: false,
      courseSubmissions: true,
      securityAlerts: true,
      maintenanceNotifications: true,
    },
    platform: {
      maintenanceMode: false,
      betaFeatures: false,
      publicRegistration: true,
      courseApproval: true,
      autoBackups: true,
      analyticsTracking: true,
    },
    security: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      passwordPolicy: true,
      ipWhitelist: false,
      auditLogging: true,
      encryptionEnabled: true,
    },
    system: {
      maxFileSize: 50,
      backupFrequency: "daily",
      logRetention: 30,
      cacheEnabled: true,
      compressionEnabled: true,
      cdnEnabled: false,
    },
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [maintenanceMessage, setMaintenanceMessage] = useState("")
  const [activeTab, setActiveTab] = useState("appearance")
  const [filterOpen, setFilterOpen] = useState(false)

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success("Settings loaded successfully")
    } catch (error) {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (category: keyof AdminSettingsState, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setHasChanges(false)
      toast.success("Settings saved successfully")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const enableMaintenanceMode = async () => {
    if (!maintenanceMessage.trim()) {
      toast.error("Please provide a maintenance message")
      return
    }

    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      updateSetting("platform", "maintenanceMode", true)
      toast.success("Maintenance mode enabled")
    } catch (error) {
      toast.error("Failed to enable maintenance mode")
    } finally {
      setSaving(false)
    }
  }

  const settingsCategories = [
    {
      id: "appearance",
      title: "Appearance",
      description: "Customize the admin interface appearance",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      activeBorder: "border-purple-500 ring-2 ring-purple-500/50 bg-purple-500/[0.08] dark:bg-purple-950/30 shadow-lg shadow-purple-500/10",
      activeBadge: "bg-purple-600 hover:bg-purple-600",
      count: Object.values(settings.appearance).filter(Boolean).length,
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage notification preferences",
      icon: Bell,
      color: "from-blue-500 to-cyan-500",
      activeBorder: "border-blue-500 ring-2 ring-blue-500/50 bg-blue-500/[0.08] dark:bg-blue-950/30 shadow-lg shadow-blue-500/10",
      activeBadge: "bg-blue-600 hover:bg-blue-600",
      count: Object.values(settings.notifications).filter(Boolean).length,
    },
    {
      id: "platform",
      title: "Platform",
      description: "Control platform-wide settings",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
      activeBorder: "border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-500/[0.08] dark:bg-emerald-950/30 shadow-lg shadow-emerald-500/10",
      activeBadge: "bg-emerald-600 hover:bg-emerald-600",
      count: Object.values(settings.platform).filter(Boolean).length,
    },
    {
      id: "security",
      title: "Security",
      description: "Configure security policies",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      activeBorder: "border-orange-500 ring-2 ring-orange-500/50 bg-orange-500/[0.08] dark:bg-orange-950/30 shadow-lg shadow-orange-500/10",
      activeBadge: "bg-orange-600 hover:bg-orange-600",
      count: Object.values(settings.security).filter(Boolean).length,
    },
    {
      id: "system",
      title: "System",
      description: "System configuration and limits",
      icon: Database,
      color: "from-indigo-500 to-purple-500",
      activeBorder: "border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-500/[0.08] dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/10",
      activeBadge: "bg-indigo-600 hover:bg-indigo-600",
      count: Object.values(settings.system).filter(Boolean).length,
    },
  ]

  const filteredCategories = settingsCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getSystemStatus = () => {
    const criticalIssues = [
      !settings.security.twoFactorRequired,
      !settings.security.auditLogging,
      settings.platform.maintenanceMode,
    ].filter(Boolean).length

    const warnings = [
      !settings.system.cacheEnabled,
      !settings.platform.autoBackups,
      settings.security.sessionTimeout > 60,
    ].filter(Boolean).length

    return { criticalIssues, warnings }
  }

  const { criticalIssues, warnings } = getSystemStatus()
  const currentCategory = settingsCategories.find((c) => c.id === activeTab) || settingsCategories[0]

  if (loading) {
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
                    <BreadcrumbPage className="capitalize truncate max-w-[150px] sm:max-w-none text-xs sm:text-sm font-semibold">{currentPage}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="px-2 sm:px-4 shrink-0">
              <ModeToggle />
            </div>
          </header>

          <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 pb-8 sm:pb-12 pt-0 w-full max-w-full min-w-0 overflow-x-hidden">
            {/* Loading Skeleton */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-2xl">
              <Skeleton height={36} width="60%" className="mb-3 sm:mb-4" />
              <Skeleton height={18} width="80%" className="mb-4 sm:mb-6" />
              <div className="flex flex-wrap gap-3 sm:gap-6">
                <Skeleton height={16} width={120} />
                <Skeleton height={16} width={100} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-5 w-full">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <CardContent className="p-4 sm:p-6">
                      <Skeleton height={20} width="70%" className="mb-2" />
                      <Skeleton height={14} width="90%" className="mb-4" />
                      <div className="space-y-2.5">
                        <Skeleton height={18} width="100%" />
                        <Skeleton height={18} width="100%" />
                        <Skeleton height={18} width="80%" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="dark:bg-black overflow-x-hidden min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center justify-between gap-2 px-3 sm:px-4 bg-background/80 dark:bg-black/80 backdrop-blur-md rounded-t-xl min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem className="hidden sm:block">Admin</BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:block" />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="capitalize truncate max-w-[140px] sm:max-w-none">{currentPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-1 sm:px-2 shrink-0">
            {hasChanges && (
              <Button onClick={saveSettings} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700 h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm">
                {saving ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" /> : <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
                <span className="hidden xs:inline">Save</span>
                <span className="hidden sm:inline"> Changes</span>
              </Button>
            )}
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 pb-24 sm:pb-12 pt-0 w-full max-w-full min-w-0 overflow-x-hidden">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-2xl min-w-0"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-4xl font-bold mb-1.5 sm:mb-2 flex items-center min-w-0">
                    <Settings className="h-7 w-7 sm:h-10 sm:w-10 mr-2 sm:mr-3 shrink-0" />
                    <span className="truncate">Admin Settings</span>
                  </h1>
                  <p className="text-blue-100 text-xs sm:text-lg line-clamp-2">Configure platform settings and system preferences</p>
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-6 mt-3 sm:mt-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-full sm:rounded-none">
                      <Activity className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-emerald-300 shrink-0" />
                      <span className="text-xs sm:text-sm">System: Healthy</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-full sm:rounded-none">
                      <Server className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-blue-200 shrink-0" />
                      <span className="text-xs sm:text-sm">5 Categories</span>
                    </div>
                    {criticalIssues > 0 && (
                      <div className="flex items-center gap-1.5 sm:gap-2 bg-red-500/20 px-2.5 py-1 rounded-full">
                        <AlertTriangle className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-red-300 shrink-0" />
                        <span className="text-xs sm:text-sm text-red-200 font-medium">{criticalIssues} Issues</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden lg:block shrink-0">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <TrendingUp className="h-10 w-10 mx-auto mb-2 text-emerald-300" />
                    <p className="text-sm font-medium text-blue-100">System Health: 100%</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search and Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-xl border border-gray-100 dark:border-gray-700 min-w-0"
            >
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search settings categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl w-full"
                  />
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs sm:text-sm w-full sm:w-auto"
                    onClick={() => setFilterOpen(true)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Quick Actions
                  </Button>
                </div>
              </div>

              {/* Status Alerts */}
              <div className="mt-3 sm:mt-4 space-y-2">
                {settings.platform.maintenanceMode && (
                  <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 p-3 sm:p-4 rounded-xl">
                    <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />
                    <AlertDescription className="text-xs sm:text-sm text-orange-800 dark:text-orange-200 break-words">
                      Maintenance mode is currently enabled. Users cannot access the platform.
                    </AlertDescription>
                  </Alert>
                )}
                {criticalIssues > 0 && (
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-3 sm:p-4 rounded-xl">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                    <AlertDescription className="text-xs sm:text-sm text-red-800 dark:text-red-200 break-words">
                      {criticalIssues} critical security issues require immediate attention.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </motion.div>

            {/* Settings Categories Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-5 w-full min-w-0 justify-items-stretch">
                {filteredCategories.map((category, index) => {
                  const isActive = activeTab === category.id
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer min-w-0 max-w-full justify-self-stretch h-full"
                      onClick={() => setActiveTab(category.id)}
                    >
                      <Card
                        className={`overflow-hidden rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border bg-white dark:bg-gray-800 flex flex-col justify-between h-full min-h-[180px] sm:min-h-[195px] min-w-0 ${
                          isActive
                            ? `${category.activeBorder}`
                            : "border-gray-200 dark:border-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div>
                          <div className={`h-1.5 bg-gradient-to-r ${category.color}`} />
                          <CardContent className="p-4 sm:p-5">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className={`p-2.5 bg-gradient-to-r ${category.color} rounded-xl text-white shadow-sm`}>
                                  <category.icon className="h-5 w-5 text-white" />
                                </div>
                                <Badge variant="secondary" className="text-[11px] sm:text-xs font-medium">
                                  {category.count} active
                                </Badge>
                              </div>

                              <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                  {category.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </div>

                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/60 mt-2 pt-3">
                          <div className="flex items-center gap-1.5">
                            {category.id === "security" && criticalIssues > 0 ? (
                              <Badge variant="destructive" className="text-[10px] sm:text-xs px-2 py-0.5 font-medium">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {criticalIssues} Action
                              </Badge>
                            ) : category.id === "platform" && settings.platform.maintenanceMode ? (
                              <Badge variant="secondary" className="text-[10px] sm:text-xs bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 px-2 py-0.5 font-medium">
                                <Wrench className="h-3 w-3 mr-1" />
                                Maint.
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 px-2 py-0.5 font-normal">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                                Active
                              </Badge>
                            )}
                          </div>
                          {isActive ? (
                            <Badge className={`${category.activeBadge} text-white text-[10px] sm:text-xs px-2 py-0.5 gap-1 font-semibold shadow-sm`}>
                              Selected <CheckCircle2 className="h-3 w-3" />
                            </Badge>
                          ) : (
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Select &rarr;
                            </span>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Detailed Settings Panel */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden min-w-0"
              >
                {/* Panel Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-5 bg-gray-50/60 dark:bg-gray-900/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-r ${currentCategory.color} text-white shadow-sm shrink-0`}>
                      <currentCategory.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                        {currentCategory.title} Settings
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {currentCategory.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs font-medium px-2.5 py-1">
                    {currentCategory.count} Active Options
                  </Badge>
                </div>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="p-3.5 sm:p-6 space-y-3 sm:space-y-4 m-0 focus-visible:outline-none">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-purple-50/70 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="dark-mode" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Dark Mode
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Use dark theme across admin portal</p>
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={settings.appearance.darkMode}
                        onCheckedChange={(checked) => updateSetting("appearance", "darkMode", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="compact-mode" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Compact Mode
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Reduce spacing for more data density</p>
                      </div>
                      <Switch
                        id="compact-mode"
                        checked={settings.appearance.compactMode}
                        onCheckedChange={(checked) => updateSetting("appearance", "compactMode", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="animations" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Enable Animations
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Show smooth page transitions and micro-interactions</p>
                      </div>
                      <Switch
                        id="animations"
                        checked={settings.appearance.animations}
                        onCheckedChange={(checked) => updateSetting("appearance", "animations", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="sidebar-collapsed" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Default Collapsed Sidebar
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Keep sidebar compact by default on desktop</p>
                      </div>
                      <Switch
                        id="sidebar-collapsed"
                        checked={settings.appearance.sidebarCollapsed}
                        onCheckedChange={(checked) => updateSetting("appearance", "sidebarCollapsed", checked)}
                        className="shrink-0"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="p-3.5 sm:p-6 space-y-3 sm:space-y-4 m-0 focus-visible:outline-none">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="email-updates" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Email Updates
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Receive periodic digest and critical platform updates via email</p>
                      </div>
                      <Switch
                        id="email-updates"
                        checked={settings.notifications.emailUpdates}
                        onCheckedChange={(checked) => updateSetting("notifications", "emailUpdates", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="system-alerts" className="text-sm sm:text-base font-semibold cursor-pointer">
                          System Alerts
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Immediate notifications for downtime or elevated error rates</p>
                      </div>
                      <Switch
                        id="system-alerts"
                        checked={settings.notifications.systemAlerts}
                        onCheckedChange={(checked) => updateSetting("notifications", "systemAlerts", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="user-registrations" className="text-sm sm:text-base font-semibold cursor-pointer">
                          User Registrations
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Notify admins whenever a new student or instructor registers</p>
                      </div>
                      <Switch
                        id="user-registrations"
                        checked={settings.notifications.userRegistrations}
                        onCheckedChange={(checked) => updateSetting("notifications", "userRegistrations", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="course-submissions" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Course Submissions
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Notify when an instructor submits a new course for review</p>
                      </div>
                      <Switch
                        id="course-submissions"
                        checked={settings.notifications.courseSubmissions}
                        onCheckedChange={(checked) => updateSetting("notifications", "courseSubmissions", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="security-alerts" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Security Alerts
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Urgent alerts regarding failed logins and suspicious activities</p>
                      </div>
                      <Switch
                        id="security-alerts"
                        checked={settings.notifications.securityAlerts}
                        onCheckedChange={(checked) => updateSetting("notifications", "securityAlerts", checked)}
                        className="shrink-0"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Platform Settings */}
                <TabsContent value="platform" className="p-3.5 sm:p-6 space-y-3 sm:space-y-4 m-0 focus-visible:outline-none">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="maintenance-mode" className="text-sm sm:text-base font-semibold cursor-pointer flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-orange-600 shrink-0" />
                          Maintenance Mode
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Disable public access for scheduled maintenance or upgrades</p>
                      </div>
                      <Switch
                        id="maintenance-mode"
                        checked={settings.platform.maintenanceMode}
                        onCheckedChange={(checked) => updateSetting("platform", "maintenanceMode", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="public-registration" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Public Registration
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Allow any visitor to sign up for student accounts</p>
                      </div>
                      <Switch
                        id="public-registration"
                        checked={settings.platform.publicRegistration}
                        onCheckedChange={(checked) => updateSetting("platform", "publicRegistration", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="course-approval" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Require Course Approval
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Require manual admin verification before new courses are published</p>
                      </div>
                      <Switch
                        id="course-approval"
                        checked={settings.platform.courseApproval}
                        onCheckedChange={(checked) => updateSetting("platform", "courseApproval", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="beta-features" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Experimental Beta Features
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Enable preview access to AI quizzing and analytics tools</p>
                      </div>
                      <Switch
                        id="beta-features"
                        checked={settings.platform.betaFeatures}
                        onCheckedChange={(checked) => updateSetting("platform", "betaFeatures", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="auto-backups" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Automated Daily Backups
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Execute automated snapshots of all course and quiz databases</p>
                      </div>
                      <Switch
                        id="auto-backups"
                        checked={settings.platform.autoBackups}
                        onCheckedChange={(checked) => updateSetting("platform", "autoBackups", checked)}
                        className="shrink-0"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="p-3.5 sm:p-6 space-y-3 sm:space-y-4 m-0 focus-visible:outline-none">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="two-factor" className="text-sm sm:text-base font-semibold flex items-center gap-1.5 flex-wrap cursor-pointer">
                          <Lock className="h-4 w-4 text-red-500 shrink-0" />
                          <span>Two-Factor Authentication</span>
                          {!settings.security.twoFactorRequired && (
                            <Badge variant="destructive" className="text-[10px] sm:text-xs">
                              Critical
                            </Badge>
                          )}
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Require multi-factor authorization for all administrative accounts</p>
                      </div>
                      <Switch
                        id="two-factor"
                        checked={settings.security.twoFactorRequired}
                        onCheckedChange={(checked) => updateSetting("security", "twoFactorRequired", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-2.5 sm:gap-4">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="session-timeout" className="text-sm sm:text-base font-semibold">
                          Session Timeout (minutes)
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Automatically terminate inactive sessions</p>
                      </div>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting("security", "sessionTimeout", Number.parseInt(e.target.value) || 0)}
                        className="w-full sm:w-32 h-9 sm:h-10 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/80 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 shadow-sm"
                        min="5"
                        max="480"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="audit-logging" className="text-sm sm:text-base font-semibold cursor-pointer">
                          Comprehensive Audit Logging
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Record all administrative changes and system modifications</p>
                      </div>
                      <Switch
                        id="audit-logging"
                        checked={settings.security.auditLogging}
                        onCheckedChange={(checked) => updateSetting("security", "auditLogging", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="encryption-enabled" className="text-sm sm:text-base font-semibold cursor-pointer">
                          At-Rest Encryption
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Enforce AES-256 encryption on database volumes and media assets</p>
                      </div>
                      <Switch
                        id="encryption-enabled"
                        checked={settings.security.encryptionEnabled}
                        onCheckedChange={(checked) => updateSetting("security", "encryptionEnabled", checked)}
                        className="shrink-0"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system" className="p-3.5 sm:p-6 space-y-3 sm:space-y-4 m-0 focus-visible:outline-none">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-2.5 sm:gap-4">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="max-file-size" className="text-sm sm:text-base font-semibold">
                          Max Upload File Size (MB)
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Upper file size ceiling for course videos, PDFs, and thumbnails</p>
                      </div>
                      <Input
                        id="max-file-size"
                        type="number"
                        value={settings.system.maxFileSize}
                        onChange={(e) => updateSetting("system", "maxFileSize", Number.parseInt(e.target.value) || 0)}
                        className="w-full sm:w-32 h-9 sm:h-10 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/80 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 shadow-sm"
                        min="5"
                        max="1024"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-2.5 sm:gap-4">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="backup-frequency" className="text-sm sm:text-base font-semibold">
                          Backup Schedule Frequency
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Frequency of automatic database and media sync snapshots</p>
                      </div>
                      <Select
                        value={settings.system.backupFrequency}
                        onValueChange={(val) => updateSetting("system", "backupFrequency", val)}
                      >
                        <SelectTrigger className="w-full sm:w-40 h-9 sm:h-10 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/80 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 shadow-sm">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="cache-enabled" className="text-sm sm:text-base font-semibold cursor-pointer">
                          In-Memory Cache (Redis)
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Speed up course catalog queries and quiz evaluation responses</p>
                      </div>
                      <Switch
                        id="cache-enabled"
                        checked={settings.system.cacheEnabled}
                        onCheckedChange={(checked) => updateSetting("system", "cacheEnabled", checked)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <Label htmlFor="compression-enabled" className="text-sm sm:text-base font-semibold cursor-pointer">
                          GZIP Response Compression
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">Compress API JSON payloads for faster mobile network delivery</p>
                      </div>
                      <Switch
                        id="compression-enabled"
                        checked={settings.system.compressionEnabled}
                        onCheckedChange={(checked) => updateSetting("system", "compressionEnabled", checked)}
                        className="shrink-0"
                      />
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </Tabs>

            {/* Save Changes Floating Footer */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky bottom-3 sm:bottom-4 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg shrink-0">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">Unsaved Changes</p>
                      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                        Remember to apply your changes to update the live system
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="flex-1 sm:flex-none rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                    >
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveSettings}
                      disabled={saving}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 rounded-xl h-9 sm:h-10 text-xs sm:text-sm text-white"
                    >
                      {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
                      Save Changes
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

        {/* Quick Actions Sheet */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent side="right" className="w-[88vw] sm:max-w-md p-4 sm:p-6 overflow-y-auto">
            <SheetHeader className="mb-5 text-left">
              <SheetTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                Quick Actions
              </SheetTitle>
              <SheetDescription className="text-xs sm:text-sm">
                Perform common administrative maintenance tasks instantly.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-semibold">Purge System Cache</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Flushes Redis cached catalog data, user permissions, and temporary queries.</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-8 rounded-lg mt-1"
                  onClick={() => {
                    toast.success("Cache cleared successfully")
                    setFilterOpen(false)
                  }}
                >
                  Clear Cache
                </Button>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold">Trigger DB Backup</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Initiates an immediate snapshot of the PostgreSQL database and storage metadata.</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-8 rounded-lg mt-1"
                  onClick={() => {
                    toast.success("Backup job initiated")
                    setFilterOpen(false)
                  }}
                >
                  Run Backup
                </Button>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-semibold">Enforce 2FA</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Mandates Two-Factor Authentication for all instructor and administrator roles.</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-8 rounded-lg mt-1"
                  onClick={() => {
                    updateSetting("security", "twoFactorRequired", true)
                    toast.success("2FA requirement activated")
                    setFilterOpen(false)
                  }}
                >
                  Enforce Now
                </Button>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-semibold">Maintenance Mode</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Toggle maintenance banner to temporarily block access for non-admin users.</p>
                <Button
                  size="sm"
                  variant={settings.platform.maintenanceMode ? "destructive" : "outline"}
                  className="w-full text-xs h-8 rounded-lg mt-1"
                  onClick={() => {
                    updateSetting("platform", "maintenanceMode", !settings.platform.maintenanceMode)
                    toast.success(settings.platform.maintenanceMode ? "Maintenance mode disabled" : "Maintenance mode enabled")
                    setFilterOpen(false)
                  }}
                >
                  {settings.platform.maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  )
}
