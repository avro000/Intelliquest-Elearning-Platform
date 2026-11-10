import * as React from "react"
import { useLocation } from "react-router-dom"
import {
  BookOpen,
  GraduationCapIcon,
  LayoutDashboard,
  LifeBuoy,
  Send,
  Settings2,
  TextSearch,
  BookCopy,
} from "lucide-react"


import { NavMain } from "@/components/AdminSidebar/nav-main"
import { NavProjects } from "@/components/AdminSidebar/nav-projects"
import { NavSecondary } from "@/components/AdminSidebar/nav-secondary"
import { NavUser } from "@/components/AdminSidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/AdminDashboard", icon: LayoutDashboard },
    { title: "View Courses", url: "/view-allcourses", icon: BookOpen },
    { title: "Settings", url: "/admin-settings", icon: Settings2 },
  ],
  navSecondary: [
    { title: "Support", url: "/support", icon: LifeBuoy },
    { title: "Feedback", url: "/feedback", icon: Send },
  ],
  projects: [
    { name: "Search User", url: "/search-user", icon:TextSearch},
    { name: "Manage Instructors", url: "/manage-instructor", icon: BookCopy },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  const isPathActive = (url: string) => {
    const current = location.pathname.toLowerCase().replace(/\/$/, "")
    const target = url.toLowerCase().replace(/\/$/, "")
    return current === target
  }

  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/AdminDashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GraduationCapIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">IntelliQuest</span>
                  <span className="truncate text-xs text-[var(--muted-foreground)]">
                    Private Limited
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-auto custom-scrollbar">
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            isActive: isPathActive(item.url),
          }))}
        />
        <NavProjects
          projects={data.projects.map((item) => ({
            ...item,
            isActive: isPathActive(item.url),
          }))}
        />
        <NavSecondary
          items={data.navSecondary.map((item) => ({
            ...item,
            isActive: isPathActive(item.url),
          }))}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
