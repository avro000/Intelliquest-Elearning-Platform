import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, Trophy } from "lucide-react"

type CourseSales = {
  courseTitle: string
  totalSales: number
  color?: string
  gradient?: string
}

export function BarComponent() {
  const [salesData, setSalesData] = useState<CourseSales[]>([])
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    const colorPalettes = [
      {
        color: "#3b82f6", // blue-500
        gradient: "from-blue-600 via-indigo-500 to-cyan-400",
      },
      {
        color: "#10b981", // emerald-500
        gradient: "from-emerald-600 via-teal-500 to-green-400",
      },
      {
        color: "#f59e0b", // amber-500
        gradient: "from-amber-600 via-orange-500 to-yellow-400",
      },
      {
        color: "#8b5cf6", // purple-500
        gradient: "from-purple-600 via-violet-500 to-fuchsia-400",
      },
      {
        color: "#ec4899", // pink-500
        gradient: "from-pink-600 via-rose-500 to-red-400",
      },
    ]

    fetch("http://localhost:9092/auth/instructor/course-sales", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type")
        if (!res.ok || !contentType?.includes("application/json")) {
          const errorText = await res.text()
          throw new Error(errorText)
        }
        return res.json()
      })
      .then((data) => {
        setSalesData(
          data.map((item: CourseSales, index: number) => {
            const palette = colorPalettes[index % colorPalettes.length]
            return {
              courseTitle: item.courseTitle,
              totalSales: item.totalSales,
              color: palette.color,
              gradient: palette.gradient,
            }
          })
        )
      })
      .catch((err) => console.error("Failed to fetch course sales:", err))
  }, [])

  const maxSales = Math.max(...salesData.map((item) => item.totalSales), 1)
  const totalSales = salesData.reduce((acc, curr) => acc + curr.totalSales, 0)

  // Scale max with a bit of headroom
  const scaleMax = Math.max(Math.ceil(maxSales * 1.15), 5)
  const ticks = [0, Math.round(scaleMax * 0.25), Math.round(scaleMax * 0.5), Math.round(scaleMax * 0.75), scaleMax]

  const topCourse =
    salesData.length > 0
      ? salesData.reduce((top, current) => (current.totalSales > top.totalSales ? current : top))
      : null

  return (
    <Card className="flex flex-col justify-between h-full shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Number of Courses Sold
            </CardTitle>
            <CardDescription className="mt-1">
              {salesData.length === 1
                ? `Sales breakdown for 1 course (${totalSales} total sales)`
                : `Sales distribution across ${salesData.length} courses (${totalSales} total sales)`}
            </CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1 font-semibold text-xs">
            {totalSales} Total Sales
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {salesData.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <BookOpen className="h-8 w-8 opacity-40" />
            No sales recorded yet.
          </div>
        ) : (
          <div className="space-y-5">
            {salesData.map((course) => {
              const percentage = Math.min(Math.round((course.totalSales / scaleMax) * 100), 100)
              const share = totalSales > 0 ? Math.round((course.totalSales / totalSales) * 100) : 0
              const isHovered = hoveredCourse === course.courseTitle

              return (
                <div
                  key={course.courseTitle}
                  className={`group p-3.5 rounded-xl border transition-all duration-200 ${
                    isHovered
                      ? "bg-muted/60 border-primary/40 shadow-sm"
                      : "bg-card/50 border-border/50 hover:border-border hover:bg-muted/30"
                  }`}
                  onMouseEnter={() => setHoveredCourse(course.courseTitle)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                  {/* Full Course Title and Sales Badge */}
                  <div className="flex items-start justify-between gap-4 mb-2.5">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span
                        className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: course.color }}
                      />
                      <span className="font-semibold text-sm text-foreground leading-snug">
                        {course.courseTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-xs text-muted-foreground font-medium">
                        {share}% share
                      </span>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg border shadow-xs"
                        style={{
                          backgroundColor: `${course.color}15`,
                          color: course.color,
                          borderColor: `${course.color}35`,
                        }}
                      >
                        {course.totalSales} {course.totalSales === 1 ? "sale" : "sales"}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar with Calibrated Width */}
                  <div className="relative h-4 w-full bg-muted/60 dark:bg-muted/30 rounded-full overflow-hidden p-0.5 border border-border/40">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${course.gradient} transition-all duration-700 ease-out shadow-sm`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}

            {/* Calibrated Graph Scale (X-Axis) */}
            <div className="pt-2 px-3">
              <div className="relative w-full border-t border-border/60 pt-1.5 flex justify-between text-[11px] font-mono text-muted-foreground">
                {ticks.map((tick, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="h-1 w-px bg-border/60 -mt-1.5 mb-1" />
                    <span>{tick}</span>
                  </div>
                ))}
              </div>
              <div className="text-center text-[10px] text-muted-foreground/80 mt-1 uppercase tracking-wider font-semibold">
                Course Sales Volume Scale
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/40">
        {topCourse && (
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-muted/40 border border-border/50 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Top Performing Course:
              </span>
              <span className="text-xs font-bold text-foreground">
                {topCourse.courseTitle}
              </span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 whitespace-nowrap self-start sm:self-auto shrink-0 border border-emerald-500/20">
              {topCourse.totalSales} sales
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
