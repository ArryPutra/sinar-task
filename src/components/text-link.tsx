import Link from "next/link";

export default function TextLink({
    url, 
    label,
    target
}: {
    url: string
    label: string
    target?: string
}) {
    return (
        <Link href={url}
            className="hover:underline hover:text-blue-500"
            target={target}>
            {label}
        </Link>
    )
}
