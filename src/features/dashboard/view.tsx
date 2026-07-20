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
import { NavMenu } from "./components/nav-menu"
import { NavUser } from "./components/nav-user"
import { useHeader } from "./header-context"

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
    2: roleSidebarMenus.EMPLOYEE,
  }[user.roleId] || [];

  const breadcrumbTitle = roleSidebarMenu.find((item) => pathName.startsWith(item.url))?.title;
  const { title } = useHeader();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="h-full">
        <SidebarHeader>
          <NavHeader />
        </SidebarHeader>
        <SidebarContent>
          <NavMenu items={roleSidebarMenu} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={user} />
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
                    <span>{breadcrumbTitle}</span>
                    <span className="ml-2 font-bold">{title && "/ " + title}</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex flex-col gap-6 p-4 pt-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
