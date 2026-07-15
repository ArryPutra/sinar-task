"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ChevronLeft } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"

interface BackButtonProps {
    className?: string
    href?: string 
}

export default function BackButton({ className, href }: BackButtonProps) {
    const router = useRouter()

    const handleBack = () => {
        if (href) {
            router.push(href) 
        } else {
            router.back() 
        }
    }

    return (
        <Button
            className={className + " mb-3 w-fit"}
            variant={'outline'}
            onClick={handleBack}
        >
            <ArrowLeftIcon className="mr-1" />
            Kembali
        </Button>
    )
}