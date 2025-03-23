// app/(routes)/schedule/page.tsx
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Dumbbell, CalendarDays, X, AlarmClock, Activity } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma"
import { format, isToday, isTomorrow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function SchedulePage() {
    const session = await requireAdmin();

    // Fetch real data
    const [workoutSessions, recentActivities] = await Promise.all([
        prisma.workoutSession.findMany({
            where: { userId: session.user.id },
            orderBy: { date: "asc" },
            take: 5
        }),
        prisma.activityLog.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { user: true }
        })
    ]);

    // Group sessions by date
    const sessionsByDate = workoutSessions.reduce((acc: Record<string, typeof workoutSessions>, session) => {
        const dateKey = format(session.date, "yyyy-MM-dd");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(session);
        return acc;
    }, {});

    return (
        <div className="min-h-screen p-6 w-full">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-ce
                nter gap-4 justify-between">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-4">
                        <CalendarDays className="h-8 w-8 text-primary" />
                        Workout Schedule
                    </h1>
                    <Button asChild variant="default">
                        <Link href="/schedule/new" className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Session
                        </Link>
                    </Button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5" />
                                    Training Calendar
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    mode="single"
                                    className="rounded-md"
                                    modifiers={{
                                        hasSessions: Object.keys(sessionsByDate).map(d => new Date(d))
                                    }}
                                    modifiersStyles={{
                                        hasSessions: { border: "2px solid #3b82f6" }
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Sessions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlarmClock className="h-5 w-5" />
                                    Upcoming Sessions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {workoutSessions.map((session) => (
                                    <div key={session.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{session.title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(session.date, "MMM dd, yyyy HH:mm")}
                                                </p>
                                                <Badge variant="outline" className="mt-1">
                                                    {session.duration} mins
                                                </Badge>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {session.description && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {session.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {workoutSessions.length === 0 && (
                                    <div className="text-center text-muted-foreground py-6">
                                        No upcoming sessions
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Activities */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Recent Activities
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4">
                                        <div className="bg-secondary p-2 rounded-full">
                                            <Activity className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {activity.description}
                                            </p>
                                            <time className="text-xs text-muted-foreground">
                                                {format(activity.createdAt, "MMM dd, HH:mm")}
                                            </time>
                                        </div>
                                    </div>
                                ))}
                                {recentActivities.length === 0 && (
                                    <div className="text-center text-muted-foreground py-6">
                                        No recent activities
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}