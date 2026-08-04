# 🚀 Companion Connect — Local Development & Free Deployment Guide

Welcome to the **Companion Connect** setup & deployment guide. This document outlines local setup commands as well as **100% FREE Hosting** instructions on Vercel, Neon PostgreSQL, and Upstash Redis.

---

## 🌐 FREE Cloud Hosting Architecture (Zero Cost)

You can host this entire full-stack enterprise platform online for **$0 / month** using the following free tier services:

| Component | Free Provider | Free Limits | Deployment Link |
|---|---|---|---|
| **Next.js Frontend & APIs** | **Vercel** | Unlimited Deployments & Custom Domain | [vercel.com](https://vercel.com/) |
| **PostgreSQL Database** | **Neon Tech** | 0.5 GB Free Serverless Postgres | [neon.tech](https://neon.tech/) |
| **Redis Cache & Realtime** | **Upstash** | 10,000 requests/day free forever | [upstash.com](https://upstash.com/) |

---

## ⚡ Step-by-Step Free Deployment Guide

### Step 1: Create Free PostgreSQL DB on Neon Tech (2 minutes)
1. Go to **[neon.tech](https://neon.tech/)** and sign up for free using your GitHub account (`Amarnath325`).
2. Click **"Create Project"** -> Name it **`sathi-db`**.
3. Copy the **Connection String** URL (looks like `postgresql://alex:password@ep-cool-db.us-east-2.aws.neon.tech/neondb?sslmode=require`).

---

### Step 2: Push Prisma Database Schema to Neon DB
Open PowerShell in your local project folder (`c:\Users\DELL\Documents\GitHub\sathi`):

```bash
# Set your Neon DB Connection String temporary variable
$env:DATABASE_URL="YOUR_NEON_POSTGRESQL_CONNECTION_STRING"

# Push schema tables to your live online database
npx prisma db push
```

---

### Step 3: Deploy Frontend & APIs on Vercel (3 minutes)
1. Go to **[vercel.com](https://vercel.com/)** and log in with GitHub (`Amarnath325`).
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository: **`Amarnath325/sathi`**.
4. In the **Environment Variables** section, add the following 4 keys:

| Environment Key | Value |
|---|---|
| `DATABASE_URL` | Your Neon PostgreSQL connection URL |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `companion-connect-super-secret-jwt-key-2026` |
| `NEXT_PUBLIC_APP_URL` | `https://sathi.vercel.app` (or your Vercel project name) |

5. Click **"Deploy"**!

🎉 Vercel will build the project in 60 seconds and give you a live HTTPS domain link (e.g. `https://sathi-companion.vercel.app`).

---

## 🛠️ Local Prerequisite Dependencies

| Software / Tool | Minimum Version | Purpose | Download Link |
|---|---|---|---|
| **Node.js** | `v20.x LTS` or higher | JavaScript Runtime | [nodejs.org](https://nodejs.org/) |
| **Git** | `v2.40+` | Version Control | [git-scm.com](https://git-scm.com/) |
| **PostgreSQL** | `v16.x` | Relational Database | [postgresql.org](https://www.postgresql.org/) |

---

## 💻 Local Installation Commands

```bash
# 1. Install Node Packages
npm install --legacy-peer-deps

# 2. Sync Local Database
npx prisma db push

# 3. Start Local Dev Server
npm run dev
```
