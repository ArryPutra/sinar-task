import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function SummaryCard({
    label,
    value
}: {
    label: string;
    value: number;
}) {
    return (
        <Card>
            <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-xl font-semibold">
                    {value}
                </CardTitle>
            </CardHeader>
        </Card>
    )
}
