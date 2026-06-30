import { ClipboardListIcon, ClipboardPenIcon, PieChartIcon, UserIcon, UsersIcon } from "lucide-react";

export type RoleSidebarMenu = {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
};

export const roleSidebarMenus: { ADMIN: RoleSidebarMenu[]; KARYAWAN: RoleSidebarMenu[] } = {
    ADMIN:
        [
            {
                title: "Dashboard",
                url: "/admin/dashboard",
                icon: PieChartIcon,
                isActive: true,
            },
            {
                title: "Tugas Karyawan",
                url: "/admin/employee-tasks",
                icon: ClipboardListIcon,
                isActive: true
            },
            {
                title: "Kategori Tugas Karyawan",
                url: "/admin/employee-task-categories",
                icon: ClipboardPenIcon,
                isActive: true
            },
            {
                title: "Kelola Karyawan",
                url: "/admin/employees",
                icon: UsersIcon,
                isActive: true
            },
        ],
    KARYAWAN: [
        {
            title: "Dashboard",
            url: "/karyawan/dashboard",
            icon: PieChartIcon,
            isActive: true,
        },
    ]
}