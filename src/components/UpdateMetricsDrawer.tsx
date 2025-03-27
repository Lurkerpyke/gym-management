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
                    // Converter para números
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
                toast.success('Métricas atualizadas com sucesso!')
                window.location.reload()
            } else {
                toast.error('Falha ao atualizar métricas')
            }
        } catch (error) {
            toast.error('Ocorreu um erro ao atualizar as métricas')
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="default" className="mt-4">
                    Atualizar Métricas
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-md p-6">
                    <DrawerHeader>
                        <DrawerTitle>Atualizar Métricas de Saúde</DrawerTitle>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
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
                            <Label htmlFor="height">Altura (metros)</Label>
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
                                <Label htmlFor="waistCircumference">Cintura (cm)</Label>
                                <Input
                                    id="waistCircumference"
                                    type="number"
                                    step="0.1"
                                    value={formData.waistCircumference}
                                    onChange={(e) => setFormData({ ...formData, waistCircumference: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hipCircumference">Quadril (cm)</Label>
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
                                <Label htmlFor="bodyFat">Gordura Corporal (%)</Label>
                                <Input
                                    id="bodyFat"
                                    type="number"
                                    step="0.1"
                                    value={formData.bodyFat}
                                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="muscleMass">Massa Muscular (%)</Label>
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
                            Salvar Alterações
                        </Button>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
