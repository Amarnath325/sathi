# 🚀 Companion Connect — Local Development & Setup Documentation Guide

Welcome to the **Companion Connect** enterprise setup guide. This document outlines the exact software dependencies, environment variables, database migrations, and step-by-step commands required to run the full-stack marketplace locally on your computer.

---

## 🛠️ 1. Prerequisite Software Dependencies

Before starting, ensure the following software packages are installed on your computer:

| Software / Tool | Minimum Version | Purpose | Download Link |
|---|---|---|---|
| **Node.js** | `v20.x LTS` or higher | JavaScript Runtime | [nodejs.org](https://nodejs.org/) |
| **Git** | `v2.40+` | Version Control | [git-scm.com](https://git-scm.com/) |
| **PostgreSQL** | `v16.x` | Relational Database | [postgresql.org](https://www.postgresql.org/) |
| **Redis** | `v7.x` | Cache & Real-time Messaging | [redis.io](https://redis.io/) |
| **Docker Desktop** *(Optional)* | `v4.x` | 1-Click Containerized Stack | [docker.com](https://www.docker.com/) |
| **VS Code** *(Recommended)* | Latest | Code Editor | [code.visualstudio.com](https://code.visualstudio.com/) |

> [!TIP]
> **Shortcut via Docker**: If you have **Docker Desktop** installed, you do NOT need to install PostgreSQL or Redis manually on your machine. Running `docker-compose up` will spin up Postgres, Redis, and Next.js automatically!

---

## 🔑 2. Environment Variables Configuration (`.env`)

Create a file named `.env` in the root directory (`c:\Users\DELL\Documents\GitHub\sathi\.env`) and add the following configuration:

```env
# Server & App Environment
NODE_ENV="development"
PORT=3000
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# PostgreSQL Database Connection (Prisma ORM)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sathi_db?schema=public"

# Redis Cache & Socket.IO Engine
REDIS_URL="redis://localhost:6379"

# Authentication & JWT Encryption
JWT_SECRET="companion-connect-super-secret-jwt-key-2026"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_SECRET="companion-connect-refresh-secret-key"

# Payment Gateway Keys (Escrow Sandbox / Mock)
STRIPE_SECRET_KEY="sk_test_mock_stripe_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_mock_stripe_key"
RAZORPAY_KEY_ID="rzp_test_mock_razorpay_key"
RAZORPAY_KEY_SECRET="mock_razorpay_secret"

# AWS S3 Storage & Twilio SMS (Optional Mock)
AWS_S3_BUCKET="companion-connect-storage"
AWS_REGION="us-east-1"
TWILIO_ACCOUNT_SID="mock_twilio_sid"
TWILIO_AUTH_TOKEN="mock_twilio_auth"
```

---

## 💻 3. Step-by-Step Installation Commands

### Option A: Standard Local Setup (Node.js + Postgres)

Open PowerShell / Terminal in the project directory (`c:\Users\DELL\Documents\GitHub\sathi`):

#### Step 1: Install All Node.js Packages
```bash
npm install --legacy-peer-deps
```

#### Step 2: Initialize Database Schema via Prisma ORM
Make sure your local PostgreSQL service is running on port `5432`.
```bash
# Push Prisma Schema models to your PostgreSQL database
npx prisma db push

# Generate Prisma Client Types
npx prisma generate
```

#### Step 3: Seed Demo Database Records
```bash
npm run prisma:seed
```

#### Step 4: Start the Next.js Development Server
```bash
npm run dev
```
🎉 The app will now be live at: **`http://localhost:3000`**

---

### Option B: 1-Click Docker Setup (Containerized)

If you prefer using Docker to run Next.js, PostgreSQL, and Redis together:

```bash
# Build and start all 3 containers (Next.js App + Postgres 16 + Redis 7)
docker-compose up --build
```
> The application will automatically start on `http://localhost:3000`.

---

## 🌐 4. Key Local Routes & Test URLs

| Module / Page | URL | Key Functionality |
|---|---|---|
| **Landing Homepage** | `http://localhost:3000` | Companion hero, categories & search CTA |
| **Companion Search** | `http://localhost:3000/search` | Dynamic companion directory with filters |
| **Companion Profile** | `http://localhost:3000/companion/c1` | Detailed media gallery, rates & KYC badge |
| **Escrow Booking** | `http://localhost:3000/booking/c1` | Dynamic invoice builder & escrow lock |
| **Admin Panel** | `http://localhost:3000/admin` | Full CRUD, Promo Codes, & GST controls |
| **Escrow Wallet** | `http://localhost:3000/wallet` | Cards, UPI & Bank payout withdrawals |
| **Panic SOS System** | `http://localhost:3000/safety` | 1-Tap Emergency Panic button & GPS |
| **Real-time Chat** | `http://localhost:3000/chat` | Encrypted messaging & video call simulator |

---

## 🧪 5. Building for Production

To test the optimized production bundle locally:

```bash
# 1. Build production static bundle
npm run build

# 2. Start production server
npm start
```

---

## ❓ Troubleshooting Common Setup Issues

1. **Port 3000 already in use**:
   Run `npx kill-port 3000` or change `PORT=3001` in your `.env` file.
2. **Prisma DB Connection Error**:
   Ensure PostgreSQL service is started (`net start postgresql-x64-16` on Windows).
3. **Peer Dependency Warnings**:
   Always use `npm install --legacy-peer-deps` to ensure React 19 compatibility.
