import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardView({
    cardData
}: {
    cardData: {
        employeeCount: number;
    }
}) {
    return (
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 ">
            <Card>
                <CardHeader>
                    <CardDescription>Total Karyawan</CardDescription>
                    <CardTitle className="text-xl font-semibold">
                        {cardData.employeeCount}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}
