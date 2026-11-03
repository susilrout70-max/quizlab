# QuizLab — Project Quick Reference & Defense Cheat Sheet

A concise reference guide to help you quickly review key concepts, terminology, system design, and technical decisions before your presentation.

---

## 1. Project At A Glance

- **Project Name**: QuizLab
- **Tagline**: Fair, Server-Timed Quizzes with Dynamic AI Blueprints & Anti-Cheat Engine
- **Primary Objective**: Eliminate online quiz cheating (clock tampering & answer sharing) while providing adaptive AI study tutoring.
- **Target Users**: College students, teachers/professors, campus placement candidates, and competitive exam test-takers.
- **Repository URL**: `https://github.com/susilrout70-max/quizlab.git` (branch: `main`)
- **Hosting / Deploy**: Vercel multi-service monorepo (`vercel.json`) connected to Neon PostgreSQL.

---

## 2. Verified Technology Stack

| Layer | Technologies Used | Purpose in QuizLab |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript | Fast SPA (Single Page Application) rendering & component state. |
| **Styling & UI** | Tailwind CSS v3.4, Lucide React | Modern responsive design, mobile safe-insets, dual-theme styling. |
| **State & Theming** | Custom `AuthContext` & `ThemeContext` | Global user session management and zero-FOUC Light/Dark/System modes. |
| **Backend API** | Node.js, Express, TypeScript | REST API endpoints for auth, quiz runner, grading, and AI proxy. |
| **Runtime & Dev** | TSX, Concurrently | Hot-reloading server and single-command monorepo startup (`npm run dev`). |
| **Validation** | Zod | Server-side schema validation for logins, signups, and answers. |
| **Database** | Neon Serverless PostgreSQL | Relational storage for users, attempts, questions, and timing timestamps. |
| **Security** | Bcrypt.js, JSON Web Tokens (JWT) | Password hashing (salt rounds: 10) and stateless 7-day auth sessions. |
| **AI Integration** | Google Gemini 2.5 REST API | Dynamic question synthesis across 40+ subjects and study chatbot. |

---

## 3. The 4 Core Architectural Pillars

1. **Server-Owned Timing Engine**:
   - The expiration time (`expires_at`) is written to PostgreSQL upon test creation.
   - When answers are submitted, the database compares the submission time to `expires_at`.
   - Browser clock manipulation or pausing JavaScript in DevTools cannot alter the server clock.

2. **AI Question Synthesis (Gemini 2.5)**:
   - Dynamic prompt templates generate 4-option multiple-choice questions with targeted distractors and code snippets.
   - Prevents question leakage; each session gets a fresh, randomized assessment.

3. **Granular Gap Analysis & Reattempt Support**:
   - Submissions receive instant grading with conceptual explanations for each incorrect answer.
   - A dedicated `/reattempt/:id` endpoint lets students re-test the exact same questions to reinforce learning.

4. **10/10 Mobile-First & Dual-Theme Experience**:
   - Tested across viewports from $360\text{px}$ to $1920\text{px}$.
   - Features a sticky bottom thumb bar during tests so navigation buttons are within easy reach.
   - Mobile slide-out drawer replaces cramped navigation bars.

---

## 4. Key Terminology You Must Know (Viva Preparation)

- **Monorepo**: A single repository holding both the frontend (`client/`) and backend (`server/`) with shared root orchestration scripts (`npm run dev`).
- **Server-Authoritative**: The design philosophy where the backend server holds the ultimate truth regarding state (time, grading, authentication) rather than trusting client browser input.
- **Reverse Proxy**: Vite's local dev proxy that automatically forwards requests from `http://localhost:3000/api/*` to `http://localhost:5000/api/*`, eliminating CORS issues during development.
- **Connection Pooling (`-pooler`)**: Neon's connection manager that multiplexes database connections, preventing PostgreSQL from running out of connections when serverless instances spin up.
- **FOUC (Flash of Unstyled Content)**: A brief flash of white on page load before dark mode styles load. QuizLab prevents this with an inline pre-render script in `index.html`.
- **JWT (JSON Web Token)**: A compact, digitally signed token sent in the `Authorization: Bearer <token>` header to authenticate API requests without storing server sessions in memory.
- **ACID Transactions**: Atomicity, Consistency, Isolation, and Durability guarantees provided by PostgreSQL to ensure quiz attempts and score updates are safely recorded without data corruption.

---

## 5. Important Project Files & Structure

```text
quiz questions/
├── client/                     # React 18 + Vite SPA Frontend
│   ├── src/pages/Landing.tsx   # SaaS landing page with interactive demo card
│   ├── src/pages/Dashboard.tsx # Subject explorer & exam launcher
│   ├── src/pages/QuizRunner.tsx# Test runner with sticky timer & bottom thumb bar
│   ├── src/pages/QuizReview.tsx# Granular review & explanations
│   ├── src/context/ThemeContext.tsx # Dual-theme manager (Light, Dark, System)
│   └── vite.config.ts          # Reverse proxy config for /api
├── server/                     # Express + TypeScript Backend API
│   ├── src/index.ts            # Express server initialization (port 5000)
│   ├── src/routes/ai.routes.ts # Gemini AI question generation & tutor chatbot
│   ├── src/controllers/quiz.controller.ts # Exam timer, scoring & reattempt logic
│   └── src/db/index.ts         # Neon PostgreSQL pooled connection
├── docs/                       # Specifications (Architecture, PRD, Security)
├── vercel.json                 # Vercel multi-service routing config
├── package.json                # Root orchestration scripts (concurrently)
├── Project_Presentation.pptx   # 5-Slide finished presentation deck
├── Presentation_Script.md      # Slide-by-slide student speaking notes
└── Project_Quick_Reference.md  # This reference guide
```

---

## 6. How to Run the Project (Demo Commands)

Start both Frontend and Backend concurrently with one command:
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:5000](http://localhost:5000)
- **Healthcheck**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Production Build Check**: `npm run build`
