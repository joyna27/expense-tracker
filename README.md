# Expense Tracker (MEAN Stack)

A full-stack personal expense tracker built with MongoDB, Express.js, Angular, and Node.js. Features JWT authentication, category-wise budgeting with alerts, recurring transactions, and analytics dashboards powered by MongoDB's aggregation pipeline.

## Features
- JWT-based signup/login with hashed passwords (bcrypt)
- Add, edit, delete, and filter income/expense transactions
- Recurring transactions (daily/weekly/monthly) auto-created via a scheduled cron job
- Monthly budgets per category with progress bars and over-budget warnings
- Dashboard with category-wise pie chart and income-vs-expense trend line chart (Chart.js), built on MongoDB aggregation pipelines (`$match`, `$group`, `$sort`)

## Tech Stack
- **Frontend:** Angular 18 (standalone components), Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (MongoDB Atlas)
- **Auth:** JWT + bcrypt

## Project Structure
```
expense-tracker/
├── backend/     → Express API, MongoDB models, routes, cron job
└── frontend/    → Angular application
```

---

## 1. Local Setup

### Prerequisites
- Node.js 18+ and npm
- A free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas/register

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: paste your MongoDB Atlas connection string and set a JWT_SECRET
npm run dev
```
Backend runs on `http://localhost:5000`. Confirm it's alive at `http://localhost:5000/api/health`.

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:4200`. It's already pointed at `http://localhost:5000/api` in `src/environments/environment.ts`.

---

## 2. Deployment Guide

### Step A — MongoDB Atlas (database)
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free M0 cluster.
2. Database Access → add a database user (username + password).
3. Network Access → Add IP Address → Allow Access From Anywhere (`0.0.0.0/0`) — fine for a student project.
4. Click "Connect" → "Drivers" → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker`

### Step B — Backend on Render
1. Push this project to a GitHub repo.
2. Go to https://render.com → New → Web Service → connect your repo.
3. Set **Root Directory** to `backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables (from your `.env`):
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string
   - `CLIENT_URL` = your future Netlify URL (you can update this after Step C)
7. Deploy. Render gives you a URL like `https://expense-tracker-backend.onrender.com`.
8. Confirm it works: visit `https://YOUR-RENDER-URL.onrender.com/api/health`.

### Step C — Frontend on Netlify (or Vercel)
1. Open `frontend/src/environments/environment.prod.ts` and set:
   ```ts
   export const environment = {
     production: true,
     apiUrl: 'https://YOUR-RENDER-URL.onrender.com/api'
   };
   ```
2. Commit and push this change.
3. Go to https://netlify.com → Add new site → Import from Git → select your repo.
4. Set **Base directory** to `frontend`.
5. Build command: `npm run build`
6. Publish directory: `frontend/dist/frontend/browser`
7. Deploy. Netlify gives you a live URL like `https://your-app.netlify.app`.

### Step D — Connect the two
Go back to your Render backend's environment variables and set `CLIENT_URL` to your Netlify URL (e.g. `https://your-app.netlify.app`), then redeploy the backend so CORS allows requests from your live frontend.

### Step E — Test the live app
Visit your Netlify URL, sign up, add a transaction, and confirm the dashboard charts populate.

> Note: Render's free tier spins down after inactivity, so the first request after idle time can take ~30-50 seconds to wake up. This is normal for a free-tier deployment.

---

## API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (auth required) |
| GET/POST | `/api/transactions` | List / create transactions |
| PUT/DELETE | `/api/transactions/:id` | Update / delete a transaction |
| GET | `/api/transactions/analytics/category-breakdown` | Pie chart data |
| GET | `/api/transactions/analytics/monthly-trend` | Line chart data |
| GET | `/api/transactions/analytics/summary` | Income/expense/balance totals |
| POST | `/api/budgets` | Set a category budget |
| GET | `/api/budgets/status` | Budget usage vs limit per category |

## Resume Line
> Built and deployed a full-stack expense tracking application (MEAN stack) with JWT authentication, MongoDB aggregation-based analytics dashboards, automated recurring transactions via scheduled cron jobs, and category budget tracking with usage alerts.
