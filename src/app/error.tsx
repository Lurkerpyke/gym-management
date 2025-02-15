'use client'

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useEffect } from "react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <h2 className="text-2xl font-bold">Something went wrong!</h2>
            </div>
            <p className="text-muted-foreground">
                {error.message || "An unexpected error occurred"}
            </p>
            <Button
                variant="outline"
                onClick={() => reset()}
            >
                Try again
            </Button>
        </div>
    )
}
