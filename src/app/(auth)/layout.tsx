import { roleSidebarMenus } from "@/config/role-sidebar-menus";
import { getCurrentUserAction } from "@/features/auth/actions";
import DashboardView from "@/features/dashboard/view";

export default async function AdminLayout({
    children
}: {
    children: React.ReactNode
}) {
    const currentUser = await getCurrentUserAction();

    if (!currentUser.user) {
        return;
    }

    return (
        <DashboardView
            user={{
                name: currentUser.user?.name,
                email: currentUser.user?.email,
                roleId: currentUser.user?.roleId
            }}>
            {children}
        </DashboardView>
    )
}
