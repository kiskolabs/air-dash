# Orbit absorbs AirDash; retire Netlify; defer Cloudflare

Design decision for this dashboard repo. Product delivery lives in Orbit.

## Participants

- amkisko

## Decisions

- Prefer Orbit absorb over keeping the Netlify wallboard or moving it to Cloudflare Pages in this pass. Cost cut: stop the separate SPA host once Orbit covers workplace air quality.
- Orbit owns the person-facing surfaces: air quality in Orbit Search / HQ browser routes and private Slack `/orbit air`. No React SPA rewrite into Orbit.
- After Orbit cutover is verified, retire the Netlify site for this app and hostname `air.kiskolabs.net` (DNS under `kiskolabs.net`) through the infrastructure workflow. Retire the sibling API (`air-api.kiskolabs.net`, Heroku `air-dash-api` + Redis) in the same cutover window.
- Keep this repository as a historical UI reference. Revisit a dedicated Cloudflare Pages wallboard only if a separate wall display is needed again.

## Effects

- Orbit live work already implements air quality and Slack. Cutover and verify steps are tracked there.
- This repo remains the prior Netlify Vite SPA until site and DNS destroy. Default API base `https://air-api.kiskolabs.net` stays irrelevant after API retirement.
- No Cloudflare Pages project for air-dash in this pass.

## Next

- Complete Orbit air-quality cutover per Orbit absorb live-work (secrets, deploy, HQ browser and Slack verify).
- Destroy Netlify site and `air.kiskolabs.net` DNS after verify; coordinate with API / Redis destroy so the board does not linger on a dead API.
- Leave this repo archived or idle as reference; do not start a Pages migration unless the wallboard product returns.

## Source

- Sibling API plan: air-back `docs/plans/20261118115118_orbit-absorb-retire-defer-cloudflare.md`
- Orbit absorb live work: orbit `docs/issues/20261117181812_absorb-legacy-kisko-apps.md` (air quality cutover)
- Orbit absorb plan: orbit `docs/plans/20261117181811_absorb-legacy-kisko-apps.md`
- Orbit changelog slice: orbit `docs/changelogs/20261117184500_absorb-legacy-kisko-apps.md`
- Prior dashboard blockage note: `docs/issues/20261112100000_dashboard-blocked-on-air-api.md`
- Production SPA host: `air.kiskolabs.net` (Netlify publish of `build/`)
