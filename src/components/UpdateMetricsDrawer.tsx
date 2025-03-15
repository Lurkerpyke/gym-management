// components/UpdateMetricsDrawer.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function UpdateMetricsDrawer({ metrics }: { metrics?: any }) {
    const [formData, setFormData] = useState({
        currentWeight: metrics?.currentWeight || '',
        height: metrics?.height || '',
        waistCircumference: metrics?.waistCircumference || '',
        hipCircumference: metrics?.hipCircumference || '',
        neckCircumference: metrics?.neckCircumference || '',
        bodyFat: metrics?.bodyFat || '',
        muscleMass: metrics?.muscleMass || ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/user-metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    // Convert to numbers
                    currentWeight: parseFloat(formData.currentWeight),
                    height: parseFloat(formData.height),
                    waistCircumference: parseFloat(formData.waistCircumference),
                    hipCircumference: parseFloat(formData.hipCircumference),
                    neckCircumference: parseFloat(formData.neckCircumference),
                    bodyFat: parseFloat(formData.bodyFat),
                    muscleMass: parseFloat(formData.muscleMass)
                })
            })

            if (response.ok) {
                toast.success('Metrics updated successfully!')
                window.location.reload()
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
                <Button variant="default" className="mt-4">
                    Update Metrics
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-md p-6">
                    <DrawerHeader>
                        <DrawerTitle>Update Health Metrics</DrawerTitle>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                            <Input
                                id="currentWeight"
                                type="number"
                                step="0.1"
                                value={formData.currentWeight}
                                onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="height">Height (meters)</Label>
                            <Input
                                id="height"
                                type="number"
                                step="0.01"
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="waistCircumference">Waist (cm)</Label>
                                <Input
                                    id="waistCircumference"
                                    type="number"
                                    step="0.1"
                                    value={formData.waistCircumference}
                                    onChange={(e) => setFormData({ ...formData, waistCircumference: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hipCircumference">Hip (cm)</Label>
                                <Input
                                    id="hipCircumference"
                                    type="number"
                                    step="0.1"
                                    value={formData.hipCircumference}
                                    onChange={(e) => setFormData({ ...formData, hipCircumference: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                                <Input
                                    id="bodyFat"
                                    type="number"
                                    step="0.1"
                                    value={formData.bodyFat}
                                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="muscleMass">Muscle Mass (%)</Label>
                                <Input
                                    id="muscleMass"
                                    type="number"
                                    step="0.1"
                                    value={formData.muscleMass}
                                    onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full">
                            Save Changes
                        </Button>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}