import { useEffect, useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Star, Clock, Diamond, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import UserNavbar from "@/UserDashboard/UserNavbar"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    name: string;
}

const getTierIcon = (tier: string) => {
    switch (tier) {
        case "diamond":
            return <Diamond className="h-5 w-5 text-blue-400" />
        case "gold":
            return <Medal className="h-5 w-5 text-amber-500" />
        case "silver":
            return <Medal className="h-5 w-5 text-gray-400" />
        case "bronze":
            return <Medal className="h-5 w-5 text-amber-700" />
        default:
            return <Medal className="h-5 w-5 text-gray-500" />
    }
}

const getTierName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1)
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
}

export default function QuizDashboard() {
    const userEmail = useMemo(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                return decoded.sub || "";
            } catch {
                return "";
            }
        }
        return "";
    }, []);

    const [activeTab, setActiveTab] = useState("overview")
    const [loading, setLoading] = useState(true)
    const [leaderboardData, setLeaderboardData] = useState<any[]>([])

    const [userData, setUserData] = useState<any>({
        name: "",
        username: "",
        avatar: "/placeholder.svg?height=80&width=80",
        points: 0,
        badges: [
            { name: "Quick Thinker", icon: <Star className="h-4 w-4" />, earned: true },
            { name: "Knowledge Master", icon: <Award className="h-4 w-4" />, earned: true },
            { name: "Perfect Score", icon: <Star className="h-4 w-4" />, earned: true },
            { name: "Speed Demon", icon: <Clock className="h-4 w-4" />, earned: false },
            { name: "Quiz Champion", icon: <Trophy className="h-4 w-4" />, earned: false },
        ],
        stats: {},
        rank: 0,
        tier: "participant",
        quizHistory: [],
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    throw new Error("No auth token found")
                }

                const decoded = jwtDecode<JwtPayload & { sub?: string }>(token)
                const currentUserEmail = decoded.sub
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                }

                const [marksRes, statsRes, historyRes, leaderboardRes] = await Promise.all([
                    axios.get("http://localhost:9092/auth/total-marks", config),
                    axios.get("http://localhost:9092/auth/quiz-stats", config),
                    axios.get("http://localhost:9092/auth/quiz-results", config),
                    axios.get("http://localhost:9092/auth/leaderboard-data", config),
                ])

                const formattedLeaderboard = Array.isArray(leaderboardRes.data)
                    ? leaderboardRes.data.map((user: any) => ({
                          ...user,
                          isCurrentUser: user.email === currentUserEmail,
                          avatar: user.avatar || "/placeholder.svg?height=40&width=40",
                      }))
                    : []

                setLeaderboardData(formattedLeaderboard)

                const currentUserData = formattedLeaderboard.find((user: any) => user.isCurrentUser)

                setUserData((prev: any) => ({
                    ...prev,
                    name: decoded.name,
                    username: decoded.sub,
                    points: marksRes.data.totalMarks,
                    stats: statsRes.data,
                    rank: currentUserData ? currentUserData.rank : 0,
                    tier: currentUserData ? currentUserData.tier : "participant",
                    quizHistory: Array.isArray(historyRes.data)
                        ? historyRes.data
                              .sort((a: any, b: any) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime())
                              .map((q: any, i: number) => ({
                                  id: i + 1,
                                  title: q.quizTitle,
                                  score: Math.round((q.marksAchieved / q.totalMarks) * 10000) / 100,
                                  totalQuestions: q.totalQuestions,
                                  category: q.category,
                                  date: new Date(q.submissionTime).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                  }),
                              }))
                        : [],
                }))
            } catch (error) {
                console.error("Error loading quiz dashboard data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen w-full overflow-x-hidden bg-background">
                <div className="fixed top-0 left-0 right-0 z-50">
                    <UserNavbar userEmail={userEmail} />
                </div>
                <div className="pt-20 sm:pt-24 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column: User Stats & Quick Stats */}
                        <div className="w-full min-w-0 md:col-span-1 space-y-6">
                            <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-lg overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-16 w-16 rounded-full border-2 border-purple-200 dark:border-purple-800" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-5 w-32 rounded" />
                                            <Skeleton className="h-4 w-24 rounded" />
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <Skeleton className="h-4 w-4 rounded-full" />
                                                <Skeleton className="h-4 w-20 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                                            <h3 className="font-semibold">Total Points</h3>
                                        </div>
                                        <div className="flex items-center justify-center h-12">
                                            <Skeleton className="h-12 w-16 rounded-xl" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <Medal className="h-5 w-5 mr-2 text-blue-500" />
                                            <Skeleton className="h-5 w-20 rounded" />
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Skeleton className="h-6 w-24 rounded-md" />
                                            <Skeleton className="h-6 w-28 rounded-md" />
                                            <Skeleton className="h-6 w-24 rounded-md" />
                                            <Skeleton className="h-6 w-24 rounded-md" />
                                            <Skeleton className="h-6 w-24 rounded-md" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-md">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center">
                                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                                        Quick Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-card space-y-2">
                                            <span className="text-xs text-muted-foreground">Average Score</span>
                                            <Skeleton className="h-6 w-14 rounded" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-card space-y-2">
                                            <span className="text-xs text-muted-foreground">Quizzes Completed</span>
                                            <Skeleton className="h-6 w-10 rounded" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-card space-y-2">
                                            <span className="text-xs text-muted-foreground">Best Category</span>
                                            <Skeleton className="h-5 w-20 rounded" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-card space-y-2">
                                            <span className="text-xs text-muted-foreground">Highest Score</span>
                                            <Skeleton className="h-6 w-12 rounded" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Tabs & Leaderboard / History */}
                        <div className="w-full min-w-0 md:col-span-2 space-y-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="overview">Quiz History</TabsTrigger>
                                    <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {activeTab === "overview" ? (
                                <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-md h-[600px] overflow-hidden">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                                                <h3 className="text-xl font-semibold">Quiz History</h3>
                                            </div>
                                            <Skeleton className="h-5 w-20 rounded-full" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {Array(3)
                                            .fill(0)
                                            .map((_, i) => (
                                                 <div key={i} className="flex items-center p-3 rounded-lg border bg-muted">
                                                    <div className="flex-1 min-w-0 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Skeleton className="h-5 w-32 rounded" />
                                                            <Skeleton className="h-5 w-16 rounded-full" />
                                                        </div>
                                                        <div className="flex items-center justify-between pt-1">
                                                            <Skeleton className="h-4 w-24 rounded" />
                                                            <div className="flex items-center gap-2">
                                                                <Skeleton className="h-4 w-20 rounded" />
                                                                <Skeleton className="h-2 w-16 rounded-full" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-md">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                                                <h3 className="text-xl font-semibold">Global Leaderboard</h3>
                                            </div>
                                            <Skeleton className="h-5 w-24 rounded-full" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {Array(6)
                                            .fill(0)
                                            .map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center p-3 rounded-lg border bg-card transition-colors space-x-3"
                                                >
                                                    <Skeleton className="w-8 h-8 rounded-full" />
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <Skeleton className="h-4 w-32 rounded" />
                                                            <Skeleton className="h-4 w-16 rounded-full" />
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <Skeleton className="h-3 w-24 rounded" />
                                                            <Skeleton className="h-3 w-20 rounded" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-background">
            <div className="fixed top-0 left-0 right-0 z-50">
                <UserNavbar userEmail={userEmail}/>
            </div>
            <div className="pt-20 sm:pt-24 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Stats Card */}
                    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full min-w-0 md:col-span-1">
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-lg overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                className="shrink-0"
                                            >
                                                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-purple-200 dark:border-purple-800">
                                                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                                                    <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </motion.div>
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="text-lg sm:text-xl truncate">{userData.name}</CardTitle>
                                                <CardDescription className="truncate text-xs sm:text-sm">@{userData.username}</CardDescription>
                                                <div className="flex items-center mt-1">
                                                    {getTierIcon(userData.tier)}
                                                    <span className="ml-1 text-xs sm:text-sm font-medium">{getTierName(userData.tier)} Tier</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <motion.div className="space-y-2">
                                        <div className="flex items-center">
                                            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                                            <h3 className="font-semibold">Total Points</h3>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <motion.div
                                                className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                                            >
                                                {userData.points}
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <Medal className="h-5 w-5 mr-2 text-blue-500" />
                                            <h3 className="font-semibold">Rank #{userData.rank}</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                                            {userData.badges.map((badge: { name: string; icon: React.ReactElement; earned: boolean }, index: number) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Badge
                                                        variant={badge.earned ? "default" : "outline"}
                                                        className={cn(
                                                            "py-1 px-2 flex items-center gap-1 text-xs",
                                                            badge.earned ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white" : "text-muted-foreground",
                                                        )}
                                                    >
                                                        {badge.icon}
                                                        <span>{badge.name}</span>
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <motion.div
                                variants={itemVariants}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6"
                            >
                                <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-md">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center">
                                            <Star className="h-5 w-5 mr-2 text-yellow-500" />
                                            Quick Stats
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                            <motion.div
                                                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg border bg-card text-center"
                                                whileHover={{ scale: 1.03 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                <span className="text-[11px] sm:text-xs text-muted-foreground">Average Score</span>
                                                <span className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                                                    {userData.stats.averageScore}%
                                                </span>
                                            </motion.div>
                                            <motion.div
                                                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg border bg-card text-center"
                                                whileHover={{ scale: 1.03 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                <span className="text-[11px] sm:text-xs text-muted-foreground">Quizzes Completed</span>
                                                <span className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                                    {userData.stats.quizzesCompleted}
                                                </span>
                                            </motion.div>
                                            <motion.div
                                                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg border bg-card text-center min-w-0"
                                                whileHover={{ scale: 1.03 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                <span className="text-[11px] sm:text-xs text-muted-foreground">Best Category</span>
                                                <span className="text-xs sm:text-sm font-bold text-center text-purple-600 dark:text-purple-400 truncate max-w-full">
                                                    {userData.stats.bestCategory}
                                                </span>
                                            </motion.div>
                                            <motion.div
                                                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg border bg-card text-center"
                                                whileHover={{ scale: 1.03 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                <span className="text-[11px] sm:text-xs text-muted-foreground">Highest Score</span>
                                                <span className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                                    {userData.stats.highestScore}
                                                </span>
                                            </motion.div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div className="w-full min-w-0 md:col-span-2 space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/70 dark:bg-muted/40 border border-border/60 rounded-xl">
                                <TabsTrigger value="overview" className="rounded-lg text-xs sm:text-sm font-medium data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:shadow-sm">Quiz History</TabsTrigger>
                                <TabsTrigger value="leaderboard" className="rounded-lg text-xs sm:text-sm font-medium data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:shadow-sm">Leaderboard</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6 pt-4">
                                <motion.div variants={itemVariants}>
                                    <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-md h-[600px] flex flex-col">
                                        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg sm:text-xl flex items-center">
                                                    <Clock className="h-5 w-5 mr-2 text-indigo-500 shrink-0" />
                                                    <span>Quiz History</span>
                                                </CardTitle>
                                                <Badge variant="outline" className="font-normal text-xs shrink-0">
                                                    {userData.quizHistory.length} Quizzes
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3 sm:p-6 pt-0 overflow-y-auto flex-1 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.4)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                                            <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                                                {userData.quizHistory.map((quiz: any, index: number) => (
                                                    <motion.div
                                                        key={quiz.id}
                                                        variants={itemVariants}
                                                        whileHover={{ scale: 1.01 }}
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/80 dark:bg-muted/20 dark:hover:bg-muted/50 transition-colors gap-2"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{quiz.title}</h4>
                                                                <Badge variant="secondary" className="text-[11px] shrink-0 font-medium">
                                                                    {quiz.category}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-0.5">{quiz.date}</p>
                                                        </div>
                                                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
                                                            <span className="text-xs sm:text-sm font-semibold text-foreground">Score: {quiz.score}%</span>
                                                            <div className="h-2 w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shrink-0">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${quiz.score}%` }}
                                                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                                                    className={cn(
                                                                        "h-full rounded-full",
                                                                        quiz.score >= 90
                                                                            ? "bg-green-500"
                                                                            : quiz.score >= 70
                                                                                ? "bg-yellow-500"
                                                                                : "bg-red-500",
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="leaderboard" className="pt-4">
                                <motion.div variants={itemVariants}>
                                    <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-md">
                                        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg sm:text-xl flex items-center">
                                                    <Trophy className="h-5 w-5 mr-2 text-amber-500 shrink-0" />
                                                    <span>Global Leaderboard</span>
                                                </CardTitle>
                                                <Badge variant="outline" className="font-normal text-xs shrink-0">
                                                    This Month
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3 sm:p-6 pt-0">
                                            <motion.div className="space-y-2.5" variants={containerVariants} initial="hidden" animate="visible">
                                                {leaderboardData.map((user) => (
                                                    <motion.div
                                                        key={user.rank}
                                                        variants={itemVariants}
                                                        whileHover={{ scale: 1.01 }}
                                                        className={cn(
                                                            "flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-colors gap-2",
                                                            user.isCurrentUser
                                                                ? "bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-700 shadow-xs"
                                                                : "bg-muted/30 hover:bg-muted/70 dark:bg-muted/20 dark:hover:bg-muted/50 border border-border/60",
                                                            user.tier === "diamond" && !user.isCurrentUser && "border-blue-200 dark:border-blue-800/40",
                                                            user.tier === "gold" && !user.isCurrentUser && "border-amber-200 dark:border-amber-800/40",
                                                            user.tier === "silver" && !user.isCurrentUser && "border-gray-200 dark:border-gray-700",
                                                            user.tier === "bronze" && !user.isCurrentUser && "border-amber-800/30 dark:border-amber-700/30",
                                                        )}
                                                    >
                                                        <div className="flex items-center min-w-0 flex-1 gap-2 sm:gap-3">
                                                            <div
                                                                className={cn(
                                                                    "w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold text-xs sm:text-sm shrink-0",
                                                                    user.tier === "diamond" &&
                                                                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                                                                    user.tier === "gold" &&
                                                                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                                                                    user.tier === "silver" &&
                                                                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                                                                    user.tier === "bronze" &&
                                                                    "bg-amber-100/70 text-amber-800 dark:bg-amber-900/20 dark:text-amber-700",
                                                                )}
                                                            >
                                                                {user.rank}
                                                            </div>
                                                            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                                                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                                                                <AvatarFallback className="text-xs">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-medium text-xs sm:text-sm truncate text-foreground">{user.username}</p>
                                                                <p className="text-[11px] text-muted-foreground truncate hidden xs:block sm:block">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                                            <div className="flex items-center">
                                                                {getTierIcon(user.tier)}
                                                                <span className="text-[11px] sm:text-xs font-medium ml-1 hidden sm:inline">{getTierName(user.tier)}</span>
                                                            </div>
                                                            <div className="font-bold text-right text-xs sm:text-sm min-w-[50px] sm:min-w-[70px] text-foreground">
                                                                {user.points}
                                                                <span className="text-[10px] sm:text-xs text-muted-foreground ml-0.5 sm:ml-1">pts</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
