# QuizLab (with Neon DB)

Fair, server-timed quizzes where every student receives a different random paper satisfying a teacher's blueprint. The server owns time, paper generation, and grading.

---

## Current Status: Phase 1 Complete (Auth & Roles on Neon DB)

- [x] **Phase 1: Neon DB Foundation & Auth System** (Completed)
  - Neon DB PostgreSQL connection & migration runner (`_migrations` table)
  - Secure schema: `users`, `app_config` (secret teacher invite code)
  - JWT Authentication & bcrypt password hashing
  - Teacher signup guard (requires valid invite code: `QUIZLAB_TEACHER_2026`)
  - React 18 + Vite + Tailwind CSS frontend with `AuthContext`
  - Role-protected routes (`/teacher`, `/student`)
- [ ] **Phase 2: Question Bank Management** (Up next)
- [ ] **Phase 3: Quiz Scheduling & Blueprint Builder**
- [ ] **Phase 4: Student Exam Experience & Timing Engine**
- [ ] **Phase 5: Auto-Grading, Auto-Submit & Results Review**

---

## Quick Start

### 1. Configure Neon DB Connection String
Open `server/.env` and replace `DATABASE_URL` with your Neon DB connection string:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=quizlab_super_secret_jwt_key_2026
```

### 2. Run Database Migrations
Run the migration script to create tables and seed the teacher invite code in your Neon database:
```bash
npm run db:migrate
```

### 3. Start Development Servers
Start backend API and frontend concurrently:
```bash
# Terminal 1 (Backend):
npm run server:dev

# Terminal 2 (Frontend):
npm run client:dev
```
- Frontend will open at `http://localhost:3000`
- Backend API will run at `http://localhost:5000` (Healthcheck: `http://localhost:5000/api/health`)

---

## Default Development Credentials
- **Teacher Invite Code**: `QUIZLAB_TEACHER_2026` (stored in `app_config`)
