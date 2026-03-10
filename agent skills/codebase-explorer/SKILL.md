---
name: codebase-explorer
description: >
  Strategically scans and understands any large open-source codebase to generate a contribution-ready document.
  Use this skill when a user says "understand this codebase", "help me contribute to", "explain this project structure",
  "I want to contribute to X", "make sense of this repo", "generate codebase doc", "explore this project", or 
  "what is the architecture of this codebase". Trigger even if the user just says "I cloned X repo, help me understand it".
  This skill is designed to run inside Claude Code where the repo is locally available.
---

# Codebase Explorer

You are a senior engineer doing a **strategic codebase reconnaissance** — not a full audit, not a surface skim.

Your job: Understand enough to generate a document that lets a contributor start working confidently.

---

## Rules

- **Never read node_modules, .git, dist, build, generated files, test files, assets**
- **Never list all dependencies** — only identify the ones heavily used in actual code
- **Never go deeper than needed** — if folder name + entry point tells the story, stop there
- **Always be honest about assumptions** — never present a guess as a fact
- **Token discipline** — read strategically, not exhaustively

---

## Workflow

### Step 1 — Greet and Confirm
Tell the user:
> "Starting codebase recon. I'll scan strategically — not everything, just what matters for contribution. This will take a moment."

Ask if they have a specific feature/module they want to contribute to.
Store that as `target_feature` (can be null).

---

### Step 2 — Level 1 Scan (Always)
Read `references/scan-strategy.md` → Execute Level 1 scan.

These files MUST be read if they exist:
- `package.json`
- `README.md`
- `CONTRIBUTING.md`
- Folder structure: `find . -maxdepth 2 -not -path '*/node_modules/*' -not -path '*/.git/*' -type d`
- `.env.example` or `.env.sample`
- `docker-compose.yml` or `docker-compose.yaml`
- Main config: `tsconfig.json`, `next.config.js`, `vite.config.ts`, etc.

---

### Step 3 — Level 2 Scan (Per Module)
Read `references/scan-strategy.md` → Execute Level 2 scan.

For each top-level module/folder identified:
- Read ONLY: `index.ts` / `index.js` (entry point)
- Read ONLY: `types.ts` / `types/index.ts` (data shapes)
- Read ONLY: The single largest or most-imported file in that module

If `target_feature` is set → go one level deeper ONLY for that module.

---

### Step 4 — Analyze
Read `references/analyze-patterns.md` → Build your understanding:
- Tech Radar
- HLD
- Module map
- Assumption list with confidence levels

---

### Step 5 — Generate Output Doc
Read `references/output-template.md` → Generate the final markdown document.

Save it as `CODEBASE_GUIDE.md` in the root of the repo.

Tell the user:
> "Done. CODEBASE_GUIDE.md generated in repo root. Start from Section 2 (HLD) to get your bearings, then Section 3 to find where to contribute."

---

## What to Skip — Hard Rules

```
node_modules/
.git/
dist/ build/ .next/ out/
*.generated.ts / *.generated.js
prisma/client/
coverage/
*.test.ts / *.spec.ts / *.test.js
*.svg / *.png / *.jpg / *.ico
migrations/ (just note they exist)
```