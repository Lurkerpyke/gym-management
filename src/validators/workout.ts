// src/validators/workout.ts
import { z } from "zod";

export const WorkoutSessionSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "Title must be at least 2 characters").max(50),
    description: z.string().optional(),
    date: z.date(),
    duration: z.number().min(15, "Minimum 15 minutes").max(180, "Maximum 3 hours"),
    completed: z.boolean().default(false)
});

export type WorkoutSessionFormValues = z.infer<typeof WorkoutSessionSchema>;