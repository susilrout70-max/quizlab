# QuizLab: System Workflow

Version 0.1 · Status: signup and login implemented; other flows are design


## 1. Signup and login
1. User submits the form; `supabase.auth.signUp` sends name, role and optional teacher code as metadata.
2. A trigger on `auth.users` creates the `profiles` row. Role is `student` unless the code matches `app_config`; a wrong code aborts signup.
3. The app loads the profile and routes to `/teacher` or `/student`.

## 2. Teacher: bank and scheduling
1. Teacher adds questions; each insert writes `questions` and `question_keys` together through one RPC so a question never exists without a key.
2. Teacher creates a quiz with a window, duration and blueprint rules.
3. The builder checks bank counts per rule and flags shortages.

## 3. Student: taking a quiz
```
Student clicks Start
  -> rpc start_attempt(quiz)
       window open? no  -> error
       attempt exists?  yes -> return stored paper (refresh-safe)
       otherwise        -> draw per blueprint, snapshot, set deadline = min(now()+duration, ends_at)
  -> UI renders paper, countdown from (deadline_at - server_now)
  -> each choice: rpc save_answer   (rejected if now() >= deadline_at)
  -> Submit: rpc submit_attempt     (grades, stores score)
```
The countdown is cosmetic. When it reaches zero the UI calls `submit_attempt`; if the student is offline or closes the tab, `pg_cron` does it.

## 4. Auto-submit
Every minute `auto_submit_expired()` finds attempts with `now() >= deadline_at` and `submitted_at is null`, grades them, and marks them `auto_submitted`. A student with no saved answers gets a score of 0.

## 5. Results
After submission the student calls `get_attempt_review` for correct answers and explanations. The teacher calls `get_quiz_results` for score lists on their own quizzes.

## 6. Attempt state machine
`in_progress -> submitted` (student) or `in_progress -> auto_submitted` (cron). No transition leaves a final state.

