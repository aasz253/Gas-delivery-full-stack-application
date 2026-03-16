Deployment guide
================

This project has a Vite React frontend and an Express/Mongo backend. Below are concise steps to deploy the frontend to Netlify, the backend to Render, and the database to MongoDB Atlas.

Frontend (Netlify)
- Build command: `npm run build` (run in `frontend/`)
- Publish directory: `frontend/dist`
- Environment variables (set in Netlify site settings):
  - `VITE_API_URL` — URL of the deployed backend (e.g. `https://your-backend.onrender.com`)
  - `VITE_GOOGLE_MAPS_API_KEY` — your maps key

Notes:
- The frontend reads `VITE_API_URL` (default `http://localhost:3000`) from `frontend/.env` or Netlify env settings.
- Netlify will serve the Vite production build from `dist`.

Backend (Render)
- Create a new Web Service on Render using the `backend/` folder (select the repo and the `backend` root).
- Start command: `npm start`
- Environment: Node 18+ (Render default works)
- Important environment variables to set in Render service settings:
  - `MONGO_URI` — connection string from MongoDB Atlas (see below)
  - `JWT_SECRET` — your JWT secret
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — for uploads
  - Any other keys present in `.env` (e.g., MPESA, AFRICASTALKING credentials)

Notes:
- The backend uses `process.env.PORT` and will work on Render without changes.
- CORS is enabled to allow the frontend to call the API.

MongoDB Atlas
- Create a free Atlas cluster and a database user.
- Whitelist your Render IPs or set IP access to allow access from anywhere (0.0.0.0/0) for quick testing.
- Obtain the connection string and set it as `MONGO_URI` in the Render environment variables. Example:
  - `mongodb+srv://<user>:<password>@cluster0.mongodb.net/gaslink?retryWrites=true&w=majority`

Checklist before deploy
- Replace placeholder keys in `backend/.env` with real credentials (or set them in Render env).
- In Netlify, set `VITE_API_URL` to your Render service URL after the service is created.
- Confirm `frontend/package.json` has `build` script (it uses `vite build`).

Troubleshooting
- If the frontend still calls `localhost`, ensure Netlify env `VITE_API_URL` is set and rebuild the site.
- Check Render logs for backend errors and missing env variables.

Quick automated deploy options

- Option A — I deploy (requires tokens):
  - I can push the repo to GitHub (or use your existing repo), add GitHub Actions secrets, and trigger the workflow to deploy to Netlify and Render.
  - Required secrets (add in GitHub repo Settings → Secrets):
    - `NETLIFY_AUTH_TOKEN` — Netlify personal access token
    - `NETLIFY_SITE_ID` — Netlify site ID
    - `RENDER_API_KEY` — Render API key
    - `RENDER_SERVICE_ID` — Render service id
    - `MONGO_URI` — MongoDB Atlas connection string (or set on Render directly)
    - `JWT_SECRET`, `CLOUDINARY_*`, `MPESA_*`, `AFRICASTALKING_*` — as needed
  - If you want me to run Option A, provide the tokens via a secure channel (do NOT paste tokens into public chat). Alternatively, create the secrets yourself and tell me once they exist and I will trigger the workflow.

- Option B — I walk you through step-by-step:
  - I will guide you to create the Netlify site, Render service, and Atlas cluster, and show exactly where to paste each secret. This is safer if you prefer not to share tokens.

Local test & manual deploy commands

1) Test backend locally:

```bash
cd backend
npm install
cp .env.example .env  # or create .env with your values
npm run server        # runs with nodemon
```

2) Test frontend locally:

```bash
cd frontend
npm install
npm run dev
```

3) Manually deploy frontend to Netlify (using CLI):

```bash
npm i -g netlify-cli
netlify login
netlify deploy --dir=frontend/dist --prod --site YOUR_NETLIFY_SITE_ID
```

4) Manually trigger a Render deploy:

```bash
curl -X POST "https://api.render.com/v1/services/YOUR_RENDER_SERVICE_ID/deploys" \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clearCache":true}'
```

Security reminder
- Never commit `backend/.env` to a public repository. Add it to `.gitignore` (already done).

Which option do you want? If Option A, provide how you'd like to supply tokens (I can wait while you add GitHub secrets, or you can provide them here via a secure channel). If Option B, tell me whether to start with Netlify or Render first.
