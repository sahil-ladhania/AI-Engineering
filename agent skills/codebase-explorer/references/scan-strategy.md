# Scan Strategy

## The Core Principle
Read the **minimum files** needed to answer:
1. What tech is this built with (and HOW, not just what)?
2. What are the major modules and what do they own?
3. How does data flow at a high level?

---

## Level 1 — Project-Wide (Always Execute)

### Files to Read
```bash
# Folder structure — 2 levels max
find . -maxdepth 2 \
  -not -path '*/node_modules/*' \
  -not -path '*/.git/*' \
  -not -path '*/dist/*' \
  -not -path '*/.next/*' \
  -not -path '*/build/*' \
  -type d

# Package info
cat package.json

# Docs
cat README.md
cat CONTRIBUTING.md   # if exists

# Environment shape
cat .env.example      # if exists

# Infra
cat docker-compose.yml  # if exists

# Framework config (read whichever exists)
cat next.config.js / next.config.ts
cat vite.config.ts
cat turbo.json          # monorepo signal
cat pnpm-workspace.yaml # monorepo signal
```

### What to Extract from Level 1
- [ ] Is this a monorepo? (turbo.json, pnpm-workspace.yaml, `/apps`, `/packages` folders)
- [ ] Main framework (Next.js / Express / Fastify / NestJS / etc.)
- [ ] Database ORM (Prisma / Drizzle / TypeORM / raw SQL)
- [ ] Auth approach (NextAuth / Passport / custom JWT)
- [ ] API style (REST / tRPC / GraphQL)
- [ ] Queue / background jobs (BullMQ / Inngest / Trigger.dev)
- [ ] Cache layer (Redis / Memcached)
- [ ] Testing framework (Jest / Vitest / Playwright)

---

## Level 2 — Per Module (Execute for Each Top-Level Module)

### Token Budget per Module: READ MAX 3 FILES

```
Priority 1: index.ts or index.js         → What does this module export?
Priority 2: types.ts or types/index.ts   → What data shapes does it own?
Priority 3: Largest file OR most imported file → How does it actually work?
```

### How to Find the Most Imported File
```bash
# Find which file gets imported most across the codebase
grep -r "from.*module-name" . \
  --include="*.ts" --include="*.tsx" \
  -not -path "*/node_modules/*" \
  -l | head -20
```

### Monorepo — Special Case
If monorepo detected:
```
/apps → Each app is treated as its own Level 2 module
/packages → Read index.ts of each package only
```

---

## Level 3 — Feature Deep Dive (Only if target_feature is set)

If user specified a feature they want to contribute to:

```bash
# Find all files related to that feature
find . -iname "*feature-name*" \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*"

# Find where it's imported
grep -r "feature-name" . \
  --include="*.ts" --include="*.tsx" \
  -not -path "*/node_modules/*" \
  -l
```

Read up to 5 files for the target feature — prioritize:
1. Route/API handler
2. Service/business logic
3. DB query / repository
4. Main UI component (if frontend)
5. Types

---

## Hard Skip List

Never read, never open:
```
node_modules/
.git/
dist/, build/, .next/, out/, coverage/
*.generated.ts
prisma/client/ (just note prisma is used)
**/*.test.ts, **/*.spec.ts
**/*.test.tsx, **/*.spec.tsx  
**/*.svg, **/*.png, **/*.jpg, **/*.ico, **/*.woff
migrations/ (note existence, don't read contents)
**/mocks/
**/fixtures/
**/storybook/
```

---

## Signals That Tell You a Lot (Without Reading the Whole File)

| Signal | What it means |
|--------|--------------|
| `turbo.json` exists | Monorepo with Turborepo |
| `apps/` + `packages/` folders | Monorepo, separate concerns |
| `trpc/` folder or `router.ts` pattern | tRPC API, no REST endpoints |
| `prisma/schema.prisma` | Prisma ORM, read this file — it's the DB map |
| `middleware.ts` in root | Next.js middleware, auth/redirect logic |
| `inngest/` or `trigger/` folder | Event-driven background jobs |
| `lib/` folder | Shared utilities, usually safe to skim |
| `hooks/` folder | React custom hooks, frontend state patterns |
| `server/` inside Next.js | Server actions or API routes |

---

## One Extra Read — Always Worth It

If `prisma/schema.prisma` exists → **READ IT FULLY**.

Reason: It's the entire database schema in one file. It tells you:
- Every data model in the system
- Relationships between models
- Enums = business domain vocabulary

This single file gives more context than reading 20 component files.