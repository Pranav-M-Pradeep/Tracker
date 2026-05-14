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
- **Database**: PostgreSQL via Prisma ORM
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

Fill in `.env` with your PostgreSQL credentials and a NextAuth secret.

> **Free PostgreSQL options**: [Neon](https://neon.tech) · [Supabase](https://supabase.com) · [Railway](https://railway.app)

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
| `DATABASE_URL` | Your PostgreSQL pooled connection URL |
| `DIRECT_URL` | Your PostgreSQL direct (non-pooled) URL |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate |
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://tracker.vercel.app`) |

4. Click **Deploy** — Vercel will run `npm run build` automatically

### Recommended free database: Neon

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project and copy the **Pooled connection string** → set as `DATABASE_URL`
3. Copy the **Direct connection string** → set as `DIRECT_URL`

---

## License

MIT
