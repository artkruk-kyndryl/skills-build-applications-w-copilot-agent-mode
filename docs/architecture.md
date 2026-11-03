# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

- Presentation tier decision: Use one shared API-backed card for loading, empty, and error states, with each route rendering its own returned records.
- Logic tier decision: Keep request validation and capability behavior in explicit service functions; return deliberate 4xx responses for invalid or unknown resources.
- Data tier decision: Enforce required fields and basic value constraints in Mongoose schemas while preserving non-destructive, idempotent seed upserts.
- Activity tracking approach: Validate input IDs and existing user/team references, then derive points from submitted minutes and set the occurrence time on creation.
- Team management approach: Require a name and mascot, validate submitted member references, and retain the member IDs on created and listed teams.
- Leaderboard approach: Sum activity points by team, sort totals descending with deterministic name ordering, and assign 1-based ranks.
- Workout suggestions approach: Prioritize workouts matching a user's goal, then recent activity focus, and explain the recommendation; return 404 for unknown emails.

## Test plan

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend` — passed (5 tests); failures indicate schema validation or seed idempotency regressions.
- API command: `npm run test:api --prefix octofit-tracker/backend` — passed (4 tests); failures indicate request validation, persistence, ranking, or recommendation regressions.
- Frontend command: `npm test --prefix octofit-tracker/frontend` — passed (15 tests); failures indicate missing API rendering or loading, empty, and error state regressions.
- Backend build command: `npm run build --prefix octofit-tracker/backend` — passed; failures indicate backend TypeScript errors.
- Frontend build command: `npm run build --prefix octofit-tracker/frontend` — passed; failures indicate frontend TypeScript or production bundling errors.
