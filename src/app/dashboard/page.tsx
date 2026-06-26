import { getCurrentUserAction } from "@/features/auth/actions";
import Dashboard_View from "@/features/dashboard/view";

export default async function Dashboard_Page() {

    const currentUser = await getCurrentUserAction();

    return (
        <Dashboard_View 
        user={currentUser.user}/>
    )
}
