import { ClipboardListIcon, PieChartIcon } from "lucide-react";

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
                title: "Tugas Pegawai",
                url: "/admin/tugas-pegawai",
                icon: ClipboardListIcon,
                isActive: true,
            },
        ],
    PEGAWAI: [
        {
            title: "Dashboard",
            url: "/pegawai/dashboard",
            icon: PieChartIcon,
            isActive: true,
        },
    ]
}