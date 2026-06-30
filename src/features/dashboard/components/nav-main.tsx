"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useRouter } from 'nextjs-toploader/app';

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ComponentType
    isActive?: boolean
  }[]
}) {

  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Daftar Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index} >
            <SidebarMenuButton
              tooltip={item.title}
              isActive={pathname.startsWith(`${item.url}`)}
              onClick={() => router.push(item.url)}>
              <item.icon />
              {item.title}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
