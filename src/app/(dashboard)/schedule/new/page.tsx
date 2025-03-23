// app/(routes)/schedule/new/page.tsx
import { WorkoutSessionForm } from "./components/SessionForm";

export default function NewSessionPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Create New Workout Session</h2>
      <WorkoutSessionForm />
    </div>
  );
}