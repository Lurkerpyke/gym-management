// src/components/ui/date-time-picker/TimePicker.tsx
"use client";

import { Button } from "@/components/ui/button";

export function TimePicker({
    date,
    setDate
}: {
    date: Date;
    setDate: (date: Date) => void;
}) {
    const onChange = (hours: number, minutes: number) => {
        const newDate = new Date(date);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        setDate(newDate);
    };

    return (
        <div className="flex items-center gap-2 p-3">
            <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((hOffset) => {
                    const hour = date.getHours() + hOffset;
                    return (
                        <Button
                            key={hour}
                            variant="ghost"
                            onClick={() => onChange(hour, date.getMinutes())}
                        >
                            {hour.toString().padStart(2, "0")}
                        </Button>
                    );
                })}
            </div>
            :
            <div className="flex gap-1">
                {[0, 15, 30, 45].map((minutes) => (
                    <Button
                        key={minutes}
                        variant="ghost"
                        onClick={() => onChange(date.getHours(), minutes)}
                    >
                        {minutes.toString().padStart(2, "0")}
                    </Button>
                ))}
            </div>
        </div>
    );
}