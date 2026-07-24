# RenewCred CMS — Frontend Engineering Assignment

A production-shaped, headless CMS: an authenticated **Admin Panel** for managing block-based
page content, and a **Public Website** that renders that content entirely from the API — no
hardcoded copy anywhere on the public site.

## 1. Overview

| Piece | Tech | Purpose |
|---|---|---|
| `backend/` | Express + MongoDB/Mongoose, JWT, Zod | REST API: auth, page CRUD, public reads |
| `admin-frontend/` | React (Vite) + Redux Toolkit + Tailwind | Authenticated CMS dashboard |
| `public-frontend/` | Next.js (App Router) + Redux Toolkit + Tailwind + KaTeX | Public site, server-rendered from the API |

## 2. Assumptions

The task said to document assumptions explicitly — here are the ones that shaped this build:

- **Figma design**: the linked file requires a logged-in Figma session; `web_fetch` could only
  retrieve page metadata, not the actual frames. Rather than guess at pixel-level spacing, the
  public site uses an original, clean layout for a renewable-energy-credits company
  ("RenewCred", inferred from the reference doc's Google Drive link name) — polished and
  responsive, but not a pixel-match to a design I couldn't see. If you can re-share the Figma as
  exported images or a public link, the visual layer is isolated enough (`components/blocks/*` in
  `public-frontend`) to restyle without touching data flow.
- **Database**: MongoDB, as suggested by the reference doc, for schema flexibility with the
  block-based content model (`Mixed`-typed `data` field validated per-type at the API boundary
  with Zod rather than in Mongoose).
- **Rich text**: block `richtext` type stores a small allow-listed HTML subset (`<b> <i> <a>
  <br>`) rather than integrating full TipTap. TipTap is the right call for a real CMS UI, but a
  full editor integration (extensions, JSON schema, sanitization pipeline) was much larger than
  this assignment's block-authoring needs — the block/data/order model TipTap would also produce
  is already what's implemented, so swapping in TipTap later only touches the `richtext` block's
  admin editor component, not the schema, API, or public renderer.
- **Auth**: JWT access + refresh tokens. Refresh tokens are stored server-side as bcrypt hashes
  and rotated on every use, so a stolen refresh token is single-use.
- **Media uploads**: modeled (`Media` collection) but the assignment's content (text, lists,
  tables, equations) didn't need binary file upload to demonstrate the CMS pattern, so blocks
  reference image URLs directly rather than wiring a full upload pipeline (local disk vs. S3 is
  a deployment choice, not an architecture one — `Media.url` is storage-agnostic).
- **Single admin role for now**: `Admin.role` supports `admin` / `editor` and routes already
  accept a `requireRole()` middleware, but only one seeded role is used — enough headroom to add
  editor-vs-admin permission splits without a schema change.

## 3. Architecture

```
Browser (public) → Next.js (SSR/RSC, cached fetch) → Express API → MongoDB
Browser (admin)  → React SPA (Vite) → Redux (auth + pages) → Express API → MongoDB
```

- **Block-based content model**: a `Page` has an ordered array of `Block`s (`type`, `data`,
  `order`, `metadata`). This is what lets one schema represent headers, paragraphs, nested lists,
  tables, LaTeX equations, images, quotes, code, and CTAs without a fixed page template — adding
  a new block type is additive (new type + admin form + renderer component), not a schema
  migration.
- **Nested lists**: `data.items` on a `list` block is a recursive `{ text, children[] }`
  structure, mirrored on both the Mongoose schema and the admin's `ListItemEditor` (which renders
  itself recursively), so nesting depth is unbounded without special-casing.
- **Redux boundaries** (the assignment calls this out as something being evaluated):
  - **Admin**: `authSlice` (tokens/session) and `pagesSlice` (server-fetched page list/detail —
    genuinely shared across Dashboard, PagesList, and PageEditor) are in Redux. Form field values
    while editing a page are **not** — they're `useState` in `PageEditorPage`, only dispatched to
    Redux on Save, so typing in a title field doesn't spam the store.
  - **Public site**: content is fetched server-side (Server Components + Next's fetch cache), so
    it never touches client Redux at all. The only client state is `mobileNavOpen` — genuinely
    global-but-client-only UI state, which is the one thing Redux is actually for here.
- **Response envelope**: every API response is `{ success, message, data }`, enforced by a small
  `ApiResponse` class rather than ad hoc `res.json()` calls per controller.
- **Errors**: every deliberate error is thrown as `ApiError` (with a status code) and caught by
  one central error middleware — controllers never format error responses themselves.

## 4. Folder Structure

```
cms-assignment/
├── docker-compose.yml
├── .env.example
├── backend/
│   └── src/{config,controllers,middleware,models,routes,utils,validations}/
├── admin-frontend/
│   └── src/{components,components/blocks,pages,store/slices,utils}/
└── public-frontend/
    └── src/{app,components,components/blocks,lib,store}/
```

## 5. Setup & Run

### Option A — Docker Compose (recommended)

```bash
git clone <your-repo-url> && cd cms-assignment
cp backend/.env.example backend/.env
docker compose up --build
# then seed the database (admin login + a demo "home" page)
docker compose exec backend npm run seed
```

- Public site: http://localhost:3000
- Admin panel: http://localhost:5173
- API: http://localhost:5000/api/v1 (health check: `/health`)

### Option B — Local dev (three terminals)

```bash
# 1. Backend
cd backend && cp .env.example .env && npm install
# start a local MongoDB, or point MONGO_URI in .env at Atlas/Docker mongo
npm run seed
npm run dev

# 2. Admin
cd admin-frontend && cp .env.example .env && npm install && npm run dev

# 3. Public site
cd public-frontend && cp .env.example .env && npm install && npm run dev
```

## 6. Seeded credentials (for evaluation)

```
Email:    admin@renewcred.com
Password: Admin@12345
```

Change `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `backend/.env` before seeding a real
deployment.

## 7. Environment Variables

See `.env.example` at the repo root (aggregated) and inside each service folder (authoritative).
Key ones: `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`,
`VITE_API_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`.

## 8. API Reference

Base URL: `/api/v1`. All responses: `{ success, message, data }`.

**Auth**
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | – | `{ email, password }` → access + refresh tokens |
| POST | `/auth/refresh` | – | `{ refreshToken }` → rotated token pair |
| POST | `/auth/logout` | Bearer | Invalidates the stored refresh token |
| GET | `/auth/me` | Bearer | Current admin profile |

**Pages (admin)**
| Method | Path | Description |
|---|---|---|
| GET | `/pages?page=&limit=&status=&search=` | Paginated list, any status |
| GET | `/pages/:id` | Full page incl. blocks |
| POST | `/pages` | Create (`title`, `slug`, `blocks[]`, `status`, `seo`) |
| PUT | `/pages/:id` | Update |
| PATCH | `/pages/:id/status` | `{ status: "draft" \| "published" }` |
| DELETE | `/pages/:id` | Delete |

**Public (unauthenticated, published-only)**
| Method | Path | Description |
|---|---|---|
| GET | `/public/pages` | List published pages |
| GET | `/public/pages/:slug` | One published page by slug |
| GET | `/public/settings` | Site nav/footer/contact |

**Settings (admin)** — `GET/PUT /settings`
**Dashboard (admin)** — `GET /dashboard/stats`

## 9. Security

Helmet, CORS allow-list, rate limiting (global + stricter on `/auth/login`), Zod request
validation, bcrypt password + refresh-token hashing, JWT with short-lived access tokens and
rotated refresh tokens, centralized error handling that never leaks stack traces to clients.

## 10. Deployment

The three Dockerfiles are production-oriented (multi-stage builds for both frontends, `npm ci`
would replace `npm install` once a lockfile is committed). For a real deployment: put the backend
behind a reverse proxy/TLS terminator, point `MONGO_URI` at a managed Mongo (Atlas), set real JWT
secrets, and set `CORS_ORIGIN` to the actual public domains.

## 11. Future Improvements

- Full TipTap integration for the `richtext` block (see Assumptions)
- Real media upload pipeline (S3/Cloudinary) behind the existing `Media` model
- Editor/Admin role split using the existing `requireRole()` middleware
- Optimistic UI updates in the admin page list
- E2E tests (Playwright) for the login → create → publish → public-render flow
