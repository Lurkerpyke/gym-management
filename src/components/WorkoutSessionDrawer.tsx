'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react'
import type { WorkoutSession } from '@prisma/client'

interface WorkoutSessionDrawerProps {
    session?: WorkoutSession | null
    onSuccess?: () => void
}

export default function WorkoutSessionDrawer({ session, onSuccess }: WorkoutSessionDrawerProps) {
    const [title, setTitle] = useState(session?.title || '')
    const [description, setDescription] = useState(session?.description || '')
    const [date, setDate] = useState(session?.date ? new Date(session.date).toISOString().slice(0, 16) : '')
    const [duration, setDuration] = useState(session?.duration?.toString() || '60')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/workout-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: session?.id,
                    title,
                    description,
                    date,
                    duration
                }),
            })

            if (response.ok) {
                toast.success(`Session ${session?.id ? 'updated' : 'created'} successfully!`)
                onSuccess?.()
                window.location.reload()
            } else {
                toast.error('Failed to save session')
            }
        } catch (error) {
            toast.error('An error occurred while saving session')
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant={session ? "outline" : "default"} size={session ? "sm" : "default"}>
                    {session ? (
                        "Edit"
                    ) : (
                        <>
                            <Plus className=" h-4 w-4" />
                            Adicionar novo treino
                        </>
                    )}
                </Button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[90vh]">
                <div className="mx-auto w-full max-w-md p-6">
                    <DrawerHeader>
                        <DrawerTitle>{session?.id ? 'Editar' : 'Nova'} Sessão de treino</DrawerTitle>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Data e Hora *</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duração (minutos) *</Label>
                            <Input
                                id="duration"
                                type="number"
                                min="15"
                                step="15"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full mt-4">
                            {session?.id ? 'Update' : 'Create'} Session
                        </Button>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}