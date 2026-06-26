"use client"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/features/dashboard/components/nav-user"
import { NavHeader } from "@/features/dashboard/components/nav-header"
import { ClipboardListIcon, PieChartIcon } from "lucide-react"
import { NavMain } from "./nav-main"

const data = {
  teams:
  {
    name: "Sinar Task",
    logo: (
      <img
        src={'/images/logo-only.png'} />
    ),
    plan: "v1.0.0",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <PieChartIcon />
      ),
      isActive: true,
    },
    {
      title: "Tugas Pegawai",
      url: "/tugas-pegawai",
      icon: (
        <ClipboardListIcon />
      ),
      isActive: true,
    },
  ],
}

export function AppSidebar({
  user,
  ...props
}: {
  user: {
    name: string
    email: string
  };
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
