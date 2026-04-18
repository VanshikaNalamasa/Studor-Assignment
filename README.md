# PathCredit Logger

A student activity tracker built as part of the Studor Builder Screening Project.

## How to run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## What I built

A single-page React app (Vite) where students can log activities and track their career-readiness milestones.

**Log an Activity** — form with activity name, category (Academic, Technical, Cultural, Sports), and date. Validates for empty or whitespace-only names, enforces a 100-character limit, blocks future dates, and warns on duplicate entries. Resets cleanly after every submit.

**Activity Feed** — lists all logged activities with multi-category filtering, a search bar, and sort controls (newest, oldest, A–Z). Each card supports inline editing and deletion. Empty states and no-results states are handled separately.

**PathCredit Score** — each category earns weighted points (Technical: 3, Academic: 2, Cultural: 1, Sports: 1), shown as a running total alongside a day streak counter and category breakdown bar.

**Milestone Badges** — earned on first activity per category and at count thresholds (5, 10, 25 activities).

**Persistence** — activities and badges survive page refresh via localStorage.

**Export** — one-click CSV download of all logged activities.

## What I'd add or change with more time

- **Delete with undo** — right now deletion is permanent; a brief undo window would prevent accidental loss
- **Multi-tenant support** — separate activity stores per student profile, which maps directly to Studor's institutional architecture
- **PathCredit weighting UI** — let counselors configure point values per category per institution rather than hardcoding them
- **Backend sync** — swap localStorage for a Node/Express API so data persists across devices and can feed into Studor's behavioral data pipeline
- **Activity notes field** — a short free-text field per entry for context, useful for counselor review