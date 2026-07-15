import ProfileView from "@/features/profile/views/profile"

export default function EmployeeProfileView({
    data
}: {
    data: {
        name: string
        email: string
        phoneNumber: string
    }
}) {
    return (
        <ProfileView
            data={data} />
    )
}