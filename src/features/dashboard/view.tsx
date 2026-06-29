"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RoleSidebarMenu, roleSidebarMenus } from "@/features/dashboard/config/role-sidebar-menus"
import { usePathname } from "next/navigation"
import { NavHeader } from "./components/nav-header"
import { NavMain } from "./components/nav-main"
import { NavUser } from "./components/nav-user"

export default function DashboardView({
  user,
  children
}: {
  user: {
    name: string
    email: string
    roleId: number
  },
  children: React.ReactNode
}) {

  const pathName = usePathname();

  const roleSidebarMenu: RoleSidebarMenu[] = {
    1: roleSidebarMenus.ADMIN,
    2: roleSidebarMenus.PEGAWAI,
  }[user.roleId] || [];

  const breadcrumbTitle = roleSidebarMenu.find((item) => pathName.startsWith(item.url))?.title;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="h-full">
        <SidebarHeader>
          <NavHeader />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={roleSidebarMenu} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumbTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex flex-col gap-4 p-4 pt-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
