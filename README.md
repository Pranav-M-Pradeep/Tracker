# Tracker.

A beautiful, secure **Daily Planner & Expense Tracker** built with Next.js 14, Prisma, and NextAuth.

## Features

- 📅 **Daily Planner** — Add, complete, and delete daily tasks with smooth animations
- 💸 **Expense Tracker** — Track income & expenses by month with category breakdowns
- 📊 **Monthly Summaries** — Total income, total expenses, and net balance per month
- 📄 **PDF Export** — Download a financial summary for any month
- 🔐 **Secure Auth** — Email/password login with bcrypt hashing and JWT sessions
- 📱 **3-Device Limit** — Automatically revokes oldest session when a 4th device logs in
- ✏️ **Edit & Delete** — Full CRUD on all transactions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas via Prisma ORM
- **Auth**: NextAuth.js (JWT strategy)
- **Styling**: Vanilla CSS Modules
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Export**: jsPDF + jspdf-autotable

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/Pranav-M-Pradeep/Tracker.git
cd Tracker
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your MongoDB Atlas connection string and a NextAuth secret.

> **Free MongoDB**: Sign up at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) — M0 free tier (512MB)

### 3. Push the database schema

```bash
npx prisma db push
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and register an account.

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel Dashboard](https://vercel.com/new)
3. Add the following **Environment Variables** in Vercel:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate |
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://tracker.vercel.app`) |

4. Click **Deploy** — Vercel will run `npm run build` automatically

### Recommended free database: MongoDB Atlas

1. Sign up at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a **free M0 cluster**
3. Add `0.0.0.0/0` to IP allowlist (Network Access)
4. Click **Connect → Drivers** and copy the connection string
5. Replace `<password>` with your actual password and set as `DATABASE_URL`

---

## License

MIT
