## Additional instructions

### .agents/project.md
AirDash Vite + React dashboard (`kiskolabs/air-dash`). Default branch is `master`.

Browser UI for Netatmo Home Coach air quality: polls the AirBack API, caches UI state in IndexedDB, and deploys as a static SPA on Netlify.

GitHub: https://github.com/kiskolabs/air-dash

Evidence: git, `docs/`, `usr/`, PRs, GitHub. Reads from those sources are allowed. Writes are not implied by listing them.

## Credentials and env

Env names only (never commit values):

- `VITE_COMMIT_REF` / `COMMIT_REF` / `GIT_COMMIT` — build revision for Honeybadger and deploy metadata (`build:app` maps `COMMIT_REF` into `VITE_COMMIT_REF`)
- `VITE_AIR_API_BASE_URL` — optional AirBack base URL override (defaults to production API host)
- `NODE_ENV` — Vite / Node runtime mode
- Honeybadger via its client config when enabled (do not commit new secrets; treat existing client keys as sensitive)

Local dotenv files: `.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local` (gitignored). Do not commit them.

Node: pin with `.node-version` (currently major `26`). Netlify reads `.node-version` / `.nvmrc` / `NODE_VERSION` and can install any nvm-published release; new sites default to Node 24, existing sites keep their pin.

## Product boundaries

- Stack: React 19 / Vite / react-router-dom / axios / idb-keyval / visx charts; Netlify static publish of `build/`.
- Entry: `index.html`, `src/index.jsx`, `src/App.jsx`; main surface `src/containers/Dashboard.jsx`.
- AirBack API is an external dependency (`https://air-api.kiskolabs.net`); treat fetch and parse errors as first-class paths.
- IndexedDB (`idb-keyval` store `air-dash`) holds rebuildable UI state, not durable product truth.
- Sibling API repo: `kiskolabs/air-back`. Prefer API changes there over duplicating domain rules in the dashboard.

## External service writes

- Read GitHub and similar tools when they help the task.
- Do not create, update, comment, post, or otherwise write to those services unless this turn names that destination and the write.
- Repo work is not that request. Drafts stay in the reply or in `docs/` until the user says to send them.

## Documentation layout

- Agent working records use docs-conventions timestamp trees under `docs/`.
- Workshop and ops material stay under `usr/`.
- Blank note skeletons live under `usr/templates/note/` from docs-conventions.
- Do not put secrets, tokens, or machine-local absolute paths in `docs/` or committed `usr/` text.

## Skills

- engineering-audit, security-audit, claims-audit, derivation-audit, pressure-benchmarking: packaged from amkisko/prayers under `.agents/skills/`
