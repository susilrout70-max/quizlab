# QuizLab: Product Requirements Document (PRD)

Version 0.1 · Status: Phase 1 complete, Phase 2 pending approval


## 1. Purpose
QuizLab lets teachers run timed quizzes where every student sits the same quiz in the same time window but receives a different random paper. The server owns time, paper generation and grading, so the browser is never trusted.

## 2. Users
| Role | Goal |
|---|---|
| Teacher | Build a question bank, schedule quizzes, see results. |
| Student | Open a quiz in its window, answer within the time limit, see a score. |

## 3. Goals and non-goals
**Goals:** fair per-student papers, tamper-resistant timing, server-side grading, zero custom backend.
**Non-goals (MVP):** classes/rosters, proctoring, essay questions, images in questions, payments, analytics beyond per-quiz results.

## 4. Functional requirements
| ID | Requirement | Phase |
|---|---|---|
| F1 | Email/password signup and login. Roles: student, teacher. | 1 |
| F2 | Teacher signup requires an invite code. Users cannot change their own role. | 1 |
| F3 | Teachers create, edit, delete questions: topic, difficulty (easy/medium/hard), body, 4 options, one correct answer, explanation. | 2 |
| F4 | Teachers can filter and search their own bank. | 2 |
| F5 | Teachers schedule a quiz: title, start time, end time, duration (minutes), blueprint (list of rules such as 5 x medium x Algebra). | 3 |
| F6 | The builder shows whether the bank can satisfy each blueprint rule. | 3 |
| F7 | Students see quizzes that are open now or upcoming. | 4 |
| F8 | `start_attempt` creates the paper once, stores it, and returns the same paper on refresh. | 4 |
| F9 | Each student gets a different random draw satisfying the blueprint. | 4 |
| F10 | The deadline is `min(started_at + duration, quiz end_time)` using the database clock. | 4 |
| F11 | `save_answer` rejects writes at or after the deadline. | 4 |
| F12 | `submit_attempt` grades on the server and stores the score. | 5 |
| F13 | `pg_cron` auto-submits expired, unsubmitted attempts every minute. | 5 |
| F14 | Students see their score and, after submission, correct answers and explanations for their own paper. | 5 |
| F15 | Teachers see per-quiz results for their own quizzes only. | 5 |

## 5. Non-functional requirements
- **Integrity:** no client-side value can change a deadline, score, role or paper.
- **Idempotency:** refreshing, double-clicking or retrying never creates a second attempt or a second submission.
- **Scale target:** a class of about 500 students starting inside the same minute.
- **Accessibility:** keyboard operable, visible focus, readable on mobile.

## 6. Success criteria
- Two students on the same quiz get different papers; one student refreshing gets the same paper.
- A `save_answer` call after the deadline fails even if the browser clock is changed.
- A student cannot read any correct answer before submission by any API call.
- An expired attempt is graded without the student being online.

## 7. Key decisions
- **Teacher onboarding:** invite code stored in a table unreachable from the API (no admin UI in MVP).
- **Deadline rule:** the attempt deadline is capped by the quiz end time, so late starters get less time rather than overrunning the window.
- **Frozen papers:** attempts store a snapshot of question text and options, so later edits to the bank never change an in-progress or finished paper.

