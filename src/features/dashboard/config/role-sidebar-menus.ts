import { ClipboardListIcon, ClipboardPenIcon, HistoryIcon, PieChartIcon, UserIcon, UsersIcon } from "lucide-react";

export type RoleSidebarMenu = {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
};

export const roleSidebarMenus: { ADMIN: RoleSidebarMenu[]; EMPLOYEE: RoleSidebarMenu[] } = {
    ADMIN:
        [
            {
                title: "Dashboard",
                url: "/admin/dashboard",
                icon: PieChartIcon,
                isActive: true,
            },
            {
                title: "Pekerjaan Karyawan",
                url: "/admin/employee-tasks",
                icon: ClipboardListIcon,
                isActive: true
            },
            {
                title: "Kategori Pekerjaan",
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
    EMPLOYEE: [
        {
            title: "Dashboard",
            url: "/employee/dashboard",
            icon: PieChartIcon,
            isActive: true,
        },
        {
            title: "Riwayat Pekerjaan",
            url: "/employee/employee-task-history",
            icon: HistoryIcon,
            isActive: true,
        },
        {
            title: "Profil",
            url: "/employee/profile",
            icon: UserIcon,
            isActive: true,
        }
    ]
}