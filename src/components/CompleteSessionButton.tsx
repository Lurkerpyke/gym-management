// components/CompleteSessionButton.tsx
'use client'

import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

export default function CompleteSessionButton({
    sessionId,
    completed
}: {
    sessionId: string
    completed: boolean
}) {
        const toggleCompletion = async () => {
            try {
                const response = await fetch(`/api/workout-sessions/${sessionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: !completed })
                })

                if (response.ok) {
                    localStorage.setItem("sessionToast", completed ? "Marcado como Incompleto!" : "Boaa! trabalho concluído 🎉");
                    window.location.reload()
                }
            } catch (error) {
                console.error('Error updating status:', error)
                toast.error('Failed to update status')
            }
        }
            useEffect(() => {
                const message = localStorage.getItem("sessionToast");
            
                if (message) {
                    toast.success(message);
                    localStorage.removeItem("sessionToast"); // Remove para não repetir
                }
            }, []);

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleCompletion}
            className={completed ? 'text-green-500 hover:text-green-600' : 'text-muted-foreground'}
        >
            {completed ? (
                <CheckCircle2 className="h-5 w-5" />
            ) : (
                <Circle className="h-5 w-5" />
            )}
        </Button>
    )
}