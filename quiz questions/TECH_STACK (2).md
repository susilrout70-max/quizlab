# QuizLab: Technology Stack

Version 0.1 · Status: frontend toolchain and Supabase Auth in use; pg_cron and hosting arrive in later phases


| Layer | Choice | Why |
|---|---|---|
| UI | React 18 + TypeScript | Typed components, wide ecosystem |
| Build | Vite | Fast dev server, static output |
| Styling | Tailwind CSS 3 | Utility classes, small CSS output |
| Routing | React Router 6 | Simple role-based routes |
| Backend | Supabase | Auth, Postgres, RLS and RPC with no server to run |
| Database | Postgres | Constraints, transactions, row locks, `now()` as trusted clock |
| Scheduling | `pg_cron` | In-database auto-submit with no external worker |
| Client SDK | `@supabase/supabase-js` | Auth session handling and typed queries/RPC |
| Hosting | Vercel, Netlify or Cloudflare Pages | Static SPA; set the two `VITE_` env vars and add an SPA fallback to `index.html` |
| Fonts | Bricolage Grotesque, Public Sans | Distinct headings, readable body |

Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Nothing else is needed in the browser.

