# Analyze Patterns

After scanning, build your understanding in this order.
Do NOT generate the doc yet — think first.

---

## Step 1 — Build the Tech Radar

From `package.json` dependencies + actual import patterns in code:

### Rule: Heavy Use vs Listed
A package is "heavily used" if:
- It appears in 5+ files as an import, OR
- It's foundational (ORM, auth, API layer, UI framework)

A package is NOT worth mentioning if:
- It's a dev tool (eslint, prettier, husky)
- It's a polyfill or small utility (classnames, lodash)
- It appears in only 1-2 files

### For Each Heavy-Use Tech, Capture:
```
Name: [tech]
Category: [Framework / ORM / Auth / API / UI / Queue / Cache / Testing]
How it's used: [1 sentence — specific to THIS codebase, not generic docs]
Why contributor needs to know: [what pattern they must follow]
```

### Example (Good):
```
Name: tRPC
Category: API Layer
How it's used: All API calls go through /server/routers/, each feature has its own router file
Why contributor needs to know: No REST endpoints — if adding a new API, create a procedure in the relevant router
```

### Example (Bad — too generic):
```
Name: tRPC
Category: API
How it's used: Type-safe API framework
```

---

## Step 2 — Build the HLD (High Level Design)

### What HLD Should Answer:
1. What are the major "zones" of this system?
2. How does a request travel through the system?
3. Where does data live and how does it move?

### HLD Format — Use This Mental Model:

```
[User/Client]
     ↓
[Entry Layer] — Where does a request first land?
     ↓
[API/Router Layer] — How is it routed?
     ↓
[Business Logic Layer] — Where is the actual logic?
     ↓
[Data Layer] — DB, Cache, Queue
     ↓
[Response back]
```

Fill this in based on what you found. Be specific to this codebase.

For a Next.js app it might be:
```
Browser → Next.js page → tRPC client → tRPC router → service function → Prisma → PostgreSQL
```

For a monorepo:
```
web app (apps/web) → API app (apps/api) → shared packages (packages/)
```

---

## Step 3 — Build the Module Map

For each module/folder identified:

```
Module: [folder name]
Owns: [what business domain or technical concern this handles]
Entry: [main file to look at first]
Key files: [2-3 most important files]
Connects to: [which other modules it imports from / talks to]
```

### How to identify "Connects to":
```bash
# Check imports in the module's main files
grep -n "^import\|^from\|require(" [main-file] | grep -v "node_modules"
```

---

## Step 4 — Build Assumption Registry

This is the most important section. Be honest.

### When to create an assumption:
- You read a folder name / entry point but NOT the full implementation
- You inferred behavior from types/interfaces but didn't see the actual logic
- Package is listed but you didn't verify how it's actually used in code
- Folder exists but has unusual name that's not self-explanatory

### Confidence Levels:

**HIGH** — You read the actual code that proves this
- Example: Read `auth/middleware.ts` and saw `jwt.verify()` call

**MEDIUM** — Strong signal but not directly verified
- Example: `jsonwebtoken` in package.json + `/auth` folder exists + `token` type in types.ts

**LOW** — Structural inference only
- Example: Folder named `queue/` exists, BullMQ in package.json — probably job queue but didn't read it

### Assumption Format:
```
### [CONFIDENCE] What you're assuming

- Evidence: What you saw that led to this assumption
- If CORRECT → What the contributor should do / know
- If WRONG → Where to look to find the truth
- Verify with: Exact file or command to confirm this assumption
```

### Assumption Examples:

```
### [HIGH] Auth uses JWT stored in HTTP-only cookies
- Evidence: Read `/lib/auth.ts` — saw `cookies().set('token', jwt.sign(...))` 
- If CORRECT → Don't pass Authorization headers, cookies are auto-sent
- If WRONG → Check `/middleware.ts` for session handling
- Verify with: Already confirmed, no need

### [MEDIUM] Email service is abstracted behind a single sendEmail() function
- Evidence: `nodemailer` in package.json + `/lib/email.ts` file exists
- If CORRECT → Never call nodemailer directly, always use the abstraction
- If WRONG → Search for `nodemailer.createTransport` across codebase
- Verify with: cat lib/email.ts

### [LOW] Background jobs run on a separate worker process
- Evidence: `bullmq` in package.json + `/workers` folder exists
- If CORRECT → Worker files need to be restarted separately when developing
- If WRONG → Could be inline async processing, check `/workers/index.ts`
- Verify with: cat workers/index.ts | head -50
```

---

## Step 5 — Feature Entry Points (if target_feature set)

If user specified a feature:

Map it like this:
```
Feature: [feature name]
To contribute here, start with:
  1. [File] — This is the entry point (route/API handler)
  2. [File] — This is the business logic
  3. [File] — This is the data layer
  4. [File] — This is the UI (if applicable)

Before touching this feature, understand:
  - [Dependency or pattern they must know first]
  - [Side effect or connected module to be aware of]
```