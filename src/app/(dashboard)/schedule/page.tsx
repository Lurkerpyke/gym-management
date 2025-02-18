// app/(routes)/schedule/page.tsx

import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Dumbbell, CalendarDays, X } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

// Mock data for available classes
const availableClasses = [
    {
        id: "1",
        name: "Morning Yoga",
        description: "Start your day with a relaxing yoga session.",
        trainer: "Alice Johnson",
        location: "Studio A",
        startTime: new Date("2023-10-25T06:00:00"),
        endTime: new Date("2023-10-25T07:00:00"),
        maxCapacity: 20,
    },
    {
        id: "2",
        name: "HIIT Workout",
        description: "High-intensity interval training for all levels.",
        trainer: "Mark Smith",
        location: "Main Gym",
        startTime: new Date("2023-10-25T08:00:00"),
        endTime: new Date("2023-10-25T09:00:00"),
        maxCapacity: 15,
    },
];

// Mock data for user's booked classes
const userBookings = [
    {
        id: "1",
        class: {
            id: "1",
            name: "Morning Yoga",
            startTime: new Date("2023-10-25T06:00:00"),
            endTime: new Date("2023-10-25T07:00:00"),
            location: "Studio A",
        },
        status: "booked",
    },
];

export default async function SchedulePage() {
    const session = await requireAdmin();

    return (
        <div className="min-h-screen p-6 w-full">
            <div className=" mx-auto">
                <Card className="shadow-lg rounded-2xl border-0">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                                <CalendarDays className="h-8 w-8 text-blue-600" />
                                {session.user.name} Gym Schedule
                            </h1>
                            <Button asChild variant="default" className="gap-2">
                                <Link href="/schedule/new">
                                    <Plus className="h-4 w-4" />
                                    Add Class
                                </Link>
                            </Button>
                        </div>
                        <p className="text-slate-600">
                            View and manage your gym activities and classes.
                        </p>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Calendar Section */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <Calendar mode="single" className="rounded-md" />
                        </div>

                        {/* User's Booked Classes */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <Clock className="h-6 w-6 text-blue-600" />
                                Your Booked Classes
                            </h2>
                            {userBookings.map((booking) => (
                                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-50 rounded-full">
                                                    <Dumbbell className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">
                                                        {booking.class.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-600">
                                                        {booking.class.startTime.toLocaleTimeString()} -{" "}
                                                        {booking.class.endTime.toLocaleTimeString()}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        Location: {booking.class.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="destructive" size="sm">
                                                <X className="h-4 w-4" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Available Classes */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <Dumbbell className="h-6 w-6 text-blue-600" />
                                Available Classes
                            </h2>
                            {availableClasses.map((cls) => (
                                <Card key={cls.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-50 rounded-full">
                                                    <Dumbbell className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">
                                                        {cls.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-600">
                                                        {cls.startTime.toLocaleTimeString()} -{" "}
                                                        {cls.endTime.toLocaleTimeString()}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        Trainer: {cls.trainer} | Location: {cls.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="default" size="sm">
                                                Book
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}