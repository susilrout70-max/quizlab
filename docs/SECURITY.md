# QuizLab: Security Architecture

Version 0.1 · Status: profiles, role lock and teacher invite code implemented; other controls are design


## 1. Principles
1. The browser is untrusted. Time, identity, role, paper and score come from the database.
2. Deny by default. RLS is enabled on every table; privileges are revoked and granted back narrowly.
3. Secrets of the exam (keys, explanations) live in tables students have no path to.
4. Writes that need business rules go through functions, not direct table access.

## 2. Threats and controls
| Threat | Control |
|---|---|
| Student reads correct answers | `question_keys` has policies for the owner teacher only; students get keys only from `get_attempt_review` after submission. Papers are snapshots without keys. |
| Student changes own role | `grant update (full_name)` only; `role` is not updatable. |
| Anyone signs up as teacher | Trigger requires a secret invite code from `app_config`, which has RLS on, no policies and no grants. |
| Student changes device clock | Deadline and window checks use `now()` in Postgres. The client clock is never sent. |
| Student keeps answering after time | `save_answer` checks `now() < deadline_at` on every call. |
| Student opens many attempts / re-rolls paper | `unique (quiz_id, student_id)` plus `on conflict do nothing`; the paper is stored once. |
| Student grades themselves | Score is written only by `submit_attempt` / cron; `attempts` has no client write grants. |
| Teacher reads another teacher's data | Every teacher policy is `teacher_id = (select auth.uid())`; functions re-check ownership. |
| Student passes another student's attempt id | Functions filter by `student_id = auth.uid()`. |
| Role confusion inside functions | Role is read from `profiles`, never from the JWT metadata users can edit. |
| Function abuse / privilege escalation | `SECURITY DEFINER` with `set search_path = ''`, fully qualified names, `execute` revoked from `public` and `anon`. |
| Leaked anon key | It is public by design; RLS and function checks are what protect data. The service-role key is never used in the app. |
| Race on submit and cron | `select ... for update` on the attempt row; grading is idempotent. |

## 3. Checklist before launch
- RLS enabled on every `public` table (query `pg_tables.rowsecurity`).
- Test as `anon` and as a student: `select` on `question_keys`, `app_config`, other users' attempts returns nothing or an error.
- Default teacher invite code changed.
- Email confirmation on in production; password minimum length set in Auth settings.
- Service-role key absent from the frontend bundle and env.
- Auth redirect URLs limited to the production domain.

