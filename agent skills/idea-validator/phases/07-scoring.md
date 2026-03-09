# Phase 7 — Scoring

## Your Job
Calculate the final score based on intent weights.
Give a clear verdict. No sugar coating.
Then trigger run.js to generate the report file.

## Step 1 — Collect Scores
Before calculating, summarize each phase score:

| Phase | Score | Max |
|-------|-------|-----|
| Market Need | ? | per intent |
| Monetization | ? | per intent |
| P0 Scoping | ? | per intent |
| Tech Feasibility | ? | per intent |
| Effort vs Impact | ? | per intent |
| Excitement | ? | per intent |
| **Total** | **?** | **100** |

## Step 2 — Apply Intent Weights
Use the weights defined in phases/01-intent.md
based on the user's chosen intent.

## Step 3 — Verdict

| Score | Verdict |
|-------|---------|
| 80-100 | BUILD IT — Strong signal, move fast |
| 65-79 | BUILD WITH CAUTION — Fix the weak areas first |
| 50-64 | PIVOT — Core idea has merit but needs rethinking |
| 35-49 | RISKY — Fundamental problems, reconsider |
| 0-34 | KILL IT — Do not build this right now |

## Step 4 — Verdict by Intent

### Business (A)
- 80+ → "Strong business case. Validate with 3 real customers before writing code."
- 65-79 → "Monetization or market is weak. Fix that before building."
- Below 65 → "Not ready. The fundamentals are not there yet."

### Fun (B)
- 80+ → "Go for it. You will enjoy building and finishing this."
- 65-79 → "Scope it down, you might lose interest halfway."
- Below 65 → "You are not excited enough. Pick a different idea."

### Learning (C)
- 80+ → "Perfect learning project. You will grow a lot building this."
- 65-79 → "Slightly too complex or too simple. Adjust the scope."
- Below 65 → "This will frustrate more than teach. Pick something better scoped."

### OSS (D)
- 80+ → "Community will love this. Ship a v0 fast."
- 65-79 → "Niche it down. Who specifically is this for?"
- Below 65 → "Already exists or too broad. Do more research first."

## Step 5 — Red Flags Summary
List every red flag raised across all phases.
Be specific. Not "market is weak" but
"You could not name a single person
who has complained about this problem."

## Step 6 — Green Flags Summary
List every strong signal across all phases.

## Step 7 — One Actionable Next Step
Give exactly ONE thing they should do next.
Not a list. One thing.

Example:
- "Talk to 5 potential users before writing a single line of code."
- "Cut your P0 to just the core feature and set a 4 week deadline."
- "Find one existing solution and figure out why it failed."

## Step 8 — Generate Report
Say:
"Your idea validation is complete.
Generating your report now."

Then run:
`node run.js`

Pass all phase scores, intent, idea name,
red flags, green flags, verdict, and next step.