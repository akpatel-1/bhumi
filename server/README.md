# Bhumi — Backend

A blockchain-anchored land registry system for Chhattisgarh built on Node.js, TypeScript, Express 5, PostgreSQL, and Redis. The backend provides tamper-evident land ownership records using an internal SHA-256 hash chain stored in PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js with TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL (via `pg`) |
| Cache / OTP Store | Upstash Redis |
| File Storage | Cloudflare R2 (via AWS S3 SDK) |
| Auth | JWT (access token) + Refresh token (PostgreSQL) + OTP (Redis) |
| Password Hashing | Argon2 |
| Email | Resend |
| Validation | Zod |
| Package Manager | pnpm |
| Dev Server | `tsx watch` |

---

## Project Structure

```
server 
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── app.ts
│   ├── config
│   │   └── env.ts
│   ├── index.ts
│   ├── infra
│   │   ├── db
│   │   │   ├── db.ts
│   │   │   └── schema.sql
│   │   ├── email
│   │   │   ├── email.ts
│   │   │   └── template
│   │   │       └── otp-template.ts
│   │   ├── r2
│   │   │   └── r2.ts
│   │   └── redis
│   │       └── redis.ts
│   ├── modules
│   │   ├── admin
│   │   │   ├── auth
│   │   │   │   └── admin-auth.routes.ts
│   │   │   └── registrars
│   │   │       ├── registrar.schema.ts
│   │   │       ├── registrars.controller.ts
│   │   │       ├── registrars.repository.ts
│   │   │       ├── registrars.routes.ts
│   │   │       └── registrars.service.ts
│   │   ├── error-config.ts
│   │   ├── error-handler-middleware.ts
│   │   ├── registrar
│   │   │   ├── auth
│   │   │   │   └── registrar-auth.routes.ts
│   │   │   └── verification
│   │   │       └── kyc
│   │   │           ├── registrar-kyc.controller.ts
│   │   │           ├── registrar-kyc.repository.ts
│   │   │           ├── registrar-kyc.routes.ts
│   │   │           ├── registrar-kyc.schema.ts
│   │   │           └── registrar-kyc.service.ts
│   │   ├── schema-validator.ts
│   │   ├── shared
│   │   │   └── land
│   │   │       ├── land.controller.ts
│   │   │       ├── land.model.ts
│   │   │       ├── land.repository.ts
│   │   │       ├── land.schema.ts
│   │   │       └── land.service.ts
│   │   └── user
│   │       ├── auth
│   │       │   ├── user-auth.config.ts
│   │       │   ├── user-auth.controller.ts
│   │       │   ├── user-auth.helper.ts
│   │       │   ├── user-auth.mailer.ts
│   │       │   ├── user-auth.redis.ts
│   │       │   ├── user-auth.repository.ts
│   │       │   ├── user-auth.routes.ts
│   │       │   ├── user-auth.schema.ts
│   │       │   └── user-auth.services.ts
│   │       ├── file-upload.middleware.ts
│   │       ├── kyc
│   │       │   ├── user-kyc.controller.ts
│   │       │   ├── user-kyc-middleware.ts
│   │       │   ├── user-kyc.repository.ts
│   │       │   ├── user-kyc.routes.ts
│   │       │   ├── user-kyc.schema.ts
│   │       │   └── user-kyc.service.ts
│   │       ├── land
│   │       │   ├── user-land.controller.ts
│   │       │   └── user-land.routes.ts
│   │       ├── profile
│   │       │   ├── user-profile.controller.ts
│   │       │   ├── user-profile.repository.ts
│   │       │   ├── user-profile.routes.ts
│   │       │   └── user-profile.services.ts
│   │       └── session
│   │           └── user-session.middleware.ts
│   ├── server.ts
│   ├── shared
│   │   ├── auth
│   │   │   ├── auth.config.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.repository.ts
│   │   │   ├── auth.schema.ts
│   │   │   └── auth.services.ts
│   │   └── session
│   │       ├── session.config.ts
│   │       ├── session.redis.ts
│   │       └── session-validation.middleware.ts
│   ├── types
│   │   └── expres.d.ts
│   └── utils
│       ├── api-error.ts
│       ├── auth-handler.ts
│       ├── r2-services.ts
│       ├── response-helper.ts
│       └── transaction.ts
└── tsconfig.json

62 directories, 70 files
```

Each feature follows a strict four-layer pattern:

```
.routes.ts  →  .controller.ts  →  .service.ts  →  .repository.ts
```

---

## Database Schema

### Core Tables

**`users`** — All system actors (admin, registrar, user). Users authenticate via OTP so `password_hash` is nullable for the `user` role and required for `admin`/`registrar`.

**`refresh_tokens`** — Durable refresh token store in PostgreSQL (chosen over Redis for auditability and revocation guarantees).

**`user_kyc`** — KYC submission paper trail. Unique constraint on `(user_id)` where status is `pending` or `approved` prevents duplicate active applications.

**`user_profiles`** — Denormalised profile data promoted from KYC on approval. Used for display throughout the system.

**`registrar_profiles`** — Maps a registrar user to their assigned district. Created by admin.

**`land_records`** — The physical land parcel. Plot number, location, area, land type, and R2 image key.

**`land_transactions`** — Every ownership event (privatization, transfer, correction). Tracks from/to parties, approval status, and a `blockchain_tx_hash` pointer to the sealed block.

**`blockchain_blocks`** — The hash chain ledger. One row per sealed transaction. Stores `block_hash`, `previous_hash`, and a frozen JSONB `payload` snapshot of the transaction at the moment of sealing.

### Key Constraints

- `password_role_check` — enforces `password_hash IS NULL` for users, `NOT NULL` for admin/registrar
- `pan_format_check` — validates PAN format `^[A-Z]{5}[0-9]{4}[A-Z]$`
- `unique_pending_user_kyc` — partial unique index prevents duplicate pending/approved KYC
- `land_records` unique on `(plot_no, village, tehsil, district)`
- `buyer_interests` unique on `(listing_id, buyer_id)` — one interest per buyer per listing

---

## Blockchain Implementation

Bhumi does not use an external blockchain network. It implements an internal **SHA-256 hash chain** inside PostgreSQL that provides tamper-evidence for land ownership records.

### How it works

Every time a land transaction is approved, a block is created:

```
block_hash = SHA256(previous_hash + JSON.stringify(payload))
```

Where `payload` is a frozen snapshot of the transaction (land ID, parties, type, timestamp). The `previous_hash` of the first block for any land is the string `"GENESIS"`.

If anyone modifies a historical row in `land_transactions`, the stored `block_hash` will no longer match a recomputation — the chain is broken. This is the tamper-evidence guarantee.

### Block creation flow

```
Registrar approves transaction
  → UPDATE land_transactions SET status = 'approved'
  → Fetch last block_hash for this land_id (or "GENESIS" if first)
  → Build payload snapshot
  → Compute new block_hash
  → INSERT INTO blockchain_blocks
  → UPDATE land_transactions SET blockchain_tx_hash = block_hash
  → All inside one atomic PostgreSQL transaction
```

### Seeded data

The seed creates 200 privatisation transactions (government → citizen). The backfill script then creates a genesis block for each, so the chain is valid from the start.

---

## Authentication

### Admin and Registrar

Email + password authentication. Sessions managed via HTTP-only cookies. Redis stores session tokens; PostgreSQL stores refresh tokens for durability.

### User

OTP-based authentication (no password). Flow:

```
POST /user/auth/request-otp   → OTP sent via email (Resend), stored in Redis with TTL
POST /user/auth/verify-otp    → OTP verified → access token + refresh token issued
POST /user/auth/refresh        → Rotate refresh token, issue new access token
POST /user/auth/logout         → Revoke refresh token
```

---

## API Reference

### Admin Routes — `/admin`

| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Admin login |
| POST | `/auth/logout` | Admin logout |
| GET | `/auth/me` | Get current admin |
| POST | `/registrars/` | Create a registrar |
| GET | `/registrars/` | List all registrars |

### Registrar Routes — `/registrar`

| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Registrar login |
| POST | `/auth/logout` | Registrar logout |
| GET | `/auth/me` | Get current registrar |
| GET | `/kyc/users` | List users by KYC status |
| PATCH | `/kyc/users/:userId/approve` | Approve a user's KYC |
| PATCH | `/kyc/users/:userId/reject` | Reject a user's KYC with reason |

### User Routes — `/user`

| Method | Path | Description |
|---|---|---|
| POST | `/auth/request-otp` | Request OTP for login |
| POST | `/auth/verify-otp` | Verify OTP, receive tokens |
| POST | `/auth/logout` | Logout |
| POST | `/auth/refresh` | Rotate session |
| GET | `/auth/me` | Get current user |
| POST | `/kyc` | Submit KYC (multipart, PAN document) |
| GET | `/kyc/status` | Get KYC status |
| GET | `/profile` | Get user profile |
| GET | `/land` | Get all land owned by user |
| GET | `/land/:landId/history` | Get blockchain history for a land parcel |
| GET | `/land/search` | Search land by district, tehsil, village |

---

## Environment Variables

```env
PORT=
NODE_ENV=
FRONTEND_URL=

OTP_SECRET=
ACCESS_TOKEN_SECRET=


DATABASE_URL=postgresql

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

EMAIL_API=

R2_BUCKET_NAME=
R2_ENDPOINT=
R2_ACCESS_KEY=
R2_SECRET_KEY=

```

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Format code
pnpm format
```

---

## Conventions

- **Controllers** — `handle[Noun][Action]` pattern, object method style (`const controller = {}`)
- **Services** — `[action][Noun]` (e.g. `landHistoryDetails`)
- **Repositories** — descriptive verb+entity names (e.g. `findLandHistoryByLandId`)
- **Folder naming** — `infrastructure/` not `config/`, `modules/[role]/[feature]/`
- **Formatting** — single quotes off, semicolons on, 2-space indent, import sorting via `@trivago/prettier-plugin-sort-imports`
- **Error handling** — Express 5 native async error propagation, no try/catch in controllers
