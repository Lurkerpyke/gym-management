// app/(routes)/schedule/new/components/SessionForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkoutSessionSchema } from "@/validators/workout";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker/DateTimePicker";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

export function WorkoutSessionForm() {
    const form = useForm({
        resolver: zodResolver(WorkoutSessionSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            duration: 60,
            completed: false
        }
    });

    async function onSubmit(data: any) {
        console.log(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Session Title</FormLabel>
                            <Input {...field} />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <DateTimePicker
                            date={field.value}
                            setDate={field.onChange}
                        />
                    )}
                />

                <Button type="submit">Create Session</Button>
            </form>
        </Form>
    );
}