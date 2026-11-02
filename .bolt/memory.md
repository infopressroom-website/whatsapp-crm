# Project memory

## Product intent & audience

- CRM-style dashboard app with contacts, campaigns, chat, and admin/owner roles
- Demo mode for client demonstrations — no real database/auth setup required yet
- Goal: show full dashboard experience to clients without backend complexity

## Brand personality & voice

- Communicates with user in Roman Urdu/Hindi (e.g., "isma jo demo login system karna ha")
- Technical responses mixed Roman Urdu + English — maintain this pattern

## Visual design & UX direction

- Login screen with demo account quick-select cards (Owner + Admin roles)
- Topbar with profile menu containing Sign Out action
- Dashboard layout with pre-seeded demo data (contacts, campaigns, chat views)
- Full production-quality UI expected per `.bolt/prompt`

## Decisions, constraints & rationale

- **Auth approach:** Client-side only — hardcoded demo credentials, no Supabase auth calls
  - Rationale: client demo without database setup
- **Session persistence:** `localStorage` for login state (survives refresh)
- **Demo accounts:** Riya Sharma (Owner), Admin User (Admin) — one-click login
- **Sign Up tab:** Creates new local account → auto-login
- **Data source:** Still Supabase pre-seeded demo workspace for contacts/campaigns/chat
  - New data added by client goes to same demo workspace (not isolated)
- **Tech constraints (from `.bolt/prompt`):** Vite + React + JSX, Tailwind, lucide-react icons, `@/` path alias → `src/`
- **No new packages** unless explicitly requested

## Open questions & assumptions

- **Read-only demo?** Client may want new data to NOT persist — could switch hooks to pure mock data instead of Supabase
- **Production auth:** No plan yet for real database/user accounts — demo auth is temporary
- **Supabase dependency:** Demo data still requires Supabase anon key to function; full offline mode not yet built
- Assumption: client only needs to view existing data, not test create/edit flows extensively