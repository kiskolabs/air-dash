# Dashboard blocked on air-api outage

## Participants

- amkisko

## Decisions

- air.kiskolabs.net itself was serving the SPA; the stuck Loading / Network Error state came from `https://air-api.kiskolabs.net/air_quality_data` failing (Heroku H14, then Netatmo invalid_grant).
- Harden the client with request timeout, treat API `error` payloads as failures, fix temperature/noise color band bugs, and pin Node to 16.20.2 for local installs.

## Effects

- Live dashboard showed Loading then Network Error while API returned 503/500.
- Client changes landed on branch `patch/api-timeout-and-error-handling`.
- `npm audit` after lockfile refresh reported 226 vulnerabilities (mostly CRA 3 / react-scripts transitive). Full CRA upgrade is separate work; not force-fixed here.
- `CI=true npm test -- --watchAll=false`: NetatmoClient tests passed; App mount smoke replaced because `idb-keyval` needs IndexedDB in Jest.

## Next

- Unblock data by finishing air-back refresh-token deploy (see air-back issue note).
- CRA exit and Node 26 / Vite dependency upgrade is on branch `patch/upgrade-node-and-dependencies` (see `docs/changelogs/20261112124800_vite-node26-dependency-upgrade.md`).
- Deploy Netlify after API is healthy if client branch should ship.

## Source

- Sibling API: `kiskolabs/air-back` docs/issues/20261112095300_air-api-h14-and-invalid-grant.md
- Live: https://air.kiskolabs.net/
