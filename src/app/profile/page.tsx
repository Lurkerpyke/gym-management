import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Weight, HeartPulse, Dumbbell, CalendarCheck, User } from "lucide-react";
import UpdateMetricsDrawer from "@/components/UpdateMetricsDrawer";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return redirect("/signin");
    }

    const metrics = await prisma.userMetrics.findUnique({
        where: { userId: session.user.id },
    });

    const sessions = await prisma.workoutSession.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "asc" },
    });

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <User className="h-12 w-12" />
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold">{session.user.name}</h1>
                    <p className="text-muted-foreground">{session.user.email}</p>
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
                        <div className="text-2xl font-bold">{metrics?.currentWeight || "N/A"} kg</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Body Fat</CardTitle>
                        <HeartPulse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.bodyFat || "N/A"}%</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Muscle Mass</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.muscleMass || "N/A"}%</div>
                    </CardContent>
                </Card>
            </div>

            <UpdateMetricsDrawer metrics={metrics} />

            {/* Workout Schedule Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                                <div>
                                    <p className="font-medium">{session.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(session.date).toLocaleString()}
                                    </p>
                                </div>
                                <Button variant="outline">Details</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}