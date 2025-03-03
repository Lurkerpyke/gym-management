'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Goal } from 'lucide-react'
import type { UserMetrics } from '@prisma/client'

interface UpdateMetricsDrawerProps {
    metrics?: UserMetrics | null
}

export default function UpdateMetricsDrawer({ metrics }: UpdateMetricsDrawerProps) {
    const [currentWeight, setCurrentWeight] = useState(metrics?.currentWeight?.toString() || '')
    const [goalWeight, setGoalWeight] = useState(metrics?.goalWeight?.toString() || '')
    const [bodyFat, setBodyFat] = useState(metrics?.bodyFat?.toString() || '')
    const [muscleMass, setMuscleMass] = useState(metrics?.muscleMass?.toString() || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/user-metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentWeight: parseFloat(currentWeight),
                    goalWeight: parseFloat(goalWeight),
                    bodyFat: parseFloat(bodyFat),
                    muscleMass: parseFloat(muscleMass)
                }),
            })

            if (response.ok) {
                toast.success('Metrics updated successfully!')
                window.location.reload() // Refresh to show new data
            } else {
                toast.error('Failed to update metrics')
            }
        } catch (error) {
            toast.error('An error occurred while updating metrics')
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="default" className="w-full md:w-auto">
                    <Goal className="mr-2 h-4 w-4" /> Update Fitness Goals
                </Button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[90vh]">
                <div className="mx-auto w-full max-w-md p-6">
                    <DrawerHeader>
                        <DrawerTitle>Update Fitness Metrics</DrawerTitle>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                            <Input
                                id="currentWeight"
                                type="number"
                                step="0.1"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                            <Input
                                id="goalWeight"
                                type="number"
                                step="0.1"
                                value={goalWeight}
                                onChange={(e) => setGoalWeight(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bodyFat">Body Fat Percentage</Label>
                            <Input
                                id="bodyFat"
                                type="number"
                                step="0.1"
                                value={bodyFat}
                                onChange={(e) => setBodyFat(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="muscleMass">Muscle Mass Percentage</Label>
                            <Input
                                id="muscleMass"
                                type="number"
                                step="0.1"
                                value={muscleMass}
                                onChange={(e) => setMuscleMass(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full mt-4">
                            Save Changes
                        </Button>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}