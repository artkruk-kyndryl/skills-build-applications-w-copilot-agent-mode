import { CapabilityCard } from './CapabilityCard.js';

type WorkoutSuggestion = { title: string; focus: string; minutes: number; difficulty: string; reason: string };
type WorkoutResponse = { suggestions: WorkoutSuggestion[] };

export default function Workouts() {
  return <CapabilityCard<WorkoutResponse>
    title="Workout suggestions"
    description="Recommend workouts from activity patterns."
    path={`/api/workouts/suggestions/${encodeURIComponent('mona@example.com')}`}
    emptyMessage="No workout suggestions are available."
    isEmpty={({ suggestions }) => suggestions.length === 0}
  >
    {({ suggestions }) => <ul>{suggestions.map((workout) => <li key={workout.title}>
      <strong>{workout.title}</strong> — {workout.focus}, {workout.minutes} minutes, {workout.difficulty}. {workout.reason}
    </li>)}</ul>}
  </CapabilityCard>;
}
