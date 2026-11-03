import { CapabilityCard } from './CapabilityCard.js';

type Activity = { type: string; minutes: number; points: number; user?: string; team?: string; occurredAt?: string };
type ActivityResponse = { activities: Activity[] };

export default function Activities() {
  return <CapabilityCard<ActivityResponse>
    title="Activities"
    description="Track student activity minutes and points."
    path="/api/activities"
    emptyMessage="No activities yet."
    isEmpty={({ activities }) => activities.length === 0}
  >
    {({ activities }) => <ul>{activities.map((activity, index) => <li key={`${activity.type}-${activity.occurredAt ?? index}`}>
      <strong>{activity.type}</strong>: {activity.minutes} minutes, {activity.points} points
      {activity.user && <> — User: {activity.user}</>}
      {activity.team && <> — Team: {activity.team}</>}
    </li>)}</ul>}
  </CapabilityCard>;
}
