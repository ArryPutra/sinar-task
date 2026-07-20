import { getCurrentUserAction } from "@/features/auth/actions";
import { HeaderProvider } from "@/features/dashboard/header-context";
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
        <HeaderProvider>
            <DashboardView
                user={{
                    name: currentUser.user?.name,
                    email: currentUser.user?.email,
                    roleId: currentUser.user?.userRoleId
                }}>
                {children}
            </DashboardView>
        </HeaderProvider>
    )
}
