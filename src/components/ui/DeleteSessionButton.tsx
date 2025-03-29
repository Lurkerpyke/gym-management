'use client'

import { toast } from 'sonner'
import { Button } from './button'
import { useEffect } from 'react';

export default function DeleteSessionButton({ sessionId }: { sessionId: string }) {
    const handleDelete = async () => {
        try {
            const response = await fetch('/api/workout-sessions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: sessionId }),
            });

            if (response.ok) {
                // Armazena no localStorage a mensagem que deve aparecer após o reload
                localStorage.setItem("sessionToast", "Workout session deleted successfully! 🗑️");

                // Recarrega a página
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting session:", error);
            toast.error("Failed to delete session");
        }
    };

    // Exibir o toast depois que a página recarregar
    useEffect(() => {
        const message = localStorage.getItem("sessionToast");

        if (message) {
            toast.success(message);
            localStorage.removeItem("sessionToast"); // Remove para evitar repetição
        }
    }, []);


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