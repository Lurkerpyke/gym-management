// src/components/ui/date-time-picker/DateTimePicker.tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { TimePicker } from "./TimePicker";

export function DateTimePicker({
    date,
    setDate
}: {
    date: Date;
    setDate: (date: Date) => void;
}) {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);

    return (
        <div className="flex gap-2">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                            if (d) {
                                const newDate = new Date(d);
                                newDate.setHours(date.getHours());
                                newDate.setMinutes(date.getMinutes());
                                setDate(newDate);
                            }
                            setCalendarOpen(false);
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <ClockIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "HH:mm") : <span>Pick time</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <TimePicker
                        date={date}
                        setDate={(d) => {
                            setDate(d);
                            setTimeOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}