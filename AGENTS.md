# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

**STEM Academia** is a bilingual (Russian / Kazakh) e-commerce catalog for school furniture, lab equipment, electronics, and decor — targeting educational institutions in Kazakhstan. It is a monorepo with a FastAPI backend and a React frontend, orchestrated via Docker Compose.

---

## Build & Run Commands

### Frontend (`frontend-stem/`)

```bash
cd frontend-stem
npm install
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # Production build → dist/
npm run lint       # ESLint
npm run preview    # Serve dist/ locally
```

### Backend (`backend-stem/`)

```bash
cd backend-stem
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000              # Dev server
alembic upgrade head                               # Apply migrations
alembic revision --autogenerate -m "description"   # Create new migration
python seed_db.py                                  # Seed initial data (idempotent)
```

### Docker Compose (full stack)

```bash
docker compose up --build
# → http://localhost:80  (Nginx frontend + proxied backend)
# Services: stem_db (Postgres 15), stem_backend (FastAPI), stem_frontend (Nginx+React)
```

---

## Architecture

### Backend — FastAPI (`backend-stem/`)

- **Entry point**: `main.py` — registers routers, CORS middleware, AI chat endpoint, and static file mount for `/uploads`.
- **Database**: `database.py` — SQLAlchemy engine; auto-selects SQLite (local) or PostgreSQL (production) from `DATABASE_URL`. Session via `get_db()` dependency.
- **Models**: `models.py` — `Category`, `Product`, `Order`, `Application`, `User`. Categories link to products via `slug` / `category_slug` (not integer FK for the product→category link).
- **Auth**: `routerss/auth.py` — JWT (7-day expiry, HS256), bcrypt hashing, `OAuth2PasswordBearer`. Token stored in `localStorage` as `stem_access_token`.
- **Admin**: `routerss/admin.py` — all endpoints behind `get_current_admin` dependency (requires `is_admin=True`). Covers products, categories, applications, users.
- **Migrations**: Alembic. The Docker CMD runs `alembic upgrade head && python seed_db.py` before starting uvicorn.
- **External integrations** (all optional, configured via `.env`):
  - Groq AI — `/api/ai/chat` (Llama-based chatbot)
  - Telegram Bot — order/application notifications
  - HuggingFace — AI room visualization
  - Bitrix24 — CRM webhook

### Frontend — React + Vite (`frontend-stem/`)

- **Provider hierarchy** (`main.jsx`): `BrowserRouter → LanguageProvider → UserEmailProvider → AuthProvider → CartProvider → FavoritesProvider → App`.
- **Routing** (`App.jsx`): Admin routes (`/admin/*`) hide the Navbar/Footer. ~50+ product category routes under `/secondpage/`, `/decor/`, `/electro/`, `/equipment/`, `/digital/`.
- **API layer**:
  - `api/api.js` — axios client with JWT interceptor; handles 401 → auto-logout via `window.dispatchEvent('unauthorized')`.
  - `api/adminApi.js` — separate `fetch`-based wrapper for admin endpoints; includes HTML-response detection (catches Nginx SPA fallback bugs).
- **State management**: React Context API only — no Redux/Zustand.
  - `CartContext` — persisted in `localStorage` under `stem_cart`.
  - `FavoritesContext` — requires auth.
  - `AuthContext` — token lifecycle, 401 event listener.
  - `LanguageContext` — `ru` / `kz` toggle.
- **i18n** (`i18n/translations.js`): flat key-value dictionaries for `ru` and `kz`. Accessed via `useLanguage()` hook. Product fields are also bilingual at the DB level (`title_ru`, `title_kz`, `description_ru`, `description_kz`).
- **UI**: Each component has a co-located `.css` file (no CSS modules, no Tailwind). Icons via `lucide-react`.

### Production Deployment (Nginx)

`nginx.conf` is the single source of truth for request routing in Docker:

| Path | Target |
|------|--------|
| `/api/*` | `backend:8000` |
| `/auth/*` | `backend:8000` |
| `/admin/products`, `/admin/categories`, `/admin/applications`, `/admin/users`, `/admin/me` | `backend:8000` |
| `/uploads/*` | `backend:8000` (cached 7d) |
| Everything else | `index.html` (SPA fallback) |

> Nginx admin proxy uses **per-path location blocks** (not a single `/admin/`) so that browser navigation to `/admin` or `/admin/login` still falls through to the SPA catch-all.

### Local Dev Proxy (Vite)

`vite.config.js` proxies `/api`, `/auth`, `/admin`, and `/backend-api` to `http://stem_backend:8000`. When running the frontend standalone (without Docker), set `VITE_API_URL=http://localhost:8000` in `frontend-stem/.env`.

---

## Environment Variables

**Backend** (`backend-stem/.env`):

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Postgres or SQLite connection string |
| `SECRET_KEY` | Yes | JWT signing key |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | No | Auto-seeded admin user on startup |
| `DB_SSLMODE` | No | `require` / `prefer` / `disable` for Postgres SSL |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_GROUP_CHAT_ID` | No | Order notifications |
| `GROQ_API_KEY` | No | AI chatbot |
| `HF_TOKEN` | No | AI visualization |
| `BITRIX_WEBHOOK_URL` | No | CRM integration |

**Frontend** (`frontend-stem/.env`):

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Backend base URL. `""` in Docker (relative paths via Nginx), `http://localhost:8000` for local dev |
| `VITE_API_URL_BACKEND` | Override that takes priority over `VITE_API_URL` |

---

## Key Conventions

- **Admin bootstrap**: After migrations, `seed_db.py` auto-creates an admin user if `ADMIN_EMAIL`/`ADMIN_PASSWORD` are set. Alternatively, promote an existing user via the Docker exec snippet documented in `routerss/admin.py`.
- **Product images**: uploaded to `/app/uploads/`, served at `/uploads/<filename>`, persisted via Docker volume `uploads_data`.
- **Bilingual DB fields**: `Category` and `Product` store `_ru` / `_kz` columns; the frontend picks the correct one based on the active language context.
- **Cart persistence**: fully client-side in `localStorage` (`stem_cart`), no backend cart table.
- **No tests** are currently configured in the project.
