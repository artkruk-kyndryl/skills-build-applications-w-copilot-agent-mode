import { CapabilityCard } from './CapabilityCard.js';

type Team = { name: string; mascot: string; members: string[] };
type TeamResponse = { teams: Team[] };

export default function Teams() {
  return <CapabilityCard<TeamResponse>
    title="Teams"
    description="Manage teams and members."
    path="/api/teams"
    emptyMessage="No teams yet."
    isEmpty={({ teams }) => teams.length === 0}
  >
    {({ teams }) => <ul>{teams.map((team) => <li key={team.name}>
      <strong>{team.name}</strong> — Mascot: {team.mascot}; Members: {team.members.join(', ') || 'None'}
    </li>)}</ul>}
  </CapabilityCard>;
}
