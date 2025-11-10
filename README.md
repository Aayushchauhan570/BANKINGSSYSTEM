# Banking System

A simple full‑stack Banking System — Express + MySQL backend and React + Vite frontend.

This repository is a small demo banking application with user registration/login, account management, and transactions (deposit, withdraw, transfer). It's intended for learning, prototyping, or as a base for a more production-ready system.

---

## Quick links
- Backend: `/Backend`
- Frontend: `/Frontend`
- Setup guide: `SETUP_INSTRUCTIONS.md`
- Audit & changes: `AUDIT_REPORT.md`, `CHANGES_SUMMARY.md`

---

## Features
- User registration & login (JWT)
- Password hashing with bcrypt
- Accounts per user (default Savings account on register)
- Deposit, withdraw and transfer transactions
- Transaction history per account
- Database-level transactions and row locks for safety
- Frontend SPA built with React + Vite

---

## Tech stack
- Node.js, Express
- MySQL (mysql2)
- React, Vite, axios, react-router-dom
- bcryptjs, jsonwebtoken

---

## Prerequisites
- Node.js v14+ and npm
- MySQL server (or Docker) running locally

---

## Quick start (development)

1. Clone the repository

```bash
git clone https://github.com/Aayushchauhan570/BANKINGSSYSTEM.git
cd BANKINGSSYSTEM
```

2. Install dependencies (root script will install both backend & frontend packages):

```bash
npm run dev
```

Or install manually per service:

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd Frontend
npm install
```

3. Configure database credentials in `/Backend/.env` (example):

```properties
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=banking_db
JWT_SECRET=supersecretkey
```

4. Make sure MySQL is running and create the database (if required):

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS banking_db;"
```

5. Start Backend and Frontend in two terminals:

```bash
# Terminal 1
cd Backend
npm start

# Terminal 2
cd Frontend
npm run dev
```

Open the frontend: `http://localhost:5173` (Vite may switch ports if 5173 is busy).

---

## API (summary)
Base URL: `http://localhost:5000/api`

Auth
- POST `/auth/register` — register user
- POST `/auth/login` — login user

Accounts (auth)
- GET `/accounts` — list a user's accounts
- GET `/accounts/:id` — specific account

Transactions (auth)
- POST `/transactions/deposit` — deposit
- POST `/transactions/withdraw` — withdraw
- POST `/transactions/transfer` — transfer between accounts
- GET `/transactions/account/:accountId` — transaction history

---

## Notes & next steps
- The backend currently auto-creates tables on startup for development. For production, replace with proper migrations.
- Improve validation and add tests (Jest/Supertest).
- Add CI (GitHub Actions) and consider security hardening before production.

---

## License
Add a LICENSE file if you want to publish this repository under a specific license.

---

If you want, I can:
- Add a `README` badge grid (build, license, etc.)
- Add a GitHub Actions workflow to run lint/tests
- Create a small `.env.example` file

Tell me which of the above you'd like next.