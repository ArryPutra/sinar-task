import { ClipboardListIcon, ClipboardPenIcon, PieChartIcon } from "lucide-react";

export type RoleSidebarMenu = {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
};

export const roleSidebarMenus: { ADMIN: RoleSidebarMenu[]; PEGAWAI: RoleSidebarMenu[] } = {
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
        ],
    PEGAWAI: [
        {
            title: "Dashboard",
            url: "/karyawan/dashboard",
            icon: PieChartIcon,
            isActive: true,
        },
    ]
}