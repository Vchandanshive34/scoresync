# ScoreSync

League administration and cage-side judge scoring, built to match the ScoreSync UI.
Vite + React 18 + TypeScript, no UI framework.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/
```

## Deploying to GitHub Pages

GitHub Pages is a static host — it cannot compile TypeScript or JSX. Pushing the source and
pointing Pages at the repo root serves the development `index.html`, whose
`<script src="/src/main.tsx">` the browser cannot run, and the page renders blank. **Pages must
serve `dist/`, not the repo root.**

### Option A — GitHub Actions (recommended, nothing built files committed)

`.github/workflows/deploy.yml` is included. After pushing it:

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`. The workflow runs `npm ci && npm run build` and publishes `dist/`.

### Option B — no CI, commit the build

```bash
npm run build:docs   # builds into docs/ instead of dist/
git add docs && git commit -m "Build site" && git push
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `/docs`**.

### Why it works under a subpath

`vite.config.ts` sets `base: './'`, so the built HTML references `./assets/app.js` and resolves
correctly under `https://<user>.github.io/scoresync/`. Keep it relative — an absolute `base: '/'`
breaks on a project page. Routing uses `HashRouter`, so deep links such as
`/scoresync/#/judges` work without any 404 rewrite rule. `public/.nojekyll` stops Jekyll from
touching the build output.

## Screens

| Route               | Screen           | Notes                                                                  |
| ------------------- | ---------------- | ---------------------------------------------------------------------- |
| `/`                 | Admin home       | Create League / Upcoming League / Past League tiles                    |
| `/leagues/new`      | Create League    | Name, date & time, location, promoter, bout counters, logo upload      |
| `/leagues/upcoming` | Upcoming League  | Table with Edit/View and delete                                        |
| `/leagues/past`     | Past League      | Read-only table                                                        |
| `/leagues/:id`      | League detail    | League summary plus the bout card, links to Edit Bout and Memory Sheet |
| `/leagues/:id/edit` | Edit League      | Same form as Create League, pre-filled                                 |
| `/bouts/:id/edit`   | Edit Bout        | Bout format, corner selection, three judges and the referee            |
| `/bouts/:id/score`  | Memory Sheet     | Judge scoring station                                                  |
| `/judges`           | Judge List       | Add / edit / remove judges                                             |
| `/fighters`         | Fighter List     | Roster                                                                 |

Routing uses `HashRouter` so the build serves from any static host without rewrite rules.

## Memory Sheet

Per round, per corner, each of the four categories keeps three values:

- **points** — what one action in that category is worth (editable, defaults to 1)
- **count** — how many were scored; the `+` button increments it
- **note** — free text for the commission record

Round points = Σ (points × count), shown under each corner. The two `score` selects hold the
judge's 10-point-must figures for the round, and **Final score** submits and locks the round —
locked rounds go read-only. The stopwatch counts up; **Start** / **Stop** drive it and
**Manual Time** sets it directly as `mm:ss`. Finish methods (Head Ko, Ko Body, TKO, No Contest,
RNC, Submission, DQ) toggle on the sheet.

The judge dropdown switches between the three judges assigned to the bout, and each judge gets
their own sheet.

## Where the API goes

All state is one reducer in `src/store.tsx`; components only read through `useStore()`.

1. Replace the fixtures in `src/data.ts` with API calls.
2. In `StoreProvider`, post each dispatched `Action` to the API instead of reducing locally — the
   action union is already a usable command vocabulary (`sheet/cell`, `sheet/lock`, `bout/update`…).
3. Apply server broadcasts by dispatching the same actions from a WebSocket handler, so three
   judges scoring at once converge on every station.
4. Drop the local `tick` interval once the server owns the clock.

`src/types.ts` is written to match the expected API payloads.

## Placeholders to replace

- **Logo** — `Logo()` in `src/components/ui.tsx` draws a wordmark and swoosh in markup. Swap in the
  real logo asset.
- **Fighter portraits** — rendered as initials on a corner-coloured card. Point them at your own
  fighter photos; no third-party images are bundled.
- **Upload League Logo** — the button toggles a filename in state. Wire it to a real file input and
  upload endpoint.

## Files

```
src/
  App.tsx            routes
  store.tsx          reducer, provider, stopwatch
  types.ts           domain model, scoring categories, helpers
  data.ts            fixture data (replace with the API)
  styles.css         design tokens and all component styles
  components/
    Shell.tsx        header, hamburger drawer, toast
    ui.tsx           logo, fields, counter, icons, clock formatting
  pages/
    AdminHome.tsx  CreateLeague.tsx  LeagueList.tsx  LeagueDetail.tsx
    EditBout.tsx   MemorySheet.tsx   JudgeList.tsx   FighterList.tsx
```
