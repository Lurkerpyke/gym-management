'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dumbbell,
    Weight,
    HeartPulse,
    CalendarCheck,
    Goal,
    User
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function ProfilePage() {
    const { data: session } = useSession()

    if (!session) {
        redirect('/signin')
    }

    // Temporary user metrics data
    const userMetrics = {
        currentWeight: 75,
        goalWeight: 70,
        bodyFat: 18,
        muscleMass: 45,
        lastMeasurement: '2024-02-25'
    }

    const handleMetricsSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success('Metrics Updated', {
            description: 'Your fitness metrics have been successfully updated',
            position: 'top-center',
            duration: 3000
        })
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={session.user?.image || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <User className="h-12 w-12" />
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold">{session.user?.name}</h1>
                    <p className="text-muted-foreground">{session.user?.email}</p>
                    <p className="text-sm text-muted-foreground">
                        Member since: January 2024
                    </p>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Fitness Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
                        <Weight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.currentWeight} kg</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Body Fat</CardTitle>
                        <HeartPulse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.bodyFat}%</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Muscle Mass</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.muscleMass}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Update Metrics Drawer */}
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

                        <form onSubmit={handleMetricsSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight">Current Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    defaultValue={userMetrics.currentWeight}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bodyFat">Body Fat Percentage</Label>
                                <Input
                                    id="bodyFat"
                                    type="number"
                                    defaultValue={userMetrics.bodyFat}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                                <Input
                                    id="goalWeight"
                                    type="number"
                                    defaultValue={userMetrics.goalWeight}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="muscleMass">Muscle Mass Percentage</Label>
                                <Input
                                    id="muscleMass"
                                    type="number"
                                    defaultValue={userMetrics.muscleMass}
                                />
                            </div>

                            <Button type="submit" className="w-full mt-4">
                                Save Changes
                            </Button>
                        </form>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Workout Schedule Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                            <div>
                                <p className="font-medium">Personal Training</p>
                                <p className="text-sm text-muted-foreground">March 5, 2024 - 10:00 AM</p>
                            </div>
                            <Button variant="outline">Details</Button>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                            <div>
                                <p className="font-medium">Group Cycling</p>
                                <p className="text-sm text-muted-foreground">March 7, 2024 - 6:00 PM</p>
                            </div>
                            <Button variant="outline">Details</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}