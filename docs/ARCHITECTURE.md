# QuizLab: Technical Architecture

Version 0.1 · Status: Phase 1 implemented; later phases are design


## 1. Overview
```
Browser (React SPA, static hosting)
   |  supabase-js  (anon key + user JWT)
   v
Supabase
 |- Auth (JWT, auth.users)
 |- PostgREST  -> tables guarded by RLS
 |             -> RPC: SQL functions (start_attempt, save_answer, submit_attempt, ...)
 |- Postgres   -> tables, constraints, triggers, SECURITY DEFINER functions
 '- pg_cron    -> auto_submit_expired() every minute
```
There is no application server. All trusted logic lives in Postgres.

## 2. Data model
| Table | Purpose | Who can touch it |
|---|---|---|
| `profiles` | id, full_name, role | Own row: read; update full_name only |
| `app_config` | server secrets (teacher invite code) | Nobody via API |
| `questions` | teacher_id, topic, difficulty, body, options (4) | Owner teacher only. Students never read it directly |
| `question_keys` | question_id, correct_option, explanation | Owner teacher only |
| `quizzes` | teacher_id, title, starts_at, ends_at, duration_minutes | Owner teacher: all. Students: through functions |
| `quiz_blueprint_rules` | quiz_id, topic, difficulty, count | Owner teacher only |
| `attempts` | quiz_id, student_id, started_at, deadline_at, submitted_at, score, status | Student reads own row; writes only via functions |
| `attempt_questions` | attempt_id, position, question snapshot (no key) | Student reads own paper; writes only via functions |
| `attempt_answers` | attempt_id, question_id, selected_option, saved_at | Written only through `save_answer` |

Constraints: `unique (quiz_id, student_id)` on `attempts`; `check (ends_at > starts_at)`; `check (difficulty in ('easy','medium','hard'))`; `check (selected_option between 1 and 4)`; `check (count > 0)`.

## 3. Server functions (RPC)
All are `SECURITY DEFINER` with `set search_path = ''`, `execute` revoked from `public`/`anon`, granted to `authenticated`, and they identify the caller with `auth.uid()` (never a parameter).

| Function | Behaviour |
|---|---|
| `start_attempt(quiz_id)` | Checks role and that `now()` is inside the window. Inserts the attempt (`on conflict do nothing`), and if new, draws questions per blueprint with `order by random()`, snapshots them, sets `deadline_at`. Returns the paper without keys. |
| `get_attempt(attempt_id)` | Returns the stored paper, saved answers and `deadline_at`, plus `server_now` for the countdown display. |
| `save_answer(attempt_id, question_id, option)` | Verifies ownership, `submitted_at is null` and `now() < deadline_at`. Upserts the answer. |
| `submit_attempt(attempt_id)` | Locks the row (`for update`), grades against `question_keys`, writes score, sets `submitted_at`. Idempotent. |
| `auto_submit_expired()` | Runs the same grading for every attempt where `now() >= deadline_at` and not submitted. Scheduled with `pg_cron`. |
| `get_attempt_review(attempt_id)` | After submission only: returns correct options and explanations for that student's paper. |
| `get_quiz_results(quiz_id)` | Teacher-only, for quizzes they own. |

## 4. Paper generation
For each blueprint rule, select `count` random questions matching topic and difficulty from the quiz owner's bank, excluding duplicates across rules, then shuffle the final order. If the bank has too few questions for a rule, `start_attempt` fails with a clear error; the builder warns about this earlier (F6). Randomness is per attempt, so two students almost always differ when the pool is larger than the draw.

## 5. Frontend structure
```
src/
  lib/        supabase client, shared types
  auth/       AuthContext (session + profile)
  components/ AppShell, AuthLayout, ProtectedRoute
  pages/      Login, Signup, TeacherDashboard, StudentDashboard (more per phase)
supabase/migrations/   numbered SQL files, one or more per phase
```
Route guards only steer navigation. They are not a security boundary.

