'use client'

import { toast } from 'sonner'
import { Button } from './button'

export default function DeleteSessionButton({ sessionId }: { sessionId: string }) {
    const handleDelete = async () => {
        try {
            await fetch('/api/workout-sessions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: sessionId }),
            })
            window.location.reload()
        } catch (error) {
            toast.error('Failed to delete session')
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
        >
            Delete
        </Button>
    )
}