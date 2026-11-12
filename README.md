# Air Dash

Browser dashboard for Netatmo Home Coach air quality. Polls the AirBack API, caches UI state in IndexedDB, and deploys as a static SPA on Netlify.

## Stack

- React 19 + Vite 8
- Node 26 (see `.node-version`; Netlify reads this file)
- Sibling API: [air-back](https://github.com/kiskolabs/air-back)

## Developing

1. Use Node 26 (`nvm install` / `.node-version`, or any tool that honors that file).
2. `npm install`
3. Optional: set `VITE_AIR_API_BASE_URL` in `.env.local` to point at a non-production API.
4. `npm start` (Vite on http://localhost:5173)
5. `npm test`
6. `npm run build` writes to `build/` (Netlify publish directory)

## Production notes

- Netlify build command: `npm run build` (`netlify.toml`)
- `COMMIT_REF` from Netlify is mapped to `VITE_COMMIT_REF` for Honeybadger revision metadata
- Optional env: `VITE_AIR_API_BASE_URL`
