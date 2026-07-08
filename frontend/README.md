# FreelanceHub Frontend

React frontend built with Vite for faster local startup and production builds.

## Environment

Create `.env` from `.env.example` and set:

```text
VITE_API_BASE_URL=https://your-backend-domain.example.com/api
```

For local development, the app falls back to `http://localhost:8080/api`.

## Scripts

### `npm start`

Runs the Vite development server at [http://localhost:3000](http://localhost:3000).

### `npm test`

Runs the Vitest test suite once.

### `npm run build`

Builds the production app to the `build` folder.

## Vercel

The included `vercel.json` uses `npm run build`, serves the `build` directory, and rewrites client-side routes to `index.html`.
