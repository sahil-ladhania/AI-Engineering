# 🧠 Agent Skills — Learning Lab

A hands-on repository for mastering **Claude's Agent Skills** — from zero to production-ready workflows.

## What is This?

This repo is a structured, practical learning path for building Agent Skills with Claude. No fluff — just tasks, code, and real-world patterns you can ship.

Agent Skills are reusable capability packages that Claude loads automatically when relevant. Think of them as onboarding manuals for Claude — instead of repeating the same instructions every session, you package them once and Claude uses them forever.

## What's Inside

```
.
├── .claude/
│   └── skills/                  # All hands-on skill examples live here
├── tasks/
│   └── hands-on-lab.md          # Step-by-step task guide
├── syllabus/
│   └── agent-skills-syllabus.md # Full module-wise syllabus
└── README.md
```

## What You'll Learn

| Module | Topic |
|--------|-------|
| 1 | What are Agent Skills — anatomy, progressive disclosure |
| 2 | Building your first skill — frontmatter, description, triggers |
| 3 | Multi-file skills — scripts + templates |
| 4 | Skills vs CLAUDE.md vs MCP Servers vs Slash Commands |
| 5 | Sharing skills — Git, API, Claude.ai upload |
| 6 | Troubleshooting — context budget, broken triggers, path issues |

## Prerequisites

- [Claude Code](https://claude.ai/code) installed (`npm install -g @anthropic-ai/claude-code`)
- Claude Pro / Max / Team account
- Basic terminal familiarity

## How to Use This Repo

**1. Clone it**
```bash
git clone https://github.com/sahil-ladhania/AI-Engineering.git
cd AI-Engineering/agent-skills
```

**2. Open with Claude Code**
```bash
claude
```

**3. Follow the hands-on lab**
```
tasks/hands-on-lab.md → Start from Task 1
```

Each task has:
- Clear objective
- Step-by-step instructions
- A verify step so you know it actually worked

## Key Concepts

**Skill = Folder**, not a single file.

```
.claude/skills/your-skill/
├── SKILL.md          ← Required. Instructions + YAML frontmatter.
├── script.js         ← Optional. Reliable execution > prompting.
└── templates/        ← Optional. Loaded only when referenced.
```

**Auto-trigger** — Claude reads the `description` field and decides when to load a skill. Write descriptions with exact phrases your users will say.

**Progressive Disclosure** — Claude loads `SKILL.md` first. Supporting files load only when needed. Context window stays lean.

## Real-World Use Cases

- Generate client proposals with accurate pricing
- Run code reviews with a consistent checklist
- Create invoices with GST calculations
- Apply brand voice to all content — zero manual prompting

## Resources

- [Official Agent Skills Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Claude Code Docs](https://code.claude.com/docs)
- [Anthropic Skills Marketplace](https://github.com/anthropics/skills)
