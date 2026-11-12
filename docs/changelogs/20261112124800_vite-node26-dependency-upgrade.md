# Vite, Node 26, and dependency upgrade

Intent: leave Create React App so the dashboard can run on current Node LTS and clear CRA-era advisory debt.

## Participants

- amkisko

## Decisions

- Pin Node major `26` in `.node-version` (current Node LTS). Netlify installs any nvm-published release from `.node-version`; new sites default to Node 24, existing sites keep their pin.
- Replace Create React App / `react-scripts` with Vite 8 + Vitest; keep Netlify `publish = "build"`.
- Move hot-path packages to current majors: React 19, react-router-dom 7, axios 1, date-fns 4, idb-keyval 6, Font Awesome 7, `@visx/*` 4, `@honeybadger-io/react` 6.
- Env contract: `VITE_COMMIT_REF` (from Netlify `COMMIT_REF` in `build:app`) and optional `VITE_AIR_API_BASE_URL`.
- Drop CRA service worker registration; reload uses `window.location.reload()`.

## Effects

- `npm test` (vitest): 4 passed.
- `npm run build`: succeeded; production JS about 568 kB / 178 kB gzip.
- `npm audit`: 0 vulnerabilities (was hundreds under CRA 3).
- Install tree: head `node_modules` about 157 MB; pre-upgrade CRA tree on the same machine about 326 MB (n=1 each).
- Base CRA production bundle size not remeasured (old toolchain not rebuilt on Node 26); ship-size compare incomplete for base.

## Next

- Confirm Netlify build uses `.node-version` 26 after deploy.
- Smoke the live dashboard against a healthy air-api.
- Optional: split the large JS chunk if delivery budgets require it.

## Source

- Netlify Node docs: https://docs.netlify.com/build/configure-builds/manage-dependencies/
- Netlify changelog: Node 24 default for new sites (2026-07-07)
- Live-work: `docs/issues/20261112100000_dashboard-blocked-on-air-api.md`
