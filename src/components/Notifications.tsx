// components/Notifications.tsx
'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Bell, BellDot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function NotificationSystem({ sessions }: { sessions: Array<{ id: string; title: string; date: Date }> }) {
    // Track notified sessions with a ref instead of state
    const notifiedSessions = useRef<Set<string>>(new Set()) // Using useRef

    useEffect(() => {
        // Filter sessions that haven't been notified yet using ref
        const newSessions = sessions.filter(
            session => !notifiedSessions.current.has(session.id)
        )

        newSessions.forEach(session => {
            toast('⚠️ Upcoming Workout', {
                description: `Treino ${session.title} às ${session.date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    weekday: 'short'
                })}`,
                position: 'top-right',
                duration: 5000
            })
        })

        // Update notified sessions ref
        newSessions.forEach(session => notifiedSessions.current.add(session.id))
    }, [sessions]) // Only sessions in dependencies

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    {sessions.length > 0 ? (
                        <BellDot className="h-4 w-4 text-primary" />
                    ) : (
                        <Bell className="h-4 w-4" />
                    )}
                    {sessions.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                            {sessions.length}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <h4 className="font-medium leading-none">Próximos Treinos</h4>
                    {sessions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sem treinos em vista</p>
                    ) : (
                        sessions.map(session => (
                            <div key={session.id} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-medium">{session.title}</p>
                                    <p className="text-muted-foreground">
                                        {session.date.toLocaleString([], {
                                            weekday: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}